"use client"

import * as React from "react"
import { z } from "zod"
import { cn } from "./_adapter"
import { defineToolUiContract } from "../contracts/define-tool-ui-contract"

// ─── Schemas ──────────────────────────────────────────────────────────────────

export const SerializableInstagramPostSchema = z.object({
  username: z.string(),
  displayName: z.string().optional(),
  avatar: z.string().optional(),
  images: z.array(z.string()).min(1),
  caption: z.string().optional(),
  likes: z.number().optional(),
  comments: z.number().optional(),
  timestamp: z.string().optional(),
  verified: z.boolean().optional(),
  location: z.string().optional(),
})

export type SerializableInstagramPost = z.infer<typeof SerializableInstagramPostSchema>

export const InstagramPostContract = defineToolUiContract({
  toolName: "instagram_post",
  role: "information",
  outputSchema: SerializableInstagramPostSchema,
})

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}m`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return String(n)
}

function formatRelativeTime(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 60) return `${diffMins}m`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays}d`
  return date.toLocaleDateString()
}

// ─── InstagramPost Component ──────────────────────────────────────────────────

function InstagramPost({
  username,
  displayName,
  avatar,
  images,
  caption,
  likes,
  comments,
  timestamp,
  verified,
  location,
  className,
  ...props
}: React.ComponentProps<"div"> & SerializableInstagramPost) {
  const [currentImage, setCurrentImage] = React.useState(0)
  const hasMultiple = images.length > 1

  return (
    <div
      data-slot="instagram-post"
      className={cn("rounded-[22px] border border-border/50 bg-card overflow-hidden max-w-[400px]", className)}
      {...props}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 px-3 py-2.5">
        <div className="size-8 rounded-full bg-gradient-to-br from-primary via-warning to-destructive p-[2px]">
          {avatar ? (
            <img src={avatar} alt="" className="size-full rounded-full object-cover border-2 border-card" />
          ) : (
            <div className="size-full rounded-full bg-fill-subtle flex items-center justify-center text-label-primary-bold">
              {(displayName ?? username)[0].toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="text-label-primary-bold text-label-secondary truncate">{username}</span>
            {verified && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-label="Verified">
                <circle cx="6" cy="6" r="5.5" fill="var(--color-primary)" />
                <path d="M3.5 6L5.5 8L8.5 4.5" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          {location && <span className="text-label-primary text-muted-foreground">{location}</span>}
        </div>
      </div>

      {/* Image carousel */}
      <div className="relative aspect-square bg-muted/20">
        <img
          src={images[currentImage]}
          alt={caption ?? `Photo by ${username}`}
          className="w-full h-full object-cover"
        />
        {hasMultiple && (
          <>
            {currentImage > 0 && (
              <button
                type="button"
                onClick={() => setCurrentImage((i) => i - 1)}
                className="absolute left-2 top-1/2 -translate-y-1/2 flex size-7 items-center justify-center rounded-full bg-foreground/40 text-card"
                aria-label="Previous image"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M7.5 3L4.5 6L7.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </button>
            )}
            {currentImage < images.length - 1 && (
              <button
                type="button"
                onClick={() => setCurrentImage((i) => i + 1)}
                className="absolute right-2 top-1/2 -translate-y-1/2 flex size-7 items-center justify-center rounded-full bg-foreground/40 text-card"
                aria-label="Next image"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4.5 3L7.5 6L4.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </button>
            )}
            {/* Dot indicators */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentImage(i)}
                  className={cn(
                    "size-1.5 rounded-full transition-colors",
                    i === currentImage ? "bg-primary" : "bg-card/50"
                  )}
                  aria-label={`Image ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Engagement */}
      <div className="px-3 py-2 space-y-1.5">
        <div className="flex items-center gap-3 text-label-secondary">
          {likes != null && <span className="font-[590]">{formatCount(likes)} likes</span>}
          {comments != null && <span className="text-muted-foreground">{formatCount(comments)} comments</span>}
        </div>
        {caption && (
          <p className="text-label-secondary line-clamp-2">
            <span className="font-[590]">{username}</span>{" "}
            {caption}
          </p>
        )}
        {timestamp && (
          <time className="text-label-primary text-muted-foreground uppercase">{formatRelativeTime(timestamp)}</time>
        )}
      </div>
    </div>
  )
}

export { InstagramPost }