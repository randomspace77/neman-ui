"use client"

import * as React from "react"
import { z } from "zod"
import { cn } from "./_adapter"
import { defineToolUiContract } from "../contracts/define-tool-ui-contract"
import { useControllableState } from "../utils/hooks"
import type { ToolUIReceipt } from "../contracts/define-tool-ui-contract"

// ─── Format Utilities ──────────────────────────────────────────────────────────

export function formatCurrency(value: unknown): string {
  const num = typeof value === "number" ? value : Number(value)
  if (isNaN(num)) return String(value)
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(num)
}

export function formatPercent(value: unknown): string {
  const num = typeof value === "number" ? value : Number(value)
  if (isNaN(num)) return String(value)
  return new Intl.NumberFormat("en-US", { style: "percent", minimumFractionDigits: 1 }).format(num / 100)
}

export function formatDate(value: unknown): string {
  if (value instanceof Date) return value.toLocaleDateString()
  const date = new Date(String(value))
  if (isNaN(date.getTime())) return String(value)
  return date.toLocaleDateString()
}

export function formatStatusBadge(value: unknown): { label: string; variant: "success" | "warning" | "destructive" | "secondary" } {
  const str = String(value).toLowerCase()
  if (str === "active" || str === "success" || str === "done" || str === "complete" || str === "completed" || str === "approved") {
    return { label: String(value), variant: "success" }
  }
  if (str === "pending" || str === "warning" || str === "paused" || str === "in progress" || str === "in-progress") {
    return { label: String(value), variant: "warning" }
  }
  if (str === "error" || str === "failed" || str === "cancelled" || str === "denied" || str === "rejected") {
    return { label: String(value), variant: "destructive" }
  }
  return { label: String(value), variant: "secondary" }
}

// ─── Zod Schemas ───────────────────────────────────────────────────────────────

const DataTableColumnSchema = z.object({
  key: z.string(),
  label: z.string(),
  format: z.enum(["currency", "percent", "status", "date", "custom"]).optional(),
})

const DataTableSortSchema = z.object({
  key: z.string(),
  direction: z.enum(["asc", "desc"]),
})

export const SerializableDataTableSchema = z.object({
  columns: z.array(DataTableColumnSchema),
  rows: z.array(z.record(z.string(), z.unknown())),
  sort: DataTableSortSchema.optional(),
  caption: z.string().optional(),
})

export type SerializableDataTable = z.infer<typeof SerializableDataTableSchema>

export const DataTableContract = defineToolUiContract({
  toolName: "data-table",
  role: "information",
  outputSchema: SerializableDataTableSchema,
})

// ─── Types ──────────────────────────────────────────────────────────────────────

type FormatType = "currency" | "percent" | "status" | "date" | "custom"

export interface DataTableColumn {
  key: string
  label: string
  format?: FormatType
  formatFn?: (value: unknown, row: Record<string, unknown>) => React.ReactNode
}

export interface DataTableSort {
  key: string
  direction: "asc" | "desc"
}

export interface DataTableProps extends React.HTMLAttributes<HTMLDivElement> {
  columns: DataTableColumn[]
  rows: Record<string, unknown>[]
  sort?: DataTableSort
  onSortChange?: (sort: DataTableSort) => void
  caption?: string
  /** Receipt state — when set, renders in read-only confirmed mode */
  receipt?: ToolUIReceipt
}

// ─── Component ─────────────────────────────────────────────────────────────────

function DataTable({
  columns,
  rows,
  sort: sortProp,
  onSortChange,
  caption,
  receipt,
  className,
  ...props
}: DataTableProps) {
  const { value: sort, setValue: setSort } = useControllableState<DataTableSort | undefined>({
    value: sortProp,
    defaultValue: undefined,
    onChange: onSortChange as ((value: DataTableSort | undefined) => void) | undefined,
  })

  const isReadOnly = !!receipt

  const handleSort = React.useCallback(
    (key: string) => {
      if (isReadOnly) return
      const dir = sort?.key === key && sort.direction === "asc" ? "desc" : "asc"
      setSort({ key, direction: dir })
    },
    [sort, setSort, isReadOnly],
  )

  const sortedRows = React.useMemo(() => {
    if (!sort) return rows
    const { key, direction } = sort
    return [...rows].sort((a, b) => {
      const aVal = a[key]
      const bVal = b[key]
      if (aVal === bVal) return 0
      if (aVal == null) return 1
      if (bVal == null) return -1
      const aNum = Number(aVal)
      const bNum = Number(bVal)
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return direction === "asc" ? aNum - bNum : bNum - aNum
      }
      const aStr = String(aVal)
      const bStr = String(bVal)
      return direction === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr)
    })
  }, [rows, sort])

  const renderCell = React.useCallback(
    (column: DataTableColumn, row: Record<string, unknown>, rowIndex: number) => {
      const value = row[column.key]
      if (column.formatFn) {
        return column.formatFn(value, row)
      }
      if (value == null) return "—"

      switch (column.format) {
        case "currency":
          return formatCurrency(value)
        case "percent":
          return formatPercent(value)
        case "date":
          return formatDate(value)
        case "status": {
          const { label, variant } = formatStatusBadge(value)
          return (
            <span
              data-slot="data-table-badge"
              className={cn(
                "inline-flex items-center rounded-[100px] px-2 py-0.5 text-label-primary font-[590] whitespace-nowrap",
                variant === "success" && "bg-success/10 text-success",
                variant === "warning" && "bg-warning/10 text-warning",
                variant === "destructive" && "bg-destructive/10 text-destructive",
                variant === "secondary" && "bg-fill-medium text-foreground",
              )}
            >
              {label}
            </span>
          )
        }
        default:
          return String(value)
      }
    },
    [],
  )

  const sortIndicator = React.useCallback(
    (key: string) => {
      if (!sort || sort.key !== key) return null
      return (
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className={cn(
            "ml-1 inline-block text-muted-foreground transition-transform duration-200",
            sort.direction === "desc" && "rotate-180",
          )}
        >
          <path d="M6 3L9 8H3L6 3Z" fill="currentColor" />
        </svg>
      )
    },
    [sort],
  )

  return (
    <div
      data-slot="data-table"
      data-receipt={receipt ? "true" : undefined}
      className={cn(
        "overflow-hidden rounded-[22px] border border-border/50 bg-card shadow-[var(--shadow-card)]",
        "transition-all duration-300",
        className,
      )}
      {...props}
    >
      {caption && (
        <div className="border-b border-border/30 px-5 py-3">
          <h3 className="text-title-secondary font-[590] text-foreground">{caption}</h3>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-body-primary">
          <thead>
            <tr className="border-b border-border/30 bg-fill-subtle/60">
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={cn(
                    "px-5 py-2.5 text-left text-label-primary-bold text-muted-foreground",
                    !isReadOnly && "cursor-pointer select-none hover:text-foreground transition-colors duration-200",
                  )}
                  onClick={() => handleSort(column.key)}
                  aria-sort={
                    sort?.key === column.key
                      ? sort.direction === "asc"
                        ? "ascending"
                        : "descending"
                      : undefined
                  }
                >
                  <span className="inline-flex items-center gap-1">
                    {column.label}
                    {sortIndicator(column.key)}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={cn(
                  "border-b border-border/20 last:border-b-0 transition-colors duration-200",
                  rowIndex % 2 === 1 && "bg-fill-subtle/40",
                  !isReadOnly && "hover:bg-fill-subtle/80",
                )}
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-5 py-3 text-foreground">
                    {renderCell(column, row, rowIndex)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {receipt && (
        <div className="border-t border-border/30 px-5 py-2.5">
          <span className="text-label-secondary text-muted-foreground">
            {rows.length} row{rows.length !== 1 ? "s" : ""} &middot; {columns.length} column{columns.length !== 1 ? "s" : ""}
            {receipt.summary && ` — ${receipt.summary}`}
          </span>
        </div>
      )}
    </div>
  )
}

export { DataTable }
export type { DataTableColumn as DataTableColumnType, DataTableSort as DataTableSortType }