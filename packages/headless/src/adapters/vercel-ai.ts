import type {
  ChatAdapter,
  AdapterRunOptions,
  AdapterStreamEvent,
  Message,
  AssistantMessagePart,
} from "../types"

/**
 * Create a ChatAdapter that connects to a Vercel AI SDK compatible API endpoint.
 * The endpoint should return data in the Vercel AI SDK data stream protocol.
 */
export function createVercelAiAdapter(options: {
  /** The API endpoint URL (e.g., "/api/chat") */
  api: string
  /** Optional model override */
  model?: string
  /** Optional headers to include in the request */
  headers?: Record<string, string>
  /** Optional callback for tool call results */
  onToolCall?: (toolCall: {
    toolCallId: string
    toolName: string
    args: Record<string, unknown>
  }) => Promise<unknown>
  /** Optional callback for completed messages */
  onFinish?: (message: Message) => void
}): ChatAdapter {
  return {
    acceptAttachmentTypes: "image/*,.pdf,.txt,.csv,.md,.json",

    async *run({ messages, abortSignal, runConfig }: AdapterRunOptions): AsyncGenerator<AdapterStreamEvent, void, unknown> {
      const response = await fetch(options.api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        body: JSON.stringify({
          messages: messages.map(convertMessageToVercelFormat),
          model: runConfig?.model ?? options.model,
          temperature: runConfig?.temperature,
          maxTokens: runConfig?.maxTokens,
          ...runConfig,
        }),
        signal: abortSignal,
      })

      if (!response.ok) {
        throw new Error(`Chat API error: ${response.status} ${response.statusText}`)
      }

      if (!response.body) {
        throw new Error("Response body is null")
      }

      // Parse the Vercel AI SDK data stream
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
            if (!trimmed) continue

            try {
              const parsed = JSON.parse(trimmed)
              yield* convertVercelEvent(parsed, {
                currentToolCallId,
                currentToolName,
                currentToolArgs,
                onToolCall: options.onToolCall,
              })

              // Track tool call state
              if (parsed.type === "tool-call") {
                currentToolCallId = parsed.toolCallId
                currentToolName = parsed.toolName
                currentToolArgs = ""
              } else if (parsed.type === "tool-call-delta") {
                currentToolArgs += parsed.argsTextDelta ?? ""
              } else if (parsed.type === "tool-result") {
                currentToolCallId = null
                currentToolName = null
                currentToolArgs = ""
              }
            } catch {
              // Skip non-JSON lines
            }
          }
        }
      } finally {
        reader.releaseLock()
      }

      yield { type: "message-complete" }
    },

    async getSuggestions({ messages }) {
      // Default: no suggestions. Override this by providing a custom implementation.
      return []
    },
  }
}

function* convertVercelEvent(
  event: any,
  ctx: {
    currentToolCallId: string | null
    currentToolName: string | null
    currentToolArgs: string
    onToolCall?: (args: any) => Promise<unknown>
  },
): Generator<AdapterStreamEvent, void, unknown> {
  switch (event.type) {
    case "text-delta":
      yield { type: "text-delta", delta: event.textDelta ?? event.delta ?? "" }
      break

    case "reasoning-delta":
      yield { type: "reasoning-delta", delta: event.textDelta ?? event.delta ?? "" }
      break

    case "tool-call":
      yield {
        type: "tool-call-start",
        toolCallId: event.toolCallId,
        toolName: event.toolName,
      }
      if (event.args) {
        yield {
          type: "tool-call-delta",
          toolCallId: event.toolCallId,
          argsDelta: JSON.stringify(event.args),
        }
      }
      break

    case "tool-call-delta":
      yield {
        type: "tool-call-delta",
        toolCallId: event.toolCallId,
        argsDelta: event.argsTextDelta ?? "",
      }
      break

    case "tool-result":
      yield {
        type: "tool-call-result",
        toolCallId: event.toolCallId,
        result: event.result,
        isError: event.isError ?? false,
      }
      break

    case "source":
      if (event.url) {
        yield {
          type: "source",
          id: event.id ?? `src-${Date.now()}`,
          url: event.url,
          title: event.title,
          provider: event.provider,
        }
      }
      break

    case "error":
      yield { type: "error", error: new Error(event.message ?? "Unknown error") }
      break
  }
}

function convertMessageToVercelFormat(message: Message): any {
  const content = message.parts
    .map((part) => {
      switch (part.type) {
        case "text":
          return { type: "text", text: part.text }
        case "image":
          return { type: "image", image: part.image }
        case "file":
          return { type: "file", data: part.data ?? part.url, mimeType: part.mimeType }
        case "tool-call":
          return {
            type: "tool-call" as const,
            toolCallId: (part as any).toolCallId,
            toolName: (part as any).toolName,
            args: (part as any).args,
            ...((part as any).result !== undefined ? { result: (part as any).result } : {}),
          }
        case "source":
          return null
        default:
          return null
      }
    })
    .filter(Boolean)

  return {
    role: message.role,
    content,
  }
}