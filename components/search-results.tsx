"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { markFromSearch, rememberSearch } from "@/lib/nav-memory"
import { Fragment, useEffect, useMemo, useState } from "react"
import { Stars } from "@/components/stars"
import { CompareToggle } from "@/components/compare-bar"
import { SearchForm } from "@/components/search-form"
import { geocode, loadIndex, matchNames, type Place } from "@/lib/search"
import { miles, milesBetween, pct, sizeLabel } from "@/lib/format"
import type { IndexEntry } from "@/lib/types"
import { cn } from "@/lib/utils"

const ResultsMap = dynamic(() => import("./results-map"), {
  ssr: false,
  loading: () => <div className="h-[28rem] animate-pulse rounded-xl bg-muted sm:h-[34rem]" />,
})

const THEME_LABELS = ["Getting through", "Appointments", "Care"]
// Results are the closest practices, however far away: 10 at a time, "More" adds the next 10 closest.
const PAGE = 10

type Lookup =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "done"; place: Place | null; names: IndexEntry[]; index: IndexEntry[] }

type Row = IndexEntry & { miles?: number }

export function SearchResults() {
  const params = useSearchParams()
  const q = params.get("q")?.trim() ?? ""
  const lat = Number(params.get("lat"))
  const lng = Number(params.get("lng"))
  const hasCoords = params.has("lat") && params.has("lng") && Number.isFinite(lat) && Number.isFinite(lng)
  const key = hasCoords ? `${lat},${lng}` : q
  // A place picked from the suggestions arrives as coordinates plus its name
  const placeLabel = params.get("label")?.trim() || null
  const boxText = hasCoords ? (placeLabel ?? "") : q

  const [lookup, setLookup] = useState<Lookup & { key: string }>({ status: "loading", key })

  // View, sort and distance live in the URL, so Back restores exactly what the person left.
  const router = useRouter()
  const pathname = usePathname()
  const shownParam = Number(params.get("n"))
  const shown = Number.isFinite(shownParam) && shownParam > PAGE ? Math.floor(shownParam) : PAGE
  const sort: "distance" | "rating" = params.get("sort") === "rating" ? "rating" : "distance"
  const view: "list" | "map" = params.get("view") === "map" ? "map" : "list"
  const setParam = (name: string, value: string | null) => {
    const next = new URLSearchParams(params.toString())
    if (value == null) next.delete(name)
    else next.set(name, value)
    router.replace(`${pathname}?${next.toString()}`, { scroll: false })
  }
  // "More" loads the next closest. The count lives in the URL so Back and shared links restore it.
  const showMore = (next: number) => setParam("n", next > PAGE ? String(next) : null)
  const setSort = (s: "distance" | "rating") => setParam("sort", s === "distance" ? null : s)
  const setView = (v: "list" | "map") => setParam("view", v === "list" ? null : v)

  // Remember this search so a practice page can link straight back to it
  useEffect(() => {
    rememberSearch(`${pathname}?${params.toString()}`)
  }, [pathname, params])

  useEffect(() => {
    if (!hasCoords && !q) return
    let cancelled = false
    ;(async () => {
      try {
        const index = await loadIndex()
        let place: Place | null = null
        let names: IndexEntry[] = []
        if (hasCoords) {
          place = { lat, lng, label: placeLabel ?? "your location" }
        } else {
          names = matchNames(index, q)
          place = await geocode(q).catch(() => null)
        }
        if (!cancelled) setLookup({ status: "done", place, names, index, key })
      } catch {
        if (!cancelled) setLookup({ status: "error", message: "Practice data didn't load. Check your connection and try again.", key })
      }
    })()
    return () => {
      cancelled = true
    }
  }, [key, hasCoords, lat, lng, q, placeLabel])

  const current: Lookup = lookup.key === key ? lookup : { status: "loading" }

  const near = useMemo(() => {
    if (lookup.key !== key || lookup.status !== "done" || !lookup.place) return null
    const { place, index } = lookup
    const all: Row[] = index
      .map((e) => ({ ...e, miles: milesBetween(place.lat, place.lng, e.la, e.lo) }))
      .sort((a, b) => a.miles! - b.miles!)
    // The closest N, then (optionally) re-ordered by rating among those N
    let rows = all.slice(0, shown)
    if (sort === "rating") {
      rows = [...rows].sort((a, b) => (b.s ?? -1) - (a.s ?? -1) || (b.op ?? 0) - (a.op ?? 0) || a.miles! - b.miles!)
    }
    const furthest = Math.max(0, ...rows.map((r) => r.miles!))
    const nextBatch = all.slice(shown, shown + PAGE)
    return {
      rows,
      furthest,
      remaining: all.length - rows.length,
      nextFurthest: nextBatch.length ? nextBatch[nextBatch.length - 1].miles! : null,
    }
  }, [lookup, key, shown, sort])

  if (!hasCoords && !q) {
    return (
      <Shell q="">
        <p className="text-muted-foreground">Enter a postcode, town or practice name to see ratings nearby.</p>
      </Shell>
    )
  }

  if (current.status === "loading") {
    return (
      <Shell q={boxText}>
        <p className="mb-6 text-sm text-muted-foreground" aria-live="polite">Finding practices…</p>
        <ul className="space-y-3">
          {Array.from({ length: 4 }, (_, i) => (
            <li key={i} className="h-32 animate-pulse rounded-xl bg-muted" />
          ))}
        </ul>
      </Shell>
    )
  }

  if (current.status === "error") {
    return (
      <Shell q={boxText}>
        <p role="alert" className="text-worse">{current.message}</p>
      </Shell>
    )
  }

  const { place, names } = current
  const nameOnly = !place && names.length > 0

  return (
    <Shell q={boxText}>
      {!place && names.length === 0 && (
        <div className="rule-strong pt-5">
          <h2 className="text-3xl font-normal">No matches for “{q}”</h2>
          <p className="mt-2 text-muted-foreground">
            Try a full postcode (like NE65 7RW), a postcode area (like NE65), a town, or part of a practice name.
          </p>
        </div>
      )}

      {names.length > 0 && place && (
        <details className="group/names mb-8 rule-t border-b border-border py-1">
          <summary className="flex min-h-11 cursor-pointer list-none items-center gap-1.5 text-sm font-medium [&::-webkit-details-marker]:hidden">
            <ChevronRight
              aria-hidden
              className="size-4 text-muted-foreground transition-transform duration-200 group-open/names:rotate-90 motion-reduce:transition-none"
            />
            {names.length} practice{names.length === 1 ? "" : "s"} named “{q}”
          </summary>
          <ul className="mt-2 divide-y divide-border">
            {names.map((e) => (
              <li key={e.c} className="flex items-center justify-between gap-3 py-2 text-sm">
                <Link href={`/practice/${e.c}`} className="font-medium hover:underline">{e.n}</Link>
                <span className="shrink-0 text-muted-foreground">{e.tw}</span>
              </li>
            ))}
          </ul>
        </details>
      )}

      {nameOnly && (
        <>
          <h2 className="mb-5 font-heading text-2xl font-normal sm:text-3xl">
            {names.length} practice{names.length === 1 ? "" : "s"} matching “{q}”
          </h2>
          <ResultList rows={names} ranked={false} />
        </>
      )}

      {place && near && (
        <>
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-heading text-2xl font-normal sm:text-3xl">
                The {near.rows.length} closest practices to {place.label}
              </h2>
              <p className="text-sm text-muted-foreground">
                All within <span className="tabular">{miles(near.furthest)}</span>. Overall rating first, then how each
                practice does on getting through, appointments and care.
              </p>
            </div>
            <div className="grid w-full grid-cols-[auto_1fr] gap-2 text-sm sm:flex sm:w-auto sm:items-center [&>div:last-child>div]:w-full sm:[&>div:last-child>div]:w-auto">
              <Segmented
                label="View"
                value={view}
                onChange={setView}
                options={[["list", "List"], ["map", "Map"]]}
              />
              <div className="sm:order-first">
                <Segmented
                  label="Sort"
                  value={sort}
                  onChange={setSort}
                  options={[["distance", "Nearest"], ["rating", "Highest rated"]]}
                />
              </div>
            </div>
          </div>
          {view === "map" ? (
            <>
              <ResultsMap center={place} practices={near.rows} />
              <MapKey />
            </>
          ) : (
            <ResultList rows={near.rows} ranked={sort === "rating"} />
          )}
          <MoreButton
            remaining={near.remaining}
            nextFurthest={near.nextFurthest}
            onMore={() => showMore(shown + PAGE)}
          />
        </>
      )}
    </Shell>
  )
}

function MoreButton({
  remaining,
  nextFurthest,
  onMore,
}: {
  remaining: number
  nextFurthest: number | null
  onMore: () => void
}) {
  if (remaining <= 0) return null
  return (
    <div className="rule-t mt-2 flex flex-col items-center gap-2 pt-6 text-center">
      <Button type="button" variant="outline" size="lg" arrow={false} onClick={onMore} className="h-11 px-5">
        <ChevronDown aria-hidden /> Show {Math.min(PAGE, remaining)} more
      </Button>
      {nextFurthest != null && (
        <p className="text-sm text-muted-foreground tabular">The next closest, up to {miles(nextFurthest)} away</p>
      )}
    </div>
  )
}

function Shell({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-8 max-w-2xl">
        <SearchForm key={q} initial={q} />
      </div>
      {children}
    </div>
  )
}

/** Items joined by a clearly visible round dot (the "·" character is too faint at this size) */
function Dotted({ items }: { items: (string | null | undefined)[] }) {
  const shown = items.filter((i): i is string => !!i)
  return (
    <>
      {/* Each dot sticks to the item before it, so a wrapped line always starts with text */}
      {shown.map((item, i) => (
        <Fragment key={item}>
          <span className="whitespace-nowrap">
            {item}
            {i < shown.length - 1 && (
              <>
                <span className="sr-only">,</span>
                <span aria-hidden className="mx-2 inline-block size-1.5 rounded-full bg-current align-middle opacity-60" />
              </>
            )}
          </span>
          {i < shown.length - 1 && <wbr />}
        </Fragment>
      ))}
    </>
  )
}

// Same colours as starColour() in results-map.tsx
const MAP_KEY: [string, string][] = [
  ["#16645f", "4.5–5 stars"],
  ["#3d958a", "3.5–4"],
  ["#c39a1c", "2.5–3"],
  ["#d6782c", "1.5–2"],
  ["#b23f2a", "0.5–1"],
]

function MapKey() {
  return (
    <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
      {MAP_KEY.map(([c, label]) => (
        <li key={c} className="flex items-center gap-1.5">
          <span className="inline-block size-3 rounded-full border-2 border-card" style={{ background: c }} />
          {label}
        </li>
      ))}
      <li className="flex items-center gap-1.5">
        <span className="inline-block size-3 rounded-full border-2 border-card bg-[#1d3b4a]" />
        Your search
      </li>
    </ul>
  )
}

function Segmented<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: T
  onChange: (v: T) => void
  options: [T, string][]
}) {
  // A single thumb slides between equal-width segments, so the selection moves
  // continuously instead of jumping. CSS transitions restart from the current
  // position, so rapid taps stay smooth.
  const index = Math.max(0, options.findIndex(([v]) => v === value))
  return (
    <div
      role="group"
      aria-label={label}
      className="relative grid rounded-[9px] border border-input bg-card p-0.5"
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      <span
        aria-hidden
        className="absolute inset-y-0.5 left-0.5 rounded-[7px] bg-primary shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] motion-reduce:transition-none"
        style={{ width: `calc((100% - 4px) / ${options.length})`, transform: `translateX(${index * 100}%)` }}
      />
      {options.map(([v, text]) => (
        <button
          key={v}
          type="button"
          aria-pressed={value === v}
          onClick={() => onChange(v)}
          className={cn(
            "relative h-8 rounded-[7px] px-3 text-sm whitespace-nowrap transition-colors duration-200 active:opacity-70",
            value === v ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {text}
        </button>
      ))}
    </div>
  )
}

function ResultList({ rows, ranked }: { rows: Row[]; ranked: boolean }) {
  // A ruled list. Position numbers appear only when sorted by rating, so "1" never reads as "best" in a distance sort
  return (
    <ol className="rule-strong">
      {rows.map((e, i) => (
        <li
          key={e.c}
          className={cn(
            "group relative rule-t py-5 transition-colors duration-150 first:border-t-0 has-[a:active]:bg-secondary/60",
            ranked && "grid grid-cols-[2rem_1fr] gap-x-3 sm:grid-cols-[2.75rem_1fr] sm:gap-x-4",
          )}
        >
          {ranked && (
            <span aria-hidden className="pt-0.5 font-heading text-xl text-muted-foreground/70 tabular sm:text-2xl">
              {i + 1}
            </span>
          )}
          <div className="min-w-0">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
              <div className="min-w-0">
                <h3 className="font-heading text-xl leading-snug font-normal sm:text-[1.375rem]">
                  <Link
                    href={`/practice/${e.c}`}
                    onClick={() => markFromSearch(e.c)}
                    className="after:absolute after:inset-0 group-hover:underline focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-ring"
                  >
                    {e.n}
                  </Link>
                </h3>
                <p className="mt-0.5 text-sm text-muted-foreground tabular">
                  <Dotted items={[e.tw, e.pc, e.miles != null ? miles(e.miles) : null]} />
                </p>
                {(e.sz != null || e.sd != null || e.ff != null) && (
                  <p className="mt-1 text-sm text-muted-foreground tabular">
                    <Dotted
                      items={[
                        sizeLabel(e.sz),
                        e.sd != null ? `${pct(e.sd)} seen same day` : null,
                        e.ff != null ? `${pct(e.ff)} face to face` : null,
                      ]}
                    />
                  </p>
                )}
              </div>
              <div className="shrink-0 sm:text-right">
                <Stars value={e.s} size={40} />
                <p className="mt-1 text-sm text-muted-foreground tabular">
                  {e.op != null ? `${pct(e.op)} rate it good overall` : "Too few responses"}
                </p>
              </div>
            </div>
            <div className="mt-3 flex flex-col items-start gap-y-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-6 sm:gap-y-2">
              <dl className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-1.5 sm:flex sm:flex-wrap sm:gap-x-5">
                {THEME_LABELS.map((label, j) => (
                  <div key={label} className="contents sm:flex sm:items-center sm:gap-2">
                    <dt className="text-sm text-muted-foreground">{label}</dt>
                    <dd><Stars value={e.t[j]} size={14} /></dd>
                  </div>
                ))}
              </dl>
              <CompareToggle item={{ code: e.c, name: e.n }} className="relative z-10" />
            </div>
          </div>
        </li>
      ))}
    </ol>
  )
}
