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
        "flex min-h-[80px] w-full rounded-[22px] border border-border bg-fill-subtle p-4 text-base text-foreground transition-[color,border-color] duration-200 placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:outline-none focus-visible:border-foreground/20 disabled:pointer-events-none disabled:bg-fill-medium disabled:text-muted-foreground md:text-sm",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }