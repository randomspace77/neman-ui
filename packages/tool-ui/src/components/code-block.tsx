"use client"

import * as React from "react"
import { z } from "zod"
import { cn } from "./_adapter"
import { defineToolUiContract } from "../contracts/define-tool-ui-contract"
import { useCopyToClipboard } from "../utils/hooks"

// ─── Schemas ──────────────────────────────────────────────────────────────────

export const SerializableCodeBlockSchema = z.object({
  code: z.string(),
  language: z.string().optional(),
  filename: z.string().optional(),
  showLineNumbers: z.boolean().optional(),
})

export type SerializableCodeBlock = z.infer<typeof SerializableCodeBlockSchema>

export const CodeBlockContract = defineToolUiContract({
  toolName: "code-block",
  role: "information",
  outputSchema: SerializableCodeBlockSchema,
})

export const parse = CodeBlockContract.parse
export const safeParse = CodeBlockContract.safeParse

// ─── CodeBlock Props ───────────────────────────────────────────────────────────

export interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The code content to display */
  code: string
  /** Programming language for syntax hint */
  language?: string
  /** Optional filename to display in header */
  filename?: string
  /** Whether to show line numbers (default: false) */
  showLineNumbers?: boolean
  /** Receipt state — renders in read-only confirmed mode */
  choice?: SerializableCodeBlock
}

// ─── Line numbers helper ───────────────────────────────────────────────────────

function splitLines(code: string): string[] {
  if (!code) return []
  return code.split("\n")
}

// ─── CodeBlock Component ────────────────────────────────────────────────────────

function CodeBlock({
  code,
  language,
  filename,
  showLineNumbers = false,
  choice,
  className,
  ...props
}: CodeBlockProps) {
  const isReceipt = choice !== undefined
  const displayCode = isReceipt ? choice.code : code
  const displayLanguage = isReceipt ? (choice.language ?? language) : language
  const displayFilename = isReceipt ? (choice.filename ?? filename) : filename
  const displayShowLineNumbers = isReceipt ? (choice.showLineNumbers ?? showLineNumbers) : showLineNumbers

  const { copiedId, copy } = useCopyToClipboard()
  const copied = copiedId === "code-block"

  const handleCopy = React.useCallback(() => {
    copy(displayCode, "code-block")
  }, [copy, displayCode])

  const lines = React.useMemo(() => splitLines(displayCode), [displayCode])
  const maxLineNumberWidth = String(lines.length).length

  return (
    <div
      data-slot="code-block"
      data-receipt={isReceipt ? "true" : undefined}
      className={cn(
        "group relative overflow-hidden rounded-[22px] bg-[var(--code-surface)]",
        "shadow-[var(--shadow-drop-2)]",
        className
      )}
      {...props}
    >
      <div aria-live="polite" className="sr-only">
        {copied ? "Code copied to clipboard" : ""}
      </div>

      {/* Header */}
      {(displayLanguage || displayFilename) && (
        <div className="flex items-center justify-between border-b border-[var(--code-surface-foreground)]/8 px-4 py-2.5">
          <div className="flex items-center gap-2">
            {displayFilename ? (
              <span className="text-label-secondary text-[var(--code-surface-foreground)]/50">
                {displayFilename}
              </span>
            ) : displayLanguage ? (
              <span className="text-label-secondary text-[var(--code-surface-foreground)]/50">
                {displayLanguage}
              </span>
            ) : null}
            {isReceipt && (
              <span className="inline-flex items-center gap-1 text-label-primary-bold text-success/80">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Confirmed
              </span>
            )}
          </div>
          {!isReceipt && (
            <button
              onClick={handleCopy}
              aria-label={copied ? "Copied" : "Copy code"}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-label-primary transition-all duration-200",
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
                  Copy
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* No header — still show copy button (unless receipt) */}
      {!displayLanguage && !displayFilename && !isReceipt && (
        <button
          onClick={handleCopy}
          aria-label={copied ? "Copied" : "Copy code"}
          className={cn(
            "absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-label-primary transition-all duration-200",
            copied
              ? "bg-success/20 text-success opacity-100"
              : "text-[var(--code-surface-foreground)]/30 hover:bg-[var(--code-surface-foreground)]/8 hover:text-[var(--code-surface-foreground)]/70 opacity-0 group-hover:opacity-100"
          )}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      )}

      {/* Code content */}
      <div className="overflow-x-auto px-4 py-3">
        <pre className="text-label-secondary text-[var(--code-surface-foreground)]/75">
          {displayShowLineNumbers ? (
            <code>
              {lines.map((line, index) => (
                <React.Fragment key={index}>
                  <span
                    className="inline-block text-[var(--code-surface-foreground)]/25 select-none mr-4 text-right"
                    style={{ minWidth: `${maxLineNumberWidth + 0.5}ch` }}
                    aria-hidden="true"
                  >
                    {index + 1}
                  </span>
                  {line}
                  {index < lines.length - 1 && "\n"}
                </React.Fragment>
              ))}
            </code>
          ) : (
            <code>{displayCode}</code>
          )}
        </pre>
      </div>
    </div>
  )
}

export { CodeBlock }