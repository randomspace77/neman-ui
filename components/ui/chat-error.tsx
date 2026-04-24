"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// ─── Message Error Display ──────────────────────────────────────
// Shows an error state for a failed message, with retry option.

function ChatError({
  error,
  onRetry,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  /** The error that occurred */
  error: Error | string
  /** Callback to retry the failed action */
  onRetry?: () => void
}) {
  const message = typeof error === "string" ? error : error.message

  return (
    <div
      data-slot="chat-error"
      className={cn(
        "flex items-start gap-3 rounded-[22px] border border-destructive/20 bg-destructive/5 px-4 py-3",
        className
      )}
      {...props}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        className="shrink-0 text-destructive mt-0.5"
        aria-hidden="true"
      >
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2" />
        <path d="M8 5V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="8" cy="11" r="0.8" fill="currentColor" />
      </svg>
      <div className="flex-1 min-w-0">
        <p className="text-label-primary-bold text-destructive">
          Something went wrong
        </p>
        <p className="text-label-secondary text-muted-foreground mt-0.5 truncate">
          {message}
        </p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className={cn(
            "shrink-0 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5",
            "text-label-primary text-destructive",
            "border border-destructive/30 bg-destructive/5",
            "transition-all duration-200 hover:bg-destructive/10 hover:border-destructive/50 active:scale-[0.98]"
          )}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 6C2 3.79 3.79 2 6 2C7.68 2 9.1 3.03 9.68 4.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            <path d="M10 6C10 8.21 8.21 10 6 10C4.32 10 2.9 8.97 2.32 7.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            <path d="M9.68 2.5V4.5H7.68" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2.32 9.5V7.5H4.32" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Retry
        </button>
      )}
    </div>
  )
}

export { ChatError }