"use client"

import * as React from "react"
import { z } from "zod"
import { cn } from "./_adapter"
import { defineToolUiContract } from "../contracts/define-tool-ui-contract"

// ─── Schemas ──────────────────────────────────────────────────────────────────

export const SerializableXPostSchema = z.object({
  username: z.string(),
  handle: z.string(),
  avatar: z.string().optional(),
  content: z.string(),
  image: z.string().optional(),
  likes: z.number().optional(),
  retweets: z.number().optional(),
  replies: z.number().optional(),
  views: z.number().optional(),
  timestamp: z.string().optional(),
  verified: z.boolean().optional(),
  url: z.string().optional(),
})

export type SerializableXPost = z.infer<typeof SerializableXPostSchema>

export const XPostContract = defineToolUiContract({
  toolName: "x_post",
  role: "information",
  outputSchema: SerializableXPostSchema,
})

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}

// ─── XPost Component ─────────────────────────────────────────────────────────

function XPost({
  username,
  handle,
  avatar,
  content,
  image,
  likes,
  retweets,
  replies,
  views,
  timestamp,
  verified,
  url,
  className,
  ...props
}: React.ComponentProps<"div"> & SerializableXPost) {
  const Wrapper = url ? "a" : "div"
  const wrapperProps = url
    ? { href: url, target: "_blank", rel: "noopener noreferrer" }
    : {}

  return (
    // @ts-expect-error - polymorphic wrapper
    <Wrapper
      data-slot="x-post"
      className={cn(
        "block rounded-[22px] border border-border/50 bg-card overflow-hidden max-w-[480px]",
        url && "hover:border-border transition-colors",
        className
      )}
      {...wrapperProps}
      {...props}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 px-3.5 py-2.5">
        <div className="size-10 shrink-0 rounded-full bg-fill-subtle flex items-center justify-center overflow-hidden">
          {avatar ? (
            <img src={avatar} alt="" className="size-full object-cover" />
          ) : (
            <span className="text-title-primary">{username[0]?.toUpperCase()}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="text-title-primary truncate">{username}</span>
            {verified && (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-label="Verified">
                <circle cx="7" cy="7" r="6" fill="var(--color-primary)" />
                <path d="M4 7L6 9L10 5" stroke="var(--color-card)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <span className="text-label-primary text-muted-foreground">@{handle}</span>
        </div>
        {/* X/Twitter logo */}
        <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" className="shrink-0 text-muted-foreground/40" aria-hidden="true">
          <path d="M10.77 1.5H13.27L7.96 7.38L14.25 16.5H9.33L5.36 11.28L1.04 16.5H0L5.65 10.2L-0.25 1.5H4.82L8.4 6.27L10.77 1.5ZM10.08 15.03H11.47L4.08 2.75H2.58L10.08 15.03Z" transform="translate(2 0)" />
        </svg>
      </div>

      {/* Content */}
      <div className="px-3.5 pb-2.5">
        <p className="text-body-primary whitespace-pre-wrap">{content}</p>
      </div>

      {/* Image */}
      {image && (
        <img src={image} alt="" className="w-full rounded-2xl mx-3.5 w-[calc(100%-28px)]" />
      )}

      {/* Timestamp */}
      {timestamp && (
        <div className="px-3.5 pt-1.5 pb-1">
          <time className="text-label-primary text-muted-foreground">{timestamp}</time>
        </div>
      )}

      {/* Engagement */}
      {(likes != null || retweets != null || replies != null || views != null) && (
        <div className="flex items-center justify-between px-3.5 py-2 border-t border-border/20 text-muted-foreground">
          {replies != null && (
            <span className="flex items-center gap-1 text-label-primary">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 7C2 4.24 4.24 2 7 2H9C11.76 2 14 4.24 14 7V11H7C4.24 11 2 8.76 2 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" transform="translate(-1 1)" />
              </svg>
              {formatCount(replies)}
            </span>
          )}
          {retweets != null && (
            <span className="flex items-center gap-1 text-label-primary">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M4 2L1 5L4 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10 12L13 9L10 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M1 5H9C10.66 5 12 6.34 12 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M13 9H5C3.34 9 2 7.66 2 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              {formatCount(retweets)}
            </span>
          )}
          {likes != null && (
            <span className="flex items-center gap-1 text-label-primary">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M7 12L2.5 7.5C1 6 1 3.5 2.5 2C4 0.5 7 0.5 7 3C7 0.5 10 0.5 11.5 2C13 3.5 13 6 11.5 7.5L7 12Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {formatCount(likes)}
            </span>
          )}
          {views != null && (
            <span className="flex items-center gap-1 text-label-primary">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M1 7C1 7 3.5 2 7 2C10.5 2 13 7 13 7C13 7 10.5 12 7 12C3.5 12 1 7 1 7Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              {formatCount(views)}
            </span>
          )}
        </div>
      )}
    </Wrapper>
  )
}

export { XPost }