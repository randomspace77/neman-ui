"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// ─── Typing indicator (bouncing dots) ────────────────────────────

function ChatTypingIndicator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="chat-typing-indicator"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[22px] bg-card border border-border/50 px-4 py-2.5",
        "shadow-[var(--shadow-drop-1)]",
        className
      )}
      {...props}
    >
      <span className="inline-flex items-center gap-1.5">
        <span className="neman-typing-dot h-2 w-2 rounded-full bg-brand/50 animate-[bounce_1.4s_ease-in-out_infinite]" />
        <span className="neman-typing-dot h-2 w-2 rounded-full bg-brand/50 animate-[bounce_1.4s_ease-in-out_0.2s_infinite]" />
        <span className="neman-typing-dot h-2 w-2 rounded-full bg-brand/50 animate-[bounce_1.4s_ease-in-out_0.4s_infinite]" />
      </span>
    </div>
  )
}

// ─── Streaming text shimmer ──────────────────────────────────────

function ChatStreamingText({
  children,
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="chat-streaming-text"
      className={cn("animate-pulse", className)}
      {...props}
    >
      {children}
      <span className="neman-cursor-blink ml-0.5 inline-block h-[1em] w-[2px] bg-brand align-middle" />
    </span>
  )
}

// ─── Spinner for loading states ──────────────────────────────────

function ChatSpinner({
  size = "default",
  className,
  ...props
}: React.ComponentProps<"div"> & {
  size?: "sm" | "default" | "lg"
}) {
  const sizeMap = { sm: "size-4", default: "size-5", lg: "size-6" }
  const borderMap = { sm: "border-2", default: "border-2", lg: "border-[3px]" }

  return (
    <div
      data-slot="chat-spinner"
      className={cn(
        "inline-block animate-spin rounded-full border-brand/25 border-t-brand shadow-[var(--shadow-drop-1)]",
        sizeMap[size],
        borderMap[size],
        className
      )}
      {...props}
    />
  )
}

export { ChatTypingIndicator, ChatStreamingText, ChatSpinner }