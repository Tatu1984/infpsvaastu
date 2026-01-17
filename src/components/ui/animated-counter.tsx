"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView, useSpring, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedCounterProps {
  value: number
  duration?: number
  delay?: number
  prefix?: string
  suffix?: string
  className?: string
  once?: boolean
}

export function AnimatedCounter({
  value,
  duration = 2,
  delay = 0,
  prefix = "",
  suffix = "",
  className,
  once = true,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once, margin: "-100px" })
  const [hasAnimated, setHasAnimated] = useState(false)

  const spring = useSpring(0, {
    duration: duration * 1000,
    bounce: 0,
  })

  const display = useTransform(spring, (current) => {
    return Math.round(current).toLocaleString()
  })

  useEffect(() => {
    if (isInView && !hasAnimated) {
      const timer = setTimeout(() => {
        spring.set(value)
        setHasAnimated(true)
      }, delay * 1000)
      return () => clearTimeout(timer)
    }
  }, [isInView, value, spring, delay, hasAnimated])

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  )
}

interface StatCardProps {
  value: number
  label: string
  prefix?: string
  suffix?: string
  icon?: React.ReactNode
  delay?: number
  className?: string
}

export function StatCard({
  value,
  label,
  prefix,
  suffix,
  icon,
  delay = 0,
  className,
}: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      className={cn(
        "flex flex-col items-center text-center",
        className
      )}
    >
      {icon && (
        <div className="mb-2 text-saffron-400">
          {icon}
        </div>
      )}
      <div className="text-3xl md:text-4xl font-bold text-white">
        <AnimatedCounter
          value={value}
          prefix={prefix}
          suffix={suffix}
          delay={delay * 0.1}
        />
      </div>
      <div className="text-sm text-earth-300 mt-1">{label}</div>
    </motion.div>
  )
}

interface AnimatedProgressProps {
  value: number
  max?: number
  className?: string
  showLabel?: boolean
}

export function AnimatedProgress({
  value,
  max = 100,
  className,
  showLabel = false,
}: AnimatedProgressProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const percentage = (value / max) * 100

  return (
    <div ref={ref} className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between text-sm mb-1">
          <span className="text-earth-600">Progress</span>
          <span className="font-medium text-earth-900">{percentage.toFixed(0)}%</span>
        </div>
      )}
      <div className="h-2 bg-earth-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-saffron-500 to-gold-500 rounded-full"
          initial={{ width: 0 }}
          animate={isInView ? { width: `${percentage}%` } : { width: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  )
}
