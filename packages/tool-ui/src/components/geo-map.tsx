"use client"

import * as React from "react"
import { z } from "zod"
import { cn } from "./_adapter"
import { defineToolUiContract } from "../contracts/define-tool-ui-contract"

// ─── Schemas ──────────────────────────────────────────────────────────────────

const GeoCoordinateSchema = z.object({
  lat: z.number(),
  lng: z.number(),
})

const GeoMarkerSchema = z.object({
  position: GeoCoordinateSchema,
  label: z.string().optional(),
  description: z.string().optional(),
  color: z.string().optional(),
})

export const SerializableGeoMapSchema = z.object({
  center: GeoCoordinateSchema.optional(),
  zoom: z.number().optional(),
  markers: z.array(GeoMarkerSchema),
  title: z.string().optional(),
  style: z.enum(["light", "dark", "satellite"]).optional(),
  interactive: z.boolean().optional(),
})

export type SerializableGeoMap = z.infer<typeof SerializableGeoMapSchema>

export const GeoMapContract = defineToolUiContract({
  toolName: "geo_map",
  role: "information",
  outputSchema: SerializableGeoMapSchema,
})

// ─── GeoMap Component ──────────────────────────────────────────────────────────

function GeoMap({
  center,
  zoom: zoomProp,
  markers,
  title,
  interactive = false,
  className,
  ...props
}: React.ComponentProps<"div"> & SerializableGeoMap) {
  const zoom = zoomProp ?? 13
  const mapCenter = center ?? markers[0]?.position ?? { lat: 40.7128, lng: -74.006 }

  // Create a static map URL for the embedded view (OpenStreetMap-based)
  // We render a visual representation with markers positioned using CSS
  const [selectedMarker, setSelectedMarker] = React.useState<number | null>(null)

  // Calculate bounding box for markers
  const latRange = markers.length > 0
    ? { min: Math.min(...markers.map((m) => m.position.lat)), max: Math.max(...markers.map((m) => m.position.lat)) }
    : { min: mapCenter.lat - 0.01, max: mapCenter.lat + 0.01 }
  const lngRange = markers.length > 0
    ? { min: Math.min(...markers.map((m) => m.position.lng)), max: Math.max(...markers.map((m) => m.position.lng)) }
    : { min: mapCenter.lng - 0.01, max: mapCenter.lng + 0.01 }

  // Add padding
  const latPad = (latRange.max - latRange.min) * 0.1 || 0.005
  const lngPad = (lngRange.max - lngRange.min) * 0.1 || 0.005

  const latMin = latRange.min - latPad
  const latMax = latRange.max + latPad
  const lngMin = lngRange.min - lngPad
  const lngMax = lngRange.max + lngPad

  return (
    <div
      data-slot="geo-map"
      className={cn("rounded-[22px] border border-border/50 bg-card overflow-hidden", className)}
      {...props}
    >
      {title && (
        <div className="px-4 py-2.5 border-b border-border/30">
          <h4 className="text-label-primary-bold">{title}</h4>
        </div>
      )}

      {/* Map visualization */}
      <div className="relative w-full aspect-[16/10] bg-muted/20 overflow-hidden">
        {/* Grid lines */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <defs>
            <pattern id="mapGrid" width="10%" height="10%" patternUnits="objectBoundingBox">
              <path d="M 1 0 L 0 0 0 1" fill="none" stroke="var(--color-border)" strokeWidth="0.5" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mapGrid)" />
        </svg>

        {/* Markers */}
        {markers.map((marker, i) => {
          const latPct = (marker.position.lat - latMin) / (latMax - latMin) * 100
          const lngPct = (marker.position.lng - lngMin) / (lngMax - lngMin) * 100

          // Invert Y axis (lat increases upward but CSS y increases downward)
          const bottom = `${latPct}%`
          const left = `${lngPct}%`

          return (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedMarker(selectedMarker === i ? null : i)}
              className="absolute -translate-x-1/2 -translate-y-full group"
              style={{ bottom, left }}
            >
              {/* Pin */}
              <div className={cn(
                "flex items-center justify-center transition-transform duration-150",
                interactive && "hover:scale-110 cursor-pointer",
              )}>
                <svg width="24" height="32" viewBox="0 0 24 32" aria-hidden="true">
                  <path
                    d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20C24 5.4 18.6 0 12 0z"
                    fill={marker.color ?? "var(--color-brand)"}
                  />
                  <circle cx="12" cy="12" r="4" fill="var(--color-card)" />
                </svg>
              </div>
              {/* Label */}
              {marker.label && !selectedMarker && selectedMarker !== 0 && (
                <span className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-[8px] bg-card px-2 py-0.5 text-[10px] font-[590] shadow-[var(--shadow-drop-2)]">
                  {marker.label}
                </span>
              )}
            </button>
          )
        })}

        {/* Coordinate display */}
        <div className="absolute bottom-2 right-2 rounded-[8px] bg-foreground/70 px-2 py-0.5 text-[10px] text-card tabular-nums">
          {mapCenter.lat.toFixed(4)}, {mapCenter.lng.toFixed(4)}
        </div>

        {/* Zoom badge */}
        <div className="absolute top-2 left-2 rounded-[8px] bg-foreground/70 px-2 py-0.5 text-[10px] text-card">
          z{zoom}
        </div>
      </div>

      {/* Selected marker info */}
      {selectedMarker != null && markers[selectedMarker] && (
        <div className="border-t border-border/30 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <div
              className="size-3 rounded-full shrink-0"
              style={{ backgroundColor: markers[selectedMarker].color ?? "var(--color-brand)" }}
            />
            <span className="text-label-primary-bold">
              {markers[selectedMarker].label ?? `Marker ${selectedMarker + 1}`}
            </span>
          </div>
          {markers[selectedMarker].description && (
            <p className="text-label-secondary text-muted-foreground mt-0.5">
              {markers[selectedMarker].description}
            </p>
          )}
          <span className="text-[10px] text-muted-foreground tabular-nums">
            {markers[selectedMarker].position.lat.toFixed(6)}, {markers[selectedMarker].position.lng.toFixed(6)}
          </span>
        </div>
      )}
    </div>
  )
}

export { GeoMap }