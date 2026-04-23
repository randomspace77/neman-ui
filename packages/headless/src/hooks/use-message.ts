"use client"

import { useChatContext } from "../context/chat-provider"
import type { Message } from "../types"

/**
 * Access a specific message by ID.
 * Returns null if no NemanChatProvider is present or message not found.
 */
export function useMessage(messageId: string): Message | null {
  const ctx = useChatContext()
  if (!ctx) return null
  return ctx.thread.messages.find((m) => m.id === messageId) ?? null
}

/**
 * Access a specific message by index in the thread.
 * Returns null if no NemanChatProvider is present or index out of bounds.
 */
export function useMessageByIndex(index: number): Message | null {
  const ctx = useChatContext()
  if (!ctx) return null
  return ctx.thread.messages[index] ?? null
}