import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { notFound } from "next/navigation"
import { MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Stars } from "@/components/stars"
import { BackLink } from "@/components/back-link"
import { CompareToggle } from "@/components/compare-bar"
import { ComparisonBadge, QuestionRow, ResultBar } from "@/components/question-row"
import { Spread } from "@/components/spread"
import { allPracticeCodes, getPractice, nearbyPractices } from "@/lib/data"
import { AREA_PHRASES, directionsUrl, longDate, miles, pct, rankPhrase, sizeLabel, starWords, telUrl } from "@/lib/format"
import type { Meta } from "@/lib/types"
import metaJson from "@/data/meta.json"

const meta = metaJson as Meta
const fmt = (n: number) => n.toLocaleString("en-GB")

// Prerender one page at build time (Cache Components needs at least one).
// Every other practice renders on its first visit and is then served from cache,
// which keeps the build small (6,000+ prerendered pages came to ~1.7 GB).
export function generateStaticParams() {
  return allPracticeCodes().slice(0, 1).map((code) => ({ code }))
}

export async function generateMetadata({ params }: PageProps<"/practice/[code]">): Promise<Metadata> {
  const { code } = await params
  const p = getPractice(code)
  if (!p) return { title: "Practice not found" }
  const overall = p.questions.overallexp
  return {
    title: `${p.name}${p.postcode ? `, ${p.postcode}` : ""}`,
    description: overall
      ? `${pct(overall.p)} of patients at ${p.name} describe their overall experience as good (England average ${pct(meta.questions[0].median)}). Ratings from the ${meta.year} GP Patient Survey.`
      : `Patient survey ratings for ${p.name} from the ${meta.year} GP Patient Survey.`,
  }
}

export default function PracticePage(props: PageProps<"/practice/[code]">) {
  return (
    <Suspense fallback={<PracticeSkeleton />}>
      <PracticeDetail params={props.params} />
    </Suspense>
  )
}

function PracticeSkeleton() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12" aria-busy>
      <div className="h-10 w-32 py-3"><div className="h-4 rounded bg-muted" /></div>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-4">
          <div className="h-12 w-3/4 animate-pulse rounded bg-muted" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-44 animate-pulse rounded-2xl bg-muted" />
      </div>
      <div className="mt-10 h-20 animate-pulse rounded-xl bg-muted" />
    </div>
  )
}

async function PracticeDetail({ params }: Pick<PageProps<"/practice/[code]">, "params">) {
  const { code } = await params
  const p = getPractice(code)
  if (!p) notFound()

  const overallQ = meta.questions.find((q) => q.key === "overallexp")!
  const overall = p.questions.overallexp
  const nearby = nearbyPractices(p, 5)
  const fewResponses = p.responses < meta.minRespondents
  const ageDist = meta.dists.find((d) => d.key === "age")

  return (
    <article className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <BackLink code={p.code} />

      <header className="mt-6 grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-14">
        <div>
          <h1 className="text-[clamp(2.25rem,5.2vw,4rem)] font-normal">{p.name}</h1>
          <p className="mt-4 text-muted-foreground">{[...p.address, p.postcode].filter(Boolean).join(", ")}</p>
          {p.patients != null && (
            <p className="mt-3 text-muted-foreground tabular">
              <Link href="/about#size" className="font-medium text-foreground underline-offset-4 hover:underline">
                {sizeLabel(p.size)}
              </Link>
              {" · "}
              {fmt(p.patients)} registered patients
              {" "}<span className="text-sm whitespace-nowrap">({longDate(meta.registeredAsOf)})</span>
            </p>
          )}
          <p className="mt-1 text-sm text-muted-foreground tabular">
            {fmt(p.responses)} replies from {fmt(p.surveysSent)} surveyed (
            {pct(p.responseRate)}) · Practice code {p.code}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {p.phone && (
              <Button asChild variant="outline" size="lg" arrow={false} className="h-11">
                <a href={telUrl(p.phone)}>
                  <Phone aria-hidden /> {p.phone}
                </a>
              </Button>
            )}
            <Button asChild variant="outline" size="lg" arrow={false} className="h-11">
              <a href={directionsUrl(p.name, p.postcode)} target="_blank" rel="noreferrer">
                <MapPin aria-hidden /> Directions
              </a>
            </Button>
            <CompareToggle item={{ code: p.code, name: p.name }} />
          </div>
        </div>

        <section aria-label="Scorecard" className="self-start">
          <div className="rule-strong pt-4 pb-5">
            <h2 className="text-2xl font-normal">Overall experience</h2>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Stars value={p.stars} size={28} />
              {p.stars != null && <span className="font-heading text-2xl tabular">{p.stars}</span>}
            </div>
            <p className="mt-2 font-medium">
              <span className="tabular">{fmt(p.responses)}</span> {p.responses === 1 ? "person" : "people"} reviewed this
              practice.
              <br />
              {p.stars != null ? `It’s ${starWords(p.stars).charAt(0).toLowerCase()}${starWords(p.stars).slice(1)}.` : "There isn’t enough data to rank it."}
            </p>
            {p.similar?.stars != null && (
              <p className="mt-2 text-sm text-muted-foreground">
                Its patients mostly live in {AREA_PHRASES[p.similar.group]}. Among practices serving similar areas,
                it’s in the{" "}
                <span className="font-medium text-foreground">{rankPhrase(p.similar.stars)}</span>.{" "}
                <Link href="/about#similar" className="underline underline-offset-4 hover:text-foreground">
                  Why this matters
                </Link>
              </p>
            )}
            {overall && (
              <>
                <p className="mt-2 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground tabular">{pct(overall.p)}</span> of patients describe
                  their experience as good. England average: <span className="tabular">{pct(overallQ.median)}</span>.
                </p>
                <div className="mt-3">
                  <ResultBar result={overall} median={overallQ.median} />
                </div>
                <p className="mt-1 text-sm text-muted-foreground tabular">
                  {overall.lo != null && overall.hi != null && <>Likely range {pct(overall.lo)}–{pct(overall.hi)} · </>}
                  {overall.n} {overall.n === 1 ? "person" : "people"} answered
                </p>
                <ComparisonBadge cmp={overall.cmp} className="mt-2" />
              </>
            )}
          </div>
          <ul>
            {meta.themes.map((t) => (
              <li key={t.key} className="rule-t">
                <a
                  href={`#${t.key}`}
                  className="group flex min-h-14 items-center justify-between gap-4 py-3 transition-colors active:bg-secondary/60"
                >
                  <span>
                    <span className="block font-medium group-hover:underline">{t.label}</span>
                    <span className="block text-sm text-muted-foreground">{starWords(p.themes[t.key])}</span>
                  </span>
                  <Stars value={p.themes[t.key]} size={16} />
                </a>
              </li>
            ))}
            <li className="rule-t">
              <a
                href="#expect"
                className="group flex min-h-12 items-center justify-between gap-4 py-3 text-sm transition-colors active:bg-secondary/60"
              >
                <span className="font-medium group-hover:underline">What to expect</span>
                <span className="text-muted-foreground tabular">
                  {p.dists.apptwhen ? `${pct(p.dists.apptwhen.s[0])} seen same day` : ""}
                </span>
              </a>
            </li>
          </ul>
        </section>
      </header>

      {fewResponses && (
        <p role="note" className="mt-10 rounded-xl bg-worse-soft p-4 text-sm text-worse ring-1 ring-worse/25">
          Only {p.responses} patients responded to the survey here, so these ratings may not be reliable.
        </p>
      )}

      <p aria-hidden className="mt-14 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="inline-block size-3 rounded-full bg-primary" /> This practice</span>
        <span className="flex items-center gap-1.5"><span className="inline-block h-1.5 w-6 rounded-full bg-primary/25" /> Likely range</span>
        <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-0.5 bg-star" /> England average</span>
      </p>
      {meta.themes.map((t) => (
        <section key={t.key} id={t.key} className="mt-6 scroll-mt-28 [&+section]:mt-16" aria-labelledby={`${t.key}-h`}>
          <div className="rule-strong flex flex-wrap items-center justify-between gap-x-6 gap-y-2 pt-4">
            <h2 id={`${t.key}-h`} className="text-3xl font-normal">{t.label}</h2>
            <Stars value={p.themes[t.key]} size={18} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{t.summary}</p>
          <div className="mt-2 divide-y divide-border">
            {meta.questions
              .filter((q) => q.theme === t.key)
              .map((q) => (
                <QuestionRow key={q.key} label={q.label} summary={q.summary} median={q.median} result={p.questions[q.key]} />
              ))}
          </div>
        </section>
      ))}


      <section id="expect" className="mt-16 scroll-mt-28" aria-labelledby="expect-h">
        <h2 id="expect-h" className="rule-strong pt-4 text-3xl font-normal">What to expect</h2>
        <p className="mt-1 max-w-[42rem] text-sm text-muted-foreground">
          What happened when people last contacted the practice and got an appointment. These aren’t ratings: they
          describe how the practice works, beside England as a whole.
        </p>
        <div className="mt-4 grid gap-x-12 gap-y-8 lg:grid-cols-2">
          {meta.dists
            .filter((d) => d.key !== "age")
            .map((d) => (
              <Spread key={d.key} title={d.label} categories={d.categories} england={d.england} dist={p.dists[d.key]} />
            ))}
        </div>
      </section>

      <section id="conditions" className="mt-16 scroll-mt-28" aria-labelledby="conditions-h">
        <h2 id="conditions-h" className="rule-strong pt-4 text-3xl font-normal">Long-term conditions</h2>
        <p className="mt-1 max-w-[42rem] text-sm text-muted-foreground">
          {p.conditionShare != null ? (
            <>
              <span className="tabular">{pct(p.conditionShare)}</span> of people who answered here have a long-term
              physical or mental condition (England <span className="tabular">{pct(meta.conditionShareMedian)}</span>).{" "}
            </>
          ) : null}
          These results don’t count towards the practice’s stars.
        </p>
        <div className="mt-2 divide-y divide-border">
          {meta.questions
            .filter((q) => q.theme === "conditions")
            .map((q) => (
              <QuestionRow key={q.key} label={q.label} summary={q.summary} median={q.median} result={p.questions[q.key]} />
            ))}
        </div>
      </section>

      {ageDist && (
        <section id="who" className="mt-16 scroll-mt-28" aria-labelledby="who-h">
          <h2 id="who-h" className="rule-strong pt-4 text-3xl font-normal">Who answered here</h2>
          <p className="mt-1 max-w-[42rem] text-sm text-muted-foreground">
            The ages of people who answered the survey, a rough guide to who uses the practice.
          </p>
          <div className="mt-4 lg:w-1/2 lg:pr-6">
            <Spread title={ageDist.label} categories={ageDist.categories} england={ageDist.england} dist={p.dists.age} />
          </div>
        </section>
      )}

      {nearby.length > 0 && (
        <section className="mt-16" aria-labelledby="nearby">
          <h2 id="nearby" className="rule-strong pt-4 text-3xl font-normal">Nearby practices</h2>
          <ul className="mt-2 divide-y divide-border">
            {nearby.map(({ practice: o, miles: m }) => (
              <li key={o.code} className="flex flex-wrap items-center justify-between gap-3 py-3.5">
                <div className="min-w-0">
                  <Link href={`/practice/${o.code}`} className="font-medium hover:underline">{o.name}</Link>
                  <p className="text-sm text-muted-foreground tabular">{miles(m)} away</p>
                </div>
                <Stars value={o.stars} size={15} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-10 text-xs text-muted-foreground">
        {meta.year} GP Patient Survey (Ipsos for NHS England).
        {p.pcn && <> Part of {p.pcn}.</>} {p.icb && <>{p.icb}.</>}
      </p>
    </article>
  )
}
