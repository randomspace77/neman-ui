// ─── Message Types ───────────────────────────────────────────────────────────

export type MessageRole = "user" | "assistant" | "system"

export type MessageStatus =
  | "running"
  | "requires-action"
  | "complete"
  | "incomplete"

export type IncompleteReason =
  | "cancelled"
  | "length"
  | "content-filter"
  | "error"
  | "other"

export type ToolCallState =
  | "input-streaming"
  | "input-available"
  | "output-available"
  | "output-error"
  | "output-denied"
  | "approval-requested"
  | "approval-responded"

// ─── User Message Parts ─────────────────────────────────────────────────────

export type TextMessagePart = {
  type: "text"
  text: string
  parentId?: string
}

export type ImageMessagePart = {
  type: "image"
  image: string
  alt?: string
}

export type FileMessagePart = {
  type: "file"
  name: string
  data?: string
  url?: string
  mimeType: string
}

export type DataMessagePart = {
  type: "data"
  name: string
  data: unknown
}

export type UserMessagePart =
  | TextMessagePart
  | ImageMessagePart
  | FileMessagePart
  | DataMessagePart

// ─── Assistant Message Parts ────────────────────────────────────────────────

export type ReasoningMessagePart = {
  type: "reasoning"
  text: string
  duration?: number
  parentId?: string
}

export type ToolCallMessagePart = {
  type: "tool-call"
  toolCallId: string
  toolName: string
  args: Record<string, unknown>
  argsText?: string
  result?: unknown
  isError?: boolean
  state: ToolCallState
  artifact?: unknown
  interrupt?: { type: "human"; payload: unknown }
}

export type SourceMessagePart = {
  type: "source"
  id: string
  url: string
  title?: string
  provider?: string
}

export type AssistantMessagePart =
  | TextMessagePart
  | ReasoningMessagePart
  | ToolCallMessagePart
  | SourceMessagePart
  | ImageMessagePart
  | FileMessagePart
  | DataMessagePart

// ─── Message ─────────────────────────────────────────────────────────────────

export interface Message {
  id: string
  role: MessageRole
  parts: UserMessagePart[] | AssistantMessagePart[]
  status: MessageStatus
  incompleteReason?: IncompleteReason
  createdAt: number
  parentId?: string
  branchNumber?: number
  branchCount?: number
}

// ─── Attachment ───────────────────────────────────────────────────────────────

export type AttachmentStatus = "uploading" | "complete" | "error" | "paused"

export interface Attachment {
  id: string
  name: string
  mimeType: string
  size?: number
  url?: string
  thumbnailUrl?: string
  status: AttachmentStatus
  progress?: number
  file?: File
}