import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 font-medium whitespace-nowrap transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-200 ease-out outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:opacity-80 active:scale-[0.98]",
        secondary:
          "bg-fill-subtle text-foreground hover:bg-fill-medium active:scale-[0.98] active:opacity-80",
        blue: "bg-brand text-brand-foreground hover:opacity-80 active:scale-[0.98] disabled:bg-brand/50",
        outline:
          "border border-border bg-background hover:bg-fill-subtle hover:text-foreground active:scale-[0.98] active:opacity-80",
        ghost:
          "hover:bg-fill-subtle hover:text-foreground active:scale-[0.98] active:opacity-80",
        destructive:
          "bg-destructive text-destructive-foreground hover:opacity-80 active:scale-[0.98]",
        link: "text-brand underline-offset-4 hover:underline active:opacity-70",
      },
      size: {
        default: "h-10 px-6 rounded-[22px]",
        sm: "h-8 px-4 rounded-md text-sm",
        lg: "h-[56px] px-6 rounded-[22px] text-base",
        icon: "size-10 rounded-full",
        "icon-sm": "size-8 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }