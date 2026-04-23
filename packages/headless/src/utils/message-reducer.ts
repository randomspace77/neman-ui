import type {
  Message,
  UserMessagePart,
  AssistantMessagePart,
  AssistantMessagePart as APart,
  ToolCallState,
} from "../types"

// ─── Helpers ──────────────────────────────────────────────────────────────────

let nextId = 1
export function createId(): string {
  return `msg-${Date.now()}-${nextId++}`
}

export function createUserMessage(
  text: string,
  attachments?: Array<{ name: string; url: string; mimeType: string }>,
): Message {
  const parts: UserMessagePart[] = [{ type: "text", text }]
  if (attachments) {
    for (const att of attachments) {
      if (att.mimeType.startsWith("image/")) {
        parts.push({ type: "image", image: att.url, alt: att.name })
      } else {
        parts.push({ type: "file", name: att.name, url: att.url, mimeType: att.mimeType })
      }
    }
  }
  return {
    id: createId(),
    role: "user",
    parts,
    status: "complete",
    createdAt: Date.now(),
  }
}

export function createAssistantMessage(): Message {
  return {
    id: createId(),
    role: "assistant",
    parts: [],
    status: "running",
    createdAt: Date.now(),
  }
}

export function updateAssistantPart(
  message: Message,
  predicate: (part: APart) => boolean,
  updates: Partial<APart>,
): Message {
  if (message.role !== "assistant") return message
  return {
    ...message,
    parts: (message.parts as APart[]).map((part) =>
      predicate(part) ? ({ ...part, ...updates } as typeof part) : part,
    ) as Message['parts'],
  }
}

export function findToolCallPart(
  message: Message,
  toolCallId: string,
): APart & { type: "tool-call" } | undefined {
  if (message.role !== "assistant") return undefined
  return (message.parts as APart[]).find(
    (p): p is APart & { type: "tool-call" } =>
      p.type === "tool-call" && (p as any).toolCallId === toolCallId,
  ) as APart & { type: "tool-call" } | undefined
}

export function appendPart(message: Message, part: APart): Message {
  if (message.role !== "assistant") return message
  return {
    ...message,
    parts: [...(message.parts as APart[]), part],
  }
}