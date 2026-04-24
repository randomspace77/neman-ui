"use client"

import * as React from "react"
import { z } from "zod"
import { cn } from "./_adapter"
import { defineToolUiContract } from "../contracts/define-tool-ui-contract"
import { useControllableState } from "../utils/hooks"
import type { ToolUIReceipt } from "../contracts/define-tool-ui-contract"

// ─── Schemas ──────────────────────────────────────────────────────────────────

export const SerializableMessageDraftSchema = z.object({
  title: z.string().optional(),
  body: z.string(),
  placeholder: z.string().optional(),
  maxLength: z.number().optional(),
  recipient: z.string().optional(),
  tone: z.enum(["professional", "casual", "friendly", "formal"]).optional(),
})

export type SerializableMessageDraft = z.infer<typeof SerializableMessageDraftSchema>

export const MessageDraftContract = defineToolUiContract({
  toolName: "message_draft",
  role: "control",
  outputSchema: SerializableMessageDraftSchema,
})

// ─── MessageDraft Component ────────────────────────────────────────────────────

const toneLabels: Record<string, string> = {
  professional: "Professional",
  casual: "Casual",
  friendly: "Friendly",
  formal: "Formal",
}

function MessageDraft({
  title,
  body: bodyProp,
  placeholder,
  maxLength,
  recipient,
  tone: toneProp,
  onChange,
  onSend,
  receipt,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "onChange"> & SerializableMessageDraft & {
  onChange?: (body: string) => void
  onSend?: (body: string) => void
  receipt?: ToolUIReceipt
}) {
  const { value: body, setValue: setBody } = useControllableState({
    value: bodyProp,
    defaultValue: bodyProp ?? "",
    onChange,
  })

  const [tone, setTone] = React.useState<string>(toneProp ?? "professional")
  const isReadonly = receipt != null
  const charCount = body.length
  const isOverLimit = maxLength != null && charCount > maxLength

  return (
    <div
      data-slot="message-draft"
      className={cn(
        "rounded-[22px] border border-border/50 bg-card overflow-hidden shadow-[var(--shadow-card)] transition-all duration-300",
        isReadonly && "opacity-80",
        className
      )}
      {...props}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/30">
        <h4 className="text-label-primary-bold">{title ?? "Message Draft"}</h4>
        <div className="flex items-center gap-1">
          {Object.keys(toneLabels).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTone(t)}
              disabled={isReadonly}
              className={cn(
                "rounded-lg px-2 py-0.5 text-label-primary-bold transition-colors duration-200",
                tone === t
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {toneLabels[t]}
            </button>
          ))}
        </div>
      </div>

      {/* Recipient */}
      {recipient && (
        <div className="px-4 py-2 border-b border-border/20 bg-fill-subtle">
          <span className="text-label-secondary text-muted-foreground">To: </span>
          <span className="text-label-primary">{recipient}</span>
        </div>
      )}

      {/* Body */}
      <div className="p-3">
        {isReadonly ? (
          <div className="text-body-secondary whitespace-pre-wrap">{body}</div>
        ) : (
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={placeholder ?? "Write your message..."}
            maxLength={maxLength ?? undefined}
            className="w-full min-h-[120px] resize-y rounded-2xl border border-border/40 bg-transparent px-3 py-2 text-body-primary text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground/20"
          />
        )}
        {maxLength != null && (
          <div className={cn("text-label-primary mt-1 text-right", isOverLimit ? "text-destructive" : "text-muted-foreground")}>
            {charCount}/{maxLength}
          </div>
        )}
      </div>

      {/* Actions */}
      {!isReadonly && (
        <div className="flex justify-end px-4 py-2.5 border-t border-border/30">
          <button
            type="button"
            onClick={() => onSend?.(body)}
            disabled={!body.trim()}
            className="rounded-xl bg-primary text-primary-foreground px-4 py-2 text-label-secondary-bold transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      )}
    </div>
  )
}

export { MessageDraft }