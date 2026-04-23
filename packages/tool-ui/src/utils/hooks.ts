"use client"

import * as React from "react"

// ─── useControllableState ───────────────────────────────────────────────────────
// Controlled/uncontrolled state hook (same pattern used in neman-ui components)

export interface ControllableStateProps<T> {
  value?: T
  defaultValue?: T
  onChange?: (value: T) => void
}

export function useControllableState<T>(props: ControllableStateProps<T>) {
  const { value: valueProp, defaultValue, onChange } = props
  const [internalValue, setInternalValue] = React.useState(defaultValue as T)
  const isControlled = valueProp !== undefined
  const value = isControlled ? valueProp : internalValue

  const setValue = React.useCallback(
    (next: T | ((prev: T) => T)) => {
      const nextValue = typeof next === "function" ? (next as (prev: T) => T)(value) : next
      if (!isControlled) {
        setInternalValue(nextValue)
      }
      onChange?.(nextValue)
    },
    [isControlled, value, onChange],
  )

  return { value, setValue, isControlled }
}

// ─── useCopyToClipboard ─────────────────────────────────────────────────────────

export function useCopyToClipboard(timeout = 2000) {
  const [copiedId, setCopiedId] = React.useState<string | null>(null)
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const copy = React.useCallback(
    (text: string, id?: string) => {
      navigator.clipboard.writeText(text)
      setCopiedId(id ?? "default")
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setCopiedId(null), timeout)
    },
    [timeout],
  )

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return { copiedId, copy }
}

// ─── useSignatureReset ──────────────────────────────────────────────────────────
// Calls reset callback when a signature string changes (used for animation resets)

export function useSignatureReset(
  signature: string,
  onReset: () => void,
) {
  const prevSignatureRef = React.useRef(signature)
  React.useEffect(() => {
    if (prevSignatureRef.current !== signature) {
      prevSignatureRef.current = signature
      onReset()
    }
  }, [signature, onReset])
}