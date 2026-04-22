import * as React from "react"
import { cn } from "@/lib/utils"

function Textarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-[80px] w-full rounded-[22px] border border-border bg-fill-subtle px-4 py-3 text-base text-foreground transition-[color,border-color] duration-300 outline-none placeholder:text-muted-foreground disabled:pointer-events-none disabled:bg-fill-medium disabled:text-muted-foreground md:text-sm",
        "focus-visible:border-foreground/20 focus-visible:ring-[3px] focus-visible:ring-ring/30",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }