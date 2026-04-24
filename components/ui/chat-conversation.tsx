"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useChatContext } from "@/packages/headless/src"

// ─── Conversation container (dual-mode) ────────────────────────

function ChatConversation({
  auto = false,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  /** When true and NemanChatProvider is present, auto-renders all thread messages. */
  auto?: boolean
}) {
  const bottomRef = React.useRef<HTMLDivElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [isAtBottom, setIsAtBottom] = React.useState(true)

  const handleScroll = React.useCallback(() => {
    const container = containerRef.current
    if (!container) return
    const threshold = 60
    setIsAtBottom(
      container.scrollHeight - container.scrollTop - container.clientHeight < threshold
    )
  }, [])

  const scrollToBottom = React.useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  React.useEffect(() => {
    if (isAtBottom) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  })

  return (
    <div
      role="log"
      aria-label="Chat conversation"
      aria-live="polite"
      data-slot="chat-conversation"
      ref={containerRef}
      onScroll={handleScroll}
      className={cn(
        "relative flex h-full flex-col overflow-y-auto",
        "scroll-smooth",
        className
      )}
      {...props}
    >
      <div className="flex flex-1 flex-col gap-6 px-4 pt-6 pb-4 md:px-6">
        {children}
      </div>
      <div ref={bottomRef} />

      {!isAtBottom && (
        <button
          aria-label="Scroll to bottom"
          onClick={scrollToBottom}
          className={cn(
            "absolute bottom-4 left-1/2 -translate-x-1/2",
            "inline-flex size-9 items-center justify-center",
            "rounded-full border border-border bg-card text-muted-foreground",
            "shadow-[var(--shadow-drop-3)]",
            "transition-all duration-300 hover:text-foreground hover:shadow-[var(--shadow-drop-4)] active:scale-95"
          )}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
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
      )}
    </div>
  )
}

// ─── Auto conversation renderer (connected mode) ──────────────
// Requires NemanChatProvider in the tree. Renders all thread messages automatically.

function ChatConversationAuto() {
  const ctx = useChatContext()
  if (!ctx) return null

  const { messages } = ctx.thread
  const { isStreaming } = ctx.streaming

  return (
    <ChatConversation auto>
      {messages.map((msg) => (
        <div key={msg.id} data-slot="auto-message" data-role={msg.role}>
          {/* Auto-rendered messages — use <ChatMessage messageId={msg.id}> for full styling */}
          <div className={cn(
            "max-w-[75%] rounded-[22px] px-4 py-2.5",
            msg.role === "user"
              ? "ml-auto bg-fill-medium text-foreground shadow-[var(--shadow-drop-2)]"
              : "mr-auto bg-card text-foreground border border-border/50 shadow-[var(--shadow-card)]"
          )}>
            {msg.parts.map((part, i) => {
              if (part.type === "text") return <div key={i} className="text-body-primary">{part.text}</div>
              if (part.type === "reasoning") return <div key={i} className="text-sm text-muted-foreground italic">{part.text}</div>
              return null
            })}
          </div>
        </div>
      ))}
      {(ctx.thread.isLoading || isStreaming) && (
        <div className="flex justify-start">
          <div className="rounded-[22px] bg-card px-4 py-2.5 border border-border/50 shadow-[var(--shadow-card)]">
            <div className="neman-typing-dots flex items-center gap-1" aria-label="Assistant is typing" role="status">
              <span className="size-1.5 rounded-full bg-brand/60 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="size-1.5 rounded-full bg-brand/60 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="size-1.5 rounded-full bg-brand/60 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        </div>
      )}
    </ChatConversation>
  )
}

// ─── Empty state ──────────────────────────────────────────────────

function ChatConversationEmpty({
  icon,
  title,
  description,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  icon?: React.ReactNode
  title?: string
  description?: string
}) {
  return (
    <div
      role="status"
      data-slot="chat-conversation-empty"
      className={cn(
        "flex flex-1 flex-col items-center justify-center gap-4 py-20 text-center",
        className
      )}
      {...props}
    >
      {icon && (
        <div className="flex size-14 items-center justify-center rounded-[22px] bg-fill-subtle text-muted-foreground shadow-[var(--shadow-drop-1)]">
          {icon}
        </div>
      )}
      {title && (
        <h3 className="text-headline-primary text-foreground">{title}</h3>
      )}
      {description && (
        <p className="max-w-[400px] text-body-secondary text-muted-foreground">
          {description}
        </p>
      )}
      {children}
    </div>
  )
}

export { ChatConversation, ChatConversationAuto, ChatConversationEmpty }