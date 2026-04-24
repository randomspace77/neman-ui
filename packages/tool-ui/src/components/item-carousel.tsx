"use client"

import * as React from "react"
import { z } from "zod"
import { cn } from "./_adapter"
import { defineToolUiContract } from "../contracts/define-tool-ui-contract"

// ─── Schemas ──────────────────────────────────────────────────────────────────

const CarouselItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  image: z.string().optional(),
  badge: z.string().optional(),
  metadata: z.record(z.string(), z.string()).optional(),
})

export const SerializableItemCarouselSchema = z.object({
  title: z.string().optional(),
  items: z.array(CarouselItemSchema),
  layout: z.enum(["horizontal", "grid"]).optional(),
})

export type SerializableItemCarousel = z.infer<typeof SerializableItemCarouselSchema>

export const ItemCarouselContract = defineToolUiContract({
  toolName: "item_carousel",
  role: "information",
  outputSchema: SerializableItemCarouselSchema,
})

// ─── ItemCarousel Component ────────────────────────────────────────────────────

function ItemCarousel({
  title,
  items,
  layout = "horizontal",
  className,
  ...props
}: React.ComponentProps<"div"> & SerializableItemCarousel) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(false)

  const updateScrollState = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2)
  }

  React.useEffect(() => {
    updateScrollState()
    const el = scrollRef.current
    if (!el) return
    el.addEventListener("scroll", updateScrollState, { passive: true })
    return () => el.removeEventListener("scroll", updateScrollState)
  }, [])

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current
    if (!el) return
    const amount = el.clientWidth * 0.75
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" })
  }

  if (layout === "grid") {
    return (
      <div
        data-slot="item-carousel"
        className={cn("rounded-[22px] border border-border/50 bg-card p-4", className)}
        {...props}
      >
        {title && <h4 className="text-label-primary-bold mb-3">{title}</h4>}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-border/30 bg-fill-subtle p-3 transition-colors duration-200 hover:border-border/60"
            >
              {item.image && (
                <img src={item.image} alt="" className="w-full aspect-square rounded-lg object-cover mb-2" />
              )}
              <div className="text-label-primary-bold truncate">{item.title}</div>
              {item.description && (
                <div className="text-label-secondary text-muted-foreground line-clamp-2 mt-0.5">{item.description}</div>
              )}
              {item.badge && (
                <span className="inline-block mt-1 rounded-md bg-primary/10 px-2 py-0.5 text-label-primary-bold text-primary">
                  {item.badge}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      data-slot="item-carousel"
      className={cn("rounded-[22px] border border-border/50 bg-card p-4", className)}
      {...props}
    >
      {title && <h4 className="text-label-primary-bold mb-3">{title}</h4>}
      <div className="relative">
        {/* Left arrow */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 flex size-8 items-center justify-center rounded-full bg-card shadow-[var(--shadow-drop-2)] border border-border/30 transition-opacity hover:bg-fill-subtle"
            aria-label="Scroll left"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M8.5 3L5 7L8.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        {/* Scrollable items */}
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="shrink-0 w-44 snap-start rounded-2xl border border-border/30 bg-fill-subtle p-3 transition-colors duration-200 hover:border-border/60"
            >
              {item.image && (
                <img src={item.image} alt="" className="w-full aspect-square rounded-lg object-cover mb-2" />
              )}
              <div className="text-label-primary-bold truncate">{item.title}</div>
              {item.description && (
                <div className="text-label-secondary text-muted-foreground line-clamp-2 mt-0.5">{item.description}</div>
              )}
              {item.badge && (
                <span className="inline-block mt-1 rounded-md bg-primary/10 px-2 py-0.5 text-label-primary-bold text-primary">
                  {item.badge}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Right arrow */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 flex size-8 items-center justify-center rounded-full bg-card shadow-[var(--shadow-drop-2)] border border-border/30 transition-opacity hover:bg-fill-subtle"
            aria-label="Scroll right"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M5.5 3L9 7L5.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

export { ItemCarousel }