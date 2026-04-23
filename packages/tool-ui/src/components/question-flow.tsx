"use client"

import * as React from "react"
import { z } from "zod"
import { cn } from "./_adapter"
import { defineToolUiContract } from "../contracts/define-tool-ui-contract"
import type { ToolUIReceipt } from "../contracts/define-tool-ui-contract"
import { useControllableState } from "../utils/hooks"

// ─── Schemas ──────────────────────────────────────────────────────────────────

const QuestionTypeSchema = z.enum(["text", "select", "multiselect", "confirm"])

const QuestionSchema = z.object({
  id: z.string(),
  type: QuestionTypeSchema,
  question: z.string(),
  description: z.string().optional(),
  options: z.array(z.string()).optional(),
  required: z.boolean().optional(),
  placeholder: z.string().optional(),
})

export const SerializableQuestionFlowSchema = z.object({
  title: z.string().optional(),
  questions: z.array(QuestionSchema),
  submitLabel: z.string().optional(),
})

export type SerializableQuestionFlow = z.infer<typeof SerializableQuestionFlowSchema>
type Question = z.infer<typeof QuestionSchema>

export const QuestionFlowContract = defineToolUiContract({
  toolName: "question_flow",
  role: "decision",
  outputSchema: SerializableQuestionFlowSchema,
})

// ─── Types ────────────────────────────────────────────────────────────────────

type QuestionAnswers = Record<string, string | string[] | boolean>

// ─── Question Items ────────────────────────────────────────────────────────────

function TextQuestion({
  q,
  value,
  onChange,
  disabled,
}: {
  q: Question
  value: string
  onChange: (v: string) => void
  disabled?: boolean
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-label-primary-bold">
        {q.question}
        {q.required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      {q.description && <p className="text-label-secondary text-muted-foreground">{q.description}</p>}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={q.placeholder}
        disabled={disabled}
        className="w-full rounded-[12px] border border-border/50 bg-card px-3 py-2 text-[14px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
      />
    </div>
  )
}

function SelectQuestion({
  q,
  value,
  onChange,
  disabled,
  multiselect,
}: {
  q: Question
  value: string | string[]
  onChange: (v: string | string[]) => void
  disabled?: boolean
  multiselect?: boolean
}) {
  const selected = (Array.isArray(value) ? value : value ? [value] : []) as string[]

  const handleToggle = (option: string) => {
    if (multiselect) {
      const next = selected.includes(option)
        ? selected.filter((s) => s !== option)
        : [...selected, option]
      onChange(next)
    } else {
      onChange(option)
    }
  }

  return (
    <div className="space-y-1.5">
      <label className="text-label-primary-bold">
        {q.question}
        {q.required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      {q.description && <p className="text-label-secondary text-muted-foreground">{q.description}</p>}
      <div className="flex flex-wrap gap-1.5">
        {q.options?.map((option) => {
          const isSelected = selected.includes(option)
          return (
            <button
              key={option}
              type="button"
              onClick={() => handleToggle(option)}
              disabled={disabled}
              className={cn(
                "rounded-[10px] border px-3 py-1.5 text-[13px] font-[590] transition-all duration-150",
                isSelected
                  ? "border-brand bg-brand/10 text-brand"
                  : "border-border/50 bg-card text-foreground hover:border-border"
              )}
            >
              {option}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function ConfirmQuestion({
  q,
  value,
  onChange,
  disabled,
}: {
  q: Question
  value: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
}) {
  return (
    <label className="flex items-start gap-2.5 cursor-pointer">
      <button
        type="button"
        role="checkbox"
        aria-checked={value}
        onClick={() => onChange(!value)}
        disabled={disabled}
        className={cn(
          "mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-[8px] border transition-colors duration-150",
          value ? "border-brand bg-brand text-white" : "border-border/50 bg-card"
        )}
      >
        {value && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path d="M2 5L4.5 7.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
      <div className="min-w-0">
        <span className="text-label-primary-bold">
          {q.question}
          {q.required && <span className="text-destructive ml-0.5">*</span>}
        </span>
        {q.description && <p className="text-label-secondary text-muted-foreground">{q.description}</p>}
      </div>
    </label>
  )
}

// ─── QuestionFlow Component ────────────────────────────────────────────────────

function QuestionFlow({
  title,
  questions,
  submitLabel = "Submit",
  answers: answersProp,
  onAnswersChange,
  onSubmit,
  receipt,
  className,
  ...props
}: React.ComponentProps<"div"> & SerializableQuestionFlow & {
  answers?: QuestionAnswers
  onAnswersChange?: (answers: QuestionAnswers) => void
  onSubmit?: (answers: QuestionAnswers) => void
  receipt?: ToolUIReceipt
}) {
  const initialAnswers: QuestionAnswers = {}
  for (const q of questions) {
    if (q.type === "confirm") initialAnswers[q.id] = false
    else if (q.type === "text") initialAnswers[q.id] = ""
    else initialAnswers[q.id] = []
  }

  const { value: answers, setValue: setAnswers } = useControllableState<QuestionAnswers>({
    value: answersProp,
    defaultValue: initialAnswers,
    onChange: onAnswersChange,
  })

  const isReadonly = receipt != null

  const setAnswer = (id: string, value: string | string[] | boolean) => {
    if (isReadonly) return
    setAnswers((prev: QuestionAnswers) => ({ ...prev, [id]: value }))
  }

  return (
    <div
      data-slot="question-flow"
      className={cn(
        "rounded-[22px] border border-border/50 bg-card p-4 space-y-4",
        isReadonly && "opacity-80",
        className
      )}
      {...props}
    >
      {title && <h4 className="text-label-primary-bold">{title}</h4>}
      {questions.map((q) => {
        if (q.type === "text") {
          return (
            <TextQuestion
              key={q.id}
              q={q}
              value={(answers[q.id] as string) ?? ""}
              onChange={(v) => setAnswer(q.id, v)}
              disabled={isReadonly}
            />
          )
        }
        if (q.type === "select" || q.type === "multiselect") {
          return (
            <SelectQuestion
              key={q.id}
              q={q}
              value={answers[q.id] as string | string[] ?? (q.type === "multiselect" ? [] : "")}
              onChange={(v) => setAnswer(q.id, v)}
              disabled={isReadonly}
              multiselect={q.type === "multiselect"}
            />
          )
        }
        if (q.type === "confirm") {
          return (
            <ConfirmQuestion
              key={q.id}
              q={q}
              value={(answers[q.id] as boolean) ?? false}
              onChange={(v) => setAnswer(q.id, v)}
              disabled={isReadonly}
            />
          )
        }
        return null
      })}
      {!isReadonly && (
        <button
          type="button"
          onClick={() => onSubmit?.(answers)}
          className="rounded-[12px] bg-brand px-4 py-2 text-[14px] font-[590] text-white transition-all duration-150 hover:opacity-90 active:scale-[0.98]"
        >
          {submitLabel}
        </button>
      )}
    </div>
  )
}

export { QuestionFlow }