"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// ─── Code block ──────────────────────────────────────────────────

function ChatCodeBlock({
  language,
  filename,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  language?: string
  filename?: string
}) {
  const [copied, setCopied] = React.useState(false)

  const codeText = React.useMemo(() => {
    if (typeof children === "string") return children
    // Extract text from React children
    let text = ""
    React.Children.forEach(children, (child) => {
      if (typeof child === "string") text += child
    })
    return text
  }, [children])

  const handleCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(codeText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }, [codeText])

  return (
    <div
      data-slot="chat-code-block"
      className={cn(
        "group relative overflow-hidden rounded-[22px] bg-[var(--code-surface)]",
        "shadow-[var(--shadow-drop-2)]",
        className
      )}
      {...props}
    >
      {/* Header */}
      {(language || filename) && (
        <div className="flex items-center justify-between border-b border-[var(--code-surface-foreground)]/8 px-4 py-2.5">
          <div className="flex items-center gap-2">
            {filename ? (
              <span className="text-label-secondary text-[var(--code-surface-foreground)]/50">{filename}</span>
            ) : language ? (
              <span className="text-label-secondary text-[var(--code-surface-foreground)]/50">{language}</span>
            ) : null}
          </div>
          <button
            onClick={handleCopy}
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
                  <path d="M2 8L5.5 11.5L12 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M4.5 1H10.5C11.6 1 12.5 1.9 12.5 3V9C12.5 10.1 11.6 11 10.5 11H4.5C3.4 11 2.5 10.1 2.5 9V3C2.5 1.9 3.4 1 4.5 1Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9.5 3V11C9.5 12.1 8.6 13 7.5 13H3.5C2.4 13 1.5 12.1 1.5 11V5C1.5 3.9 2.4 3 3.5 3H9.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
      )}

      {/* No header — still show copy button */}
      {!language && !filename && (
        <button
          onClick={handleCopy}
          className={cn(
            "absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-[10px] px-2.5 py-1 text-label-primary transition-all duration-200",
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
        <pre className="text-[13px] leading-[20px] text-[var(--code-surface-foreground)]/75">
          <code>{children}</code>
        </pre>
      </div>
    </div>
  )
}

export { ChatCodeBlock }