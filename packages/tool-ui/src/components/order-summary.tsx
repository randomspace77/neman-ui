"use client"

import * as React from "react"
import { z } from "zod"
import { cn } from "./_adapter"
import { defineToolUiContract } from "../contracts/define-tool-ui-contract"

// ─── Schemas ──────────────────────────────────────────────────────────────────

const OrderLineSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string().optional(),
  quantity: z.number().optional(),
  unitPrice: z.number().optional(),
  total: z.number().optional(),
  status: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"]).optional(),
})

export const SerializableOrderSummarySchema = z.object({
  orderId: z.string(),
  title: z.string().optional(),
  lines: z.array(OrderLineSchema),
  subtotal: z.number().optional(),
  tax: z.number().optional(),
  shipping: z.number().optional(),
  total: z.number(),
  currency: z.string().optional(),
  status: z.enum(["pending", "processing", "confirmed", "shipped", "delivered", "cancelled"]).optional(),
})

export type SerializableOrderSummary = z.infer<typeof SerializableOrderSummarySchema>

export const OrderSummaryContract = defineToolUiContract({
  toolName: "order_summary",
  role: "information",
  outputSchema: SerializableOrderSummarySchema,
})

// ─── Helpers ──────────────────────────────────────────────────────────────────

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "Pending", color: "text-warning", bg: "bg-warning/10" },
  processing: { label: "Processing", color: "text-foreground", bg: "bg-fill-medium" },
  confirmed: { label: "Confirmed", color: "text-success", bg: "bg-success/10" },
  shipped: { label: "Shipped", color: "text-foreground", bg: "bg-fill-medium" },
  delivered: { label: "Delivered", color: "text-success", bg: "bg-success/10" },
  cancelled: { label: "Cancelled", color: "text-destructive", bg: "bg-destructive/10" },
}

function formatMoney(value: number, currency?: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency ?? "USD",
  }).format(value)
}

// ─── OrderSummary Component ────────────────────────────────────────────────────

function OrderSummary({
  orderId,
  title,
  lines,
  subtotal,
  tax,
  shipping,
  total,
  currency,
  status,
  className,
  ...props
}: React.ComponentProps<"div"> & SerializableOrderSummary) {
  const statusInfo = status ? statusConfig[status] : undefined

  return (
    <div
      data-slot="order-summary"
      className={cn(
        "rounded-[22px] border border-border/50 bg-card overflow-hidden shadow-[var(--shadow-card)] transition-all duration-300",
        className
      )}
      {...props}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
        <div className="min-w-0">
          <h4 className="text-label-primary-bold truncate">{title ?? `Order ${orderId}`}</h4>
          <span className="text-label-secondary text-muted-foreground">#{orderId}</span>
        </div>
        {statusInfo && (
          <span className={cn("inline-flex items-center gap-1 rounded-lg px-2.5 py-0.5 text-label-primary-bold", statusInfo.bg, statusInfo.color)}>
            {statusInfo.label}
          </span>
        )}
      </div>

      {/* Line items */}
      <div className="divide-y divide-border/20">
        {lines.map((line) => {
          const lineStatus = line.status ? statusConfig[line.status] : undefined
          return (
            <div key={line.id} className="flex items-start gap-3 px-4 py-2.5">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-body-primary truncate">{line.label}</span>
                  {lineStatus && (
                    <span className={cn("inline-flex items-center rounded-md px-1.5 py-0.5 text-label-primary", lineStatus.bg, lineStatus.color)}>
                      {lineStatus.label}
                    </span>
                  )}
                </div>
                {line.description && (
                  <span className="text-label-secondary text-muted-foreground line-clamp-1">{line.description}</span>
                )}
              </div>
              <div className="shrink-0 text-right">
                {line.quantity != null && line.unitPrice != null && (
                  <span className="text-label-secondary text-muted-foreground">
                    {line.quantity} × {formatMoney(line.unitPrice, currency)}
                  </span>
                )}
                {line.total != null && (
                  <div className="text-title-primary">{formatMoney(line.total, currency)}</div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Totals */}
      <div className="border-t border-border/30 bg-fill-subtle px-4 py-3 space-y-1">
        {subtotal != null && (
          <div className="flex justify-between text-label-secondary text-muted-foreground">
            <span>Subtotal</span>
            <span>{formatMoney(subtotal, currency)}</span>
          </div>
        )}
        {tax != null && (
          <div className="flex justify-between text-label-secondary text-muted-foreground">
            <span>Tax</span>
            <span>{formatMoney(tax, currency)}</span>
          </div>
        )}
        {shipping != null && (
          <div className="flex justify-between text-label-secondary text-muted-foreground">
            <span>Shipping</span>
            <span>{formatMoney(shipping, currency)}</span>
          </div>
        )}
        <div className="flex justify-between text-body-primary-bold border-t border-border/20 pt-1.5">
          <span>Total</span>
          <span>{formatMoney(total, currency)}</span>
        </div>
      </div>
    </div>
  )
}

export { OrderSummary }