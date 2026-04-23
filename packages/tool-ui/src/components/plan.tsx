"use client"

import * as React from "react"
import { z } from "zod"
import { cn } from "./_adapter"
import { Card, CardHeader, CardContent } from "./_adapter"
import { defineToolUiContract } from "../contracts/define-tool-ui-contract"

// ─── Schemas ──────────────────────────────────────────────────────────────────

const StepStatusSchema = z.enum(["pending", "running", "complete", "error"])

const PlanStepSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  status: StepStatusSchema,
})

export const SerializablePlanSchema = z.object({
  steps: z.array(PlanStepSchema),
  compact: z.boolean().optional(),
})

export type SerializablePlan = z.infer<typeof SerializablePlanSchema>
export type PlanStep = z.infer<typeof PlanStepSchema>
export type StepStatus = z.infer<typeof StepStatusSchema>

export const PlanContract = defineToolUiContract({
  toolName: "plan",
  role: "information",
  outputSchema: SerializablePlanSchema,
})

// Re-export parse/safeParse from contract for convenience
export const parse = PlanContract.parse
export const safeParse = PlanContract.safeParse

// ─── Status config ─────────────────────────────────────────────────────────────

function getStepStatusConfig(status: StepStatus) {
  switch (status) {
    case "pending":
      return { label: "Pending", color: "text-muted-foreground", bg: "bg-fill-subtle", border: "border-border" }
    case "running":
      return { label: "Running", color: "text-brand", bg: "bg-brand/10", border: "border-brand/20" }
    case "complete":
      return { label: "Complete", color: "text-success", bg: "bg-success/10", border: "border-success/20" }
    case "error":
      return { label: "Error", color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20" }
  }
}

// ─── Step icon ─────────────────────────────────────────────────────────────────

function StepIcon({ status, className }: { status: StepStatus; className?: string }) {
  switch (status) {
    case "pending":
      return (
        <div
          data-slot="plan-step-icon"
          className={cn(
            "flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-muted-foreground/30",
            className
          )}
        />
      )
    case "running":
      return (
        <svg
          data-slot="plan-step-icon"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          className={cn("shrink-0 text-brand animate-spin", className)}
          aria-label="Running"
        >
          <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25" />
          <path d="M10 3a7 7 0 0 1 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    case "complete":
      return (
        <div
          data-slot="plan-step-icon"
          className={cn(
            "flex size-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success",
            className
          )}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6L5 9L10 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )
    case "error":
      return (
        <div
          data-slot="plan-step-icon"
          className={cn(
            "flex size-5 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-destructive",
            className
          )}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      )
  }
}

// ─── Plan Props ────────────────────────────────────────────────────────────────

export interface PlanProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Array of plan steps */
  steps: PlanStep[]
  /** Render in compact variant */
  compact?: boolean
  /** Receipt state — renders in read-only confirmed mode */
  choice?: SerializablePlan
}

// ─── Plan Component ────────────────────────────────────────────────────────────

function PlanRoot({
  steps,
  compact = false,
  choice,
  className,
  ...props
}: PlanProps) {
  const isReceipt = choice !== undefined
  const displaySteps = isReceipt ? choice.steps : steps

  return (
    <Card
      data-slot="plan"
      data-receipt={isReceipt ? "true" : undefined}
      className={cn(
        compact && "gap-0 py-3",
        className
      )}
      {...props}
    >
      <CardHeader className={cn(compact && "px-3 py-0 gap-1")}>
        <div className="text-title-secondary font-[590]">Plan</div>
        {isReceipt && (
          <span className="text-label-primary-bold text-muted-foreground">Completed</span>
        )}
      </CardHeader>
      <CardContent className={cn(compact && "px-3 pb-0 pt-0")}>
        <ol className="space-y-0">
          {displaySteps.map((step, index) => {
            const config = getStepStatusConfig(step.status)
            const isLast = index === displaySteps.length - 1

            return (
              <li key={step.id} data-slot="plan-step" data-status={step.status}>
                <div className="flex items-start gap-3 pb-4">
                  {/* Vertical connector line */}
                  <div className="relative flex flex-col items-center">
                    <StepIcon status={step.status} />
                    {!isLast && (
                      <div
                        className={cn(
                          "absolute top-5 h-[calc(100%+16px)] w-px",
                          step.status === "complete" ? "bg-success/30" : "bg-border"
                        )}
                      />
                    )}
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-body-primary font-[590]",
                        step.status === "pending" && "text-muted-foreground",
                        step.status === "complete" && "text-foreground",
                        className
                      )}>
                        {step.title}
                      </span>
                      {compact && (
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2 py-0.5 text-label-primary-bold",
                            config.bg,
                            config.color
                          )}
                        >
                          {config.label}
                        </span>
                      )}
                    </div>
                    {step.description && !compact && (
                      <p className="mt-1 text-body-primary text-muted-foreground">
                        {step.description}
                      </p>
                    )}
                  </div>
                  {/* Status badge (non-compact) */}
                  {!compact && (
                    <span
                      className={cn(
                        "shrink-0 inline-flex items-center rounded-full px-2.5 py-0.5 text-label-primary-bold",
                        config.bg,
                        config.color
                      )}
                    >
                      {config.label}
                    </span>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
      </CardContent>
    </Card>
  )
}

// ─── Plan.Compact ──────────────────────────────────────────────────────────────

function PlanCompact({
  steps,
  choice,
  className,
  ...props
}: Omit<PlanProps, "compact">) {
  return (
    <PlanRoot
      steps={steps}
      compact
      choice={choice}
      className={cn("rounded-[16px] border-border/50", className)}
      {...props}
    />
  )
}

// ─── Compound Export ────────────────────────────────────────────────────────────

const Plan = Object.assign(PlanRoot, {
  Compact: PlanCompact,
})

export { Plan, PlanRoot, PlanCompact }