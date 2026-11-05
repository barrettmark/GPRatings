"use client"

import { useEffect, useId, useState } from "react"
import { useRouter } from "next/navigation"
import { Building2, LocateFixed, MapPin, Search, Stethoscope } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { loadIndex, suggest, type Suggestion } from "@/lib/search"

const MIN_CHARS = 3

const GROUPS: { kind: Suggestion["kind"]; title: string }[] = [
  { kind: "place", title: "Places" },
  { kind: "postcode", title: "Postcodes" },
  { kind: "practice", title: "Practices" },
]

export function SearchForm({ initial = "", large = false }: { initial?: string; large?: boolean }) {
  const router = useRouter()
  const listId = useId()
  const [q, setQ] = useState(initial)
  // Only suggest once the person has typed: a prefilled box (results page) stays quiet
  const [typed, setTyped] = useState(false)
  const [open, setOpen] = useState(false)
  const [found, setFound] = useState<{ key: string; items: Suggestion[] }>({ key: "", items: [] })
  const [active, setActive] = useState(-1)
  const [locating, setLocating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const query = q.trim()
  useEffect(() => {
    if (!typed || query.length < MIN_CHARS) return
    const ctrl = new AbortController()
    // Short pause so we don't ask the postcode service on every keystroke
    const t = setTimeout(async () => {
      const items = await suggest(query, ctrl.signal)
      if (!ctrl.signal.aborted) {
        setFound({ key: query, items })
        setActive(-1)
      }
    }, 150)
    return () => {
      clearTimeout(t)
      ctrl.abort()
    }
  }, [query, typed])

  const items = found.key === query && query.length >= MIN_CHARS ? found.items : []
  const showList = open && typed && items.length > 0
  const optionId = (i: number) => `${listId}-opt-${i}`

  function choose(s: Suggestion) {
    setOpen(false)
    setError(null)
    if (s.kind === "practice") {
      router.push(`/practice/${s.id.slice(3)}`)
    } else if (s.kind === "postcode") {
      setQ(s.label)
      router.push(`/search?q=${encodeURIComponent(s.label)}`)
    } else {
      const label = s.detail ? `${s.label}, ${s.detail}` : s.label
      setQ(label)
      router.push(`/search?lat=${s.lat.toFixed(5)}&lng=${s.lng.toFixed(5)}&label=${encodeURIComponent(label)}`)
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (showList && active >= 0) {
      choose(items[active])
      return
    }
    if (!query) {
      setError("Enter a postcode, town or practice name.")
      return
    }
    setError(null)
    setOpen(false)
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showList) {
      if (e.key === "ArrowDown" && items.length) setOpen(true)
      return
    }
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActive((a) => (a + 1) % items.length)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActive((a) => (a <= 0 ? items.length - 1 : a - 1))
    } else if (e.key === "Escape") {
      e.preventDefault()
      setOpen(false)
      setActive(-1)
    }
  }

  function useLocation() {
    if (!("geolocation" in navigator)) {
      setError("Your browser can't share your location. Enter a postcode instead.")
      return
    }
    setLocating(true)
    setError(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false)
        const { latitude, longitude } = pos.coords
        router.push(`/search?lat=${latitude.toFixed(5)}&lng=${longitude.toFixed(5)}`)
      },
      (err) => {
        setLocating(false)
        setError(
          err.code === err.PERMISSION_DENIED
            ? "Location access is turned off. Enter a postcode instead."
            : "We couldn't find your location. Enter a postcode instead.",
        )
      },
      { timeout: 10000, maximumAge: 300000 },
    )
  }

  return (
    <div className="w-full">
      <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row" role="search">
        <div className="relative flex-1">
          <label htmlFor={`${listId}-input`} className="sr-only">
            Postcode, town or practice name
          </label>
          <Search
            aria-hidden
            className={cn(
              "pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground",
              large ? "size-5" : "size-4",
            )}
          />
          <input
            id={`${listId}-input`}
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              setTyped(true)
              setOpen(true)
            }}
            onKeyDown={onKeyDown}
            // Start fetching the practice list early, so results and suggestions appear sooner
            onFocus={() => {
              void loadIndex().catch(() => {})
              if (typed) setOpen(true)
            }}
            onBlur={() => setOpen(false)}
            placeholder="Postcode, town or practice name"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            enterKeyHint="search"
            role="combobox"
            aria-expanded={showList}
            aria-controls={`${listId}-list`}
            aria-autocomplete="list"
            aria-activedescendant={showList && active >= 0 ? optionId(active) : undefined}
            className={cn(
              "w-full rounded-[10px] border border-input bg-card pr-3 shadow-xs outline-none placeholder:text-muted-foreground/80 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30",
              large ? "h-12 pl-10 text-base" : "h-11 pl-9 text-base sm:h-10 sm:text-sm",
            )}
          />

          <div
            id={`${listId}-list`}
            role="listbox"
            aria-label="Suggestions"
            hidden={!showList}
            className="absolute inset-x-0 top-full z-[1100] mt-1.5 max-h-[min(24rem,60vh)] overflow-y-auto overscroll-contain rounded-[10px] bg-popover py-1.5 text-popover-foreground shadow-[0_12px_32px_-12px_rgb(0_0_0/0.28)] ring-1 ring-border"
          >
            {GROUPS.map((g) => {
              const group = items.map((s, i) => ({ s, i })).filter(({ s }) => s.kind === g.kind)
              if (!group.length) return null
              return (
                <div key={g.kind} role="group" aria-label={g.title}>
                  <p aria-hidden className="px-3 pt-2 pb-1 text-xs text-muted-foreground">
                    {g.title}
                  </p>
                  {group.map(({ s, i }) => {
                    const Icon = s.kind === "place" ? MapPin : s.kind === "postcode" ? Building2 : Stethoscope
                    return (
                      <div
                        key={s.id}
                        id={optionId(i)}
                        role="option"
                        aria-selected={i === active}
                        // Keep focus in the input so the list doesn't close before the tap lands
                        onPointerDown={(e) => e.preventDefault()}
                        onClick={() => choose(s)}
                        onPointerEnter={() => setActive(i)}
                        className={cn(
                          "mx-1.5 flex min-h-11 cursor-pointer items-center gap-2.5 rounded-[7px] px-2.5 py-2 text-sm",
                          i === active && "bg-secondary",
                        )}
                      >
                        <Icon aria-hidden className="size-4 shrink-0 text-muted-foreground" />
                        <span className="min-w-0 truncate">
                          <span className="font-medium">{s.label}</span>
                          {"detail" in s && s.detail && <span className="text-muted-foreground"> · {s.detail}</span>}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
        <Button type="submit" size={large ? "lg" : "default"} className={large ? "h-12 px-5 text-base" : "h-11 sm:h-10"}>
          Find practices
        </Button>
      </form>
      <p aria-live="polite" className="sr-only">
        {showList ? `${items.length} suggestion${items.length === 1 ? "" : "s"} available` : ""}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <Button
          type="button"
          variant="link"
          onClick={useLocation}
          loading={locating}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          {!locating && <LocateFixed aria-hidden />}
          {locating ? "Finding your location…" : "Use my location"}
        </Button>
        {error && (
          <p role="alert" className="text-sm text-worse">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}
