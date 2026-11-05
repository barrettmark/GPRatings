import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { Stars } from "@/components/stars"
import { getPractice } from "@/lib/data"
import { pct, rankPhrase, sizeLabel } from "@/lib/format"
import type { Meta, Practice } from "@/lib/types"
import { cn } from "@/lib/utils"
import metaJson from "@/data/meta.json"

const meta = metaJson as Meta

export const metadata: Metadata = { title: "Compare practices" }

export default function ComparePage({ searchParams }: PageProps<"/compare">) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="text-3xl font-medium sm:text-4xl">Compare practices</h1>
      <Suspense fallback={<p className="mt-6 text-muted-foreground">Loading comparison…</p>}>
        <CompareTable searchParams={searchParams} />
      </Suspense>
    </div>
  )
}

async function CompareTable({ searchParams }: { searchParams: PageProps<"/compare">["searchParams"] }) {
  const sp = await searchParams
  const raw = Array.isArray(sp.c) ? sp.c.join(",") : (sp.c ?? "")
  const practices = [...new Set(raw.split(",").map((c) => c.trim()).filter(Boolean))]
    .slice(0, 3)
    .map((c) => getPractice(c))
    .filter((p): p is Practice => !!p)

  if (practices.length < 2) {
    return (
      <p className="mt-6 text-muted-foreground">
        Pick two or three practices to compare. Tick “Compare” on any practice in{" "}
        <Link href="/search" className="text-primary underline underline-offset-2">search results</Link>.
      </p>
    )
  }

  // Highlight the best value in each row (only when it actually differs)
  const best = (vals: (number | null | undefined)[]) => {
    const nums = vals.filter((v): v is number => v != null)
    const max = Math.max(...nums)
    return nums.length > 1 && nums.some((v) => v !== max) ? max : null
  }

  return (
    <div className="mt-8 overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full min-w-[36rem] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="w-[34%] p-4 text-left align-bottom font-normal text-muted-foreground">Practice</th>
            {practices.map((p) => (
              <th key={p.code} className="p-4 text-left align-bottom">
                <Link href={`/practice/${p.code}`} className="font-heading text-base font-medium hover:underline">
                  {p.name}
                </Link>
                <p className="mt-0.5 font-normal text-muted-foreground">{p.postcode}</p>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-border">
            <th scope="row" className="p-4 text-left font-normal text-muted-foreground">Practice size</th>
            {practices.map((p) => (
              <td key={p.code} className="p-4 tabular">
                {p.patients != null ? (
                  <>
                    {sizeLabel(p.size)}
                    <span className="block text-xs text-muted-foreground">
                      {p.patients.toLocaleString("en-GB")} registered patients
                    </span>
                  </>
                ) : (
                  <span className="text-muted-foreground">–</span>
                )}
              </td>
            ))}
          </tr>
          <tr className="border-b border-border bg-secondary/40">
            <th scope="row" className="p-4 text-left font-medium">Overall</th>
            {practices.map((p) => (
              <td key={p.code} className="p-4"><Stars value={p.stars} size={18} /></td>
            ))}
          </tr>
          <tr className="border-b border-border">
            <th scope="row" className="p-4 text-left font-normal text-muted-foreground">
              Among practices serving similar areas
            </th>
            {practices.map((p) => (
              <td key={p.code} className="p-4">
                {p.similar?.stars != null ? (
                  <>
                    <Stars value={p.similar.stars} size={15} />
                    <span className="mt-1 block text-xs text-muted-foreground">{rankPhrase(p.similar.stars)}</span>
                  </>
                ) : (
                  <span className="text-muted-foreground">–</span>
                )}
              </td>
            ))}
          </tr>
          {meta.themes.map((t) => (
            <tr key={t.key} className="border-b border-border">
              <th scope="row" className="p-4 text-left font-medium">{t.label}</th>
              {practices.map((p) => (
                <td key={p.code} className="p-4"><Stars value={p.themes[t.key]} size={15} /></td>
              ))}
            </tr>
          ))}
          {meta.themes.map((t) => (
            <Rows key={t.key} title={t.label} keys={meta.questions.filter((q) => q.theme === t.key)} practices={practices} best={best} />
          ))}
          <Expect practices={practices} />
          <Rows
            title="Long-term conditions"
            keys={meta.questions.filter((q) => q.theme === "conditions")}
            practices={practices}
            best={best}
          />
          <tr>
            <th scope="row" className="p-4 text-left font-normal text-muted-foreground">Survey responses</th>
            {practices.map((p) => (
              <td key={p.code} className="p-4 tabular text-muted-foreground">{p.responses}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

// Not ratings, so no "best" highlight: just the share for each practice beside England
const EXPECT_ROWS = [
  { dist: "apptwhen", index: 0, label: "Seen the same day" },
  { dist: "apptwhen", index: 4, label: "Waited over 2 weeks" },
  { dist: "appttype", index: 0, label: "Seen face to face" },
  { dist: "apptwho", index: 0, label: "Saw a GP" },
]

function Expect({ practices }: { practices: Practice[] }) {
  return (
    <>
      <tr>
        <th colSpan={practices.length + 1} className="px-4 pt-6 pb-2 text-left font-heading text-base font-medium">
          What to expect <span className="font-sans text-xs font-normal text-muted-foreground">% of last appointments</span>
        </th>
      </tr>
      {EXPECT_ROWS.map((r) => {
        const england = meta.dists.find((d) => d.key === r.dist)?.england[r.index]
        return (
          <tr key={r.label} className="border-b border-border/60">
            <th scope="row" className="px-4 py-2.5 text-left font-normal">
              {r.label} <span className="text-xs text-muted-foreground tabular">(England {pct(england)})</span>
            </th>
            {practices.map((p) => {
              const d = p.dists[r.dist]
              return (
                <td key={p.code} className="px-4 py-2.5 tabular">
                  {d ? pct(d.s[r.index]) : <span className="text-muted-foreground">–</span>}
                  {d?.low && <span className="ml-1 text-xs text-worse" title="Fewer than 30 people answered">*</span>}
                </td>
              )
            })}
          </tr>
        )
      })}
    </>
  )
}

function Rows({
  title,
  keys,
  practices,
  best,
}: {
  title: string
  keys: Meta["questions"]
  practices: Practice[]
  best: (v: (number | null | undefined)[]) => number | null
}) {
  return (
    <>
      <tr>
        <th colSpan={practices.length + 1} className="px-4 pt-6 pb-2 text-left font-heading text-base font-medium">
          {title} <span className="font-sans text-xs font-normal text-muted-foreground">% answering positively</span>
        </th>
      </tr>
      {keys.map((q) => {
        const vals = practices.map((p) => p.questions[q.key]?.p)
        const top = best(vals)
        return (
          <tr key={q.key} className="border-b border-border/60">
            <th scope="row" className="px-4 py-2.5 text-left font-normal">
              {q.label} <span className="text-xs text-muted-foreground tabular">(England {pct(q.median)})</span>
            </th>
            {practices.map((p, i) => {
              const r = p.questions[q.key]
              return (
                <td key={p.code} className={cn("px-4 py-2.5 tabular", vals[i] === top && "font-semibold text-better")}>
                  {r ? pct(r.p) : <span className="text-muted-foreground">–</span>}
                  {r?.low && <span className="ml-1 text-xs text-worse" title="Fewer than 30 people answered">*</span>}
                </td>
              )
            })}
          </tr>
        )
      })}
    </>
  )
}
