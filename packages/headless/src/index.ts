// @neman-ui/headless — Headless runtime for neman-ui chat components
// Provides context, hooks, types, and adapters for reactive chat state management.

// Context & Provider
export { NemanChatProvider, useChatContext } from "./context/chat-provider"

// Hooks
export { useThread, useThreadRequired } from "./hooks/use-thread"
export { useComposer, useComposerRequired } from "./hooks/use-composer"
export { useMessage, useMessageByIndex } from "./hooks/use-message"
export { useStreaming, useStreamingRequired } from "./hooks/use-streaming"
export { useDropzone } from "./hooks/use-dropzone"

// Types
export type {
  MessageRole,
  MessageStatus,
  IncompleteReason,
  ToolCallState,
  TextMessagePart,
  ImageMessagePart,
  FileMessagePart,
  DataMessagePart,
  UserMessagePart,
  ReasoningMessagePart,
  ToolCallMessagePart,
  SourceMessagePart,
  AssistantMessagePart,
  Message,
  AttachmentStatus,
  Attachment,
} from "./types/message"

export type {
  ThreadState,
  ThreadActions,
  RunOptions,
  ComposerState,
  ComposerActions,
  ChatContextValue,
} from "./types/thread"

export type {
  ChatAdapter,
  AdapterRunOptions,
  AdapterStreamEvent,
  TextDeltaEvent,
  ReasoningDeltaEvent,
  ToolCallStartEvent,
  ToolCallDeltaEvent,
  ToolCallResultEvent,
  SourceEvent,
  ImageEvent,
  MessageCompleteEvent,
  ErrorEvent,
} from "./types/adapter"

export type {
  AttachmentAdapter,
  DropzoneState,
} from "./types/attachment"

// Adapters
export { createVercelAiAdapter } from "./adapters/vercel-ai"
export { createOpenAiAdapter } from "./adapters/openai"
export { createCustomAdapter } from "./adapters/custom"

// Utils
export { BranchStore } from "./utils/branch-store"
export { consumeStream } from "./utils/streaming"
export {
  createId,
  createUserMessage,
  createAssistantMessage,
  updateAssistantPart,
  appendPart,
} from "./utils/message-reducer"