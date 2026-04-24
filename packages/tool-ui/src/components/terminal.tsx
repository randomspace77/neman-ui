"use client"

import * as React from "react"
import { z } from "zod"
import { cn } from "./_adapter"
import { defineToolUiContract } from "../contracts/define-tool-ui-contract"
import { useControllableState, useCopyToClipboard } from "../utils/hooks"
import type { ToolUIReceipt } from "../contracts/define-tool-ui-contract"

// ─── Zod Schemas ───────────────────────────────────────────────────────────────

const TerminalLineSchema = z.object({
  type: z.enum(["input", "output", "error"]),
  text: z.string(),
})

export const SerializableTerminalSchema = z.object({
  lines: z.array(TerminalLineSchema),
  title: z.string().optional(),
  command: z.string().optional(),
  workingDirectory: z.string().optional(),
})

export type SerializableTerminal = z.infer<typeof SerializableTerminalSchema>

export const TerminalContract = defineToolUiContract({
  toolName: "terminal",
  role: "information",
  outputSchema: SerializableTerminalSchema,
})

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface TerminalLine {
  type: "input" | "output" | "error"
  text: string
}

export interface TerminalProps extends React.HTMLAttributes<HTMLDivElement> {
  lines: TerminalLine[]
  title?: string
  command?: string
  workingDirectory?: string
  /** Receipt state — when set, renders in read-only confirmed mode */
  receipt?: ToolUIReceipt
}

// ─── Component ─────────────────────────────────────────────────────────────────

function Terminal({
  lines,
  title,
  command,
  workingDirectory,
  receipt,
  className,
  ...props
}: TerminalProps) {
  const { copiedId, copy } = useCopyToClipboard()
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const isReadOnly = !!receipt

  const allText = React.useMemo(() => lines.map((l) => l.text).join("\n"), [lines])

  // Auto-scroll to bottom on new lines
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [lines])

  return (
    <div
      data-slot="terminal"
      data-receipt={receipt ? "true" : undefined}
      className={cn(
        "overflow-hidden rounded-[22px] border border-border/50",
        "bg-[var(--code-surface)] text-[var(--code-surface-foreground)]",
        "shadow-[var(--shadow-drop-2)] transition-all duration-300",
        className,
      )}
      {...props}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
        {/* Terminal dots */}
        <div className="flex items-center gap-1.5">
          <div className="size-[10px] rounded-full bg-destructive/80" />
          <div className="size-[10px] rounded-full bg-warning/80" />
          <div className="size-[10px] rounded-full bg-success/80" />
        </div>
        {title && (
          <span className="flex-1 text-center text-label-primary text-white/60 font-[590]">
            {title}
          </span>
        )}
        {!title && <span className="flex-1" />}
        {/* Copy button */}
        <button
          onClick={() => copy(allText, "terminal-content")}
          className={cn(
            "flex items-center gap-1 rounded-lg px-2 py-1 text-label-primary",
            "text-white/50 transition-all duration-200 hover:text-white/90 hover:bg-white/5",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
          )}
          aria-label="Copy terminal output"
        >
          {copiedId === "terminal-content" ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <rect x="4" y="4" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.2" />
              <path d="M1 8V2C1 1.45 1.45 1 2 1H8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {/* Working directory / command header */}
      {(workingDirectory || command) && (
        <div className="flex items-center gap-1.5 border-b border-white/5 px-4 py-1.5">
          {workingDirectory && (
            <span className="text-label-primary text-white/40 font-mono">
              {workingDirectory}
            </span>
          )}
          {command && (
            <>
              {workingDirectory && <span className="text-white/20">$</span>}
              <span className="text-label-primary text-muted-foreground font-mono">{command}</span>
            </>
          )}
        </div>
      )}

      {/* Terminal lines */}
      <div
        ref={scrollRef}
        className="max-h-[400px] overflow-y-auto p-4 font-mono text-[13px] leading-[1.6]"
      >
        {lines.map((line, index) => (
          <div
            key={index}
            data-slot="terminal-line"
            data-type={line.type}
            className={cn(
              "flex items-start gap-2 py-[2px]",
              line.type === "input" && "text-white/90",
              line.type === "output" && "text-white/60",
              line.type === "error" && "text-destructive",
            )}
          >
            {line.type === "input" && (
              <span className="shrink-0 select-none text-muted-foreground/80" aria-hidden="true">
                $
              </span>
            )}
            <pre className="whitespace-pre-wrap break-all font-mono text-[13px] leading-[1.6] m-0 p-0 bg-transparent">
              {line.text}
            </pre>
          </div>
        ))}
      </div>

      {/* Receipt footer */}
      {receipt && (
        <div className="border-t border-white/10 px-4 py-2.5">
          <span className="text-label-primary text-white/50">
            {lines.length} line{lines.length !== 1 ? "s" : ""}
            {receipt.summary && ` — ${receipt.summary}`}
          </span>
        </div>
      )}
    </div>
  )
}

export { Terminal }