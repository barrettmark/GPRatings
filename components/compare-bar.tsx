"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MAX_COMPARE, useCompare, type CompareItem } from "./compare-store"
import { cn } from "@/lib/utils"

export function CompareBar() {
  const { items, remove, clear } = useCompare()
  const pathname = usePathname()
  const open = items.length > 0 && pathname !== "/compare"

  // Keep showing the last chips while the bar slides away, so it leaves the way it arrived
  const [shown, setShown] = useState(items)
  if (items.length > 0 && items !== shown) setShown(items)

  return (
    <div
      aria-hidden={!open}
      inert={!open}
      className={cn(
        "material fixed inset-x-0 bottom-0 z-[1200] border-t border-white/40 shadow-[0_-10px_30px_-14px_rgb(0_0_0/0.25)] dark:border-white/10",
        "transition-[transform,opacity] duration-[380ms] ease-[cubic-bezier(0.25,1,0.5,1)]",
        "motion-reduce:translate-y-0 motion-reduce:duration-200",
        open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0",
      )}
    >
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6">
        <span className="text-sm font-medium">
          Compare <span className="tabular text-muted-foreground">({shown.length}/{MAX_COMPARE})</span>
        </span>
        <ul className="flex min-w-0 flex-1 flex-wrap gap-1.5">
          {shown.map((i) => (
            <li
              key={i.code}
              className="flex max-w-[14rem] items-center gap-1 rounded-full bg-card/80 py-0.5 pr-0.5 pl-2.5 text-xs shadow-xs ring-1 ring-border"
            >
              <span className="truncate">{i.name}</span>
              <button
                onClick={() => remove(i.code)}
                className="grid size-6 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground active:scale-90"
                aria-label={`Remove ${i.name} from comparison`}
              >
                <X className="size-3" />
              </button>
            </li>
          ))}
        </ul>
        <Button variant="ghost" size="sm" onClick={clear}>
          Clear
        </Button>
        {shown.length >= 2 ? (
          <Button asChild size="sm">
            <Link href={`/compare?c=${shown.map((i) => i.code).join(",")}`}>Compare practices</Link>
          </Button>
        ) : (
          <span className="text-xs text-muted-foreground">Add one more to compare</span>
        )}
      </div>
    </div>
  )
}

export function CompareToggle({ item, className }: { item: CompareItem; className?: string }) {
  const { has, toggle, isFull } = useCompare()
  const on = has(item.code)
  const disabled = !on && isFull
  return (
    <label
      className={cn(
        "-m-2 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg p-2 text-sm text-muted-foreground transition-colors select-none hover:text-foreground active:bg-secondary",
        disabled && "cursor-not-allowed opacity-50 hover:text-muted-foreground",
        className,
      )}
      title={disabled ? `You can compare up to ${MAX_COMPARE} practices` : undefined}
    >
      <input
        type="checkbox"
        checked={on}
        disabled={disabled}
        onChange={() => toggle(item)}
        className="size-4 accent-[var(--primary)]"
      />
      Compare
    </label>
  )
}
