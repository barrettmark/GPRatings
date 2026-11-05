import { cn } from "@/lib/utils"

/*
 * GP Ratings mark: a map pin holding a medical plus, redrawn from the 2013 app icon.
 * The plus is deliberately teal-on-white, never red-on-white (the Red Cross emblem is protected),
 * and the pin is teal rather than NHS blue.
 * Colours come from the theme tokens, so the mark follows light and dark mode.
 */

// 64-unit grid: pin head centred at (32, 26), radius 20, tip at (32, 61)
export const PIN_PATH = "M32 61C25.5 52.5 12 40.6 12 26a20 20 0 0 1 40 0c0 14.6-13.5 26.5-20 35Z"
export const PLUS_PATH =
  "M29.6 18.5a1.6 1.6 0 0 1 1.6-1.6h1.6a1.6 1.6 0 0 1 1.6 1.6v5.1h5.1a1.6 1.6 0 0 1 1.6 1.6v1.6a1.6 1.6 0 0 1-1.6 1.6h-5.1v5.1a1.6 1.6 0 0 1-1.6 1.6h-1.6a1.6 1.6 0 0 1-1.6-1.6v-5.1h-5.1a1.6 1.6 0 0 1-1.6-1.6v-1.6a1.6 1.6 0 0 1 1.6-1.6h5.1Z"

export function LogoMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      className={cn("shrink-0", className)}
    >
      {title && <title>{title}</title>}
      <path d={PIN_PATH} className="fill-primary" />
      <circle cx="32" cy="26" r="12.5" className="fill-card" />
      <path d={PLUS_PATH} className="fill-primary" />
    </svg>
  )
}

const STAR_PATH = "M10 1.6l2.47 5.3 5.8.68-4.28 3.97 1.13 5.73L10 14.4l-5.12 2.88 1.13-5.73L1.73 7.58l5.8-.68z"

/**
 * The full emblem for the home page: pin and plus above the 2013 icon's five stars.
 * Entrance: the pin settles in, then the stars light one by one (CSS only; skipped with reduced motion).
 */
export function LogoEmblem({ className }: { className?: string }) {
  return (
    <svg viewBox="0 8.85 120 119.15" aria-hidden className={cn("emblem shrink-0 overflow-visible", className)}>
      <g className="emblem-pin" transform="translate(13 0) scale(1.475)">
        <path d={PIN_PATH} className="fill-primary" />
        <circle cx="32" cy="26" r="12.5" className="fill-card" />
        <path d={PLUS_PATH} className="fill-primary" />
      </g>
      {/* Position on the group, animate the path: keeps each star's pop centred on itself */}
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} transform={`translate(${2 + i * 24} 104)`}>
          <path d={STAR_PATH} className="emblem-star fill-star" style={{ "--i": i } as React.CSSProperties} />
        </g>
      ))}
    </svg>
  )
}
