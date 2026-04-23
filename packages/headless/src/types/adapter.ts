import type { Message } from "./message"

// ─── Adapter ──────────────────────────────────────────────────────────────────
// The ChatAdapter is the single extension point for connecting neman-ui
// to any AI backend. Implement this interface to integrate with your
// preferred LLM provider.

export interface ChatAdapter {
  /** Stream a response for the given messages. Returns an AsyncGenerator. */
  run: (options: AdapterRunOptions) => AsyncGenerator<AdapterStreamEvent, void, unknown>

  /** Optional: generate suggestions based on conversation context */
  getSuggestions?: (options: { messages: Message[] }) => Promise<string[]>

  /** Optional: filter acceptable attachment MIME types */
  acceptAttachmentTypes?: string
}

export interface AdapterRunOptions {
  messages: Message[]
  abortSignal: AbortSignal
  runConfig?: {
    model?: string
    temperature?: number
    maxTokens?: number
    [key: string]: unknown
  }
  context?: Record<string, unknown>
}

// ─── Stream Events ────────────────────────────────────────────────────────────
// These events are yielded by the adapter during streaming.

export type AdapterStreamEvent =
  | TextDeltaEvent
  | ReasoningDeltaEvent
  | ToolCallStartEvent
  | ToolCallDeltaEvent
  | ToolCallResultEvent
  | SourceEvent
  | ImageEvent
  | MessageCompleteEvent
  | ErrorEvent

export interface TextDeltaEvent {
  type: "text-delta"
  delta: string
}

export interface ReasoningDeltaEvent {
  type: "reasoning-delta"
  delta: string
  duration?: number
}

export interface ToolCallStartEvent {
  type: "tool-call-start"
  toolCallId: string
  toolName: string
}

export interface ToolCallDeltaEvent {
  type: "tool-call-delta"
  toolCallId: string
  argsDelta: string
}

export interface ToolCallResultEvent {
  type: "tool-call-result"
  toolCallId: string
  result: unknown
  isError?: boolean
}

export interface SourceEvent {
  type: "source"
  id: string
  url: string
  title?: string
  provider?: string
}

export interface ImageEvent {
  type: "image"
  image: string
  alt?: string
}

export interface MessageCompleteEvent {
  type: "message-complete"
}

export interface ErrorEvent {
  type: "error"
  error: Error
}