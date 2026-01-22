import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  const formatted = `₹${price.toLocaleString('en-IN')}`

  if (price >= 10000000) {
    const crores = price / 10000000
    const croreStr = crores % 1 === 0 ? crores.toFixed(0) : crores.toFixed(2).replace(/\.?0+$/, '')
    return `${formatted} (${croreStr} Cr)`
  } else if (price >= 100000) {
    const lacs = price / 100000
    const lacStr = lacs % 1 === 0 ? lacs.toFixed(0) : lacs.toFixed(2).replace(/\.?0+$/, '')
    return `${formatted} (${lacStr} Lac)`
  } else if (price >= 1000) {
    const thousands = price / 1000
    const thousandStr = thousands % 1 === 0 ? thousands.toFixed(0) : thousands.toFixed(2).replace(/\.?0+$/, '')
    return `${formatted} (${thousandStr}K)`
  }
  return formatted
}

export function formatPriceInput(value: string): string {
  // Remove non-digits
  const digits = value.replace(/[^0-9]/g, '')
  if (!digits) return ''
  // Format with Indian commas
  const num = parseInt(digits, 10)
  return num.toLocaleString('en-IN')
}

export function parsePriceInput(value: string): string {
  // Remove commas to get raw number
  return value.replace(/,/g, '')
}

export function formatArea(area: number): string {
  return `${area.toLocaleString('en-IN')} sq.ft`
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
}

export function timeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)

  let interval = seconds / 31536000
  if (interval > 1) return Math.floor(interval) + ' years ago'

  interval = seconds / 2592000
  if (interval > 1) return Math.floor(interval) + ' months ago'

  interval = seconds / 86400
  if (interval > 1) return Math.floor(interval) + ' days ago'

  interval = seconds / 3600
  if (interval > 1) return Math.floor(interval) + ' hours ago'

  interval = seconds / 60
  if (interval > 1) return Math.floor(interval) + ' minutes ago'

  return Math.floor(seconds) + ' seconds ago'
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Safely parse JSON string with fallback value
 * Prevents runtime crashes from malformed JSON data
 */
export function safeJsonParse<T>(json: string | null | undefined, fallback: T): T {
  if (!json) return fallback
  try {
    return JSON.parse(json) as T
  } catch {
    console.warn('Failed to parse JSON:', json?.substring(0, 50))
    return fallback
  }
}
