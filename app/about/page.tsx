import type { Metadata } from "next"
import type { Meta } from "@/lib/types"
import metaJson from "@/data/meta.json"
import { AREA_PHRASES, longDate, pct } from "@/lib/format"

const meta = metaJson as Meta
const fmt = (n: number) => n.toLocaleString("en-GB")

export const metadata: Metadata = { title: "How ratings work" }

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-4xl font-medium sm:text-5xl">How ratings work</h1>
      <div className="mt-8 space-y-10 text-[1.05rem] leading-relaxed">
        <section>
          <h2 className="text-2xl font-medium">Where the data comes from</h2>
          <p className="mt-3 text-muted-foreground">
            Every year, NHS England asks a sample of patients at every GP practice in England about their
            experience. The {meta.year} GP Patient Survey, run by Ipsos, received {fmt(meta.responses)} responses
            across {fmt(meta.practiceCount)} practices. We use the published, weighted practice results, which
            adjust for the age and gender of the people who replied. Practice addresses and phone numbers come
            from the NHS Organisation Data Service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-medium">From answers to stars</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-muted-foreground marker:text-foreground">
            <li>For each question we take the share of patients who answered positively, for example “very good” or “fairly good”.</li>
            <li>We rank every practice in England on that question.</li>
            <li>The rank becomes a star rating in half-star steps. Each half star is a tenth of practices: 5 stars is the top 10%, 0.5 stars the bottom 10%.</li>
            <li>The headline rating is patients’ own verdict: their overall experience of the practice.</li>
            <li>Theme ratings (getting through, appointments, care) combine the rankings of the questions in that theme.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-medium">Allowing for small samples</h2>
          <p className="mt-3 text-muted-foreground">
            A result from a handful of patients can look excellent or terrible by chance. Before ranking, we pull
            each result towards the England average, more strongly the less certain it is. A practice where 95%
            of 20 people were happy needs more evidence to reach the top than one where 95% of 200 were. The
            percentages we show are the survey’s own; only the ranking allows for uncertainty.
          </p>
        </section>

        {meta.deprivationGroups.length > 0 && (
          <section id="similar" className="scroll-mt-28">
            <h2 className="text-2xl font-medium">Compared with similar areas</h2>
            <p className="mt-3 text-muted-foreground">
              Practices serving poorer areas tend to get lower scores, partly because of the challenges their
              patients face, not only how well the practice runs. So alongside the national rank, each practice is
              ranked against the fifth of practices whose patients live in similarly deprived areas. This uses the
              government’s Index of Multiple Deprivation 2025 for each practice’s registered patients.
            </p>
            <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-card">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="p-3 font-normal">Practices whose patients live in</th>
                    <th className="p-3 text-right font-normal">Typical overall experience</th>
                  </tr>
                </thead>
                <tbody>
                  {meta.deprivationGroups.map((g, i) => (
                    <tr key={g.label} className="border-b border-border/60 last:border-0">
                      <td className="p-3">{AREA_PHRASES[i]}</td>
                      <td className="p-3 text-right tabular">{pct(g.overallMedian)} good</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section>
          <h2 className="text-2xl font-medium">Better, similar or worse</h2>
          <p className="mt-3 text-muted-foreground">
            Surveys only ask some patients, so every result has a margin of error. The survey publishes a likely
            range (a 95% confidence interval) for each result. We only call a practice “better” or “worse” than
            the England average when its whole range sits above or below that average. Otherwise we say
            “similar”, even if its stars differ.
          </p>
          <p className="mt-3 text-muted-foreground">
            Where fewer than {meta.minRespondents} people answered a question, we show the result but flag it.
            Where the survey withheld a result because too few people answered, we show “not enough responses”.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-medium">The questions</h2>
          <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="p-3 font-normal">Measure</th>
                  <th className="p-3 font-normal">Theme</th>
                  <th className="p-3 text-right font-normal">England average</th>
                </tr>
              </thead>
              <tbody>
                {meta.questions.map((q) => (
                  <tr key={q.key} className="border-b border-border/60 last:border-0">
                    <td className="p-3">
                      <span className="font-medium">{q.label}</span>
                      <span className="block text-muted-foreground">{q.summary}</span>
                    </td>
                    <td className="p-3 text-muted-foreground">
                      {q.theme === "overall"
                        ? "Overall"
                        : q.theme === "conditions"
                          ? "Long-term conditions (not in stars)"
                          : meta.themes.find((t) => t.key === q.theme)?.label}
                    </td>
                    <td className="p-3 text-right tabular">{pct(q.median)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {meta.registeredAsOf && (
          <section id="size" className="scroll-mt-28">
            <h2 className="text-2xl font-medium">Practice size</h2>
            <p className="mt-3 text-muted-foreground">
              Practice size comes from the number of patients registered with each practice on{" "}
              {longDate(meta.registeredAsOf)}, published by NHS England (Patients Registered at a GP Practice). The
              typical practice in England has about {meta.registeredMedian?.toLocaleString("en-GB")} patients. Size
              tells you nothing about quality on its own, but bigger practices often offer more services and longer
              opening hours, while smaller ones can feel more personal.
            </p>
            <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-card">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="p-3 font-normal">Label</th>
                    <th className="p-3 text-right font-normal">Registered patients</th>
                  </tr>
                </thead>
                <tbody>
                  {meta.sizeBands.map((b) => (
                    <tr key={b.key} className="border-b border-border/60 last:border-0">
                      <td className="p-3 font-medium">{b.label}</td>
                      <td className="p-3 text-right tabular">
                        {b.to == null
                          ? `${b.from.toLocaleString("en-GB")} or more`
                          : b.from === 0
                            ? `Under ${(b.to + 1).toLocaleString("en-GB")}`
                            : `${b.from.toLocaleString("en-GB")} to ${b.to.toLocaleString("en-GB")}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section>
          <h2 className="text-2xl font-medium">What to expect</h2>
          <p className="mt-3 text-muted-foreground">
            Practice pages also show what happened at people’s last appointment: how soon it took place, whether
            it was face to face, who they saw, and how they got in touch. These describe how a practice works rather
            than how good it is, so they have no stars. We leave out answers like “I can’t remember” and show each
            practice beside England as a whole.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-medium">What ratings don’t tell you</h2>
          <p className="mt-3 text-muted-foreground">
            These ratings describe patient experience, not clinical quality or safety. For inspection results,
            see the Care Quality Commission. Practices change, and survey responses were collected in early{" "}
            {meta.year}. GP Ratings is independent and is not part of the NHS.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-medium">Background</h2>
          <p className="mt-3 text-muted-foreground">
            GP Ratings first launched in 2013 as an iPhone app built on 42 million pieces of patient feedback.
            This version rebuilds it for the web using the latest survey.
          </p>
        </section>
      </div>
    </article>
  )
}
