"use client"

import * as React from "react"
import { z } from "zod"
import { cn } from "./_adapter"
import { defineToolUiContract } from "../contracts/define-tool-ui-contract"
import type { ToolUIReceipt } from "../contracts/define-tool-ui-contract"
import { useControllableState } from "../utils/hooks"

// ─── Schemas ──────────────────────────────────────────────────────────────────

const SliderParamSchema = z.object({
  key: z.string(),
  label: z.string(),
  description: z.string().optional(),
  min: z.number(),
  max: z.number(),
  step: z.number().optional(),
  unit: z.string().optional(),
  defaultValue: z.number().optional(),
})

export const SerializableParameterSliderSchema = z.object({
  title: z.string().optional(),
  parameters: z.array(SliderParamSchema),
  values: z.record(z.string(), z.number()).optional(),
})

export type SerializableParameterSlider = z.infer<typeof SerializableParameterSliderSchema>

export const ParameterSliderContract = defineToolUiContract({
  toolName: "parameter_slider",
  role: "control",
  outputSchema: SerializableParameterSliderSchema,
})

// ─── Single Slider ───────────────────────────────────────────────────────────

function ParamSlider({
  param,
  value,
  onChange,
  disabled,
}: {
  param: z.infer<typeof SliderParamSchema>
  value: number
  onChange: (v: number) => void
  disabled?: boolean
}) {
  const step = param.step ?? 1
  const pct = ((value - param.min) / (param.max - param.min)) * 100

  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <div className="min-w-0">
          <span className="text-label-primary-bold">{param.label}</span>
          {param.description && (
            <span className="text-label-secondary text-muted-foreground ml-2">{param.description}</span>
          )}
        </div>
        <span className="text-label-primary-bold tabular-nums shrink-0">
          {value}{param.unit ?? ""}
        </span>
      </div>
      <input
        type="range"
        min={param.min}
        max={param.max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className={cn(
          "w-full h-1.5 rounded-full appearance-none cursor-pointer bg-border/40",
          "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand [&::-webkit-slider-thumb]:shadow-[var(--shadow-drop-1)]",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        style={{
          background: disabled
            ? undefined
            : `linear-gradient(to right, var(--color-brand) ${pct}%, var(--color-border) ${pct}%)`,
        }}
      />
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>{param.min}{param.unit}</span>
        <span>{param.max}{param.unit}</span>
      </div>
    </div>
  )
}

// ─── ParameterSlider Component ────────────────────────────────────────────────

function ParameterSlider({
  title,
  parameters,
  values: valuesProp,
  onValuesChange,
  receipt,
  className,
  ...props
}: React.ComponentProps<"div"> & SerializableParameterSlider & {
  /** Controlled values state */
  values?: Record<string, number>
  /** Change callback */
  onValuesChange?: (values: Record<string, number>) => void
  /** Receipt makes it read-only */
  receipt?: ToolUIReceipt
}) {
  const initialValues: Record<string, number> = {}
  for (const p of parameters) {
    initialValues[p.key] = p.defaultValue ?? (p.min + p.max) / 2
  }

  const { value: values, setValue: setValues } = useControllableState<Record<string, number>>({
    value: valuesProp,
    defaultValue: initialValues,
    onChange: onValuesChange,
  })

  const isReadonly = receipt != null

  const handleChange = (key: string, value: number) => {
    if (isReadonly) return
    setValues((prev: Record<string, number>) => ({ ...prev, [key]: value }))
  }

  return (
    <div
      data-slot="parameter-slider"
      className={cn(
        "rounded-[22px] border border-border/50 bg-card p-4 space-y-4",
        isReadonly && "opacity-80",
        className
      )}
      {...props}
    >
      {title && <h4 className="text-label-primary-bold">{title}</h4>}
      {parameters.map((param) => (
        <ParamSlider
          key={param.key}
          param={param}
          value={values[param.key] ?? param.defaultValue ?? (param.min + param.max) / 2}
          onChange={(v) => handleChange(param.key, v)}
          disabled={isReadonly}
        />
      ))}
    </div>
  )
}

export { ParameterSlider }