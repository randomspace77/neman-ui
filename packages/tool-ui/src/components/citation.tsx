"use client"

import * as React from "react"
import { z } from "zod"
import { cn } from "./_adapter"
import { defineToolUiContract } from "../contracts/define-tool-ui-contract"
import { useControllableState } from "../utils/hooks"
import type { ToolUIReceipt } from "../contracts/define-tool-ui-contract"

// ─── Zod Schemas ───────────────────────────────────────────────────────────────

const CitationItemSchema = z.object({
  id: z.string(),
  url: z.string().url().optional().or(z.literal("")),
  title: z.string().optional(),
  provider: z.string().optional(),
  snippet: z.string().optional(),
})

export const SerializableCitationSchema = z.object({
  citations: z.array(CitationItemSchema),
  count: z.number().optional(),
})

export type SerializableCitation = z.infer<typeof SerializableCitationSchema>

export const CitationContract = defineToolUiContract({
  toolName: "citation",
  role: "information",
  outputSchema: SerializableCitationSchema,
})

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface CitationItem {
  id: string
  url?: string
  title?: string
  provider?: string
  snippet?: string
}

export interface CitationProps extends React.HTMLAttributes<HTMLDivElement> {
  citations: CitationItem[]
  /** For collapsed view: total number of citations */
  count?: number
  /** Controlled open state */
  open?: boolean
  /** Default open state */
  defaultOpen?: boolean
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void
  /** Receipt state — when set, renders in read-only confirmed mode */
  receipt?: ToolUIReceipt
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

function extractHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return url
  }
}

// ─── Component ─────────────────────────────────────────────────────────────────

function Citation({
  citations,
  count,
  open: openProp,
  defaultOpen,
  onOpenChange,
  receipt,
  className,
  ...props
}: CitationProps) {
  const { value: open, setValue: setOpen } = useControllableState<boolean>({
    value: openProp,
    defaultValue: defaultOpen ?? false,
    onChange: onOpenChange,
  })

  const isReadOnly = !!receipt
  const displayCount = count ?? citations.length

  return (
    <div
      data-slot="citation"
      data-receipt={receipt ? "true" : undefined}
      className={cn(
        "rounded-[22px] border border-border/50 bg-card shadow-[var(--shadow-card)] transition-all duration-300",
        className,
      )}
      {...props}
    >
      {/* Header toggle */}
      <button
        aria-expanded={open}
        onClick={() => !isReadOnly && setOpen((prev: boolean) => !prev)}
        className={cn(
          "flex w-full items-center gap-2.5 px-4 py-3 text-left transition-colors duration-200",
          !isReadOnly && "hover:bg-fill-subtle/60",
          "rounded-[22px]",
        )}
      >
        {/* Star icon */}
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
          {displayCount} source{displayCount !== 1 ? "s" : ""}
        </span>
        {/* Chevron */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden="true"
          className={cn(
            "ml-auto shrink-0 text-muted-foreground transition-transform duration-300",
            open && "rotate-180",
          )}
        >
          <path d="M4 6L7 9L10 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Expandable list */}
      <div
        className={cn(
          "grid transition-all duration-300",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="space-y-1 border-t border-border/30 px-3 py-3">
            {citations.map((citation) => (
              <CitationItem
                key={citation.id}
                citation={citation}
                isReadOnly={isReadOnly}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Receipt footer */}
      {receipt && (
        <div className="border-t border-border/30 px-4 py-2.5">
          <span className="text-label-primary text-muted-foreground">
            {displayCount} citation{displayCount !== 1 ? "s" : ""} confirmed
            {receipt.summary && ` — ${receipt.summary}`}
          </span>
        </div>
      )}
    </div>
  )
}

// ─── Citation Item ─────────────────────────────────────────────────────────────

function CitationItem({
  citation,
  isReadOnly = false,
  className,
}: {
  citation: CitationItem
  isReadOnly?: boolean
  className?: string
}) {
  const content = (
    <>
      {/* Link icon */}
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 text-brand" aria-hidden="true">
        <path
          d="M6 1.5H3C2.17 1.5 1.5 2.17 1.5 3V11C1.5 11.83 2.17 12.5 3 12.5H11C11.83 12.5 12.5 11.83 12.5 11V8"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 1.5L12.5 1.5L12.5 6"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.5 1.5L7 7"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="truncate font-[590] text-foreground text-label-secondary-bold">
            {citation.title || extractHostname(citation.url || citation.id)}
          </span>
          {citation.provider && (
            <span className="shrink-0 rounded-[100px] bg-brand/10 px-1.5 py-0.5 text-brand text-[11px] font-[590]">
              {citation.provider}
            </span>
          )}
        </div>
        {citation.url && (
          <span className="block truncate text-label-primary text-muted-foreground">
            {extractHostname(citation.url)}
          </span>
        )}
        {citation.snippet && (
          <p className="mt-0.5 line-clamp-2 text-label-primary text-muted-foreground">
            {citation.snippet}
          </p>
        )}
      </div>
    </>
  )

  if (citation.url && !isReadOnly) {
    return (
      <a
        href={citation.url}
        target="_blank"
        rel="noopener noreferrer"
        data-slot="citation-item"
        className={cn(
          "flex items-start gap-2.5 rounded-[10px] px-3 py-2.5 text-label-secondary",
          "transition-all duration-200 hover:bg-brand/[0.04] hover:text-foreground",
          className,
        )}
        >
        {content}
      </a>
    )
  }

  return (
    <div
      data-slot="citation-item"
      className={cn(
        "flex items-start gap-2.5 rounded-[10px] px-3 py-2.5 text-label-secondary",
        isReadOnly && "opacity-80",
        className,
      )}
      >
      {content}
    </div>
  )
}

export { Citation, CitationItem }