import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full min-w-0 rounded-[22px] border border-border bg-fill-subtle px-4 text-base text-foreground transition-[color,border-color] duration-200 placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:outline-none focus-visible:border-foreground/20 disabled:pointer-events-none disabled:bg-fill-medium disabled:text-muted-foreground md:text-sm",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }