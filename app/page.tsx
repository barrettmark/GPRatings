import Link from "next/link"
import { LogoEmblem } from "@/components/logo"
import { SearchForm } from "@/components/search-form"
import { Stars } from "@/components/stars"
import { ResultBar } from "@/components/question-row"
import { getPractice } from "@/lib/data"
import { pct } from "@/lib/format"
import type { Meta } from "@/lib/types"
import metaJson from "@/data/meta.json"

const meta = metaJson as Meta
const fmt = (n: number) => n.toLocaleString("en-GB")

// A real result, used to show how to read one
const EXAMPLE_CODE = "A84002"
const EXAMPLE_QUESTION = "localgpservicesphone"

export default function Home() {
  const example = getPractice(EXAMPLE_CODE)
  const exampleQ = meta.questions.find((q) => q.key === EXAMPLE_QUESTION)!
  const exampleResult = example?.questions[EXAMPLE_QUESTION]

  return (
    <>
      <section className="mx-auto grid max-w-5xl items-center gap-x-14 gap-y-8 px-4 pt-10 pb-16 sm:px-6 sm:pt-20 sm:pb-24 md:grid-cols-[1fr_auto]">
        <LogoEmblem className="w-28 md:order-last md:mt-[calc(clamp(2.75rem,6.4vw,5.25rem)*0.125)] md:w-60 md:self-start lg:w-72" />
        <div>
        <h1 className="max-w-4xl text-[clamp(2.75rem,6.4vw,5.25rem)] font-normal">
          Find a GP practice that patients rate well
        </h1>
        <p className="mt-6 max-w-[38rem] text-lg text-muted-foreground sm:text-xl">
          {fmt(meta.practiceCount)} practices in England, compared on getting through, appointments and care.
          Built from {fmt(meta.responses)} answers to the {meta.year} GP Patient Survey.
        </p>
        <div className="mt-10 max-w-2xl">
          <SearchForm large />
        </div>
        <p className="mt-8 text-sm text-muted-foreground">
          Independent. Not part of the NHS.
        </p>
        </div>
      </section>

      {example && exampleResult && (
        <section className="rule-t" aria-labelledby="read-h">
          <div className="mx-auto grid max-w-5xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1fr_1.35fr] md:gap-16 md:py-20">
            <div>
              <h2 id="read-h" className="text-3xl font-normal sm:text-4xl">How to read a rating</h2>
              <p className="mt-4 text-muted-foreground">
                Every practice is ranked against every other practice in England, question by question. We show
                what share of patients answered positively, how sure we can be, and how that compares with the
                England average.
              </p>
              <Link
                href="/about"
                className="mt-5 inline-flex min-h-10 items-center text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                More on how ratings work
              </Link>
            </div>

            <figure className="rule-strong pt-4">
              <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <Link href={`/practice/${example.code}`} className="font-medium text-foreground hover:underline">
                  {example.name}
                </Link>
                <span>Real result, {meta.year} survey</span>
              </figcaption>
              <div className="rule-t mt-4 pt-5">
                <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
                  <div>
                    <p className="font-medium">{exampleQ.label}</p>
                    <p className="text-sm text-muted-foreground">{exampleQ.summary}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-heading text-3xl tabular">{pct(exampleResult.p)}</span>
                    <Stars value={exampleResult.stars} size={16} />
                  </div>
                </div>
                <div className="mt-5">
                  <ResultBar result={exampleResult} median={exampleQ.median} />
                </div>
                <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-3">
                  <div>
                    <dt className="flex items-center gap-2 font-medium">
                      <span aria-hidden className="inline-block size-3 rounded-full bg-primary" /> This practice
                    </dt>
                    <dd className="mt-1 text-muted-foreground">
                      {pct(exampleResult.p)} found it easy, from {exampleResult.n} people who answered.
                    </dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-2 font-medium">
                      <span aria-hidden className="inline-block h-1.5 w-5 rounded-full bg-primary/25" /> Likely range
                    </dt>
                    <dd className="mt-1 text-muted-foreground">
                      The true figure is very likely between {pct(exampleResult.lo)} and {pct(exampleResult.hi)}.
                    </dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-2 font-medium">
                      <span aria-hidden className="inline-block h-3 w-0.5 bg-star" /> England average
                    </dt>
                    <dd className="mt-1 text-muted-foreground">
                      {pct(exampleQ.median)}.{" "}
                      {exampleResult.cmp === "better"
                        ? "The whole range sits above it, so this practice is better than average."
                        : exampleResult.cmp === "worse"
                          ? "The whole range sits below it, so this practice is worse than average."
                          : "The range overlaps it, so we can't say this practice is different."}
                    </dd>
                  </div>
                </dl>
              </div>
            </figure>
          </div>
        </section>
      )}

      <section className="rule-t" aria-labelledby="rate-h">
        <div className="mx-auto grid max-w-5xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 md:gap-16 md:py-20">
          <div>
            <h2 id="rate-h" className="text-3xl font-normal sm:text-4xl">What we rate</h2>
            <ul className="mt-6">
              <li className="rule-strong py-4">
                <p className="font-heading text-xl">Overall experience</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Patients’ own verdict on the practice. This is the headline rating.
                </p>
              </li>
              {meta.themes.map((t) => (
                <li key={t.key} className="rule-t py-4">
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="font-heading text-xl">{t.label}</p>
                    <p className="shrink-0 text-xs text-muted-foreground tabular">
                      {meta.questions.filter((q) => q.theme === t.key).length} questions
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{t.summary}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-3xl font-normal sm:text-4xl">What the stars mean</h2>
            <ul className="mt-6">
              {[
                [5, "Top 10% of practices"],
                [4, "Top 30%"],
                [3, "Top half"],
                [2, "Bottom 40%"],
                [1, "Bottom 20%"],
              ].map(([s, label], i) => (
                <li
                  key={s}
                  className={`${i === 0 ? "rule-strong" : "rule-t"} flex items-center justify-between gap-4 py-3.5`}
                >
                  <Stars value={s as number} size={18} />
                  <span className="text-sm text-muted-foreground">{label}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-muted-foreground">
              Half stars fill the steps in between. Where few people answered, we say so.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
