export function pct(x: number | null | undefined) {
  return x == null ? "–" : `${Math.round(x * 100)}%`
}

export function miles(m: number) {
  return m < 0.1 ? "under 0.1 miles" : `${m < 10 ? m.toFixed(1) : Math.round(m)} miles`
}

export function milesBetween(lat1: number, lng1: number, lat2: number, lng2: number) {
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return 3958.8 * 2 * Math.asin(Math.sqrt(a))
}

export function directionsUrl(name: string, postcode: string | null) {
  const dest = postcode ? `${name}, ${postcode}` : name
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}`
}

export function telUrl(phone: string) {
  return `tel:${phone.replace(/\s+/g, "")}`
}

const SIZE_LABELS = {
  small: "Small practice",
  medium: "Medium practice",
  large: "Large practice",
  verylarge: "Very large practice",
} as const

export function sizeLabel(size: keyof typeof SIZE_LABELS | null | undefined) {
  return size ? SIZE_LABELS[size] : null
}

/** "2026-10-01" -> "1 October 2026" */
export function longDate(iso: string | null | undefined) {
  if (!iso) return ""
  const [y, m, d] = iso.split("-").map(Number)
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })
}

/** Stars are deciles: 5 = top 10%, 0.5 = bottom 10%. Returns e.g. "top 30%" */
export function rankPhrase(stars: number) {
  const decile = Math.round(stars * 2)
  return decile >= 6 ? `top ${(11 - decile) * 10}%` : `bottom ${decile * 10}%`
}

export function starWords(stars: number | null | undefined) {
  if (stars == null) return "Not enough data"
  return `Ranked in the ${rankPhrase(stars)} of practices`
}

/** Where a practice's patients live, by deprivation fifth (0 least .. 4 most deprived) */
export const AREA_PHRASES = [
  "some of England’s least deprived areas",
  "areas less deprived than average",
  "areas of average deprivation",
  "areas more deprived than average",
  "some of England’s most deprived areas",
]
