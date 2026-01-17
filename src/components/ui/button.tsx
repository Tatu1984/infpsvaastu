"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-saffron-500 text-white hover:bg-saffron-600 shadow-sm hover:shadow-md",
        saffron: "bg-saffron-500 text-white hover:bg-saffron-600 shadow-sm hover:shadow-md",
        gold: "bg-gold-500 text-white hover:bg-gold-600 shadow-sm hover:shadow-md",
        destructive: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
        outline: "border border-earth-300 bg-white hover:bg-earth-50 text-earth-700 hover:border-earth-400",
        "outline-saffron": "border-2 border-saffron-500 bg-transparent text-saffron-600 hover:bg-saffron-50",
        "outline-gold": "border-2 border-gold-500 bg-transparent text-gold-600 hover:bg-gold-50",
        secondary: "bg-earth-100 text-earth-900 hover:bg-earth-200",
        ghost: "hover:bg-earth-100 text-earth-700",
        "ghost-saffron": "hover:bg-saffron-50 text-saffron-600",
        link: "text-saffron-600 underline-offset-4 hover:underline",
        success: "bg-green-600 text-white hover:bg-green-700 shadow-sm",
        gradient: "bg-gradient-to-r from-saffron-500 to-gold-500 text-white hover:from-saffron-600 hover:to-gold-600 shadow-md hover:shadow-lg",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
