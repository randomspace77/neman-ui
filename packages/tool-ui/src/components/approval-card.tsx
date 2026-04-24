"use client"

import * as React from "react"
import { z } from "zod"
import { cn } from "./_adapter"
import { Button } from "./_adapter"
import { Card, CardHeader, CardContent, CardFooter } from "./_adapter"
import { defineToolUiContract } from "../contracts/define-tool-ui-contract"

// ─── Schemas ──────────────────────────────────────────────────────────────────

const ApprovalChoiceSchema = z.enum(["approved", "denied"])

export const SerializableApprovalCardSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  danger: z.boolean().optional(),
  choice: ApprovalChoiceSchema.optional(),
})

export type SerializableApprovalCard = z.infer<typeof SerializableApprovalCardSchema>
export type ApprovalChoice = z.infer<typeof ApprovalChoiceSchema>

export const ApprovalCardContract = defineToolUiContract({
  toolName: "approval-card",
  role: "decision",
  outputSchema: SerializableApprovalCardSchema,
  decisionSchema: ApprovalChoiceSchema,
})

export const parse = ApprovalCardContract.parse
export const safeParse = ApprovalCardContract.safeParse

// ─── Choice badge ──────────────────────────────────────────────────────────────

function ChoiceBadge({ choice }: { choice: ApprovalChoice }) {
  if (choice === "approved") {
    return (
      <span
        data-slot="approval-badge"
        data-choice="approved"
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-3 py-1",
          "bg-success/10 text-success text-label-primary-bold"
        )}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M2 7.5L5.5 11L12 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Approved
      </span>
    )
  }

  return (
    <span
      data-slot="approval-badge"
      data-choice="denied"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1",
        "bg-destructive/10 text-destructive text-label-primary-bold"
      )}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M4 4L10 10M10 4L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      Denied
    </span>
  )
}

// ─── ApprovalCard Props ────────────────────────────────────────────────────────

export interface ApprovalCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Title of the approval request */
  title: string
  /** Optional description explaining what needs approval */
  description?: string
  /** Whether this is a dangerous/destructive action */
  danger?: boolean
  /** Current choice state (when a decision has been made) */
  choice?: ApprovalChoice
  /** Callback when user approves */
  onApprove?: () => void
  /** Callback when user denies */
  onDeny?: () => void
}

// ─── ApprovalCard Component ────────────────────────────────────────────────────

function ApprovalCard({
  title,
  description,
  danger = false,
  choice,
  onApprove,
  onDeny,
  className,
  ...props
}: ApprovalCardProps) {
  const isReceipt = choice !== undefined

  return (
    <Card
      data-slot="approval-card"
      data-receipt={isReceipt ? "true" : undefined}
      data-danger={danger ? "true" : undefined}
      className={cn(
        danger && !isReceipt && "border-destructive/20",
        className
      )}
      {...props}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="text-title-secondary font-[590]">{title}</div>
          {isReceipt && <ChoiceBadge choice={choice!} />}
        </div>
        {description && (
          <p className="text-body-primary text-muted-foreground mt-1">{description}</p>
        )}
        {danger && !isReceipt && (
          <div className="flex items-center gap-2 mt-2 rounded-lg bg-destructive/5 px-3 py-2 text-label-primary-bold text-destructive border border-destructive/15">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M7 2L12.5 11.5H1.5L7 2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
              <path d="M7 6V8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <circle cx="7" cy="10" r="0.5" fill="currentColor" />
            </svg>
            This action cannot be undone
          </div>
        )}
      </CardHeader>

      {!isReceipt && (
        <CardFooter className="gap-3 pt-2">
          <Button
            variant="blue"
            size="sm"
            onClick={onApprove}
            className="font-[590]"
          >
            Approve
          </Button>
          <Button
            variant={danger ? "destructive" : "outline"}
            size="sm"
            onClick={onDeny}
            className={cn(!danger && "font-[590]")}
          >
            Deny
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

export { ApprovalCard }