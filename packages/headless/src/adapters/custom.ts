import type { ChatAdapter, AdapterRunOptions, AdapterStreamEvent, Message } from "../types"

/**
 * Create a custom ChatAdapter for any HTTP endpoint.
 * Provide transform functions to convert between neman-ui's message format
 * and your API's request/response format.
 */
export function createCustomAdapter(options: {
  /** The API endpoint URL */
  endpoint: string
  /** Transform neman-ui messages to your API's request body */
  transformRequest: (messages: Message[], runConfig?: Record<string, unknown>) => unknown
  /** Transform a response chunk from your API to neman-ui stream events */
  transformResponse: (chunk: unknown) => AdapterStreamEvent[]
  /** Optional HTTP headers */
  headers?: Record<string, string>
  /** Optional HTTP method (default: "POST") */
  method?: string
}): ChatAdapter {
  return {
    async *run({ messages, abortSignal, runConfig }: AdapterRunOptions): AsyncGenerator<AdapterStreamEvent, void, unknown> {
      const body = options.transformRequest(messages, runConfig)

      const response = await fetch(options.endpoint, {
        method: options.method ?? "POST",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        body: JSON.stringify(body),
        signal: abortSignal,
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`)
      }

      if (!response.body) {
        throw new Error("Response body is null")
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })

          // Try to parse as JSON array or newline-delimited JSON
          const events: AdapterStreamEvent[] = []

          try {
            // Try single JSON object
            const parsed = JSON.parse(chunk)
            events.push(...options.transformResponse(parsed))
          } catch {
            // Try newline-delimited JSON
            for (const line of chunk.split("\n")) {
              const trimmed = line.trim()
              if (!trimmed) continue
              try {
                const parsed = JSON.parse(trimmed)
                events.push(...options.transformResponse(parsed))
              } catch {
                // Skip malformed lines
              }
            }
          }

          for (const event of events) {
            yield event
          }
        }
      } finally {
        reader.releaseLock()
      }

      yield { type: "message-complete" }
    },
  }
}