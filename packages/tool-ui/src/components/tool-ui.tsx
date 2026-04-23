"use client"

import * as React from "react"

// Import cn from the parent project — when used as a package, this resolves
// to the shared utility. For copy/paste usage, update this import path.
// Import Button — same pattern as cn.
// We import these at the package level, but for copy/paste usage,
// the _adapter.tsx file re-exports them from the correct local paths.

// ─── Types ─────────────────────────────────────────────────────────────────────

import type { Action, DecisionResult, ToolUIReceipt } from "../contracts/define-tool-ui-contract"
type ToolCallState =
  | "input-streaming"
  | "input-available"
  | "output-available"
  | "output-error"
  | "output-denied"
  | "approval-requested"
  | "approval-responded"

export interface ToolUIRootProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The tool name (maps to a registered tool) */
  toolName: string
  /** Current state of the tool call */
  status?: ToolCallState
  /** Receipt state — when set, renders in read-only confirmed mode */
  receipt?: ToolUIReceipt
  children: React.ReactNode
}

export interface ToolUISurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export interface ToolUIActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export interface ToolUIActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "destructive" | "ghost" | "outline"
  loading?: boolean
  disabled?: boolean
  shortcut?: string
  confirmLabel?: string
  onAction?: (actionId: string, result?: DecisionResult) => void
}

export interface ToolUILocalActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  actions: Action[]
  onAction?: (actionId: string) => void | Promise<void>
}

export interface ToolUIDecisionActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  actions: Action[]
  onAction?: (actionId: string, result: DecisionResult) => void | Promise<void>
  confirmTimeout?: number
}

// ─── ToolUI Context ─────────────────────────────────────────────────────────────

const ToolUIContext = React.createContext<{
  toolName: string
  status: ToolCallState
  receipt?: ToolUIReceipt
}>({
  toolName: "",
  status: "input-available",
})

// ─── Status Config ──────────────────────────────────────────────────────────────

function getStatusConfig(status: ToolCallState) {
  switch (status) {
    case "input-streaming":
      return { label: "Running", color: "text-brand", bg: "bg-brand/10", border: "border-brand/20" }
    case "input-available":
      return { label: "Running", color: "text-brand", bg: "bg-brand/10", border: "border-brand/20" }
    case "output-available":
      return { label: "Done", color: "text-success", bg: "bg-success/10", border: "border-success/20" }
    case "output-error":
      return { label: "Error", color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20" }
    case "output-denied":
      return { label: "Denied", color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20" }
    case "approval-requested":
      return { label: "Needs Approval", color: "text-warning", bg: "bg-warning/10", border: "border-warning/20" }
    case "approval-responded":
      return { label: "Responded", color: "text-muted-foreground", bg: "bg-fill-subtle", border: "border-border" }
  }
}

// ─── ToolUI Root ─────────────────────────────────────────────────────────────────

function ToolUIRoot({
  toolName,
  status = "input-available",
  receipt,
  className,
  children,
  ...props
}: ToolUIRootProps) {
  const ctx = React.useMemo(() => ({ toolName, status, receipt }), [toolName, status, receipt])

  return (
    <ToolUIContext.Provider value={ctx}>
      <div
        data-slot="tool-ui"
        data-tool-ui-id={toolName}
        data-status={status}
        data-receipt={receipt ? "true" : undefined}
        className={className}
        {...props}
      >
        {children}
      </div>
    </ToolUIContext.Provider>
  )
}

// ─── ToolUI Surface ──────────────────────────────────────────────────────────────

function ToolUISurface({ className, children, ...props }: ToolUISurfaceProps) {
  return (
    <div
      data-slot="tool-ui-surface"
      className={className}
      {...props}
    >
      {children}
    </div>
  )
}

// ─── ToolUI Actions ──────────────────────────────────────────────────────────────

function ToolUIActions({ className, children, ...props }: ToolUIActionsProps) {
  return (
    <div
      data-slot="tool-ui-actions"
      className={className}
      {...props}
    >
      {children}
    </div>
  )
}

// ─── ToolUI Action ────────────────────────────────────────────────────────────────

function ToolUIAction({
  variant = "default",
  loading = false,
  disabled = false,
  shortcut,
  confirmLabel,
  onAction,
  className,
  children,
  ...props
}: ToolUIActionProps) {
  const [confirming, setConfirming] = React.useState(false)
  const [executing, setExecuting] = React.useState(false)
  const confirmTimerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (confirmLabel && !confirming) {
        setConfirming(true)
        confirmTimerRef.current = setTimeout(() => setConfirming(false), 3000)
        return
      }

      if (confirmTimerRef.current) {
        clearTimeout(confirmTimerRef.current)
      }

      setExecuting(true)
      onAction?.(props.id ?? "", {
        kind: "decision",
        version: 1,
        decisionId: `decision-${Date.now()}`,
        actionId: props.id ?? "",
        actionLabel: String(children),
        at: Date.now(),
      })
      setTimeout(() => setExecuting(false), 500)
    },
    [confirmLabel, confirming, onAction, children, props.id],
  )

  React.useEffect(() => {
    return () => {
      if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current)
    }
  }, [])

  const isDisabled = disabled || executing

  return (
    <button
      data-variant={variant}
      data-confirming={confirming || undefined}
      disabled={isDisabled}
      onClick={handleClick}
      className={className}
      {...props}
    >
      {executing ? "..." : confirming ? confirmLabel : children}
      {shortcut && !confirming && (
        <kbd className="ml-2 text-[11px] text-muted-foreground opacity-60">{shortcut}</kbd>
      )}
    </button>
  )
}

// ─── ToolUI LocalActions ──────────────────────────────────────────────────────────

function ToolUILocalActions({
  actions,
  onAction,
  className,
  children,
  ...props
}: ToolUILocalActionsProps) {
  return (
    <div
      data-slot="tool-ui-local-actions"
      className={className}
      {...props}
    >
      {actions.map((action) => (
        <ToolUIAction
          key={action.id}
          id={action.id}
          variant={action.variant}
          loading={action.loading}
          disabled={action.disabled}
          shortcut={action.shortcut}
          onAction={(actionId) => onAction?.(actionId)}
        >
          {action.label}
        </ToolUIAction>
      ))}
      {children}
    </div>
  )
}

// ─── ToolUI DecisionActions ───────────────────────────────────────────────────────

function ToolUIDecisionActions({
  actions,
  onAction,
  confirmTimeout = 3000,
  className,
  ...props
}: ToolUIDecisionActionsProps) {
  return (
    <div
      data-slot="tool-ui-decision-actions"
      className={className}
      {...props}
    >
      {actions.map((action) => (
        <ToolUIAction
          key={action.id}
          id={action.id}
          variant={action.variant}
          confirmLabel={action.confirmLabel}
          loading={action.loading}
          disabled={action.disabled}
          shortcut={action.shortcut}
          onAction={(_, result) => {
            if (result) {
              onAction?.(action.id, result as DecisionResult)
            }
          }}
        >
          {action.label}
        </ToolUIAction>
      ))}
    </div>
  )
}

// ─── Compound Export ─────────────────────────────────────────────────────────────

export const ToolUI = Object.assign(ToolUIRoot, {
  Surface: ToolUISurface,
  Actions: ToolUIActions,
  Action: ToolUIAction,
  LocalActions: ToolUILocalActions,
  DecisionActions: ToolUIDecisionActions,
})

export { ToolUIRoot, ToolUISurface, ToolUIActions, ToolUIAction, ToolUILocalActions, ToolUIDecisionActions }
export { getStatusConfig }
export type { ToolCallState }