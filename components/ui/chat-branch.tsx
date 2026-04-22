"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// ─── Branch navigation ──────────────────────────────────────────

function ChatBranch({
  branchCount,
  currentBranch = 0,
  onBranchChange,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  branchCount: number
  currentBranch?: number
  onBranchChange?: (index: number) => void
}) {
  if (branchCount <= 1) return null

  return (
    <div
      data-slot="chat-branch"
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-border/50 bg-card px-1 py-0.5",
        "shadow-[var(--shadow-drop-1)]",
        className
      )}
      {...props}
    >
      <button
        onClick={() => onBranchChange?.(currentBranch - 1)}
        disabled={currentBranch === 0}
        aria-label="Previous branch"
        className="inline-flex size-7 items-center justify-center rounded-full text-muted-foreground transition-all duration-200 hover:bg-fill-subtle hover:text-foreground active:scale-95 disabled:opacity-25 disabled:pointer-events-none"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M9 3L5 7L9 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <span className="px-1 text-label-secondary tabular-nums text-muted-foreground">
        {currentBranch + 1} / {branchCount}
      </span>
      <button
        onClick={() => onBranchChange?.(currentBranch + 1)}
        disabled={currentBranch >= branchCount - 1}
        aria-label="Next branch"
        className="inline-flex size-7 items-center justify-center rounded-full text-muted-foreground transition-all duration-200 hover:bg-fill-subtle hover:text-foreground active:scale-95 disabled:opacity-25 disabled:pointer-events-none"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  )
}

export { ChatBranch }