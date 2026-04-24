"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// ─── Quote/Reply Block ──────────────────────────────────────────
// Displays quoted text from a previous message, for reply context.

function ChatQuote({
  className,
  onDismiss,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  /** Optional dismiss callback — shows an X button */
  onDismiss?: () => void
}) {
  return (
    <div
      data-slot="chat-quote"
      className={cn(
        "relative flex items-start gap-2 rounded-lg border-l-2 border-border bg-fill-subtle px-3 py-2",
        className
      )}
      {...props}
    >
      <div className="flex-1 min-w-0 text-body-secondary text-muted-foreground line-clamp-3">
        {children}
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss quote"
          className="shrink-0 inline-flex size-5 items-center justify-center rounded-full text-muted-foreground/60 transition-colors hover:bg-fill-subtle hover:text-foreground"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path d="M2 2L8 8M8 2L2 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  )
}

export { ChatQuote }