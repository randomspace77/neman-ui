"use client"

import * as React from "react"
import { z } from "zod"
import { cn } from "./_adapter"
import { defineToolUiContract } from "../contracts/define-tool-ui-contract"

// ─── Schemas ──────────────────────────────────────────────────────────────────

export const SerializableAudioSchema = z.object({
  src: z.string(),
  title: z.string().optional(),
  artist: z.string().optional(),
  duration: z.number().optional(),
  waveformData: z.array(z.number()).optional(),
})

export type SerializableAudio = z.infer<typeof SerializableAudioSchema>

export const AudioContract = defineToolUiContract({
  toolName: "audio",
  role: "information",
  outputSchema: SerializableAudioSchema,
})

// ─── Audio Component ─────────────────────────────────────────────────────────

function Audio({
  src,
  title,
  artist,
  duration,
  waveformData,
  className,
  ...props
}: React.ComponentProps<"div"> & SerializableAudio) {
  const audioRef = React.useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = React.useState(false)
  const [currentTime, setCurrentTime] = React.useState(0)
  const [progress, setProgress] = React.useState(0)

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
    } else {
      audio.play()
    }
    setPlaying(!playing)
  }

  const handleTimeUpdate = () => {
    const audio = audioRef.current
    if (!audio) return
    setCurrentTime(audio.currentTime)
    if (audio.duration) {
      setProgress((audio.currentTime / audio.duration) * 100)
    }
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    if (!audio) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = (e.clientX - rect.left) / rect.width
    audio.currentTime = pct * audio.duration
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${s.toString().padStart(2, "0")}`
  }

  // Generate visual waveform bars from waveformData or use default pattern
  const bars = React.useMemo(() => {
    if (waveformData && waveformData.length > 0) {
      return waveformData
    }
    // Default visual pattern
    return Array.from({ length: 40 }, (_, i) => 0.3 + 0.7 * Math.sin((i / 40) * Math.PI))
  }, [waveformData])

  return (
    <div
      data-slot="tool-audio"
      className={cn(
        "rounded-[22px] border border-border/50 bg-card p-4",
        className
      )}
      {...props}
    >
      <audio ref={audioRef} src={src} onTimeUpdate={handleTimeUpdate} onEnded={() => setPlaying(false)} />
      <div className="flex items-center gap-3">
        {/* Play/Pause button */}
        <button
          type="button"
          onClick={togglePlay}
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform duration-200 hover:opacity-90 active:scale-95"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <rect x="3" y="2" width="3.5" height="12" rx="1" />
              <rect x="9.5" y="2" width="3.5" height="12" rx="1" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M4 2L13 8L4 14V2Z" />
            </svg>
          )}
        </button>

        {/* Info + waveform + time */}
        <div className="flex-1 min-w-0 space-y-1">
          {(title || artist) && (
            <div className="flex items-baseline gap-1.5">
              {title && <span className="text-label-primary-bold truncate">{title}</span>}
              {artist && <span className="text-label-secondary text-muted-foreground truncate">{artist}</span>}
            </div>
          )}
          {/* Waveform / progress bar */}
          <div className="relative cursor-pointer" onClick={handleSeek}>
            <div className="flex items-end gap-[2px] h-8">
              {bars.map((bar, i) => {
                const barProgress = (i / bars.length) * 100
                const isPast = barProgress < progress
                return (
                  <div
                    key={i}
                    className={cn(
                      "flex-1 rounded-[1px] transition-colors duration-100 min-w-[2px]",
                      isPast ? "bg-primary" : "bg-border/40"
                    )}
                    style={{ height: `${Math.max(bar * 100, 15)}%` }}
                  />
                )
              })}
            </div>
          </div>
          {/* Time display */}
          <div className="flex justify-between text-label-primary text-muted-foreground tabular-nums">
            <span>{formatTime(currentTime)}</span>
            {duration != null && <span>{formatTime(duration)}</span>}
          </div>
        </div>
      </div>
    </div>
  )
}

export { Audio }