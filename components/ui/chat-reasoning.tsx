"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// ─── Reasoning (thinking) collapsible ────────────────────────────

function ChatReasoning({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  isStreaming = false,
  duration,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  isStreaming?: boolean
  duration?: number
}) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen ?? false)
  const open = openProp ?? internalOpen
  const setOpen = React.useCallback(
    (value: boolean | ((prev: boolean) => boolean)) => {
      const next = typeof value === "function" ? value(open) : value
      setInternalOpen(next)
      onOpenChange?.(next)
    },
    [open, onOpenChange]
  )

  // Auto-open when streaming starts, auto-close 1s after it ends
  const prevStreamingRef = React.useRef(isStreaming)
  React.useEffect(() => {
    if (isStreaming && !prevStreamingRef.current) {
      setOpen(true)
    }
    if (!isStreaming && prevStreamingRef.current) {
      const timer = setTimeout(() => setOpen(false), 1000)
      return () => clearTimeout(timer)
    }
    prevStreamingRef.current = isStreaming
  }, [isStreaming, setOpen])

  return (
    <div
      data-slot="chat-reasoning"
      className={cn(
        "rounded-[22px] border border-border/50 bg-fill-subtle transition-all duration-300",
        isStreaming && "border-primary/20 bg-fill-medium",
        className
      )}
      {...props}
    >
      <button
        aria-expanded={open}
        onClick={() => setOpen((o: boolean) => !o)}
        className="flex w-full items-center gap-2.5 px-4 py-3 text-left transition-colors duration-200 hover:bg-fill-medium rounded-[22px]"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          className={cn(
            "shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-90 text-foreground"
          )}
        >
          <path
            d="M6 4L10 8L6 12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className={cn(
          "text-label-secondary-bold transition-colors duration-200",
          isStreaming ? "text-foreground" : "text-muted-foreground"
        )}>
          {isStreaming ? (
            <span className="inline-flex items-center gap-1.5">
              Thinking
              <span className="neman-reasoning-dots" />
            </span>
          ) : duration != null ? (
            `Thought for ${duration}s`
          ) : (
            "View reasoning"
          )}
        </span>
      </button>
      <div
        className={cn(
          "grid transition-all duration-300",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-3.5 pt-1 text-body-primary text-muted-foreground">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export { ChatReasoning }