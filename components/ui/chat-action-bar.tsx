"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// ─── Action Bar ─────────────────────────────────────────────────
// A floating or inline bar of action buttons that appears on message hover.
// Inspired by assistant-ui's ActionBarPrimitive.

function ChatActionBar({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="chat-action-bar"
      className={cn(
        "inline-flex items-center gap-0.5 rounded-lg border border-border/50 bg-card shadow-[var(--shadow-drop-2)]",
        "opacity-0 transition-opacity duration-200 group-hover/message:opacity-100",
        "group-hover:opacity-100",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// ─── Action Bar Button ──────────────────────────────────────────

function ChatActionBarButton({
  className,
  label,
  ...props
}: React.ComponentProps<"button"> & {
  /** Accessible label for the button */
  label?: string
}) {
  return (
    <button
      type="button"
      aria-label={label}
      data-slot="chat-action-bar-button"
      className={cn(
        "inline-flex size-7 items-center justify-center rounded-lg text-muted-foreground",
        "transition-all duration-200 hover:bg-fill-subtle hover:text-foreground active:scale-95",
        className
      )}
      {...props}
    />
  )
}

// ─── Copy Button ────────────────────────────────────────────────

function ChatActionBarCopy({
  value,
  className,
  ...props
}: React.ComponentProps<"button"> & {
  /** The text content to copy to clipboard */
  value: string
  label?: string
}) {
  const [copied, setCopied] = React.useState(false)
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const handleCopy = React.useCallback(() => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setCopied(false), 2000)
  }, [value])

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return (
    <ChatActionBarButton
      aria-label={copied ? "Copied" : "Copy"}
      onClick={handleCopy}
      className={cn(copied && "text-success", className)}
      {...props}
    >
      {copied ? (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M3.5 7.5L6 10L10.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <rect x="5" y="5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M9 5V3.5C9 2.67 8.33 2 7.5 2H3.5C2.67 2 2 2.67 2 3.5V7.5C2 8.33 2.67 9 3.5 9H5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      )}
    </ChatActionBarButton>
  )
}

// ─── Edit Button ────────────────────────────────────────────────

function ChatActionBarEdit({
  onClick,
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <ChatActionBarButton
      aria-label="Edit message"
      onClick={onClick}
      className={className}
      {...props}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M10.5 2L12 3.5L5 10.5H3.5V9L10.5 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </ChatActionBarButton>
  )
}

// ─── Reload Button ──────────────────────────────────────────────

function ChatActionBarReload({
  onClick,
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <ChatActionBarButton
      aria-label="Regenerate response"
      onClick={onClick}
      className={className}
      {...props}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M2 7C2 4.24 4.24 2 7 2C9.06 2 10.83 3.19 11.65 4.93" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M12 7C12 9.76 9.76 12 7 12C4.94 12 3.17 10.81 2.35 9.07" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M11.65 2V4.93H9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2.35 12V9.07H5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </ChatActionBarButton>
  )
}

// ─── Feedback (Thumbs Up/Down) ──────────────────────────────────

function ChatActionBarFeedbackPositive({
  onClick,
  active,
  className,
  ...props
}: React.ComponentProps<"button"> & {
  active?: boolean
}) {
  return (
    <ChatActionBarButton
      aria-label="Positive feedback"
      onClick={onClick}
      className={cn(active && "text-success", className)}
      {...props}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M4 8V3L5.5 1.5C5.8 1.2 6.3 1.2 6.5 1.5L7 2.5L6 5H9.5C10.1 5 10.5 5.5 10.4 6L9.9 9C9.8 9.5 9.4 9.8 9 9.8H5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 12V8H4V12H2Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </ChatActionBarButton>
  )
}

function ChatActionBarFeedbackNegative({
  onClick,
  active,
  className,
  ...props
}: React.ComponentProps<"button"> & {
  active?: boolean
}) {
  return (
    <ChatActionBarButton
      aria-label="Negative feedback"
      onClick={onClick}
      className={cn(active && "text-destructive", className)}
      {...props}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M10 6V11L8.5 12.5C8.2 12.8 7.7 12.8 7.5 12.5L7 11.5L8 9H4.5C3.9 9 3.5 8.5 3.6 8L4.1 5C4.2 4.5 4.6 4.2 5 4.2H9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 2V6H10V2H12Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </ChatActionBarButton>
  )
}

export {
  ChatActionBar,
  ChatActionBarButton,
  ChatActionBarCopy,
  ChatActionBarEdit,
  ChatActionBarReload,
  ChatActionBarFeedbackPositive,
  ChatActionBarFeedbackNegative,
}