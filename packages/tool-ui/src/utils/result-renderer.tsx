import type { ComponentType } from "react"
import type { ToolUiContract } from "../contracts/define-tool-ui-contract"

// ─── Inline ToolCallState type (avoiding cross-package import) ──────────────

type ToolCallState =
  | "input-streaming"
  | "input-available"
  | "output-available"
  | "output-error"
  | "output-denied"
  | "approval-requested"
  | "approval-responded"

// ─── Inline AssistantMessagePart (tool-call only, for typing) ────────────────

interface ToolCallPart {
  type: "tool-call"
  toolCallId: string
  toolName: string
  args: Record<string, unknown>
  state: ToolCallState
  result?: unknown
  isError?: boolean
}

// ─── Tool UI Registry ──────────────────────────────────────────────────────────

export interface ToolUiRegistryEntry<TOutput = unknown, TDecision = unknown> {
  contract: ToolUiContract<TOutput, TDecision>
  component: ComponentType<ToolUiComponentProps<TOutput, TDecision>>
}

export interface ToolUiComponentProps<TOutput = unknown, TDecision = unknown> {
  /** Parsed tool output data */
  output: TOutput
  /** Current tool call state */
  status?: ToolCallState
  /** Receipt state — when set, renders in read-only confirmed mode */
  choice?: TDecision & { at?: number }
  /** Callback when a decision is made */
  onDecision?: (decision: TDecision) => void
  /** Additional class name */
  className?: string
}

const registry = new Map<string, ToolUiRegistryEntry>()

/**
 * Register a tool UI component for a given tool name.
 */
export function registerToolUi<TOutput, TDecision>(
  contract: ToolUiContract<TOutput, TDecision>,
  component: ComponentType<ToolUiComponentProps<TOutput, TDecision>>,
): void {
  registry.set(contract.toolName, {
    contract,
    component: component as ComponentType<ToolUiComponentProps>,
  })
}

/**
 * Get the registered component for a tool name.
 */
export function getToolUiComponent(toolName: string): ComponentType<ToolUiComponentProps> | null {
  const entry = registry.get(toolName)
  return entry?.component ?? null
}

/**
 * Get the contract for a tool name.
 */
export function getToolUiContract(toolName: string): ToolUiContract<unknown, unknown> | null {
  const entry = registry.get(toolName)
  return entry?.contract ?? null
}

/**
 * Create a result renderer that can be used to render tool calls from
 * assistant messages. This is the main integration point with the chat system.
 */
export function createResultToolRenderer<TOutput, TDecision>(
  contract: ToolUiContract<TOutput, TDecision>,
  render: (parsed: TOutput, ctx: { toolCallId: string; status: ToolCallState }) => React.ReactNode,
) {
  return function ResultRenderer({
    result,
    toolCallId,
    status,
  }: {
    result: unknown
    toolCallId: string
    status: ToolCallState
  }) {
    const parsed = contract.safeParse(result)
    if (!parsed.success || !parsed.data) return null
    return render(parsed.data, { toolCallId, status })
  }
}

/**
 * Render tool call parts from an assistant message.
 * Uses the registry to find the appropriate component for each tool call.
 */
export function renderToolCallParts(
  parts: ToolCallPart[],
  options?: {
    fallback?: (part: ToolCallPart) => React.ReactNode
  },
): React.ReactNode[] {
  return parts.map((part) => {
    const Component = getToolUiComponent(part.toolName)

    if (Component) {
      const contract = getToolUiContract(part.toolName)
      const parsed = contract?.safeParse(part.args)
      if (parsed?.success && parsed.data) {
        return (
          <Component
            key={part.toolCallId}
            output={parsed.data}
            status={part.state}
          />
        )
      }
    }

    // Fallback: render args as JSON
    if (options?.fallback) {
      return options.fallback(part)
    }

    return null
  })
}