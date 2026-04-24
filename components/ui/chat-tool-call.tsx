"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// ─── Tool call status ────────────────────────────────────────────

type ToolState =
  | "input-streaming"
  | "input-available"
  | "output-available"
  | "output-error"
  | "output-denied"
  | "approval-requested"
  | "approval-responded"

function getStatusConfig(state: ToolState) {
  switch (state) {
    case "input-streaming":
      return { label: "Running", color: "text-foreground", bg: "bg-fill-medium" }
    case "input-available":
      return { label: "Running", color: "text-foreground", bg: "bg-fill-medium" }
    case "output-available":
      return { label: "Done", color: "text-success", bg: "bg-success/10" }
    case "output-error":
      return { label: "Error", color: "text-destructive", bg: "bg-destructive/10" }
    case "output-denied":
      return { label: "Denied", color: "text-destructive", bg: "bg-destructive/10" }
    case "approval-requested":
      return { label: "Needs Approval", color: "text-warning", bg: "bg-warning/10" }
    case "approval-responded":
      return { label: "Responded", color: "text-foreground", bg: "bg-fill-subtle" }
  }
}

// ─── Tool call container ──────────────────────────────────────────

function ChatToolCall({
  state = "output-available",
  open: openProp,
  defaultOpen,
  onOpenChange,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  state?: ToolState
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [internalOpen, setInternalOpen] = React.useState(
    defaultOpen ?? (state === "input-streaming" || state === "output-error")
  )
  const open = openProp ?? internalOpen
  const setOpen = React.useCallback(
    (value: boolean | ((prev: boolean) => boolean)) => {
      const next = typeof value === "function" ? value(open) : value
      setInternalOpen(next)
      onOpenChange?.(next)
    },
    [open, onOpenChange]
  )
  const config = getStatusConfig(state)

  return (
    <div
      data-slot="chat-tool-call"
      data-state={state}
      className={cn(
        "rounded-[22px] border border-border/50 transition-all duration-300",
        "shadow-[var(--shadow-drop-1)]",
        state === "output-error" && "border-destructive/20",
        className
      )}
      {...props}
    >
      <button
        aria-expanded={open}
        onClick={() => setOpen((o: boolean) => !o)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors duration-200 hover:bg-fill-medium rounded-[22px]"
      >
        {/* Wrench icon */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          className="shrink-0 text-muted-foreground"
        >
          <path
            d="M6.5 2.5C5.12 2.5 4 3.62 4 5C4 6.38 5.12 7.5 6.5 7.5C6.67 7.5 6.84 7.48 7 7.45V12C7 12.55 7.45 13 8 13H8.5C9.05 13 9.5 12.55 9.5 12V7.45C9.66 7.48 9.83 7.5 10 7.5C11.38 7.5 12.5 6.38 12.5 5C12.5 3.62 11.38 2.5 10 2.5"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="flex-1 text-label-secondary-bold text-foreground">
          {props.title || "Tool Call"}
        </span>
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-label-primary-bold",
            config.bg,
            config.color
          )}
        >
          {config.label}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          className={cn(
            "shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180"
          )}
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div
        className={cn(
          "grid transition-all duration-300",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="border-t border-border/30 px-4 py-3">{children}</div>
        </div>
      </div>
    </div>
  )
}

// ─── Tool call input (parameters) ───────────────────────────────

function ChatToolCallInput({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="chat-tool-call-input"
      className={cn("space-y-1.5", className)}
      {...props}
    />
  )
}

// ─── Tool call output (results) ──────────────────────────────────

function ChatToolCallOutput({
  variant = "default",
  className,
  ...props
}: React.ComponentProps<"div"> & {
  variant?: "default" | "error"
}) {
  return (
    <div
      data-slot="chat-tool-call-output"
      data-variant={variant}
      className={cn(
        "rounded-[6px] p-3 text-body-primary",
        variant === "error"
          ? "bg-destructive/5 text-destructive border border-destructive/15"
          : "bg-fill-subtle text-foreground",
        className
      )}
      {...props}
    />
  )
}

export { ChatToolCall, ChatToolCallInput, ChatToolCallOutput }
export type { ToolState }