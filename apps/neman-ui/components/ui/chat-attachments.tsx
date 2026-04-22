"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// ─── Attachments container ───────────────────────────────────────

function ChatAttachments({
  variant = "inline",
  className,
  ...props
}: React.ComponentProps<"div"> & {
  variant?: "grid" | "inline" | "list"
}) {
  return (
    <div
      data-slot="chat-attachments"
      data-variant={variant}
      className={cn(
        variant === "grid" && "grid grid-cols-3 gap-2",
        variant === "inline" && "flex flex-wrap gap-2",
        variant === "list" && "flex flex-col gap-2",
        "px-3 pt-3",
        className
      )}
      {...props}
    />
  )
}

// ─── Single attachment ────────────────────────────────────────────

function ChatAttachment({
  name,
  type = "file",
  size,
  thumbnail,
  onRemove,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  name: string
  type?: "image" | "file"
  size?: string
  thumbnail?: string
  onRemove?: () => void
}) {
  const isImage = type === "image"

  return (
    <div
      data-slot="chat-attachment"
      className={cn(
        "group relative flex items-center gap-3 overflow-hidden rounded-[16px] border border-border/50 bg-card",
        "shadow-[var(--shadow-drop-1)] transition-all duration-300 hover:border-foreground/15 hover:shadow-[var(--shadow-drop-2)]",
        isImage && thumbnail ? "p-1.5" : "px-4 py-2.5",
        className
      )}
      {...props}
    >
      {/* Image thumbnail */}
      {isImage && thumbnail && (
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[12px] bg-fill-subtle">
          {/* Placeholder for actual image */}
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
              <path d="M3 16L8 11L21 21" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      )}

      {/* File icon + info */}
      {(!isImage || !thumbnail) && (
        <>
          <div className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-brand/8 text-brand">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-brand/70">
              <path
                d="M4 1.5H9.5L13 5V13C13 13.8 12.3 14.5 11.5 14.5H4C3.2 14.5 2.5 13.8 2.5 13V3C2.5 2.2 3.2 1.5 4 1.5Z"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              <path d="M9.5 1.5V5.5H13" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-label-secondary-bold truncate text-foreground">{name}</p>
            {size && (
              <p className="text-label-primary text-muted-foreground">{size}</p>
            )}
          </div>
        </>
      )}

      {/* Remove button */}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className={cn(
            "absolute right-1.5 top-1.5 flex size-6 items-center justify-center",
            "rounded-full bg-background/90 text-muted-foreground",
            "opacity-0 transition-all duration-200 hover:text-foreground group-hover:opacity-100 active:scale-90"
          )}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  )
}

export { ChatAttachments, ChatAttachment }