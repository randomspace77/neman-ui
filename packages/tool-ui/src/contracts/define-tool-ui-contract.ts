import { z } from "zod"

// ─── Base Schemas ──────────────────────────────────────────────────────────────

export const ToolUIIdSchema = z.string().min(1)
export const ToolUIRoleSchema = z.enum(["information", "decision", "control", "state", "composite"])

export interface ToolUIReceipt {
  outcome: "success" | "partial" | "failed" | "cancelled"
  summary?: string
  identifiers?: Record<string, string>
  at?: number
}

export const ToolUIReceiptSchema: z.ZodType<ToolUIReceipt> = z.object({
  outcome: z.enum(["success", "partial", "failed", "cancelled"]),
  summary: z.string().optional(),
  identifiers: z.record(z.string(), z.string()).optional(),
  at: z.number().optional(),
})

// ─── Action Schema ─────────────────────────────────────────────────────────────

export interface Action {
  id: string
  label: string
  sentence?: string
  variant?: "default" | "destructive" | "secondary" | "ghost" | "outline"
  confirmLabel?: string
  confirmTimeout?: number
  icon?: React.ReactNode
  loading?: boolean
  disabled?: boolean
  shortcut?: string
}

export const ActionSchema: z.ZodType<Action> = z.object({
  id: z.string(),
  label: z.string(),
  sentence: z.string().optional(),
  variant: z.enum(["default", "destructive", "secondary", "ghost", "outline"]).optional(),
  confirmLabel: z.string().optional(),
  confirmTimeout: z.number().optional(),
  loading: z.boolean().optional(),
  disabled: z.boolean().optional(),
  shortcut: z.string().optional(),
})

// ─── Decision Result ───────────────────────────────────────────────────────────

export interface DecisionResult {
  kind: "decision"
  version: 1
  decisionId: string
  actionId: string
  actionLabel: string
  at: number
  payload?: Record<string, unknown>
}

// ─── Contract Definition ───────────────────────────────────────────────────────

export interface ToolUiContract<TOutput, TDecision = void> {
  toolName: string
  role: z.infer<typeof ToolUIRoleSchema>
  outputSchema: z.ZodType<TOutput>
  decisionSchema?: z.ZodType<TDecision>
  parse: (raw: unknown) => TOutput
  safeParse: (raw: unknown) => { success: boolean; data?: TOutput; error?: z.ZodError }
}

export function defineToolUiContract<TOutput, TDecision = void>(config: {
  toolName: string
  role?: z.infer<typeof ToolUIRoleSchema>
  outputSchema: z.ZodType<TOutput>
  decisionSchema?: z.ZodType<TDecision>
}): ToolUiContract<TOutput, TDecision> {
  return {
    toolName: config.toolName,
    role: config.role ?? "information",
    outputSchema: config.outputSchema,
    decisionSchema: config.decisionSchema,
    parse: (raw: unknown) => config.outputSchema.parse(raw),
    safeParse: (raw: unknown) => {
      const result = config.outputSchema.safeParse(raw)
      if (result.success) {
        return { success: true, data: result.data }
      }
      return { success: false, error: result.error }
    },
  }
}