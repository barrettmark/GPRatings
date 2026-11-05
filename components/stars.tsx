import { cn } from "@/lib/utils"

/**
 * 0-5 stars in half steps. Null renders an explicit "no rating" state.
 * The star shape is one CSS mask (.star-mask in globals.css) repeated per tile;
 * each star is centred in its tile, so a half rating cuts a star exactly in half.
 */
export function Stars({
  value,
  size = 18,
  className,
}: {
  value: number | null | undefined
  size?: number
  className?: string
}) {
  if (value == null) {
    return <span className={cn("text-sm text-muted-foreground", className)}>No rating</span>
  }
  const tile = Math.round(size * 1.14)
  return (
    <span
      role="img"
      aria-label={`${value} out of 5 stars`}
      className={cn("relative inline-block shrink-0 align-middle", className)}
      style={{ width: tile * 5, height: size, "--tile": `${tile}px`, "--size": `${size}px` } as React.CSSProperties}
    >
      <span className="star-mask absolute inset-0 bg-star-empty" />
      <span className="star-mask absolute inset-y-0 left-0 bg-star" style={{ width: `${value * 20}%` }} />
    </span>
  )
}
