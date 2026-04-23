// Components
export { Button, buttonVariants } from "./button"
export { Input } from "./input"
export { Textarea } from "./textarea"
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from "./card"
export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "./dialog"
export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
} from "./popover"
export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "./tooltip"
export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants } from "./tabs"
export { Switch } from "./switch"
export { Checkbox } from "./checkbox"
export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./select"
export { Badge, badgeVariants } from "./badge"
export { Avatar, AvatarImage, AvatarFallback } from "./avatar"
export { Spinner } from "./spinner"
export { Skeleton } from "./skeleton"
export { Slider } from "./slider"
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "./table"
export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./dropdown-menu"

// Utilities
export { cn } from "@/lib/utils"

// Headless Layer (type-only imports to avoid bundling runtime code)
export type {
  Message,
  MessageRole,
  MessageStatus,
  ToolCallState,
  Attachment,
  ChatAdapter,
  AdapterStreamEvent,
  ThreadState,
  ThreadActions,
  ComposerState,
  ComposerActions,
  ChatContextValue,
  AttachmentAdapter,
  DropzoneState,
} from "@/packages/headless/src"
export {
  NemanChatProvider,
  useChatContext,
  useThread,
  useThreadRequired,
  useComposer,
  useComposerRequired,
  useMessage,
  useStreaming,
  useDropzone,
  createVercelAiAdapter,
  createOpenAiAdapter,
  createCustomAdapter,
} from "@/packages/headless/src"

// Tool-UI Layer
export {
  ToolUI,
  getStatusConfig as getToolUIStatusConfig,
  Plan,
  ProgressTracker,
  ApprovalCard,
  CodeBlock as ToolCodeBlock,
  CodeDiff,
  DataTable,
  Citation,
  Terminal,
  OptionList,
  ImageGallery,
  defineToolUiContract,
  registerToolUi,
  createResultToolRenderer,
  renderToolCallParts,
  Chart,
  StatsDisplay,
  LinkPreview,
  OrderSummary,
  PreferencesPanel,
  ParameterSlider,
  QuestionFlow,
  ToolImage,
  Video,
  Audio,
  ItemCarousel,
  MessageDraft,
  InstagramPost,
  LinkedInPost,
  XPost,
  GeoMap,
  WeatherWidget,
} from "@/packages/tool-ui/src"
export type {
  ToolUiContract,
  Action as ToolUiAction,
  DecisionResult,
  ToolUiComponentProps,
} from "@/packages/tool-ui/src"

// AI Chat
export {
  ChatMessage,
  ChatMessageAvatar,
  ChatMessageContent,
  ChatMessageText,
  ChatMessageActions,
  ChatMessageAction,
  ChatMessageTimestamp,
} from "./chat-message"
export {
  ChatConversation,
  ChatConversationAuto,
  ChatConversationEmpty,
} from "./chat-conversation"
export {
  ChatReasoning,
} from "./chat-reasoning"
export {
  ChatToolCall,
  ChatToolCallInput,
  ChatToolCallOutput,
} from "./chat-tool-call"
export type { ToolState } from "./chat-tool-call"
export { ChatCodeBlock } from "./chat-code-block"
export { ChatMarkdown } from "./chat-markdown"
export {
  ChatPromptInput,
  ChatPromptInputTextarea,
  ChatPromptInputBody,
  ChatPromptInputToolbar,
  ChatPromptInputToolbarLeft,
  ChatPromptInputToolbarRight,
  ChatPromptInputAction,
  ChatPromptInputSubmit,
  ChatPromptInputStop,
} from "./chat-prompt-input"
export {
  ChatAttachments,
  ChatAttachment,
} from "./chat-attachments"
export {
  ChatSuggestions,
  ChatSuggestion,
} from "./chat-suggestions"
export {
  ChatTypingIndicator,
  ChatStreamingText,
  ChatSpinner,
} from "./chat-typing-indicator"
export {
  ChatSources,
  ChatSource,
} from "./chat-sources"
export { ChatBranch } from "./chat-branch"
export {
  ChatActionBar,
  ChatActionBarButton,
  ChatActionBarCopy,
  ChatActionBarEdit,
  ChatActionBarReload,
  ChatActionBarFeedbackPositive,
  ChatActionBarFeedbackNegative,
} from "./chat-action-bar"
export { ChatError } from "./chat-error"
export { ChatQuote } from "./chat-quote"
export { ChatInProgress } from "./chat-in-progress"

// Theme
export { ThemeProvider } from "@/components/theme-provider"
export { ThemeToggle } from "@/components/theme-toggle"