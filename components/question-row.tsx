import { Stars } from "@/components/stars"
import { pct } from "@/lib/format"
import type { Comparison, QuestionResult } from "@/lib/types"
import { cn } from "@/lib/utils"

const CMP: Record<Comparison, { text: string; className: string }> = {
  better: { text: "Better than England average", className: "bg-better-soft text-better" },
  similar: { text: "Not clearly different from England average", className: "bg-secondary text-muted-foreground" },
  worse: { text: "Worse than England average", className: "bg-worse-soft text-worse" },
}

export function ComparisonBadge({ cmp, className }: { cmp: Comparison; className?: string }) {
  // "Similar" is the common case, so it stays plain text; only real differences get a coloured pill
  if (cmp === "similar") {
    return <span className={cn("inline-flex text-sm text-muted-foreground", className)}>{CMP.similar.text}</span>
  }
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-sm font-medium", CMP[cmp].className, className)}>
      {CMP[cmp].text}
    </span>
  )
}

/** Bar from 0-100%: practice result, its 95% range, and the England median tick. */
export function ResultBar({ result, median }: { result: QuestionResult; median: number }) {
  const w = (x: number) => `${Math.max(0, Math.min(1, x)) * 100}%`
  return (
    <div className="relative h-6" aria-hidden>
      <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-secondary" />
      {result.lo != null && result.hi != null && (
        <div
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-primary/25"
          style={{ left: w(result.lo), width: `calc(${w(result.hi)} - ${w(result.lo)})` }}
        />
      )}
      <div className="absolute top-0.5 bottom-0.5 w-0.5 -translate-x-1/2 rounded bg-star" style={{ left: w(median) }} />
      <div
        className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-card bg-primary shadow-sm"
        style={{ left: w(result.p) }}
      />
    </div>
  )
}

export function QuestionRow({
  label,
  summary,
  median,
  result,
}: {
  label: string
  summary: string
  median: number
  result: QuestionResult | undefined
}) {
  return (
    <div className="py-5">
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
        <div className="min-w-0 flex-1 basis-64">
          <h4 className="font-medium">{label}</h4>
          <p className="mt-0.5 text-sm text-muted-foreground">{summary}</p>
        </div>
        {result ? (
          <div className="flex items-center gap-3">
            <span className="font-heading text-2xl tabular">{pct(result.p)}</span>
            <Stars value={result.stars} size={16} />
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">Not enough responses to report</span>
        )}
      </div>
      {result && (
        <>
          <div className="mt-3">
            <ResultBar result={result} median={median} />
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <ComparisonBadge cmp={result.cmp} />
            <span className="tabular">England average {pct(median)}</span>
            {result.lo != null && result.hi != null && (
              <span className="tabular">Likely range {pct(result.lo)}–{pct(result.hi)}</span>
            )}
            <span className={cn("tabular", result.low && "font-medium text-worse")}>
              {result.n} {result.n === 1 ? "person" : "people"} answered{result.low ? ": treat with caution" : ""}
            </span>
          </div>
        </>
      )}
    </div>
  )
}
