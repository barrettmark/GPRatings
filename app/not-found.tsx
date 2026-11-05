import Link from "next/link"
import { SearchForm } from "@/components/search-form"

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-medium sm:text-4xl">We couldn’t find that page</h1>
      <p className="mt-3 text-muted-foreground">
        The practice may have closed or merged, or the link may be wrong. Search for it instead.
      </p>
      <div className="mt-6">
        <SearchForm />
      </div>
      <Link href="/" className="mt-6 inline-block text-sm text-primary underline-offset-4 hover:underline">
        Back to the home page
      </Link>
    </div>
  )
}
