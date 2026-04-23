"use client"

import * as React from "react"
import { z } from "zod"
import { cn } from "./_adapter"
import { defineToolUiContract } from "../contracts/define-tool-ui-contract"
import { useCopyToClipboard } from "../utils/hooks"

// ─── Schemas ──────────────────────────────────────────────────────────────────

export const SerializableCodeDiffSchema = z.object({
  oldCode: z.string(),
  newCode: z.string(),
  language: z.string().optional(),
  filename: z.string().optional(),
})

export type SerializableCodeDiff = z.infer<typeof SerializableCodeDiffSchema>

export const CodeDiffContract = defineToolUiContract({
  toolName: "code-diff",
  role: "information",
  outputSchema: SerializableCodeDiffSchema,
})

export const parse = CodeDiffContract.parse
export const safeParse = CodeDiffContract.safeParse

// ─── Diff computation ──────────────────────────────────────────────────────────

interface DiffLine {
  type: "context" | "addition" | "deletion"
  oldLineNumber?: number
  newLineNumber?: number
  content: string
}

function computeDiff(oldLines: string[], newLines: string[]): DiffLine[] {
  // Simple LCS-based diff: find longest common subsequence and mark additions/deletions
  const m = oldLines.length
  const n = newLines.length

  // Build LCS table
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (oldLines[i - 1] === newLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }

  // Backtrack to find diff
  const result: DiffLine[] = []
  let i = m
  let j = n
  let oldNum = m
  let newNum = n

  // We need to walk backwards and build the diff, then reverse
  const backwards: DiffLine[] = []

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
      backwards.push({ type: "context", oldLineNumber: i, newLineNumber: j, content: oldLines[i - 1] })
      i--
      j--
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      backwards.push({ type: "addition", newLineNumber: j, content: newLines[j - 1] })
      j--
    } else {
      backwards.push({ type: "deletion", oldLineNumber: i, content: oldLines[i - 1] })
      i--
    }
  }

  backwards.reverse()

  // Collapse context sections to only show a few lines around changes
  // For simplicity, show all lines when small, or collapse to +/- 3 lines of context around changes
  const hasChanges = backwards.some(l => l.type !== "context")
  if (!hasChanges) {
    // No changes at all
    return backwards.map(l => ({ ...l }))
  }

  // Keep 3 lines of context around each change
  const contextRadius = 3
  const showLine = new Set<number>()
  backwards.forEach((line, idx) => {
    if (line.type !== "context") {
      for (let k = Math.max(0, idx - contextRadius); k <= Math.min(backwards.length - 1, idx + contextRadius); k++) {
        showLine.add(k)
      }
    }
  })

  const result2: DiffLine[] = []
  let lastShown = -1
  backwards.forEach((line, idx) => {
    if (showLine.has(idx)) {
      if (lastShown >= 0 && idx - lastShown > 1) {
        // Add a separator line
        result2.push({ type: "context", content: "..." })
      }
      result2.push(line)
      lastShown = idx
    }
  })

  return result2
}

// ─── DiffLine Component ────────────────────────────────────────────────────────

function DiffLineRow({
  line,
  showLineNumbers,
  maxOldWidth,
  maxNewWidth,
}: {
  line: DiffLine
  showLineNumbers: boolean
  maxOldWidth: number
  maxNewWidth: number
}) {
  const prefix = line.type === "addition" ? "+" : line.type === "deletion" ? "-" : " "
  const isChangeLine = line.type !== "context" || line.content === "..."

  return (
    <div
      data-slot="diff-line"
      data-type={line.type}
      className={cn(
        "flex",
        line.type === "addition" && "bg-success/10",
        line.type === "deletion" && "bg-destructive/10",
        line.content === "..." && "text-[var(--code-surface-foreground)]/30 text-center",
      )}
    >
      {/* Line numbers */}
      {showLineNumbers && (
        <>
          <span
            className={cn(
              "inline-block shrink-0 text-right select-none pr-3 text-[var(--code-surface-foreground)]/25",
              line.type === "deletion" && "text-destructive/50",
              line.type === "addition" && "text-success/50",
            )}
            style={{ minWidth: `${maxOldWidth + 0.5}ch` }}
            aria-hidden="true"
          >
            {line.oldLineNumber ?? ""}
          </span>
          <span
            className={cn(
              "inline-block shrink-0 text-right select-none pr-3 border-r border-[var(--code-surface-foreground)]/8 text-[var(--code-surface-foreground)]/25",
              line.type === "addition" && "text-success/50",
              line.type === "deletion" && "text-destructive/50",
            )}
            style={{ minWidth: `${maxNewWidth + 0.5}ch` }}
            aria-hidden="true"
          >
            {line.newLineNumber ?? ""}
          </span>
        </>
      )}
      {/* Prefix */}
      <span
        className={cn(
          "inline-block shrink-0 w-5 text-center select-none text-[var(--code-surface-foreground)]/40",
          line.type === "addition" && "text-success/70",
          line.type === "deletion" && "text-destructive/70",
        )}
        aria-hidden="true"
      >
        {line.content === "..." ? "" : prefix}
      </span>
      {/* Content */}
      <span
        className={cn(
          "flex-1",
          line.type === "addition" && "text-success",
          line.type === "deletion" && "text-destructive",
          line.type === "context" && "text-[var(--code-surface-foreground)]/75",
          line.content === "..." && "text-[var(--code-surface-foreground)]/30",
        )}
      >
        {line.content}
      </span>
    </div>
  )
}

// ─── CodeDiff Props ────────────────────────────────────────────────────────────

export interface CodeDiffProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The original code */
  oldCode: string
  /** The new/modified code */
  newCode: string
  /** Programming language for syntax hint */
  language?: string
  /** Optional filename to display in header */
  filename?: string
  /** Receipt state — renders in read-only confirmed mode */
  choice?: SerializableCodeDiff
}

// ─── CodeDiff Component ────────────────────────────────────────────────────────

function CodeDiff({
  oldCode,
  newCode,
  language,
  filename,
  choice,
  className,
  ...props
}: CodeDiffProps) {
  const isReceipt = choice !== undefined
  const displayOld = isReceipt ? choice.oldCode : oldCode
  const displayNew = isReceipt ? choice.newCode : newCode
  const displayLanguage = isReceipt ? (choice.language ?? language) : language
  const displayFilename = isReceipt ? (choice.filename ?? filename) : filename

  const { copiedId, copy } = useCopyToClipboard()
  const copied = copiedId === "code-diff-new"

  const handleCopyNew = React.useCallback(() => {
    copy(displayNew, "code-diff-new")
  }, [copy, displayNew])

  const diffLines = React.useMemo(
    () => computeDiff(displayOld.split("\n"), displayNew.split("\n")),
    [displayOld, displayNew]
  )

  const additions = diffLines.filter(l => l.type === "addition").length
  const deletions = diffLines.filter(l => l.type === "deletion").length

  // Compute line number widths
  const maxOldLine = displayOld.split("\n").length
  const maxNewLine = displayNew.split("\n").length
  const maxOldWidth = String(maxOldLine).length
  const maxNewWidth = String(maxNewLine).length

  return (
    <div
      data-slot="code-diff"
      data-receipt={isReceipt ? "true" : undefined}
      className={cn(
        "group relative overflow-hidden rounded-[22px] bg-[var(--code-surface)]",
        "shadow-[var(--shadow-drop-2)]",
        className
      )}
      {...props}
    >
      <div aria-live="polite" className="sr-only">
        {copied ? "New code copied to clipboard" : ""}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--code-surface-foreground)]/8 px-4 py-2.5">
        <div className="flex items-center gap-3">
          {displayFilename && (
            <span className="text-label-secondary text-[var(--code-surface-foreground)]/50">
              {displayFilename}
            </span>
          )}
          {displayLanguage && !displayFilename && (
            <span className="text-label-secondary text-[var(--code-surface-foreground)]/50">
              {displayLanguage}
            </span>
          )}
          {/* Change summary */}
          <div className="flex items-center gap-2 text-label-primary-bold">
            {additions > 0 && (
              <span className="text-success/80">
                +{additions}
              </span>
            )}
            {deletions > 0 && (
              <span className="text-destructive">
                -{deletions}
              </span>
            )}
            {additions === 0 && deletions === 0 && (
              <span className="text-[var(--code-surface-foreground)]/50">No changes</span>
            )}
          </div>
          {isReceipt && (
            <span className="inline-flex items-center gap-1 text-label-primary-bold text-success/80">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Confirmed
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!isReceipt && (
            <button
              onClick={handleCopyNew}
              aria-label={copied ? "Copied" : "Copy new code"}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-[10px] px-2.5 py-1 text-label-primary transition-all duration-200",
                copied
                  ? "bg-success/20 text-success"
                  : "text-[var(--code-surface-foreground)]/35 hover:bg-[var(--code-surface-foreground)]/8 hover:text-[var(--code-surface-foreground)]/70"
              )}
            >
              {copied ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 8L5.5 11.5L12 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Copied
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M4.5 1H10.5C11.6 1 12.5 1.9 12.5 3V9C12.5 10.1 11.6 11 10.5 11H4.5C3.4 11 2.5 10.1 2.5 9V3C2.5 1.9 3.4 1 4.5 1Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9.5 3V11C9.5 12.1 8.6 13 7.5 13H3.5C2.4 13 1.5 12.1 1.5 11V5C1.5 3.9 2.4 3 3.5 3H9.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Copy new
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Diff content */}
      <div className="overflow-x-auto px-4 py-3">
        <pre className="text-[13px] leading-[20px] font-mono">
          <code>
            {diffLines.map((line, index) => (
              <DiffLineRow
                key={index}
                line={line}
                showLineNumbers={true}
                maxOldWidth={maxOldWidth}
                maxNewWidth={maxNewWidth}
              />
            ))}
          </code>
        </pre>
      </div>

      {/* Receipt summary footer */}
      {isReceipt && (
        <div className="border-t border-[var(--code-surface-foreground)]/8 px-4 py-2.5">
          <div className="flex items-center gap-4 text-label-primary text-[var(--code-surface-foreground)]/50">
            <span className="text-success/70">+{additions} added</span>
            <span className="text-destructive">-{deletions} removed</span>
          </div>
        </div>
      )}
    </div>
  )
}

export { CodeDiff }