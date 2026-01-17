"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

interface LogoProps {
  variant?: "full" | "compact" | "icon"
  size?: "sm" | "md" | "lg"
  className?: string
  showText?: boolean
  linkToHome?: boolean
}

const sizes = {
  sm: { icon: 32, text: "text-lg" },
  md: { icon: 40, text: "text-xl" },
  lg: { icon: 48, text: "text-2xl" },
}

function LogoIcon({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      {/* Gradient Definitions */}
      <defs>
        <linearGradient id="saffronGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B35" />
          <stop offset="100%" stopColor="#E55A24" />
        </linearGradient>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E5BE6A" />
          <stop offset="100%" stopColor="#D4A853" />
        </linearGradient>
      </defs>

      {/* Background Circle with Vastu Grid */}
      <circle cx="24" cy="24" r="23" fill="url(#saffronGradient)" />

      {/* Vastu Grid Lines (subtle) */}
      <g opacity="0.15" stroke="white" strokeWidth="0.5">
        <line x1="8" y1="24" x2="40" y2="24" />
        <line x1="24" y1="8" x2="24" y2="40" />
        <line x1="12" y1="12" x2="36" y2="36" />
        <line x1="36" y1="12" x2="12" y2="36" />
      </g>

      {/* House Shape - Modern Geometric */}
      <g>
        {/* Roof */}
        <path
          d="M24 11L12 21V22H36V21L24 11Z"
          fill="white"
        />

        {/* House Body */}
        <rect x="14" y="22" width="20" height="14" fill="white" />

        {/* Door */}
        <rect x="20" y="26" width="8" height="10" rx="1" fill="url(#saffronGradient)" />

        {/* Door Detail */}
        <circle cx="26" cy="31" r="1" fill="white" />

        {/* Windows */}
        <rect x="15" y="25" width="4" height="4" rx="0.5" fill="url(#goldGradient)" />
        <rect x="29" y="25" width="4" height="4" rx="0.5" fill="url(#goldGradient)" />
      </g>

      {/* Decorative corner elements (Vastu-inspired) */}
      <g opacity="0.3" fill="white">
        <circle cx="8" cy="8" r="2" />
        <circle cx="40" cy="8" r="2" />
        <circle cx="8" cy="40" r="2" />
        <circle cx="40" cy="40" r="2" />
      </g>
    </svg>
  )
}

function LogoContent({ variant, size, className }: Omit<LogoProps, "linkToHome">) {
  const sizeConfig = sizes[size || "md"]

  if (variant === "icon") {
    return <LogoIcon size={sizeConfig.icon} />
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <LogoIcon size={sizeConfig.icon} />
      {(variant === "full" || variant === "compact") && (
        <div className="flex flex-col">
          <span
            className={cn(
              "font-bold tracking-tight",
              sizeConfig.text
            )}
          >
            {variant === "compact" ? (
              <span className="text-earth-900">INFPS</span>
            ) : (
              <>
                <span className="text-earth-900">infps</span>
                <span className="gradient-text-saffron">vaastu</span>
              </>
            )}
          </span>
          {variant === "full" && (
            <span className="text-[10px] text-earth-500 tracking-wider uppercase -mt-1">
              Sacred Spaces
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default function Logo({
  variant = "full",
  size = "md",
  className,
  linkToHome = true,
}: LogoProps) {
  if (linkToHome) {
    return (
      <Link href="/" className={cn("flex items-center", className)}>
        <LogoContent variant={variant} size={size} />
      </Link>
    )
  }

  return <LogoContent variant={variant} size={size} className={className} />
}

export { LogoIcon }
