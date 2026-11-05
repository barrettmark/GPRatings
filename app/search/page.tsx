import type { Metadata } from "next"
import { Suspense } from "react"
import { SearchResults } from "@/components/search-results"

export const metadata: Metadata = { title: "Find practices near you" }

export default function SearchPage() {
  // Results depend on the URL, so they render in the browser inside Suspense.
  return (
    <Suspense fallback={<div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 text-muted-foreground">Loading search…</div>}>
      <SearchResults />
    </Suspense>
  )
}
