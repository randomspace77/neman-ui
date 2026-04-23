import type { ChatAdapter, AdapterRunOptions, AdapterStreamEvent } from "../types"

/**
 * Create a ChatAdapter that connects to an OpenAI-compatible chat completions API.
 * Supports streaming responses with tool calls.
 */
export function createOpenAiAdapter(options: {
  /** The API base URL (default: "https://api.openai.com/v1") */
  baseUrl?: string
  /** API key (sent as Bearer token) */
  apiKey: string
  /** Model to use (default: "gpt-4o") */
  model?: string
  /** Optional custom headers */
  headers?: Record<string, string>
  /** Optional callback for tool calls */
  onToolCall?: (args: {
    toolCallId: string
    toolName: string
    args: Record<string, unknown>
  }) => Promise<unknown>
}): ChatAdapter {
  const baseUrl = options.baseUrl ?? "https://api.openai.com/v1"
  const model = options.model ?? "gpt-4o"

  return {
    acceptAttachmentTypes: "image/*,.pdf,.txt,.csv,.md,.json",

    async *run({ messages, abortSignal, runConfig }: AdapterRunOptions): AsyncGenerator<AdapterStreamEvent, void, unknown> {
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${options.apiKey}`,
          ...options.headers,
        },
        body: JSON.stringify({
          model: runConfig?.model ?? model,
          messages: convertMessagesToOpenAiFormat(messages),
          stream: true,
          temperature: runConfig?.temperature,
          max_tokens: runConfig?.maxTokens,
        }),
        signal: abortSignal,
      })

      if (!response.ok) {
        const errorBody = await response.text()
        throw new Error(`OpenAI API error: ${response.status} ${errorBody}`)
      }

      if (!response.body) {
        throw new Error("Response body is null")
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""
      let currentToolCallId: string | null = null
      let currentToolName: string | null = null
      let currentToolArgs: string = ""

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split("\n")
          buffer = lines.pop() ?? ""

          for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed || !trimmed.startsWith("data: ")) continue
            const data = trimmed.slice(6)
            if (data === "[DONE]") continue

            try {
              const parsed = JSON.parse(data)
              const delta = parsed.choices?.[0]?.delta
              if (!delta) continue

              // Text content
              if (delta.content) {
                yield { type: "text-delta", delta: delta.content }
              }

              // Reasoning (o1/o3 models)
              if (delta.reasoning_content) {
                yield { type: "reasoning-delta", delta: delta.reasoning_content }
              }

              // Tool calls
              if (delta.tool_calls) {
                for (const tc of delta.tool_calls) {
                  if (tc.id) {
                    // New tool call started
                    if (currentToolCallId && currentToolArgs) {
                      // Finish previous tool call
                      try {
                        const args = JSON.parse(currentToolArgs)
                        yield {
                          type: "tool-call-delta",
                          toolCallId: currentToolCallId,
                          argsDelta: currentToolArgs,
                        }
                      } catch {
                        // Ignore parse errors for incomplete args
                      }
                    }
                    currentToolCallId = tc.id
                    currentToolName = tc.function?.name
                    currentToolArgs = ""
                    yield {
                      type: "tool-call-start",
                      toolCallId: tc.id,
                      toolName: tc.function?.name ?? "",
                    }
                  }

                  if (tc.function?.arguments) {
                    currentToolArgs += tc.function.arguments
                  }
                }
              }
            } catch {
              // Skip malformed JSON
            }
          }
        }

        // Finish any pending tool call
        if (currentToolCallId && currentToolArgs) {
          try {
            const args = JSON.parse(currentToolArgs)
            yield {
              type: "tool-call-delta",
              toolCallId: currentToolCallId,
              argsDelta: currentToolArgs,
            }
            yield {
              type: "tool-call-result",
              toolCallId: currentToolCallId,
              result: args,
              isError: false,
            }
          } catch {
            // Ignore parse errors
          }
        }
      } finally {
        reader.releaseLock()
      }

      yield { type: "message-complete" }
    },
  }
}

function convertMessagesToOpenAiFormat(messages: any[]): any[] {
  return messages.map((msg) => {
    const content = msg.parts
      .filter((p: any) => p.type === "text")
      .map((p: any) => p.text)
      .join("")

    if (msg.role === "user") {
      return { role: "user", content }
    }

    // Assistant messages with tool calls
    const toolCalls = msg.parts
      .filter((p: any) => p.type === "tool-call")
      .map((p: any) => ({
        id: p.toolCallId,
        type: "function",
        function: {
          name: p.toolName,
          arguments: JSON.stringify(p.args),
        },
      }))

    if (toolCalls.length > 0) {
      return {
        role: "assistant",
        content: content || null,
        tool_calls: toolCalls,
      }
    }

    return { role: "assistant", content }
  })
}