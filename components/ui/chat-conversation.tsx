"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// ─── Conversation container ──────────────────────────────────────

function ChatConversation({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
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
        <div className="flex size-14 items-center justify-center rounded-[22px] bg-brand/8 text-brand shadow-[var(--shadow-drop-1)]">
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

export { ChatConversation, ChatConversationEmpty }