"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  useMessage,
  type Message,
} from "@/packages/headless/src"
import type { ToolState } from "./chat-tool-call"

// ─── Message bubble (dual-mode: presentational + connected) ──────

function ChatMessage({
  from: fromProp,
  messageId,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  /** Message sender. Required in presentational mode, optional if messageId is provided. */
  from?: "user" | "assistant"
  /** When provided and NemanChatProvider is present, reads message state from context. */
  messageId?: string
}) {
  const message = messageId ? useMessage(messageId) : null
  const effectiveFrom = fromProp ?? (message?.role === "user" ? "user" : message?.role === "assistant" ? "assistant" : undefined)

  // If we have a message from context but no children, render auto content
  const autoContent = message && !children ? <AutoMessageContent message={message} /> : null

  return (
    <div
      role="article"
      aria-label={effectiveFrom === "user" ? "Your message" : "Assistant message"}
      data-slot="chat-message"
      data-from={effectiveFrom}
      className={cn(
        "group flex w-full gap-3",
        effectiveFrom === "user" ? "justify-end" : "justify-start",
        className
      )}
      {...props}
    >
      {autoContent ?? children}
    </div>
  )
}

// ─── Auto-render message content from context ────────────────────

function AutoMessageContent({ message }: { message: Message }) {
  return (
    <ChatMessageContent from={message.role === "user" ? "user" : "assistant"}>
      {message.parts.map((part, i) => {
        switch (part.type) {
          case "text":
            return <ChatMessageText key={i}>{part.text}</ChatMessageText>
          case "reasoning":
            return (
              <div key={i} className="text-sm text-muted-foreground italic">
                {part.text}
              </div>
            )
          case "tool-call":
            return (
              <div key={i} data-slot="chat-auto-tool-call" className="flex items-center gap-2 text-sm">
                <span className="rounded-full bg-brand/10 px-2 py-0.5 text-label-primary-bold text-brand">
                  {part.state === "input-streaming" || part.state === "input-available" ? "Running" : part.state === "output-available" ? "Done" : part.state === "output-error" ? "Error" : part.state}
                </span>
                <span className="font-[590]">{part.toolName}</span>
              </div>
            )
          case "image":
            return (
              <img
                key={i}
                src={part.image}
                alt={part.alt ?? ""}
                className="max-w-full rounded-[10px]"
              />
            )
          case "source":
            return (
              <a
                key={i}
                href={part.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand underline text-sm"
              >
                {part.title ?? part.url}
              </a>
            )
          default:
            return null
        }
      })}
    </ChatMessageContent>
  )
}

// ─── Message avatar ─────────────────────────────────────────────

function ChatMessageAvatar({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      role="img"
      aria-hidden="true"
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

// ─── Message content area (dual-mode) ────────────────────────────

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
          "border border-border/50 shadow-[var(--shadow-card)]",
        ],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// ─── Message text (dual-mode) ─────────────────────────────────────

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
      type="button"
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