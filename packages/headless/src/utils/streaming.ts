import type { ChatAdapter, AdapterStreamEvent } from "../types"
import type { Message, AssistantMessagePart } from "../types"
import {
  createAssistantMessage,
  appendPart,
  updateAssistantPart,
} from "./message-reducer"

// ─── Streaming Engine ─────────────────────────────────────────────────────────
// Consumes an AsyncGenerator from a ChatAdapter and dispatches state updates
// to reconcile the thread state.

export interface StreamCallbacks {
  onMessageStart: (message: Message) => void
  onMessageUpdate: (messageId: string, updates: Partial<Message>) => void
  onMessagePartAppend: (messageId: string, part: AssistantMessagePart) => void
  onMessagePartUpdate: (
    messageId: string,
    predicate: (part: AssistantMessagePart) => boolean,
    updates: Partial<AssistantMessagePart>,
  ) => void
  onMessageComplete: (messageId: string) => void
  onError: (messageId: string, error: Error) => void
}

export async function consumeStream(
  adapter: ChatAdapter,
  messages: Message[],
  abortSignal: AbortSignal,
  callbacks: StreamCallbacks,
  runConfig?: Record<string, unknown>,
): Promise<void> {
  const assistantMessage = createAssistantMessage()
  callbacks.onMessageStart(assistantMessage)

  let hasToolCallsNeedingResults = false

  try {
    const generator = adapter.run({
      messages,
      abortSignal,
      runConfig,
    })

    for await (const event of generator) {
      if (abortSignal.aborted) break

      switch (event.type) {
        case "text-delta": {
          // Find existing text part or append new one
          const existingParts = assistantMessage.parts as AssistantMessagePart[]
          const textPart = existingParts.find(
            (p): p is AssistantMessagePart & { type: "text" } =>
              p.type === "text",
          )
          if (textPart) {
            const updated = {
              ...textPart,
              text: textPart.text + (event as any).delta,
            }
            callbacks.onMessagePartUpdate(
              assistantMessage.id,
              (p) => p.type === "text",
              updated,
            )
          } else {
            const part: AssistantMessagePart = {
              type: "text",
              text: (event as any).delta,
            }
            callbacks.onMessagePartAppend(assistantMessage.id, part)
          }
          break
        }

        case "reasoning-delta": {
          const e = event as any
          const existingParts = assistantMessage.parts as AssistantMessagePart[]
          const reasoningPart = existingParts.find(
            (p): p is AssistantMessagePart & { type: "reasoning" } =>
              p.type === "reasoning",
          )
          if (reasoningPart) {
            callbacks.onMessagePartUpdate(
              assistantMessage.id,
              (p) => p.type === "reasoning",
              { text: reasoningPart.text + e.delta },
            )
          } else {
            const part: AssistantMessagePart = {
              type: "reasoning",
              text: e.delta,
              duration: e.duration,
            }
            callbacks.onMessagePartAppend(assistantMessage.id, part)
          }
          break
        }

        case "tool-call-start": {
          const e = event as any
          const part: AssistantMessagePart = {
            type: "tool-call",
            toolCallId: e.toolCallId,
            toolName: e.toolName,
            args: {},
            state: "input-streaming" as const,
          }
          callbacks.onMessagePartAppend(assistantMessage.id, part)
          hasToolCallsNeedingResults = true
          break
        }

        case "tool-call-delta": {
          const e = event as any
          // Accumulate args JSON from delta fragments
          callbacks.onMessagePartUpdate(
            assistantMessage.id,
            (p): p is any => p.type === "tool-call" && (p as any).toolCallId === e.toolCallId,
            {
              argsText: ((prev: any) => {
                const current = (prev as any).argsText ?? ""
                return current + e.argsDelta
              }),
            } as any,
          )
          break
        }

        case "tool-call-result": {
          const e = event as any
          callbacks.onMessagePartUpdate(
            assistantMessage.id,
            (p) => p.type === "tool-call" && (p as any).toolCallId === e.toolCallId,
            {
              result: e.result,
              isError: e.isError,
              state: e.isError ? "output-error" as const : "output-available" as const,
            },
          )
          break
        }

        case "source": {
          const e = event as any
          const part: AssistantMessagePart = {
            type: "source",
            id: e.id,
            url: e.url,
            title: e.title,
            provider: e.provider,
          }
          callbacks.onMessagePartAppend(assistantMessage.id, part)
          break
        }

        case "image": {
          const e = event as any
          const part: AssistantMessagePart = {
            type: "image",
            image: e.image,
            alt: e.alt,
          }
          callbacks.onMessagePartAppend(assistantMessage.id, part)
          break
        }

        case "message-complete": {
          // Set final tool-call states
          if (hasToolCallsNeedingResults) {
            // Mark any tool-calls still in input-streaming as input-available
            const parts = assistantMessage.parts as AssistantMessagePart[]
            for (const part of parts) {
              if (part.type === "tool-call") {
                const tc = part as any
                if (tc.state === "input-streaming") {
                  callbacks.onMessagePartUpdate(
                    assistantMessage.id,
                    (p) => p.type === "tool-call" && (p as any).toolCallId === tc.toolCallId,
                    { state: "input-available" as const },
                  )
                }
              }
            }
          }

          callbacks.onMessageUpdate(assistantMessage.id, {
            status: "complete",
            incompleteReason: undefined,
          })
          callbacks.onMessageComplete(assistantMessage.id)
          break
        }

        case "error": {
          const e = event as any
          callbacks.onError(assistantMessage.id, e.error)
          break
        }
      }

      // Update the local reference for next iteration
      // (Parts are accumulated in callbacks, we just track tool-call presence)
    }
  } catch (err: any) {
    if (abortSignal.aborted) {
      callbacks.onMessageUpdate(assistantMessage.id, {
        status: "incomplete",
        incompleteReason: "cancelled",
      })
    } else {
      callbacks.onError(assistantMessage.id, err instanceof Error ? err : new Error(String(err)))
      callbacks.onMessageUpdate(assistantMessage.id, {
        status: "incomplete",
        incompleteReason: "error",
      })
    }
  }
}