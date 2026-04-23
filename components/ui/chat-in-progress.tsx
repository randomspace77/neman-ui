"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// ─── Message In-Progress Indicator ────────────────────────────────
// Shows a pulsing dot when a message is still streaming.

function ChatInProgress({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="chat-in-progress"
      className={cn("flex items-center gap-1.5 px-1 py-0.5", className)}
      {...props}
    >
      <span className="relative flex size-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
        <span className="relative inline-flex size-2 rounded-full bg-brand" />
      </span>
      <span className="text-label-secondary text-muted-foreground">Generating...</span>
    </div>
  )
}

export { ChatInProgress }