"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSyncExternalStore } from "react"
import { ChevronLeft } from "lucide-react"
import { cameFromSearch, lastSearch } from "@/lib/nav-memory"

const noop = () => () => {}

/**
 * Leads back to the search that found this practice, not an empty search page.
 * If the person arrived by tapping a result, uses browser history so their
 * scroll position and list/map choice come back exactly as they left them.
 */
export function BackLink({ code }: { code: string }) {
  const router = useRouter()
  const href = useSyncExternalStore(noop, () => lastSearch(), () => null)

  return (
    <Link
      href={href ?? "/search"}
      onClick={(e) => {
        if (cameFromSearch(code)) {
          e.preventDefault()
          router.back()
        }
      }}
      className="-ml-1.5 inline-flex min-h-10 items-center gap-0.5 rounded-md px-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground active:opacity-60"
    >
      <ChevronLeft aria-hidden className="size-4" />
      {href ? "Back to results" : "Search practices"}
    </Link>
  )
}
