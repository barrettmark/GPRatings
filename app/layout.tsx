import type { Metadata } from "next"
import { Figtree, Fraunces } from "next/font/google"
import Link from "next/link"
import { CompareBar } from "@/components/compare-bar"
import { LogoMark } from "@/components/logo"
import meta from "@/data/meta.json"
import "./globals.css"

const figtree = Figtree({ variable: "--font-figtree", subsets: ["latin"] })
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], axes: ["opsz", "SOFT"] })

export const metadata: Metadata = {
  title: { default: "GP Ratings: find a GP practice patients rate well", template: "%s · GP Ratings" },
  description: `Compare ${meta.practiceCount.toLocaleString("en-GB")} GP practices in England using ${meta.responses.toLocaleString("en-GB")} patient survey responses from the ${meta.year} GP Patient Survey.`,
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB" className={`${figtree.variable} ${fraunces.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">
        <header className="material scroll-edge sticky top-0 z-[1200]">
          <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-4 sm:px-6">
            <Link href="/" className="-ml-1.5 flex items-center gap-2 font-heading text-xl font-semibold tracking-tight sm:text-2xl">
              <LogoMark className="size-14" />
              GP Ratings
            </Link>
            <nav className="-mr-2 flex items-center text-sm text-muted-foreground">
              <Link href="/search" className="rounded-md px-2 py-2.5 transition-colors hover:text-foreground active:opacity-60">Search</Link>
              <Link href="/about" className="rounded-md px-2 py-2.5 transition-colors hover:text-foreground active:opacity-60">How ratings work</Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border/70 pb-24 text-sm text-muted-foreground">
          <div className="mx-auto max-w-5xl space-y-2 px-4 py-8 sm:px-6">
            <p>
              Ratings come from the {meta.year} GP Patient Survey, run by Ipsos for NHS England. Practice
              addresses come from the NHS Organisation Data Service, and registered patient numbers from NHS England’s
              Patients Registered at a GP Practice.
            </p>
            <p>
              GP Ratings is independent and not part of the NHS. Ratings reflect patient experience, not
              clinical quality. <Link href="/about" className="underline underline-offset-2">How ratings work</Link>
            </p>
          </div>
        </footer>
        <CompareBar />
      </body>
    </html>
  )
}
