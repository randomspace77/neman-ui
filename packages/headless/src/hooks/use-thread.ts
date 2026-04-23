"use client"

import { useChatContext } from "../context/chat-provider"
import type { ThreadState, ThreadActions } from "../types"

/**
 * Access the thread state and actions.
 * Returns null if no NemanChatProvider is present (presentational mode).
 */
export function useThread(): (ThreadState & ThreadActions) | null {
  const ctx = useChatContext()
  if (!ctx) return null
  return ctx.thread
}

/**
 * Access the thread state and actions.
 * Throws if no NemanChatProvider is present.
 */
export function useThreadRequired(): ThreadState & ThreadActions {
  const thread = useThread()
  if (!thread) {
    throw new Error("useThreadRequired must be used within a <NemanChatProvider>")
  }
  return thread
}