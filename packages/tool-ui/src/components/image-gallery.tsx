"use client"

import * as React from "react"
import { z } from "zod"
import { cn } from "./_adapter"
import { defineToolUiContract } from "../contracts/define-tool-ui-contract"
import type { ToolUIReceipt } from "../contracts/define-tool-ui-contract"

// ─── Zod Schemas ───────────────────────────────────────────────────────────────

const GalleryImageSchema = z.object({
  url: z.string(),
  alt: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  caption: z.string().optional(),
})

export const SerializableImageGallerySchema = z.object({
  images: z.array(GalleryImageSchema),
  columns: z.number().min(1).max(6).optional(),
  gap: z.enum(["none", "sm", "md", "lg"]).optional(),
})

export type SerializableImageGallery = z.infer<typeof SerializableImageGallerySchema>

export const ImageGalleryContract = defineToolUiContract({
  toolName: "image-gallery",
  role: "information",
  outputSchema: SerializableImageGallerySchema,
})

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface GalleryImage {
  url: string
  alt?: string
  width?: number
  height?: number
  caption?: string
}

export interface ImageGalleryProps extends React.HTMLAttributes<HTMLDivElement> {
  images: GalleryImage[]
  columns?: number
  gap?: "none" | "sm" | "md" | "lg"
  /** Receipt state — when set, renders in read-only confirmed mode */
  receipt?: ToolUIReceipt
}

// ─── Gap mapping ────────────────────────────────────────────────────────────────

const gapMap: Record<string, string> = {
  none: "gap-0",
  sm: "gap-2",
  md: "gap-3",
  lg: "gap-4",
}

// ─── Lightbox Component ────────────────────────────────────────────────────────

function Lightbox({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: {
  images: GalleryImage[]
  currentIndex: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  const image = images[currentIndex]

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose()
          break
        case "ArrowLeft":
          onPrev()
          break
        case "ArrowRight":
          onNext()
          break
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose, onPrev, onNext])

  return (
    <div
      data-slot="image-gallery-lightbox"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex size-10 items-center justify-center rounded-full bg-white/10 text-white/80 transition-all duration-200 hover:bg-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        aria-label="Close lightbox"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M4 4L14 14M14 4L4 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {/* Prev button */}
      {currentIndex > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev() }}
          className="absolute left-4 z-10 flex size-10 items-center justify-center rounded-full bg-white/10 text-white/80 transition-all duration-200 hover:bg-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          aria-label="Previous image"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 4L6 9L11 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {/* Image */}
      <div
        className="relative flex max-h-[85vh] max-w-[85vw] flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.url}
          alt={image.alt || image.caption || "Gallery image"}
          className="max-h-[75vh] max-w-[85vw] rounded-[22px] object-contain shadow-[var(--shadow-drop-4)]"
        />
        {(image.caption || image.alt) && (
          <p className="mt-3 text-label-secondary text-white/80">
            {image.caption || image.alt}
          </p>
        )}
        <span className="mt-1 text-label-primary text-white/50">
          {currentIndex + 1} / {images.length}
        </span>
      </div>

      {/* Next button */}
      {currentIndex < images.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext() }}
          className="absolute right-4 z-10 flex size-10 items-center justify-center rounded-full bg-white/10 text-white/80 transition-all duration-200 hover:bg-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          aria-label="Next image"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M7 4L12 9L7 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </div>
  )
}

// ─── Component ─────────────────────────────────────────────────────────────────

function ImageGallery({
  images,
  columns = 3,
  gap = "sm",
  receipt,
  className,
  ...props
}: ImageGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null)
  const isReadOnly = !!receipt

  const handleOpen = React.useCallback((index: number) => {
    if (isReadOnly) return
    setLightboxIndex(index)
  }, [isReadOnly])

  const handleClose = React.useCallback(() => {
    setLightboxIndex(null)
  }, [])

  const handlePrev = React.useCallback(() => {
    setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev))
  }, [])

  const handleNext = React.useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null && prev < images.length - 1 ? prev + 1 : prev,
    )
  }, [images.length])

  const gapClass = gapMap[gap] ?? "gap-2"

  return (
    <>
      <div
        data-slot="image-gallery"
        data-receipt={receipt ? "true" : undefined}
        className={cn("grid", gapClass, className)}
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        {...props}
      >
        {images.map((image, index) => (
          <button
            key={index}
            data-slot="image-gallery-item"
            type="button"
            onClick={() => handleOpen(index)}
            disabled={isReadOnly}
            className={cn(
              "group relative overflow-hidden rounded-[22px] border border-border/50 bg-card",
              "shadow-[var(--shadow-drop-1)] transition-all duration-300",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand focus-visible:ring-offset-background",
              !isReadOnly && "hover:border-foreground/15 hover:shadow-[var(--shadow-drop-2)] hover:scale-[1.02] cursor-pointer",
              isReadOnly && "cursor-default",
            )}
          >
            {/* Thumbnail */}
            <div className="relative aspect-video w-full overflow-hidden bg-fill-subtle">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.url}
                alt={image.alt || image.caption || `Image ${index + 1}`}
                width={image.width}
                height={image.height}
                className={cn(
                  "h-full w-full object-cover transition-transform duration-300",
                  !isReadOnly && "group-hover:scale-105",
                )}
                loading="lazy"
              />
              {/* Receipt indicator */}
              {isReadOnly && receipt && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                  <div className="flex items-center justify-center size-8 rounded-full bg-brand/20 text-brand">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              )}
            </div>

            {/* Caption */}
            {(image.caption || image.alt) && (
              <div className="px-3 py-2">
                <p className="truncate text-label-secondary-bold text-foreground">
                  {image.caption || image.alt}
                </p>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Receipt footer */}
      {receipt && (
        <div className="mt-2">
          <span className="text-label-secondary text-muted-foreground">
            {images.length} image{images.length !== 1 ? "s" : ""}
            {receipt.summary && ` — ${receipt.summary}`}
          </span>
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={handleClose}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </>
  )
}

export { ImageGallery }