import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-xs font-[590] whitespace-nowrap transition-[color,background-color] duration-300 [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:opacity-80",
        secondary: "bg-fill-subtle text-foreground hover:bg-fill-medium",
        destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20",
        outline: "border-border text-foreground hover:bg-fill-subtle",
        blue: "bg-primary/10 text-primary hover:bg-primary/20",
        success: "bg-success/10 text-success hover:bg-success/20",
        warning: "bg-warning/10 text-warning hover:bg-warning/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }