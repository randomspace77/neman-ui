"use client"

import * as React from "react"
import { z } from "zod"
import { cn } from "./_adapter"
import { defineToolUiContract } from "../contracts/define-tool-ui-contract"
import type { ToolUIReceipt } from "../contracts/define-tool-ui-contract"
import { useControllableState } from "../utils/hooks"

// ─── Schemas ──────────────────────────────────────────────────────────────────

const PreferenceOptionSchema = z.object({
  label: z.string(),
  value: z.string(),
  description: z.string().optional(),
})

const PreferenceItemSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("select"),
    key: z.string(),
    label: z.string(),
    description: z.string().optional(),
    options: z.array(PreferenceOptionSchema),
    defaultValue: z.string().optional(),
  }),
  z.object({
    type: z.literal("toggle"),
    key: z.string(),
    label: z.string(),
    description: z.string().optional(),
    defaultValue: z.boolean().optional(),
  }),
  z.object({
    type: z.literal("slider"),
    key: z.string(),
    label: z.string(),
    description: z.string().optional(),
    min: z.number(),
    max: z.number(),
    step: z.number().optional(),
    defaultValue: z.number().optional(),
    unit: z.string().optional(),
  }),
])

export const SerializablePreferencesPanelSchema = z.object({
  title: z.string().optional(),
  preferences: z.array(PreferenceItemSchema),
})

export type SerializablePreferencesPanel = z.infer<typeof SerializablePreferencesPanelSchema>

export type PreferencesValues = Record<string, string | boolean | number>

export const PreferencesPanelContract = defineToolUiContract({
  toolName: "preferences_panel",
  role: "control",
  outputSchema: SerializablePreferencesPanelSchema,
})

// ─── Preference Select ────────────────────────────────────────────────────────

function PreferenceSelect({
  pref,
  value,
  onChange,
}: {
  pref: Extract<z.infer<typeof PreferenceItemSchema>, { type: "select" }>
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="space-y-2">
      <div>
        <div className="text-label-primary-bold">{pref.label}</div>
        {pref.description && (
          <div className="text-label-secondary text-muted-foreground">{pref.description}</div>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {pref.options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-label-secondary-bold transition-all duration-200",
              value === opt.value
                ? "border-primary bg-primary/10 text-primary"
                : "border-border/50 bg-card text-foreground hover:border-border"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Preference Toggle ────────────────────────────────────────────────────────

function PreferenceToggle({
  pref,
  value,
  onChange,
}: {
  pref: Extract<z.infer<typeof PreferenceItemSchema>, { type: "toggle" }>
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer">
      <div className="min-w-0">
        <div className="text-label-primary-bold">{pref.label}</div>
        {pref.description && (
          <div className="text-label-secondary text-muted-foreground">{pref.description}</div>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors duration-200",
          value ? "bg-primary" : "bg-border"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block size-4 rounded-full bg-card shadow-[var(--shadow-drop-1)] transition-transform duration-200",
            value ? "translate-x-[18px]" : "translate-x-[2px]"
          )}
          style={{ marginTop: "2px" }}
        />
      </button>
    </label>
  )
}

// ─── Preference Slider ────────────────────────────────────────────────────────

function PreferenceSlider({
  pref,
  value,
  onChange,
}: {
  pref: Extract<z.infer<typeof PreferenceItemSchema>, { type: "slider" }>
  value: number
  onChange: (v: number) => void
}) {
  const step = pref.step ?? 1
  const pct = ((value - pref.min) / (pref.max - pref.min)) * 100

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-label-primary-bold">{pref.label}</span>
          {pref.description && (
            <span className="text-label-secondary text-muted-foreground ml-2">{pref.description}</span>
          )}
        </div>
        <span className="text-label-primary-bold tabular-nums">
          {value}{pref.unit ?? ""}
        </span>
      </div>
      <input
        type="range"
        min={pref.min}
        max={pref.max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-border/40 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-[var(--shadow-drop-1)]"
        style={{
          background: `linear-gradient(to right, var(--color-primary) ${pct}%, var(--color-border) ${pct}%)`,
        }}
      />
      <div className="flex justify-between text-label-primary text-muted-foreground">
        <span>{pref.min}{pref.unit}</span>
        <span>{pref.max}{pref.unit}</span>
      </div>
    </div>
  )
}

// ─── PreferencesPanel Component ────────────────────────────────────────────────

function PreferencesPanel({
  title,
  preferences,
  values: valuesProp,
  onValuesChange,
  receipt,
  className,
  ...props
}: React.ComponentProps<"div"> & SerializablePreferencesPanel & {
  /** Controlled values state */
  values?: PreferencesValues
  /** Change callback */
  onValuesChange?: (values: PreferencesValues) => void
  /** Receipt overrides interactivity */
  receipt?: ToolUIReceipt
}) {
  const initialValues: PreferencesValues = {}
  for (const pref of preferences) {
    if (pref.defaultValue !== undefined) {
      initialValues[pref.key] = pref.defaultValue
    }
  }

  const { value: values, setValue: setValues } = useControllableState<PreferencesValues>({
    value: valuesProp,
    defaultValue: initialValues,
    onChange: onValuesChange,
  })

  const isReadonly = receipt != null

  const handleChange = (key: string, value: string | boolean | number) => {
    if (isReadonly) return
    setValues((prev: PreferencesValues) => ({ ...prev, [key]: value }))
  }

  return (
    <div
      data-slot="preferences-panel"
      className={cn(
        "rounded-[22px] border border-border/50 bg-card p-4 space-y-4 shadow-[var(--shadow-card)] transition-all duration-300",
        isReadonly && "opacity-80",
        className
      )}
      {...props}
    >
      {title && (
        <h4 className="text-label-primary-bold">{title}</h4>
      )}
      {preferences.map((pref) => {
        if (pref.type === "select") {
          return (
            <PreferenceSelect
              key={pref.key}
              pref={pref}
              value={(values[pref.key] as string) ?? pref.defaultValue ?? pref.options[0]?.value ?? ""}
              onChange={(v) => handleChange(pref.key, v)}
            />
          )
        }
        if (pref.type === "toggle") {
          return (
            <PreferenceToggle
              key={pref.key}
              pref={pref}
              value={(values[pref.key] as boolean) ?? pref.defaultValue ?? false}
              onChange={(v) => handleChange(pref.key, v)}
            />
          )
        }
        if (pref.type === "slider") {
          return (
            <PreferenceSlider
              key={pref.key}
              pref={pref}
              value={(values[pref.key] as number) ?? pref.defaultValue ?? ((pref.min + pref.max) / 2)}
              onChange={(v) => handleChange(pref.key, v)}
            />
          )
        }
        return null
      })}
    </div>
  )
}

export { PreferencesPanel }