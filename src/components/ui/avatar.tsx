"use client"

import * as React from "react"
import Image from "next/image"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { User } from "lucide-react"

const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full bg-earth-100",
  {
    variants: {
      size: {
        xs: "h-6 w-6",
        sm: "h-8 w-8",
        md: "h-10 w-10",
        lg: "h-12 w-12",
        xl: "h-16 w-16",
        "2xl": "h-20 w-20",
      },
      ring: {
        none: "",
        saffron: "ring-2 ring-saffron-500 ring-offset-2",
        gold: "ring-2 ring-gold-500 ring-offset-2",
        white: "ring-2 ring-white ring-offset-2",
      },
    },
    defaultVariants: {
      size: "md",
      ring: "none",
    },
  }
)

const iconSizes = {
  xs: "h-3 w-3",
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
  xl: "h-8 w-8",
  "2xl": "h-10 w-10",
}

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string | null
  alt?: string
  fallback?: string
}

function Avatar({
  className,
  size = "md",
  ring,
  src,
  alt = "Avatar",
  fallback,
  ...props
}: AvatarProps) {
  const [hasError, setHasError] = React.useState(false)

  const initials = React.useMemo(() => {
    if (!fallback) return null
    const parts = fallback.split(" ")
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return fallback.slice(0, 2).toUpperCase()
  }, [fallback])

  return (
    <div
      className={cn(avatarVariants({ size, ring }), className)}
      {...props}
    >
      {src && !hasError ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          onError={() => setHasError(true)}
        />
      ) : initials ? (
        <div className="flex h-full w-full items-center justify-center bg-saffron-100 text-saffron-700 font-medium text-sm">
          {initials}
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-earth-100">
          <User className={cn("text-earth-400", iconSizes[size || "md"])} />
        </div>
      )}
    </div>
  )
}

interface AvatarGroupProps {
  avatars: Array<{ src?: string | null; alt?: string; fallback?: string }>
  max?: number
  size?: VariantProps<typeof avatarVariants>["size"]
  className?: string
}

function AvatarGroup({ avatars, max = 4, size = "md", className }: AvatarGroupProps) {
  const visible = avatars.slice(0, max)
  const remaining = avatars.length - max

  return (
    <div className={cn("flex -space-x-2", className)}>
      {visible.map((avatar, i) => (
        <Avatar
          key={i}
          src={avatar.src}
          alt={avatar.alt}
          fallback={avatar.fallback}
          size={size}
          ring="white"
          className="border-2 border-white"
        />
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            avatarVariants({ size }),
            "flex items-center justify-center bg-earth-200 text-earth-600 text-xs font-medium border-2 border-white"
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  )
}

export { Avatar, AvatarGroup }
