// ─── Attachment Adapter ────────────────────────────────────────────────────────
// Defines how files are uploaded. Users provide an implementation to integrate
// with their backend (S3, Cloudflare R2, local API, etc.)

import type { Attachment } from "./message"

export interface AttachmentAdapter {
  /** Accept pattern for file input (e.g. "image/*,.pdf") */
  accept?: string
  /** Maximum number of files that can be attached at once */
  maxFiles?: number
  /** Maximum file size in bytes */
  maxSize?: number
  /** Whether multiple files can be attached at once */
  multiple?: boolean

  /** Upload a single file. Return the updated attachment with url/thumbnailUrl set. */
  upload: (file: File, attachment: Attachment) => Promise<Attachment>
  /** Optional: remove a previously uploaded file (e.g. delete from storage) */
  remove?: (attachment: Attachment) => Promise<void>
  /** Optional: validate a file before upload starts. Return an error message or null. */
  validate?: (file: File) => string | null
}

export interface DropzoneState {
  /** Whether a drag is currently over the dropzone */
  isDragOver: boolean
  /** List of validation errors for rejected files */
  errors: string[]
}