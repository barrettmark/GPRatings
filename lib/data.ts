import "server-only"
import { readFileSync } from "node:fs"
import path from "node:path"
import type { Practice } from "./types"
import { milesBetween } from "./format"

// Read once at module scope: the file is fixed per deploy, so Next.js can
// include it in prerendered pages. (A JSON import would make TypeScript type
// a 14 MB file.)
const practices: Record<string, Practice> = JSON.parse(
  readFileSync(path.join(process.cwd(), "data", "practices.json"), "utf8"),
)

export function getPractice(code: string): Practice | undefined {
  return practices[code.toUpperCase()]
}

export function allPracticeCodes(): string[] {
  return Object.keys(practices)
}

export function nearbyPractices(p: Practice, count = 5) {
  if (p.lat == null || p.lng == null) return []
  const { lat, lng } = p
  return Object.values(practices)
    .filter((o) => o.code !== p.code && o.lat != null && o.lng != null)
    .map((o) => ({ practice: o, miles: milesBetween(lat, lng, o.lat!, o.lng!) }))
    .sort((a, b) => a.miles - b.miles)
    .slice(0, count)
}
