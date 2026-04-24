"use client"

import * as React from "react"
import { z } from "zod"
import { cn } from "./_adapter"
import { defineToolUiContract } from "../contracts/define-tool-ui-contract"

// ─── Schemas ──────────────────────────────────────────────────────────────────

export const SerializableVideoSchema = z.object({
  src: z.string(),
  poster: z.string().optional(),
  title: z.string().optional(),
  duration: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  source: z.string().optional(),
})

export type SerializableVideo = z.infer<typeof SerializableVideoSchema>

export const VideoContract = defineToolUiContract({
  toolName: "video",
  role: "information",
  outputSchema: SerializableVideoSchema,
})

// ─── Video Component ─────────────────────────────────────────────────────────

function Video({
  src,
  poster,
  title,
  duration,
  width,
  height,
  source,
  className,
  ...props
}: React.ComponentProps<"div"> & SerializableVideo) {
  return (
    <div
      data-slot="tool-video"
      className={cn("rounded-[22px] border border-border/50 bg-card overflow-hidden shadow-[var(--shadow-card)] transition-all duration-300", className)}
      {...props}
    >
      <div
        className="relative bg-muted/20"
        style={{
          aspectRatio: (width && height) ? `${width}/${height}` : "16/9",
        }}
      >
        <video
          src={src}
          poster={poster}
          controls
          preload="metadata"
          className="w-full h-full object-cover"
          width={width}
          height={height}
        />
        {duration && (
          <span className="absolute bottom-2 right-2 rounded-md bg-foreground/70 px-1.5 py-0.5 text-label-primary-bold text-card">
            {duration}
          </span>
        )}
      </div>
      {(title || source) && (
        <div className="px-3 py-2 space-y-0.5">
          {title && <p className="text-label-primary-bold">{title}</p>}
          {source && <p className="text-label-primary text-muted-foreground">{source}</p>}
        </div>
      )}
    </div>
  )
}

export { Video }