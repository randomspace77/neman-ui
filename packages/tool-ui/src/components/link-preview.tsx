"use client"

import * as React from "react"
import { z } from "zod"
import { cn } from "./_adapter"
import { defineToolUiContract } from "../contracts/define-tool-ui-contract"

// ─── Schemas ──────────────────────────────────────────────────────────────────

export const SerializableLinkPreviewSchema = z.object({
  url: z.string().url(),
  title: z.string(),
  description: z.string().optional(),
  domain: z.string().optional(),
  image: z.string().url().optional(),
  favicon: z.string().url().optional(),
})

export type SerializableLinkPreview = z.infer<typeof SerializableLinkPreviewSchema>

export const LinkPreviewContract = defineToolUiContract({
  toolName: "link_preview",
  role: "information",
  outputSchema: SerializableLinkPreviewSchema,
})

// ─── LinkPreview Component ────────────────────────────────────────────────────

function LinkPreview({
  url,
  title,
  description,
  domain,
  image,
  favicon,
  className,
  ...props
}: React.ComponentProps<"a"> & SerializableLinkPreview) {
  const displayDomain = domain ?? (() => {
    try { return new URL(url).hostname } catch { return url }
  })()

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      data-slot="link-preview"
      className={cn(
        "group/block flex overflow-hidden rounded-[22px] border border-border/50 bg-card",
        "transition-all duration-300 hover:border-border hover:shadow-[var(--shadow-drop-2)] shadow-[var(--shadow-card)]",
        image ? "flex-row" : "flex-col",
        className
      )}
      {...props}
    >
      {image && (
        <div className="w-1/3 shrink-0 bg-fill-subtle overflow-hidden">
          <img
            src={image}
            alt=""
            className="w-full h-full object-cover transition-transform duration-200 group-hover/block:scale-105"
          />
        </div>
      )}
      <div className="flex flex-col justify-center gap-1.5 p-4 min-w-0 flex-1">
        <h4 className="text-label-primary-bold truncate">{title}</h4>
        {description && (
          <p className="text-label-secondary text-muted-foreground line-clamp-2">{description}</p>
        )}
        <div className="flex items-center gap-1.5 text-label-primary text-muted-foreground mt-0.5">
          {favicon && (
            <img src={favicon} alt="" className="size-3 rounded-sm" />
          )}
          <span>{displayDomain}</span>
        </div>
      </div>
    </a>
  )
}

export { LinkPreview }