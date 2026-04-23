"use client"

import * as React from "react"
import { z } from "zod"
import { cn } from "./_adapter"
import { defineToolUiContract } from "../contracts/define-tool-ui-contract"

// ─── Schemas ──────────────────────────────────────────────────────────────────

const StatItemSchema = z.object({
  label: z.string(),
  value: z.union([z.string(), z.number()]),
  change: z.number().optional(),
  changeLabel: z.string().optional(),
  icon: z.string().optional(),
})

export const SerializableStatsDisplaySchema = z.object({
  title: z.string().optional(),
  stats: z.array(StatItemSchema),
  layout: z.enum(["grid", "stacked"]).optional(),
})

export type SerializableStatsDisplay = z.infer<typeof SerializableStatsDisplaySchema>

export const StatsDisplayContract = defineToolUiContract({
  toolName: "stats_display",
  role: "information",
  outputSchema: SerializableStatsDisplaySchema,
})

// ─── StatsDisplay Component ──────────────────────────────────────────────────

function StatsDisplay({
  title,
  stats,
  layout = "grid",
  className,
  ...props
}: React.ComponentProps<"div"> & SerializableStatsDisplay) {
  return (
    <div
      data-slot="stats-display"
      className={cn(
        "rounded-[22px] border border-border/50 bg-card p-4",
        className
      )}
      {...props}
    >
      {title && (
        <h4 className="text-label-primary-bold mb-3">{title}</h4>
      )}
      <div
        className={cn(
          layout === "grid"
            ? "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
            : "flex flex-col gap-3"
        )}
      >
        {stats.map((stat, i) => (
          <div
            key={i}
            className="rounded-[14px] border border-border/30 bg-fill-subtle/30 px-3 py-2.5"
          >
            <div className="text-label-secondary text-muted-foreground mb-0.5">
              {stat.label}
            </div>
            <div className="text-body-primary font-[590] text-xl tracking-tight">
              {typeof stat.value === "number"
                ? stat.value.toLocaleString()
                : stat.value}
            </div>
            {stat.change !== undefined && (
              <div
                className={cn(
                  "text-label-secondary mt-0.5 flex items-center gap-0.5",
                  stat.change >= 0 ? "text-success" : "text-destructive"
                )}
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  aria-hidden="true"
                >
                  {stat.change >= 0 ? (
                    <path d="M5 2L8.5 6.5H1.5L5 2Z" fill="currentColor" />
                  ) : (
                    <path d="M5 8L1.5 3.5H8.5L5 8Z" fill="currentColor" />
                  )}
                </svg>
                {Math.abs(stat.change).toFixed(1)}%
                {stat.changeLabel && (
                  <span className="text-muted-foreground ml-0.5">
                    {stat.changeLabel}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export { StatsDisplay }