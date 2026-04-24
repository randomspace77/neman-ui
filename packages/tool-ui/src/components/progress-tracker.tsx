"use client"

import * as React from "react"
import { z } from "zod"
import { cn } from "./_adapter"
import { defineToolUiContract } from "../contracts/define-tool-ui-contract"

// ─── Schemas ──────────────────────────────────────────────────────────────────

const ProgressStepStatusSchema = z.enum(["pending", "running", "complete", "error"])

const ProgressStepSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string().optional(),
  status: ProgressStepStatusSchema,
})

export const SerializableProgressTrackerSchema = z.object({
  steps: z.array(ProgressStepSchema),
  orientation: z.enum(["horizontal", "vertical"]).optional(),
})

export type SerializableProgressTracker = z.infer<typeof SerializableProgressTrackerSchema>
export type ProgressStep = z.infer<typeof ProgressStepSchema>
export type ProgressStepStatus = z.infer<typeof ProgressStepStatusSchema>

export const ProgressTrackerContract = defineToolUiContract({
  toolName: "progress-tracker",
  role: "state",
  outputSchema: SerializableProgressTrackerSchema,
})

export const parse = ProgressTrackerContract.parse
export const safeParse = ProgressTrackerContract.safeParse

// ─── Dot/Node rendering ────────────────────────────────────────────────────────

function StepDot({ status }: { status: ProgressStepStatus }) {
  const base = "flex size-3 shrink-0 items-center justify-center rounded-full transition-all duration-300"

  switch (status) {
    case "pending":
      return (
        <div
          data-slot="progress-dot"
          data-status="pending"
          className={cn(base, "bg-muted-foreground/20 border-2 border-muted-foreground/30")}
        />
      )
    case "running":
      return (
        <div
          data-slot="progress-dot"
          data-status="running"
          className={cn(base, "bg-primary border-2 border-primary/60 ring-4 ring-foreground/10")}
        >
          <div className="size-1.5 rounded-full bg-primary-foreground animate-pulse" />
        </div>
      )
    case "complete":
      return (
        <div
          data-slot="progress-dot"
          data-status="complete"
          className={cn(base, "bg-success border-2 border-success/60")}
        >
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="text-success-foreground">
            <path d="M1.5 4L3 5.5L6.5 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )
    case "error":
      return (
        <div
          data-slot="progress-dot"
          data-status="error"
          className={cn(base, "bg-destructive border-2 border-destructive/60")}
        >
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="text-destructive-foreground">
            <path d="M2.5 2.5L5.5 5.5M5.5 2.5L2.5 5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </div>
      )
  }
}

function ConnectorLine({ completed, orientation }: { completed: boolean; orientation: "horizontal" | "vertical" }) {
  if (orientation === "horizontal") {
    return (
      <div
        data-slot="progress-connector"
        className={cn(
          "h-0.5 flex-1 min-w-4 transition-colors duration-300",
          completed ? "bg-success/50" : "bg-border"
        )}
      />
    )
  }

  return (
    <div
      data-slot="progress-connector"
      className={cn(
        "w-0.5 flex-1 min-h-4 transition-colors duration-300",
        completed ? "bg-success/50" : "bg-border"
      )}
    />
  )
}

// ─── ProgressTracker Props ────────────────────────────────────────────────────

export interface ProgressTrackerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Array of progress steps */
  steps: ProgressStep[]
  /** Layout orientation */
  orientation?: "horizontal" | "vertical"
  /** Receipt state — renders in read-only confirmed mode */
  choice?: SerializableProgressTracker
}

// ─── Horizontal Layout ─────────────────────────────────────────────────────────

function ProgressTrackerHorizontal({
  steps,
  className,
  ...props
}: ProgressTrackerProps) {
  return (
    <div
      data-slot="progress-tracker"
      data-orientation="horizontal"
      className={cn("flex items-start gap-0", className)}
      {...props}
    >
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1
        const isCompleted = step.status === "complete" && (index < steps.length - 1 ? steps[index + 1]?.status !== "pending" || step.status === "complete" : true)

        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center gap-2 min-w-0">
              <StepDot status={step.status} />
              <div className="text-center min-w-0">
                <div
                  className={cn(
                    "text-label-secondary-bold truncate",
                    step.status === "complete" && "text-foreground",
                    step.status === "running" && "text-primary",
                    step.status === "pending" && "text-muted-foreground",
                    step.status === "error" && "text-destructive"
                  )}
                >
                  {step.label}
                </div>
                {step.description && (
                  <p className="mt-0.5 text-label-primary text-muted-foreground line-clamp-2">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
            {!isLast && (
              <ConnectorLine completed={step.status === "complete"} orientation="horizontal" />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

// ─── Vertical Layout ────────────────────────────────────────────────────────────

function ProgressTrackerVertical({
  steps,
  className,
  ...props
}: ProgressTrackerProps) {
  return (
    <div
      data-slot="progress-tracker"
      data-orientation="vertical"
      className={cn("flex flex-col", className)}
      {...props}
    >
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1

        return (
          <div key={step.id} data-slot="progress-step" data-status={step.status} className="flex gap-3">
            {/* Left column: dot + connector */}
            <div className="flex flex-col items-center">
              <StepDot status={step.status} />
              {!isLast && (
                <ConnectorLine completed={step.status === "complete"} orientation="vertical" />
              )}
            </div>
            {/* Right column: label + description */}
            <div className={cn("pb-4 min-w-0", isLast && "pb-0")}>
              <div
                className={cn(
                  "text-title-primary",
                  step.status === "complete" && "text-foreground",
                  step.status === "running" && "text-primary",
                  step.status === "pending" && "text-muted-foreground",
                  step.status === "error" && "text-destructive"
                )}
              >
                {step.label}
              </div>
              {step.description && (
                <p className="mt-0.5 text-body-primary text-muted-foreground">
                  {step.description}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── ProgressTracker Component ──────────────────────────────────────────────────

function ProgressTrackerRoot({
  steps,
  orientation = "vertical",
  choice,
  ...props
}: ProgressTrackerProps) {
  const isReceipt = choice !== undefined
  const displaySteps = isReceipt ? choice.steps : steps

  const subProps = {
    steps: displaySteps,
    choice,
    ...props,
  }

  // Wrap in card for receipt state
  if (isReceipt) {
    return (
      <div
        data-slot="progress-tracker-card"
        data-receipt="true"
        className="rounded-[22px] border border-border/50 bg-card p-5 shadow-[var(--shadow-card)]"
      >
        <div className="text-title-secondary font-[590] mb-4">Progress</div>
        {orientation === "horizontal" ? (
          <ProgressTrackerHorizontal {...subProps} />
        ) : (
          <ProgressTrackerVertical {...subProps} />
        )}
      </div>
    )
  }

  if (orientation === "horizontal") {
    return <ProgressTrackerHorizontal {...subProps} />
  }

  return <ProgressTrackerVertical {...subProps} />
}

// ─── Compound Export ────────────────────────────────────────────────────────────

const ProgressTracker = Object.assign(ProgressTrackerRoot, {
  Horizontal: ProgressTrackerHorizontal,
  Vertical: ProgressTrackerVertical,
})

export { ProgressTracker, ProgressTrackerRoot, ProgressTrackerHorizontal, ProgressTrackerVertical }