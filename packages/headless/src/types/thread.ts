import type { Message, Attachment } from "./message"

// ─── Thread State ────────────────────────────────────────────────────────────

export interface ThreadState {
  messages: Message[]
  isLoading: boolean
  error: Error | null
  suggestions: string[]
}

// ─── Thread Actions ──────────────────────────────────────────────────────────

export interface ThreadActions {
  append: (message: Omit<Message, "id" | "createdAt">) => string
  update: (messageId: string, updates: Partial<Message>) => void
  remove: (messageId: string) => void
  startRun: (options?: RunOptions) => Promise<void>
  cancelRun: () => void
  switchBranch: (messageId: string, branchIndex: number) => void
  getBranchInfo: (messageId: string) => { current: number; total: number }
  setSuggestions: (suggestions: string[]) => void
  clearError: () => void
}

export interface RunOptions {
  parentId?: string
  sourceId?: string
  steer?: boolean
}

// ─── Composer State ──────────────────────────────────────────────────────────

export interface ComposerState {
  text: string
  attachments: Attachment[]
  isEditing: boolean
  editingMessageId: string | null
  isSending: boolean
}

// ─── Composer Actions ───────────────────────────────────────────────────────

export interface ComposerActions {
  setText: (text: string) => void
  addAttachment: (file: File) => Promise<void>
  removeAttachment: (id: string) => void
  clearAttachments: () => void
  send: () => void
  cancel: () => void
  startEdit: (messageId: string) => void
  cancelEdit: () => void
  reset: () => void
}

// ─── Chat Context ────────────────────────────────────────────────────────────

export interface ChatContextValue {
  thread: ThreadState & ThreadActions
  composer: ComposerState & ComposerActions
  streaming: {
    isStreaming: boolean
    abort: () => void
  }
}