"use client"

import { useCallback, useRef, useState } from "react"
import type { AttachmentAdapter, DropzoneState } from "../types/attachment"
import type { Attachment } from "../types/message"

// ─── useDropzone ────────────────────────────────────────────────────────────
// Provides drag-and-drop + click-to-upload functionality.
// Wire it to the composer's addAttachment/removeAttachment actions.

interface UseDropzoneOptions {
  /** The attachment adapter to handle uploads */
  adapter?: AttachmentAdapter
  /** Callback when files are added (receives the processed attachments) */
  onFilesAdded?: (attachments: Attachment[]) => void
  /** Callback when a file is rejected (validation failure) */
  onFilesRejected?: (errors: string[]) => void
  /** Whether the dropzone is disabled */
  disabled?: boolean
}

interface UseDropzoneReturn extends DropzoneState {
  /** Props to spread onto the dropzone container element */
  getRootProps: () => {
    onDragEnter: (e: React.DragEvent) => void
    onDragOver: (e: React.DragEvent) => void
    onDragLeave: (e: React.DragEvent) => void
    onDrop: (e: React.DragEvent) => void
    onClick: () => void
    role: "button"
    tabIndex: number
    "data-drag-over": boolean
  }
  /** Props to spread onto the hidden file input */
  getInputProps: () => {
    type: "file"
    accept?: string
    multiple?: boolean
    style: React.CSSProperties
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    ref: React.RefObject<HTMLInputElement | null>
  }
  /** Programmatically open the file picker */
  openFilePicker: () => void
  /** Process an array of files through the adapter */
  addFiles: (files: File[]) => Promise<void>
}

export function useDropzone(options: UseDropzoneOptions = {}): UseDropzoneReturn {
  const { adapter, onFilesAdded, onFilesRejected, disabled = false } = options
  const [isDragOver, setIsDragOver] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement | null>(null)
  const dragCounterRef = useRef(0)

  const addFiles = useCallback(
    async (files: File[]) => {
      if (disabled) return

      const maxSize = adapter?.maxSize
      const maxFiles = adapter?.maxFiles
      const validationErrors: string[] = []
      const validFiles: File[] = []

      for (const file of files) {
        // Validate individual file
        if (adapter?.validate) {
          const error = adapter.validate(file)
          if (error) {
            validationErrors.push(`${file.name}: ${error}`)
            continue
          }
        }

        // Check size limit
        if (maxSize && file.size > maxSize) {
          validationErrors.push(`${file.name}: File too large (max ${Math.round(maxSize / 1024 / 1024)}MB)`)
          continue
        }

        validFiles.push(file)
      }

      if (validationErrors.length > 0) {
        setErrors((prev) => [...prev, ...validationErrors])
        onFilesRejected?.(validationErrors)
      }

      // Enforce max files
      const filesToProcess = maxFiles ? validFiles.slice(0, maxFiles) : validFiles

      const attachments: Attachment[] = []
      for (const file of filesToProcess) {
        const attachment: Attachment = {
          id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          name: file.name,
          mimeType: file.type || "application/octet-stream",
          size: file.size,
          status: "uploading",
          progress: 0,
          file,
        }

        if (adapter?.upload) {
          try {
            const uploaded = await adapter.upload(file, attachment)
            attachments.push(uploaded)
          } catch {
            attachments.push({ ...attachment, status: "error" })
          }
        } else {
          // No adapter: mark as complete with object URL
          attachments.push({
            ...attachment,
            status: "complete",
            progress: 100,
            url: URL.createObjectURL(file),
          })
        }
      }

      if (attachments.length > 0) {
        onFilesAdded?.(attachments)
      }
    },
    [adapter, disabled, onFilesAdded, onFilesRejected],
  )

  const handleDragEnter = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      dragCounterRef.current++
      if (dragCounterRef.current === 1) {
        setIsDragOver(true)
      }
    },
    [],
  )

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
    },
    [],
  )

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      dragCounterRef.current--
      if (dragCounterRef.current === 0) {
        setIsDragOver(false)
      }
    },
    [],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      dragCounterRef.current = 0
      setIsDragOver(false)
      setErrors([])

      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) {
        addFiles(files)
      }
    },
    [addFiles],
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files ? Array.from(e.target.files) : []
      if (files.length > 0) {
        addFiles(files)
      }
      // Reset input so same file can be selected again
      e.target.value = ""
    },
    [addFiles],
  )

  const openFilePicker = useCallback(() => {
    inputRef.current?.click()
  }, [])

  return {
    isDragOver,
    errors,
    getRootProps: () => ({
      onDragEnter: handleDragEnter,
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
      onClick: openFilePicker,
      role: "button" as const,
      tabIndex: 0,
      "data-drag-over": isDragOver,
    }),
    getInputProps: () => ({
      type: "file" as const,
      accept: adapter?.accept,
      multiple: adapter?.multiple ?? true,
      style: { display: "none" },
      onChange: handleInputChange,
      ref: inputRef,
    }),
    openFilePicker,
    addFiles,
  }
}