// @neman-ui/tool-ui — Tool call rendering components for neman-ui chat
// Provides Zod-validated, receipt-capable tool UI components with neman design tokens.

// Contracts & Types
export { defineToolUiContract } from "./contracts/define-tool-ui-contract"
export type {
  ToolUiContract,
  Action,
  DecisionResult,
  ToolUIReceipt,
} from "./contracts/define-tool-ui-contract"
export { ToolUIReceiptSchema, ActionSchema } from "./contracts/define-tool-ui-contract"

// ToolUI Primitive
export { ToolUI, getStatusConfig } from "./components/tool-ui"
export type {
  ToolUIRootProps,
  ToolUISurfaceProps,
  ToolUIActionsProps,
  ToolUIActionProps,
  ToolUILocalActionsProps,
  ToolUIDecisionActionsProps,
} from "./components/tool-ui"

// Tool Components
export { Plan } from "./components/plan"
export { ProgressTracker } from "./components/progress-tracker"
export { ApprovalCard } from "./components/approval-card"
export { CodeBlock } from "./components/code-block"
export { CodeDiff } from "./components/code-diff"
export { DataTable, formatCurrency, formatPercent, formatDate, formatStatusBadge } from "./components/data-table"
export { Citation } from "./components/citation"
export { Terminal } from "./components/terminal"
export { OptionList } from "./components/option-list"
export { ImageGallery } from "./components/image-gallery"
export { Chart } from "./components/chart"
export { StatsDisplay } from "./components/stats-display"
export { LinkPreview } from "./components/link-preview"
export { OrderSummary } from "./components/order-summary"
export { PreferencesPanel } from "./components/preferences-panel"
export { ParameterSlider } from "./components/parameter-slider"
export { QuestionFlow } from "./components/question-flow"
export { Image as ToolImage } from "./components/image"
export { Video } from "./components/video"
export { Audio } from "./components/audio"
export { ItemCarousel } from "./components/item-carousel"
export { MessageDraft } from "./components/message-draft"
export { InstagramPost } from "./components/instagram-post"
export { LinkedInPost } from "./components/linkedin-post"
export { XPost } from "./components/x-post"
export { GeoMap } from "./components/geo-map"
export { WeatherWidget } from "./components/weather-widget"

// Registry & Renderer
export {
  registerToolUi,
  getToolUiComponent,
  getToolUiContract,
  createResultToolRenderer,
  renderToolCallParts,
} from "./utils/result-renderer"
export type { ToolUiRegistryEntry, ToolUiComponentProps } from "./utils/result-renderer"

// Hooks (shared utilities)
export { useControllableState, useCopyToClipboard, useSignatureReset } from "./utils/hooks"
export type { ControllableStateProps } from "./utils/hooks"