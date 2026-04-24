"use client"

import * as React from "react"
import { z } from "zod"
import { cn } from "./_adapter"
import { Card, CardHeader, CardContent } from "./_adapter"
import { defineToolUiContract } from "../contracts/define-tool-ui-contract"

// ─── Schemas ──────────────────────────────────────────────────────────────────

const DataPointSchema = z.object({
  label: z.string(),
  value: z.number(),
  color: z.string().optional(),
})

const DataSetSchema = z.object({
  name: z.string(),
  data: z.array(DataPointSchema),
  color: z.string().optional(),
})

export const SerializableChartSchema = z.object({
  type: z.enum(["bar", "line", "pie"]),
  title: z.string().optional(),
  labels: z.array(z.string()).optional(),
  datasets: z.array(DataSetSchema),
  xAxisLabel: z.string().optional(),
  yAxisLabel: z.string().optional(),
})

export type SerializableChart = z.infer<typeof SerializableChartSchema>

export const ChartContract = defineToolUiContract({
  toolName: "chart",
  role: "information",
  outputSchema: SerializableChartSchema,
})

// ─── Chart Component ──────────────────────────────────────────────────────────

function ChartBar({
  labels,
  datasets,
  maxHeight = 200,
}: {
  labels?: string[]
  datasets: z.infer<typeof DataSetSchema>[]
  maxHeight?: number
}) {
  const allValues = datasets.flatMap((ds) => ds.data.map((d) => d.value))
  const maxVal = Math.max(...allValues, 1)
  const barCount = labels?.length ?? datasets[0]?.data.length ?? 0
  const barWidth = 100 / Math.max(barCount, 1)

  const defaultColors = [
    "bg-primary",
    "bg-success",
    "bg-warning",
    "bg-destructive",
    "bg-muted-foreground",
  ]

  return (
    <div
      className="flex items-end gap-1 w-full"
      style={{ height: maxHeight }}
    >
      {labels?.map((label, i) => {
        const values = datasets.map((ds, dsIdx) => {
          const dp = ds.data[i]
          return {
            value: dp?.value ?? 0,
            color: dp?.color ?? ds.color ?? defaultColors[dsIdx % defaultColors.length],
          }
        })

        return (
          <div
            key={label}
            className="flex flex-col items-center gap-0.5 flex-1"
            style={{ width: `${barWidth}%` }}
          >
            <div className="flex items-end gap-0.5 flex-1 w-full">
              {values.map((v, vi) => (
                <div
                  key={vi}
                  className={cn("flex-1 rounded-t-[8px] transition-all duration-300 min-h-[2px]", v.color)}
                  style={{ height: `${(v.value / maxVal) * 100}%` }}
                />
              ))}
            </div>
            <span className="text-label-primary text-muted-foreground truncate max-w-full">{label}</span>
          </div>
        )
      })}
    </div>
  )
}

function ChartLine({
  labels,
  datasets,
  maxHeight = 200,
}: {
  labels?: string[]
  datasets: z.infer<typeof DataSetSchema>[]
  maxHeight?: number
}) {
  const allValues = datasets.flatMap((ds) => ds.data.map((d) => d.value))
  const maxVal = Math.max(...allValues, 1)
  const minVal = Math.min(...allValues, 0)
  const range = maxVal - minVal || 1

  const defaultColors = [
    "var(--color-primary)",
    "var(--color-success)",
    "var(--color-warning)",
  ]

  return (
    <div className="relative w-full" style={{ height: maxHeight }}>
      <svg
        viewBox={`0 0 ${((labels?.length ?? datasets[0]?.data.length ?? 1) - 1) * 100} ${maxHeight}`}
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        {datasets.map((ds, dsIdx) => {
          const points = ds.data
            .map((dp, i) => ({
              x: i * 100,
              y: maxHeight - ((dp.value - minVal) / range) * maxHeight * 0.9,
            }))
          const pathD = points
            .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
            .join(" ")

          return (
            <path
              key={dsIdx}
              d={pathD}
              fill="none"
              stroke={ds.color ?? defaultColors[dsIdx % defaultColors.length]}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )
        })}
      </svg>
      {labels && (
        <div className="flex justify-between mt-1">
          {labels.map((label, i) => (
            <span key={i} className="text-label-primary text-muted-foreground">{label}</span>
          ))}
        </div>
      )}
    </div>
  )
}

function ChartPie({
  datasets,
}: {
  labels?: string[]
  datasets: z.infer<typeof DataSetSchema>[]
}) {
  const data = datasets[0]?.data ?? []
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1

  const defaultColors = [
    "var(--color-primary)",
    "var(--color-success)",
    "var(--color-warning)",
    "var(--color-destructive)",
    "var(--color-muted-foreground)",
  ]

  let cumulativePercent = 0
  const slices = data.map((dp, i) => {
    const percent = (dp.value / total) * 100
    const startAngle = cumulativePercent * 3.6
    cumulativePercent += percent
    return { ...dp, percent, startAngle, color: dp.color ?? defaultColors[i % defaultColors.length] }
  })

  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 100 100" className="w-32 h-32">
        {slices.map((slice, i) => {
          const startRad = (slice.startAngle * Math.PI) / 180
          const endRad = ((slice.startAngle + slice.percent * 3.6) * Math.PI) / 180
          const largeArc = slice.percent > 50 ? 1 : 0
          const x1 = 50 + 45 * Math.cos(startRad)
          const y1 = 50 + 45 * Math.sin(startRad)
          const x2 = 50 + 45 * Math.cos(endRad)
          const y2 = 50 + 45 * Math.sin(endRad)

          const isLast = i === slices.length - 1 && slice.percent < 99.5

          return (
            <path
              key={i}
              d={`M 50 50 L ${x1} ${y1} A 45 45 0 ${largeArc} 1 ${x2} ${y2} Z`}
              fill={slice.color}
              stroke="var(--color-card)"
              strokeWidth="1"
            />
          )
        })}
      </svg>
      <div className="flex flex-col gap-1.5">
        {slices.map((slice, i) => (
          <div key={i} className="flex items-center gap-2 text-label-primary">
            <span
              className="inline-block size-2.5 rounded-full shrink-0"
              style={{ backgroundColor: slice.color }}
            />
            <span className="text-muted-foreground">{slice.label}</span>
            <span className="font-[590] ml-auto">{slice.percent.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Chart({
  className,
  ...props
}: React.ComponentProps<"div"> & SerializableChart) {
  return (
    <Card data-slot="chart" className={cn("w-full", className)} {...props}>
      {props.title && (
        <CardHeader className="pb-2">
          <h4 className="text-label-primary-bold">{props.title}</h4>
        </CardHeader>
      )}
      <CardContent>
        {props.type === "bar" && <ChartBar labels={props.labels} datasets={props.datasets} />}
        {props.type === "line" && <ChartLine labels={props.labels} datasets={props.datasets} />}
        {props.type === "pie" && <ChartPie labels={props.labels} datasets={props.datasets} />}
        {(props.xAxisLabel || props.yAxisLabel) && (
          <div className="flex justify-between mt-2 text-label-primary text-muted-foreground">
            <span>{props.xAxisLabel}</span>
            <span>{props.yAxisLabel}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export { Chart }