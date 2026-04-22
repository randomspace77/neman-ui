"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// ─── Message bubble ─────────────────────────────────────────────

function ChatMessage({
  from,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  from: "user" | "assistant"
}) {
  return (
    <div
      data-slot="chat-message"
      data-from={from}
      className={cn(
        "group flex w-full gap-3",
        from === "user" ? "justify-end" : "justify-start",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// ─── Message avatar ─────────────────────────────────────────────

function ChatMessageAvatar({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="chat-message-avatar"
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full",
        "bg-brand/8 text-brand shadow-[var(--shadow-drop-1)]",
        "transition-all duration-300 group-hover:bg-brand/15 group-hover:text-brand group-hover:shadow-[var(--shadow-drop-2)]",
        className
      )}
      {...props}
    />
  )
}

// ─── Message content area ────────────────────────────────────────

function ChatMessageContent({
  from,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  from: "user" | "assistant"
}) {
  return (
    <div
      data-slot="chat-message-content"
      data-from={from}
      className={cn(
        "max-w-[75%] space-y-2",
        from === "user" && [
          "rounded-[22px] bg-brand px-4 py-3 text-brand-foreground text-body-primary",
          "shadow-[var(--shadow-drop-2)]",
        ],
        from === "assistant" && [
          "rounded-[22px] bg-card px-4 py-2.5 text-foreground",
          "border border-border/60 shadow-[var(--shadow-card)]",
        ],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// ─── Message text ────────────────────────────────────────────────

function ChatMessageText({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="chat-message-text"
      className={cn("text-body-primary", className)}
      {...props}
    />
  )
}

// ─── Message actions row ─────────────────────────────────────────

function ChatMessageActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="chat-message-actions"
      className={cn(
        "flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100",
        className
      )}
      {...props}
    />
  )
}

// ─── Message action button ───────────────────────────────────────

function ChatMessageAction({
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      data-slot="chat-message-action"
      className={cn(
        "inline-flex size-7 items-center justify-center rounded-[10px] text-muted-foreground transition-all duration-200 hover:bg-fill-subtle hover:text-foreground active:scale-95",
        className
      )}
      {...props}
    />
  )
}

// ─── Message timestamp ──────────────────────────────────────────

function ChatMessageTimestamp({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="chat-message-timestamp"
      className={cn("text-label-secondary text-muted-foreground", className)}
      {...props}
    />
)
}

export {
  ChatMessage,
  ChatMessageAvatar,
  ChatMessageContent,
  ChatMessageText,
  ChatMessageActions,
  ChatMessageAction,
  ChatMessageTimestamp,
}