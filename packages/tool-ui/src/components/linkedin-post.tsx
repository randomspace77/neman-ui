"use client"

import * as React from "react"
import { z } from "zod"
import { cn } from "./_adapter"
import { defineToolUiContract } from "../contracts/define-tool-ui-contract"

// ─── Schemas ──────────────────────────────────────────────────────────────────

export const SerializableLinkedInPostSchema = z.object({
  authorName: z.string(),
  authorHeadline: z.string().optional(),
  authorAvatar: z.string().optional(),
  content: z.string(),
  image: z.string().optional(),
  likes: z.number().optional(),
  comments: z.number().optional(),
  reposts: z.number().optional(),
  timestamp: z.string().optional(),
  articleTitle: z.string().optional(),
  articleDescription: z.string().optional(),
  articleUrl: z.string().optional(),
  articleImage: z.string().optional(),
})

export type SerializableLinkedInPost = z.infer<typeof SerializableLinkedInPostSchema>

export const LinkedInPostContract = defineToolUiContract({
  toolName: "linkedin_post",
  role: "information",
  outputSchema: SerializableLinkedInPostSchema,
})

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}m`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`
  return String(n)
}

// ─── LinkedInPost Component ──────────────────────────────────────────────────

function LinkedInPost({
  authorName,
  authorHeadline,
  authorAvatar,
  content,
  image,
  likes,
  comments,
  reposts,
  timestamp,
  articleTitle,
  articleDescription,
  articleUrl,
  articleImage,
  className,
  ...props
}: React.ComponentProps<"div"> & SerializableLinkedInPost) {
  return (
    <div
      data-slot="linkedin-post"
      className={cn("rounded-[22px] border border-border/50 bg-card overflow-hidden max-w-[520px] shadow-[var(--shadow-card)] transition-all duration-300", className)}
      {...props}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 px-3.5 py-3">
        <div className="size-10 shrink-0 rounded-full bg-fill-subtle flex items-center justify-center overflow-hidden">
          {authorAvatar ? (
            <img src={authorAvatar} alt="" className="size-full object-cover" />
          ) : (
            <span className="text-title-primary">{authorName[0]?.toUpperCase()}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-title-primary truncate">{authorName}</div>
          {authorHeadline && (
            <div className="text-label-primary text-muted-foreground line-clamp-1">{authorHeadline}</div>
          )}
          {timestamp && (
            <time className="text-label-primary text-muted-foreground">{timestamp}</time>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-3.5 pb-2.5">
        <p className="text-body-primary whitespace-pre-wrap line-clamp-6">{content}</p>
      </div>

      {/* Image */}
      {image && (
        <img src={image} alt="" className="w-full" />
      )}

      {/* Article card */}
      {articleTitle && (
        <a
          href={articleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block mx-3.5 mb-2.5 rounded-2xl border border-border/40 overflow-hidden hover:border-border transition-colors"
        >
          {articleImage && (
            <img src={articleImage} alt="" className="w-full h-32 object-cover" />
          )}
          <div className="p-2.5">
            <h5 className="text-label-secondary-bold line-clamp-2">{articleTitle}</h5>
            {articleDescription && (
              <p className="text-label-primary text-muted-foreground line-clamp-1 mt-0.5">{articleDescription}</p>
            )}
          </div>
        </a>
      )}

      {/* Engagement bar */}
      {(likes != null || comments != null || reposts != null) && (
        <div className="flex items-center gap-3 px-3.5 py-2 border-t border-border/20 text-label-primary text-muted-foreground">
          {likes != null && <span>{formatCount(likes)} reactions</span>}
          {comments != null && <span>{formatCount(comments)} comments</span>}
          {reposts != null && <span>{formatCount(reposts)} reposts</span>}
        </div>
      )}
    </div>
  )
}

export { LinkedInPost }