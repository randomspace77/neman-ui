"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// ─── Prompt input container ──────────────────────────────────────

function ChatPromptInput({
  onSubmit,
  className,
  children,
  ...props
}: React.ComponentProps<"form"> & {
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void
}) {
  return (
    <form
      data-slot="chat-prompt-input"
      onSubmit={onSubmit}
      className={cn("relative", className)}
      {...props}
    >
      {children}
    </form>
  )
}

// ─── Textarea with auto-grow ─────────────────────────────────────

function ChatPromptInputTextarea({
  placeholder = "Send a message...",
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  const ref = React.useRef<HTMLTextAreaElement>(null)

  const autoResize = React.useCallback(() => {
    const textarea = ref.current
    if (!textarea) return
    textarea.style.height = "auto"
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
  }, [])

  React.useEffect(() => {
    autoResize()
  }, [autoResize])

  return (
    <textarea
      ref={ref}
      data-slot="chat-prompt-input-textarea"
      placeholder={placeholder}
      onInput={autoResize}
      rows={1}
      className={cn(
        "w-full resize-none bg-transparent px-5 py-3 text-body-primary text-foreground transition-[height] duration-200 ease-out",
        "placeholder:text-muted-foreground/60",
        "outline-none",
        className
      )}
      {...props}
    />
  )
}

// ─── Main body area (textarea + attachments) ─────────────────────

function ChatPromptInputBody({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="chat-prompt-input-body"
      className={cn("flex flex-col", className)}
      {...props}
    />
  )
}

// ─── Toolbar row ─────────────────────────────────────────────────

function ChatPromptInputToolbar({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="chat-prompt-input-toolbar"
      className={cn(
        "flex items-center justify-between border-t border-border/50 px-5 py-2.5",
        className
      )}
      {...props}
    />
  )
}

// ─── Toolbar left group ──────────────────────────────────────────

function ChatPromptInputToolbarLeft({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="chat-prompt-input-toolbar-left"
      className={cn("flex items-center gap-1", className)}
      {...props}
    />
  )
}

// ─── Toolbar right group ──────────────────────────────────────────

function ChatPromptInputToolbarRight({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="chat-prompt-input-toolbar-right"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  )
}

// ─── Action button ───────────────────────────────────────────────

function ChatPromptInputAction({
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      data-slot="chat-prompt-input-action"
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-[10px] text-muted-foreground",
        "transition-all duration-200 hover:bg-fill-subtle hover:text-foreground active:scale-95",
        className
      )}
      {...props}
    />
  )
}

// ─── Submit button ────────────────────────────────────────────────

function ChatPromptInputSubmit({
  disabled,
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      data-slot="chat-prompt-input-submit"
      type="submit"
      disabled={disabled}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-full bg-brand text-brand-foreground",
        "shadow-[var(--shadow-drop-2)]",
        "transition-all duration-200 hover:shadow-[var(--shadow-drop-3)] hover:opacity-90 active:scale-[0.98]",
        "disabled:opacity-30 disabled:pointer-events-none disabled:shadow-none",
        className
      )}
      {...props}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M3 8L13 3L8 13L7 9L3 8Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

// ─── Stop button ─────────────────────────────────────────────────

function ChatPromptInputStop({
  onClick,
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      data-slot="chat-prompt-input-stop"
      type="button"
      aria-label="Stop generating"
      onClick={onClick}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-full bg-destructive text-destructive-foreground",
        "shadow-[var(--shadow-drop-2)]",
        "transition-all duration-200 hover:shadow-[var(--shadow-drop-3)] hover:opacity-90 active:scale-[0.98]",
        className
      )}
      {...props}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
        <rect x="2" y="2" width="10" height="10" rx="2.5" />
      </svg>
    </button>
  )
}

export {
  ChatPromptInput,
  ChatPromptInputTextarea,
  ChatPromptInputBody,
  ChatPromptInputToolbar,
  ChatPromptInputToolbarLeft,
  ChatPromptInputToolbarRight,
  ChatPromptInputAction,
  ChatPromptInputSubmit,
  ChatPromptInputStop,
}