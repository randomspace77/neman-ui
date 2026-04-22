"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// ─── Suggestion pills container ──────────────────────────────────

function ChatSuggestions({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="chat-suggestions"
      className={cn("flex flex-wrap gap-2", className)}
      {...props}
    >
      {children}
    </div>
  )
}

// ─── Single suggestion pill ──────────────────────────────────────

function ChatSuggestion({
  onClick,
  className,
  children,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      data-slot="chat-suggestion"
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-card px-3.5 py-1.5",
        "text-label-secondary text-muted-foreground",
        "shadow-[var(--shadow-drop-1)]",
        "transition-all duration-200 hover:border-brand/20 hover:bg-brand/[0.04] hover:text-foreground hover:shadow-[var(--shadow-drop-2)]",
        "active:scale-[0.97]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export { ChatSuggestions, ChatSuggestion }