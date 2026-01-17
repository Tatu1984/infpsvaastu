import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-saffron-100 text-saffron-800",
        secondary: "bg-earth-100 text-earth-800",
        success: "bg-green-100 text-green-800",
        warning: "bg-amber-100 text-amber-800",
        destructive: "bg-red-100 text-red-800",
        outline: "border border-earth-300 text-earth-700 bg-transparent",
        premium: "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-sm",
        featured: "bg-gradient-to-r from-saffron-500 to-gold-500 text-white shadow-sm",
        gold: "bg-gold-100 text-gold-800 border border-gold-300",
        vastu: "bg-saffron-50 text-saffron-700 border border-saffron-200",
        "east-facing": "bg-green-50 text-green-700 border border-green-200",
        "vastu-compliant": "bg-gradient-to-r from-saffron-100 to-gold-100 text-saffron-800 border border-saffron-200",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-[10px]",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode
}

function Badge({ className, variant, size, icon, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </div>
  )
}

export { Badge, badgeVariants }
