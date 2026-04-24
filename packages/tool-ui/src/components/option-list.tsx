"use client"

import * as React from "react"
import { z } from "zod"
import { cn } from "./_adapter"
import { defineToolUiContract } from "../contracts/define-tool-ui-contract"
import { useControllableState } from "../utils/hooks"
import type { ToolUIReceipt } from "../contracts/define-tool-ui-contract"

// ─── Zod Schemas ───────────────────────────────────────────────────────────────

const OptionItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string().optional(),
  icon: z.string().optional(),
})

export const SerializableOptionListSchema = z.object({
  options: z.array(OptionItemSchema),
  mode: z.enum(["single", "multi"]),
  selected: z.array(z.string()).optional(),
})

export type SerializableOptionList = z.infer<typeof SerializableOptionListSchema>

export const OptionListContract = defineToolUiContract({
  toolName: "option-list",
  role: "decision",
  outputSchema: SerializableOptionListSchema,
  decisionSchema: z.object({
    selectedIds: z.array(z.string()),
  }),
})

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface OptionItem {
  id: string
  label: string
  description?: string
  icon?: React.ReactNode
}

export interface OptionListProps {
  options: OptionItem[]
  mode?: "single" | "multi"
  selected?: string[]
  defaultSelected?: string[]
  onSelectionChange?: (selected: string[]) => void
  /** Receipt state — when set, renders in read-only confirmed mode */
  receipt?: ToolUIReceipt
  className?: string
  children?: React.ReactNode
}

// ─── Icons ──────────────────────────────────────────────────────────────────────

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function RadioIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

function RadioFilledIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="8" cy="8" r="3.5" fill="currentColor" />
    </svg>
  )
}

function CheckboxIcon({ className, checked }: { className?: string; checked?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <rect
        x="2"
        y="2"
        width="12"
        height="12"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      {checked && <path d="M5 8L7 10L11 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  )
}

// ─── Component ─────────────────────────────────────────────────────────────────

function OptionList({
  options,
  mode = "single",
  selected: selectedProp,
  defaultSelected,
  onSelectionChange,
  receipt,
  className,
}: OptionListProps) {
  const { value: selected, setValue: setSelected } = useControllableState<string[]>({
    value: selectedProp,
    defaultValue: defaultSelected ?? [],
    onChange: onSelectionChange,
  })

  const isReadOnly = !!receipt
  const isMulti = mode === "multi"

  const handleSelect = React.useCallback(
    (id: string) => {
      if (isReadOnly) return
      if (isMulti) {
        setSelected((prev: string[]) =>
          prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
        )
      } else {
        setSelected((prev: string[]) =>
          prev.includes(id) ? [] : [id],
        )
      }
    },
    [isMulti, isReadOnly, setSelected],
  )

  // Keyboard navigation
  const listRef = React.useRef<HTMLDivElement>(null)
  const [focusedIndex, setFocusedIndex] = React.useState(-1)

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (isReadOnly) return
      const items = listRef.current?.querySelectorAll<HTMLElement>('[data-slot="option-item"]') ?? []
      switch (e.key) {
        case "ArrowDown":
        case "ArrowRight": {
          e.preventDefault()
          const next = (focusedIndex + 1) % options.length
          setFocusedIndex(next)
          items[next]?.focus()
          break
        }
        case "ArrowUp":
        case "ArrowLeft": {
          e.preventDefault()
          const prev = focusedIndex - 1 < 0 ? options.length - 1 : focusedIndex - 1
          setFocusedIndex(prev)
          items[prev]?.focus()
          break
        }
        case " ":
        case "Enter": {
          e.preventDefault()
          if (focusedIndex >= 0 && focusedIndex < options.length) {
            handleSelect(options[focusedIndex].id)
          }
          break
        }
      }
    },
    [focusedIndex, options, handleSelect, isReadOnly],
  )

  return (
    <div
      data-slot="option-list"
      data-mode={mode}
      data-receipt={receipt ? "true" : undefined}
      className={cn("space-y-2", className)}
      role="listbox"
      aria-multiselectable={isMulti || undefined}
      onKeyDown={handleKeyDown}
      >
      {options.map((option, index) => {
        const isSelected = selected.includes(option.id)

        return (
          <button
            key={option.id}
            data-slot="option-item"
            data-selected={isSelected || undefined}
            role="option"
            aria-selected={isSelected}
            tabIndex={index === focusedIndex ? 0 : -1}
            onClick={() => handleSelect(option.id)}
            disabled={isReadOnly}
            className={cn(
              "flex w-full items-center gap-3 rounded-[22px] border px-4 py-3 text-left",
              "transition-all duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-foreground/30 focus-visible:ring-offset-background",
              isSelected
                ? "border-foreground/15 bg-fill-medium text-foreground shadow-[var(--shadow-drop-1)]"
                : "border-border/50 bg-card text-foreground hover:border-foreground/15 hover:bg-fill-medium hover:shadow-[var(--shadow-drop-1)]",
              isReadOnly && "cursor-default",
            )}
          >
            {/* Selection indicator */}
            <span className="shrink-0">
              {isMulti ? (
                <CheckboxIcon
                  className={cn(
                    "transition-colors duration-200",
                    isSelected ? "text-primary" : "text-muted-foreground",
                  )}
                  checked={isSelected}
                />
              ) : isSelected ? (
                <RadioFilledIcon className="text-primary transition-colors duration-200" />
              ) : (
                <RadioIcon className="text-muted-foreground transition-colors duration-200" />
              )}
            </span>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {option.icon && (
                  <span className="shrink-0 text-muted-foreground">{option.icon}</span>
                )}
                <span className={cn("text-label-secondary-bold", isSelected && "text-foreground")}>
                  {option.label}
                </span>
              </div>
              {option.description && (
                <p className="mt-0.5 text-label-primary text-muted-foreground line-clamp-2">
                  {option.description}
                </p>
              )}
            </div>

            {/* Checkmark for receipt state */}
            {isReadOnly && isSelected && (
              <CheckIcon className="shrink-0 text-primary" />
            )}
          </button>
        )
      })}

      {/* Receipt footer */}
      {receipt && (
        <div className="pt-1">
          <span className="text-label-secondary text-muted-foreground">
            {selected.length} item{selected.length !== 1 ? "s" : ""} selected
            {receipt.summary && ` — ${receipt.summary}`}
          </span>
        </div>
      )}
    </div>
  )
}

export { OptionList }