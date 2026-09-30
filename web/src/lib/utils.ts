import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const RELATIVE_TIME_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 60 * 60 * 24 * 365],
  ["month", 60 * 60 * 24 * 30],
  ["day", 60 * 60 * 24],
  ["hour", 60 * 60],
  ["minute", 60],
]

const relativeTimeFormatter = new Intl.RelativeTimeFormat("en", {
  numeric: "auto",
})

export function formatRelativeTime(isoDate: string) {
  const seconds = (Date.now() - new Date(isoDate).getTime()) / 1000
  if (seconds < 60) return "just now"

  for (const [unit, unitSeconds] of RELATIVE_TIME_UNITS) {
    if (seconds >= unitSeconds) {
      return relativeTimeFormatter.format(
        -Math.floor(seconds / unitSeconds),
        unit
      )
    }
  }
  return "just now"
}

const AVATAR_TONES = [
  "bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-100",
  "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-100",
  "bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-100",
  "bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-100",
  "bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-100",
]

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

export function avatarTone(seed: string) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash + seed.charCodeAt(i)) % AVATAR_TONES.length
  }
  return AVATAR_TONES[hash]
}
