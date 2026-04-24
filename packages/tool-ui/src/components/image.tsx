"use client"

import * as React from "react"
import { z } from "zod"
import { cn } from "./_adapter"
import { defineToolUiContract } from "../contracts/define-tool-ui-contract"

// ─── Schemas ──────────────────────────────────────────────────────────────────

export const SerializableImageSchema = z.object({
  src: z.string(),
  alt: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  caption: z.string().optional(),
  source: z.string().optional(),
})

export type SerializableImage = z.infer<typeof SerializableImageSchema>

export const ImageContract = defineToolUiContract({
  toolName: "image",
  role: "information",
  outputSchema: SerializableImageSchema,
})

// ─── Image Component ─────────────────────────────────────────────────────────

function Image({
  src,
  alt,
  width,
  height,
  caption,
  source,
  className,
  ...props
}: React.ComponentProps<"div"> & SerializableImage) {
  const [loaded, setLoaded] = React.useState(false)
  const [error, setError] = React.useState(false)

  return (
    <div
      data-slot="tool-image"
      className={cn("rounded-[22px] border border-border/50 bg-card overflow-hidden shadow-[var(--shadow-card)] transition-all duration-300", className)}
      {...props}
    >
      <div
        className="relative overflow-hidden bg-muted/20"
        style={{
          aspectRatio: (width && height) ? `${width}/${height}` : undefined,
        }}
      >
        {!error ? (
          <img
            src={src}
            alt={alt ?? ""}
            width={width}
            height={height}
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-300",
              loaded ? "opacity-100" : "opacity-0"
            )}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full min-h-[120px] text-muted-foreground">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
              <path d="M6 16L10 12L13 15L18 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
        {!loaded && !error && (
          <div className="absolute inset-0 animate-pulse bg-muted/30" />
        )}
      </div>
      {(caption || source) && (
        <div className="px-3 py-2 space-y-0.5">
          {caption && <p className="text-label-secondary">{caption}</p>}
          {source && <p className="text-label-primary text-muted-foreground">{source}</p>}
        </div>
      )}
    </div>
  )
}

export { Image }