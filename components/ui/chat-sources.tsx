"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// ─── Sources list ────────────────────────────────────────────────

function ChatSources({
  count,
  open: openProp,
  defaultOpen,
  onOpenChange,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  count?: number
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen ?? false)
  const open = openProp ?? internalOpen
  const setOpen = React.useCallback(
    (value: boolean | ((prev: boolean) => boolean)) => {
      const next = typeof value === "function" ? value(open) : value
      setInternalOpen(next)
      onOpenChange?.(next)
    },
    [open, onOpenChange]
  )

  return (
    <div
      data-slot="chat-sources"
      className={cn("rounded-[22px] border border-border/50 transition-all duration-300", className)}
      {...props}
    >
      <button
        aria-expanded={open}
        onClick={() => setOpen((o: boolean) => !o)}
        className="flex w-full items-center gap-2.5 px-4 py-3 text-left transition-colors duration-200 hover:bg-fill-subtle/60 rounded-[22px]"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden="true"
          className="shrink-0 text-brand/70"
        >
          <path
            d="M7 1L8.5 4.5L12.5 5L9.5 7.5L10.5 11.5L7 9.5L3.5 11.5L4.5 7.5L1.5 5L5.5 4.5L7 1Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-label-secondary-bold text-muted-foreground">
          {count != null ? `${count} source${count !== 1 ? "s" : ""}` : "Sources"}
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden="true"
          className={cn(
            "ml-auto shrink-0 text-muted-foreground transition-transform duration-300",
            open && "rotate-180"
          )}
        >
          <path d="M4 6L7 9L10 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div
        className={cn(
          "grid transition-all duration-300",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="space-y-1.5 border-t border-border/30 px-3 py-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Single source ────────────────────────────────────────────────

function ChatSource({
  title,
  url,
  className,
  ...props
}: React.ComponentProps<"a"> & {
  title: string
  url?: string
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      data-slot="chat-source"
      className={cn(
        "flex items-center gap-2.5 rounded-[10px] px-3 py-2 text-label-secondary",
        "transition-all duration-200 hover:bg-brand/[0.04] hover:text-foreground",
        className
      )}
      {...props}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 text-brand">
        <path d="M7 1L3 5H5V9H9V5H11L7 1Z" fill="currentColor" />
      </svg>
      <span className="truncate font-[590] text-foreground">{title}</span>
      {url && (
        <span className="ml-auto truncate text-muted-foreground">
          {(() => { try { return new URL(url).hostname } catch { return url } })()}
        </span>
      )}
    </a>
  )
}

export { ChatSources, ChatSource }