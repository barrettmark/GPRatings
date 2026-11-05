import type { IndexEntry } from "./types"

export type Place = { lat: number; lng: number; label: string }

const API = "https://api.postcodes.io"
const FULL_POSTCODE = /^[A-Z]{1,2}\d[A-Z\d]?\d[A-Z]{2}$/
const OUTCODE = /^[A-Z]{1,2}\d[A-Z\d]?$/

let indexPromise: Promise<IndexEntry[]> | null = null

/** Compact list of every practice, fetched once per page load. */
export function loadIndex() {
  indexPromise ??= fetch("/data/index.json").then((r) => {
    if (!r.ok) throw new Error(`index ${r.status}`)
    return r.json()
  })
  indexPromise.catch(() => (indexPromise = null))
  return indexPromise
}

async function getJson(url: string) {
  const r = await fetch(url)
  if (r.status === 404) return null
  if (!r.ok) throw new Error(`lookup failed (${r.status})`)
  return r.json()
}

type PlaceResult = {
  name_1: string
  county_unitary?: string | null
  district_borough?: string | null
  region?: string | null
  local_type: string
  latitude: number
  longitude: number
}

const SETTLEMENTS = ["City", "Town", "Village", "Suburban Area", "Hamlet", "Other Settlement"]

/**
 * Turn what someone typed into a location: full postcode, postcode district
 * (e.g. "NE65") or a place name. Returns null when nothing matches.
 */
export async function geocode(query: string): Promise<Place | null> {
  const compact = query.toUpperCase().replace(/\s+/g, "")
  if (FULL_POSTCODE.test(compact)) {
    const d = await getJson(`${API}/postcodes/${encodeURIComponent(compact)}`)
    if (d?.result?.latitude != null) return { lat: d.result.latitude, lng: d.result.longitude, label: d.result.postcode }
    // Terminated postcodes still have a location
    const t = await getJson(`${API}/terminated_postcodes/${encodeURIComponent(compact)}`)
    if (t?.result?.latitude != null) return { lat: t.result.latitude, lng: t.result.longitude, label: t.result.postcode }
    return null
  }
  if (OUTCODE.test(compact)) {
    const d = await getJson(`${API}/outcodes/${encodeURIComponent(compact)}`)
    if (d?.result?.latitude != null) return { lat: d.result.latitude, lng: d.result.longitude, label: d.result.outcode }
  }
  const d = await getJson(`${API}/places?q=${encodeURIComponent(query.trim())}&limit=10`)
  const results: PlaceResult[] = d?.result ?? []
  const wanted = query.trim().toLowerCase()
  const best =
    results.find((r) => r.name_1.toLowerCase() === wanted && SETTLEMENTS.includes(r.local_type)) ??
    results.find((r) => SETTLEMENTS.includes(r.local_type)) ??
    results[0]
  if (!best) return null
  const area = best.district_borough || best.county_unitary || best.region
  return { lat: best.latitude, lng: best.longitude, label: area && area !== best.name_1 ? `${best.name_1}, ${area}` : best.name_1 }
}

/** Practices whose name (or code) matches the text, best matches first. */
export function matchNames(index: IndexEntry[], query: string, limit = 30) {
  const q = query.trim().toLowerCase()
  if (q.length < 3) return []
  const words = q.split(/\s+/)
  return index
    .filter((e) => e.c.toLowerCase() === q || words.every((w) => e.n.toLowerCase().includes(w)))
    .sort((a, b) => Number(b.n.toLowerCase().startsWith(q)) - Number(a.n.toLowerCase().startsWith(q)) || a.n.localeCompare(b.n))
    .slice(0, limit)
}

export type Suggestion =
  | { kind: "place"; id: string; label: string; detail: string | null; lat: number; lng: number }
  | { kind: "postcode"; id: string; label: string }
  | { kind: "practice"; id: string; label: string; detail: string | null }

const POSTCODE_START = /^[A-Z]{1,2}\d/i

/**
 * Suggestions for a partly typed search (3+ characters): matching practices from the local
 * list, plus places or postcodes from postcodes.io. Network failures just mean fewer suggestions.
 */
export async function suggest(query: string, signal?: AbortSignal): Promise<Suggestion[]> {
  const q = query.trim()
  if (q.length < 3) return []
  const looksLikePostcode = POSTCODE_START.test(q)

  const remote = (async (): Promise<Suggestion[]> => {
    try {
      if (looksLikePostcode) {
        const r = await fetch(`${API}/postcodes/${encodeURIComponent(q.replace(/\s+/g, ""))}/autocomplete?limit=5`, { signal })
        const d = r.ok ? await r.json() : null
        return ((d?.result as string[] | null) ?? []).map((pc) => ({ kind: "postcode", id: `pc-${pc}`, label: pc }))
      }
      const r = await fetch(`${API}/places?q=${encodeURIComponent(q)}&limit=12`, { signal })
      const d = r.ok ? await r.json() : null
      const seen = new Set<string>()
      // Exact name first, then bigger places (cities, towns) before suburbs and hamlets
      const typed = q.toLowerCase()
      const rank = (p: PlaceResult) =>
        (p.name_1.toLowerCase() === typed ? 0 : 10) + SETTLEMENTS.indexOf(p.local_type)
      return ((d?.result as PlaceResult[] | null) ?? [])
        .filter((p) => SETTLEMENTS.includes(p.local_type))
        .sort((a, b) => rank(a) - rank(b))
        .map((p) => {
          const area = p.district_borough || p.county_unitary || p.region || null
          return {
            kind: "place" as const,
            id: `place-${p.name_1}-${area}`,
            label: p.name_1,
            detail: area && area !== p.name_1 ? area : null,
            lat: p.latitude,
            lng: p.longitude,
          }
        })
        .filter((p) => (seen.has(p.id) ? false : (seen.add(p.id), true)))
        .slice(0, 5)
    } catch {
      return []
    }
  })()

  const local = loadIndex()
    .then((index) =>
      matchNames(index, q, 4).map((e): Suggestion => ({ kind: "practice", id: `gp-${e.c}`, label: e.n, detail: e.tw })),
    )
    .catch(() => [] as Suggestion[])

  const [r, l] = await Promise.all([remote, local])
  return [...r, ...l]
}
