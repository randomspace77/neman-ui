"use client"

import * as React from "react"
import { z } from "zod"
import { cn } from "./_adapter"
import { defineToolUiContract } from "../contracts/define-tool-ui-contract"

// ─── Schemas ──────────────────────────────────────────────────────────────────

const HourlyForecastSchema = z.object({
  time: z.string(),
  temp: z.number(),
  condition: z.enum(["sunny", "partly_cloudy", "cloudy", "rainy", "stormy", "snowy", "foggy", "windy"]),
})

const DailyForecastSchema = z.object({
  day: z.string(),
  high: z.number(),
  low: z.number(),
  condition: z.enum(["sunny", "partly_cloudy", "cloudy", "rainy", "stormy", "snowy", "foggy", "windy"]),
})

export const SerializableWeatherWidgetSchema = z.object({
  location: z.string(),
  currentTemp: z.number(),
  condition: z.enum(["sunny", "partly_cloudy", "cloudy", "rainy", "stormy", "snowy", "foggy", "windy"]),
  high: z.number().optional(),
  low: z.number().optional(),
  humidity: z.number().optional(),
  windSpeed: z.number().optional(),
  windDir: z.string().optional(),
  uvIndex: z.number().optional(),
  feelsLike: z.number().optional(),
  units: z.enum(["celsius", "fahrenheit"]).optional(),
  hourly: z.array(HourlyForecastSchema).optional(),
  daily: z.array(DailyForecastSchema).optional(),
})

export type SerializableWeatherWidget = z.infer<typeof SerializableWeatherWidgetSchema>

export const WeatherWidgetContract = defineToolUiContract({
  toolName: "weather_widget",
  role: "information",
  outputSchema: SerializableWeatherWidgetSchema,
})

// ─── Helpers ──────────────────────────────────────────────────────────────────

const conditionIcons: Record<string, { svg: React.ReactNode; label: string }> = {
  sunny: {
    label: "Sunny",
    svg: <circle cx="12" cy="12" r="5" fill="currentColor" />,
  },
  partly_cloudy: {
    label: "Partly Cloudy",
    svg: (
      <>
        <circle cx="9" cy="10" r="4" fill="currentColor" />
        <path d="M10 16H18C19.66 16 21 14.66 21 13C21 11.34 19.66 10 18 10H17.5C17.18 8.27 15.66 7 13.84 7C12.35 7 11.07 7.86 10.46 9.1" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </>
    ),
  },
  cloudy: {
    label: "Cloudy",
    svg: <path d="M6 19H18C20.21 19 22 17.21 22 15C22 12.79 20.21 11 18 11H17.5C17.18 8.27 15.66 7 13.84 7C12.35 7 11.07 7.86 10.46 9.1C10.1 9.04 9.73 9 9.35 9C6.91 9 4.93 10.98 4.93 13.42C4.93 13.62 4.94 13.83 4.97 14.03C3.86 14.55 3.09 15.68 3.09 17C3.09 18.1 4 19 6 19Z" fill="currentColor" />,
  },
  rainy: {
    label: "Rainy",
    svg: (
      <>
        <path d="M6 13H18C20.21 13 22 11.21 22 9C22 6.79 20.21 5 18 5H17.5C17.18 2.27 14 1 12 2C10 1 7 2.27 6.46 4.1C3.86 4.55 3 6.68 3 9C3 11.21 3.79 13 6 13Z" fill="currentColor" opacity="0.6" />
        <path d="M8 16L7 20M12 15L11 19M16 16L15 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
  },
  stormy: {
    label: "Stormy",
    svg: (
      <>
        <path d="M6 11H18C20.21 11 22 9.21 22 7C22 4.79 20.21 3 18 3H17.5C17.18 0.27 14 0 12 0C10 0 7 0.27 6.46 2.1C3.86 2.55 3 4.68 3 7C3 9.21 3.79 11 6 11Z" fill="currentColor" opacity="0.5" transform="translate(0 3)" />
        <path d="M13 14L10 21H13L11 27" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  snowy: {
    label: "Snowy",
    svg: (
      <>
        <path d="M6 13H18C20.21 13 22 11.21 22 9C22 6.79 20.21 5 18 5H17.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <circle cx="8" cy="17" r="1.5" fill="currentColor" />
        <circle cx="13" cy="19" r="1.5" fill="currentColor" />
        <circle cx="17" cy="16" r="1.5" fill="currentColor" />
      </>
    ),
  },
  foggy: {
    label: "Foggy",
    svg: (
      <>
        <path d="M4 10H20M4 14H20M4 18H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
  },
  windy: {
    label: "Windy",
    svg: (
      <>
        <path d="M3 8H16C17.66 8 19 6.66 19 5C19 3.34 17.66 2 16 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M3 12H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M3 16H13C14.66 16 16 17.34 16 19C16 20.66 14.66 22 13 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
  },
}

function formatTemp(temp: number, units: string): string {
  return `${Math.round(temp)}°${units === "fahrenheit" ? "F" : "C"}`
}

// ─── WeatherWidget Component ──────────────────────────────────────────────────

function WeatherWidget({
  location,
  currentTemp,
  condition,
  high,
  low,
  humidity,
  windSpeed,
  windDir,
  uvIndex,
  feelsLike,
  units = "celsius",
  hourly,
  daily,
  className,
  ...props
}: React.ComponentProps<"div"> & SerializableWeatherWidget) {
  const condInfo = conditionIcons[condition] ?? conditionIcons.cloudy

  return (
    <div
      data-slot="weather-widget"
      className={cn("rounded-[22px] border border-border/50 bg-card overflow-hidden shadow-[var(--shadow-card)] transition-all duration-300", className)}
      {...props}
    >
      {/* Current */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-label-primary-bold">{location}</h4>
            <div className="text-headline-tertiary">
              {formatTemp(currentTemp, units)}
            </div>
            <div className="flex items-center gap-2 text-label-secondary text-muted-foreground">
              <span>{condInfo.label}</span>
              {feelsLike != null && <span>· Feels like {formatTemp(feelsLike, units)}</span>}
            </div>
          </div>
          <div className="text-foreground opacity-80">
            <svg width="48" height="48" viewBox="0 0 24 24" aria-hidden="true">
              {condInfo.svg}
            </svg>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex gap-4 mt-3 text-label-primary">
          {high != null && low != null && (
            <span className="text-muted-foreground">
              H: {formatTemp(high, units)} L: {formatTemp(low, units)}
            </span>
          )}
          {humidity != null && <span className="text-muted-foreground">💧 {humidity}%</span>}
          {windSpeed != null && <span className="text-muted-foreground">💨 {windSpeed} km/h{windDir ? ` ${windDir}` : ""}</span>}
          {uvIndex != null && <span className="text-muted-foreground">☀ UV {uvIndex}</span>}
        </div>
      </div>

      {/* Hourly forecast */}
      {hourly && hourly.length > 0 && (
        <div className="border-t border-border/30 px-4 py-2.5">
          <div className="flex gap-4 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {hourly.slice(0, 8).map((h, i) => {
              const hCond = conditionIcons[h.condition] ?? conditionIcons.cloudy
              return (
                <div key={i} className="flex flex-col items-center gap-1 shrink-0">
                  <span className="text-label-primary text-muted-foreground">{h.time}</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" className="text-muted-foreground" aria-hidden="true">
                    {hCond.svg}
                  </svg>
                  <span className="text-label-primary-bold">{formatTemp(h.temp, units)}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Daily forecast */}
      {daily && daily.length > 0 && (
        <div className="border-t border-border/30 px-4 py-2.5">
          <div className="space-y-1.5">
            {daily.slice(0, 5).map((d, i) => {
              const dCond = conditionIcons[d.condition] ?? conditionIcons.cloudy
              return (
                <div key={i} className="flex items-center gap-3 text-label-secondary">
                  <span className="w-10 text-muted-foreground">{d.day}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" className="text-muted-foreground shrink-0" aria-hidden="true">
                    {dCond.svg}
                  </svg>
                  <span className="text-muted-foreground w-10 text-right">{formatTemp(d.low, units)}</span>
                  <div className="flex-1 h-1 rounded-full bg-border/30 relative overflow-hidden">
                    <div
                      className="absolute left-0 top-0 h-full rounded-full bg-primary"
                      style={{
                        width: `${((d.high - d.low) / (high! - low! + 1)) * 100}%`,
                        left: `${((d.low - low!) / (high! - low! + 1)) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="w-10 font-[590]">{formatTemp(d.high, units)}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export { WeatherWidget }