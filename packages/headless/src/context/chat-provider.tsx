"use client"

import React, {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react"
import type {
  Message,
  Attachment,
  ChatAdapter,
  ChatContextValue,
  ThreadState,
  ThreadActions,
  ComposerState,
  ComposerActions,
  AssistantMessagePart,
  ToolCallState,
} from "../types"
import { BranchStore } from "../utils/branch-store"
import {
  createUserMessage,
  createAssistantMessage,
  updateAssistantPart,
  appendPart,
} from "../utils/message-reducer"
import { consumeStream } from "../utils/streaming"

// ─── Context ──────────────────────────────────────────────────────────────────

const ChatContext = createContext<ChatContextValue | null>(null)

export function useChatContext(): ChatContextValue | null {
  return useContext(ChatContext)
}

// ─── Provider ─────────────────────────────────────────────────────────────────

interface ChatProviderProps {
  adapter?: ChatAdapter
  initialMessages?: Message[]
  children: React.ReactNode
}

export function NemanChatProvider({
  adapter,
  initialMessages = [],
  children,
}: ChatProviderProps) {
  const branchStoreRef = useRef(new BranchStore())
  const abortControllerRef = useRef<AbortController | null>(null)

  // ── Thread State ────────────────────────────────────────────────────────
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])

  // Keep branch store in sync
  const storeRef = branchStoreRef.current
  for (const msg of initialMessages) {
    if (!storeRef) continue
  }

  // ── Composer State ──────────────────────────────────────────────────────
  const [composerText, setComposerText] = useState("")
  const [composerAttachments, setComposerAttachments] = useState<Attachment[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [isSending, setIsSending] = useState(false)

  // ── Streaming State ──────────────────────────────────────────────────────
  const [isStreaming, setIsStreaming] = useState(false)

  // ── Thread Actions ──────────────────────────────────────────────────────

  const append = useCallback(
    (message: Omit<Message, "id" | "createdAt">) => {
      const fullMessage: Message = {
        ...message,
        id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        createdAt: Date.now(),
      }
      setMessages((prev) => [...prev, fullMessage])
      return fullMessage.id
    },
    [],
  )

  const update = useCallback((messageId: string, updates: Partial<Message>) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, ...updates } : m)),
    )
  }, [])

  const remove = useCallback((messageId: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== messageId))
  }, [])

  const startRun = useCallback(
    async (options?: { parentId?: string; sourceId?: string; steer?: boolean }) => {
      if (!adapter) return

      const abortController = new AbortController()
      abortControllerRef.current = abortController
      setIsLoading(true)
      setIsStreaming(true)
      setError(null)

      // Add user message to conversation
      const userMsg = createUserMessage(composerText, undefined)

      setMessages((prev) => [...prev, userMsg])

      setComposerText("")
      setComposerAttachments([])
      setIsSending(true)

      try {
        // Use functional update to get latest messages, avoiding stale closure
        let currentMessages: Message[] = []
        setMessages((prev) => {
          currentMessages = [...prev, userMsg]
          return currentMessages
        })

        await consumeStream(adapter, currentMessages, abortController.signal, {
          onMessageStart: (msg) => {
            setMessages((prev) => [...prev, msg])
          },
          onMessageUpdate: (messageId, updates) => {
            setMessages((prev) =>
              prev.map((m) => (m.id === messageId ? { ...m, ...updates } : m)),
            )
          },
          onMessagePartAppend: (messageId, part) => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === messageId
                  ? { ...m, parts: [...(m.parts as AssistantMessagePart[]), part] as Message['parts'] }
                  : m,
              ),
            )
          },
          onMessagePartUpdate: (messageId, predicate, updates) => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === messageId
                  ? {
                      ...m,
                      parts: (m.parts as AssistantMessagePart[]).map((p) =>
                        predicate(p) ? ({ ...p, ...updates } as typeof p) : p,
                      ) as Message['parts'],
                    }
                  : m,
              ),
            )
          },
          onMessageComplete: () => {
            // Stream complete for this message
          },
          onError: (_messageId, err) => {
            setError(err)
          },
        })
      } catch (err) {
        if (!abortController.signal.aborted) {
          setError(err instanceof Error ? err : new Error(String(err)))
        }
      } finally {
        setIsLoading(false)
        setIsStreaming(false)
        setIsSending(false)
        abortControllerRef.current = null
      }
    },
    [adapter, messages, composerText],
  )

  const cancelRun = useCallback(() => {
    abortControllerRef.current?.abort()
    setIsLoading(false)
    setIsStreaming(false)
    setIsSending(false)
  }, [])

  const switchBranch = useCallback((messageId: string, branchIndex: number) => {
    // Simplified: For full branching, use BranchStore
    // This is a placeholder that works with flat message arrays
  }, [])

  const getBranchInfo = useCallback(
    (messageId: string) => {
      const msg = messages.find((m) => m.id === messageId)
      return {
        current: (msg?.branchNumber ?? 1) - 1,
        total: msg?.branchCount ?? 1,
      }
    },
    [messages],
  )

  const clearError = useCallback(() => setError(null), [])

  // ── Composer Actions ────────────────────────────────────────────────────

  const addAttachment = useCallback(async (file: File) => {
    const attachment: Attachment = {
      id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: file.name,
      mimeType: file.type,
      size: file.size,
      status: "uploading",
      progress: 0,
      file,
    }
    setComposerAttachments((prev) => [...prev, attachment])

    // Simulate upload completion
    // In a real adapter, this would call an upload function
    setTimeout(() => {
      setComposerAttachments((prev) =>
        prev.map((a) =>
          a.id === attachment.id
            ? { ...a, status: "complete" as const, progress: 100, url: URL.createObjectURL(file) }
            : a,
        ),
      )
    }, 500)
  }, [])

  const removeAttachment = useCallback((id: string) => {
    setComposerAttachments((prev) => prev.filter((a) => a.id !== id))
  }, [])

  const clearAttachments = useCallback(() => {
    setComposerAttachments([])
  }, [])

  const send = useCallback(() => {
    if (!composerText.trim() && composerAttachments.length === 0) return
    startRun()
  }, [composerText, composerAttachments, startRun])

  const cancel = useCallback(() => {
    cancelRun()
  }, [cancelRun])

  const startEdit = useCallback((messageId: string) => {
    const msg = messages.find((m) => m.id === messageId)
    if (msg && msg.role === "user") {
      const textPart = msg.parts.find((p): p is Extract<typeof p, { type: "text" }> => p.type === "text")
      setComposerText((textPart as { type: "text"; text: string } | undefined)?.text ?? "")
      setIsEditing(true)
      setEditingMessageId(messageId)
    }
  }, [messages])

  const cancelEdit = useCallback(() => {
    setIsEditing(false)
    setEditingMessageId(null)
    setComposerText("")
  }, [])

  const reset = useCallback(() => {
    setComposerText("")
    setComposerAttachments([])
    setIsEditing(false)
    setEditingMessageId(null)
  }, [])

  // ── Context Value ───────────────────────────────────────────────────────

  const contextValue = useMemo<ChatContextValue>(
    () => ({
      thread: {
        messages,
        isLoading,
        error,
        suggestions,
        append,
        update,
        remove,
        startRun,
        cancelRun,
        switchBranch,
        getBranchInfo,
        setSuggestions,
        clearError,
      },
      composer: {
        text: composerText,
        attachments: composerAttachments,
        isEditing,
        editingMessageId,
        isSending,
        setText: setComposerText,
        addAttachment,
        removeAttachment,
        clearAttachments,
        send,
        cancel,
        startEdit,
        cancelEdit,
        reset,
      },
      streaming: {
        isStreaming,
        abort: cancelRun,
      },
    }),
    [
      messages, isLoading, error, suggestions,
      append, update, remove, startRun, cancelRun,
      switchBranch, getBranchInfo, setSuggestions, clearError,
      composerText, composerAttachments, isEditing, editingMessageId, isSending,
      setComposerText, addAttachment, removeAttachment, clearAttachments,
      send, cancel, startEdit, cancelEdit, reset,
      isStreaming, cancelRun,
    ],
  )

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  )
}