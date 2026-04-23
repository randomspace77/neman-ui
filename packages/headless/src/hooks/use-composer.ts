"use client"

import { useChatContext } from "../context/chat-provider"
import type { ComposerState, ComposerActions } from "../types"

/**
 * Access the composer state and actions.
 * Returns null if no NemanChatProvider is present (presentational mode).
 */
export function useComposer(): (ComposerState & ComposerActions) | null {
  const ctx = useChatContext()
  if (!ctx) return null
  return ctx.composer
}

/**
 * Access the composer state and actions.
 * Throws if no NemanChatProvider is present.
 */
export function useComposerRequired(): ComposerState & ComposerActions {
  const composer = useComposer()
  if (!composer) {
    throw new Error("useComposerRequired must be used within a <NemanChatProvider>")
  }
  return composer
}