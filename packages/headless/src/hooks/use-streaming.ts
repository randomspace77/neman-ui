"use client"

import { useChatContext } from "../context/chat-provider"

/**
 * Access streaming state and abort control.
 * Returns null if no NemanChatProvider is present.
 */
export function useStreaming(): { isStreaming: boolean; abort: () => void } | null {
  const ctx = useChatContext()
  if (!ctx) return null
  return ctx.streaming
}

/**
 * Access streaming state and abort control.
 * Throws if no NemanChatProvider is present.
 */
export function useStreamingRequired(): { isStreaming: boolean; abort: () => void } {
  const streaming = useStreaming()
  if (!streaming) {
    throw new Error("useStreamingRequired must be used within a <NemanChatProvider>")
  }
  return streaming
}