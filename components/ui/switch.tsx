"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"

function Switch({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch inline-flex shrink-0 items-center rounded-full transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-0 focus-visible:outline-none",
        "border data-[state=checked]:border-primary data-[state=unchecked]:border-border",
        "data-[size=default]:h-[22px] data-[size=default]:w-10 data-[size=default]:p-[2px]",
        "data-[size=sm]:h-[18px] data-[size=sm]:w-8 data-[size=sm]:p-[3px]",
        "data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block rounded-full bg-white shadow-[var(--shadow-drop-1)] transition-transform duration-300",
          "data-[state=checked]:translate-x-[18px] data-[state=unchecked]:translate-x-0",
          "group-data-[size=sm]/switch:data-[state=checked]:translate-x-[14px]",
          "group-data-[size=default]/switch:size-[18px] group-data-[size=sm]/switch:size-3"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }