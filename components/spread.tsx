import { pct } from "@/lib/format"
import type { Distribution } from "@/lib/types"
import { cn } from "@/lib/utils"

/**
 * How a practice's answers split across categories, beside England.
 * Not a rating, so no stars and no verdict colour: teal bar for the practice,
 * amber tick for England (amber = benchmark, per DESIGN.md).
 */
export function Spread({
  title,
  categories,
  england,
  dist,
}: {
  title: string
  categories: string[]
  england: number[]
  dist: Distribution | undefined
}) {
  return (
    <figure className="rule-t pt-4">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="font-medium">{title}</span>
        {dist && (
          <span className={cn("text-sm text-muted-foreground tabular", dist.low && "font-medium text-worse")}>
            {dist.n} {dist.n === 1 ? "person" : "people"} answered{dist.low ? ": treat with caution" : ""}
          </span>
        )}
      </figcaption>
      {dist ? (
        <table className="mt-3 w-full border-collapse text-sm">
          <thead>
            <tr className="text-xs text-muted-foreground">
              <th className="pb-1 text-left font-normal">
                <span className="sr-only">Answer</span>
              </th>
              <th className="pb-1 text-right font-normal">This practice</th>
              <th className="pb-1 text-right font-normal">England</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c, i) => (
              <tr key={c}>
                <th scope="row" className="w-[42%] py-1.5 pr-3 text-left font-normal">
                  {c}
                </th>
                <td className="py-1.5">
                  <div className="flex items-center gap-3">
                    <div className="relative h-2 flex-1 rounded-full bg-secondary" aria-hidden>
                      <div
                        className="absolute inset-y-0 left-0 rounded-full bg-primary/85"
                        style={{ width: `${dist.s[i] * 100}%` }}
                      />
                      <div
                        className="absolute -top-1 -bottom-1 w-0.5 -translate-x-1/2 rounded bg-star"
                        style={{ left: `${england[i] * 100}%` }}
                      />
                    </div>
                    <span className="w-10 text-right font-medium tabular">{pct(dist.s[i])}</span>
                  </div>
                </td>
                <td className="w-24 py-1.5 pl-3 text-right text-muted-foreground tabular">
                  {pct(england[i])}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">Not enough answers to show.</p>
      )}
    </figure>
  )
}
