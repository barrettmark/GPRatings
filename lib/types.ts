export type Comparison = "better" | "similar" | "worse"

export type QuestionResult = {
  /** share of patients answering positively, 0-1 */
  p: number
  /** 95% confidence interval */
  lo: number | null
  hi: number | null
  /** people who answered */
  n: number
  stars: number
  /** national percentile rank, 0-1 */
  pr: number
  cmp: Comparison
  /** fewer than the minimum respondents */
  low: boolean
}

export type ThemeKey = "access" | "appointments" | "care"

export type SizeKey = "small" | "medium" | "large" | "verylarge"

/** Share of answers in each category, re-based to exclude "can't remember" style answers */
export type Distribution = { s: number[]; n: number; low: boolean }

export type Practice = {
  code: string
  name: string
  address: string[]
  postcode: string | null
  phone: string | null
  lat: number | null
  lng: number | null
  active: boolean
  pcn: string | null
  icb: string | null
  /** Rank among practices serving similarly deprived areas (fifths by IMD 2025) */
  similar: { group: number; stars: number | null; themes: Partial<Record<ThemeKey, number>> } | null
  /** IMD 2025 deprivation score of the registered population */
  deprivation: number | null
  /** NHS registered list size; null when the practice isn't in the NHS file */
  patients: number | null
  size: SizeKey | null
  surveysSent: number
  responses: number
  responseRate: number
  stars: number | null
  themes: Partial<Record<ThemeKey, number>>
  questions: Record<string, QuestionResult>
  /** Answer spreads keyed by Meta.dists[].key */
  dists: Record<string, Distribution>
  /** Share of people who answered with a long-term condition */
  conditionShare: number | null
}

/** Compact search index entry (public/data/index.json) */
export type IndexEntry = {
  c: string
  n: string
  pc: string | null
  tw: string | null
  la: number
  lo: number
  s: number | null
  /** theme stars in THEME order: access, appointments, care */
  t: (number | null)[]
  /** overall % positive */
  op: number | null
  r: number
  a: 0 | 1
  /** seen the same day, share */
  sd: number | null
  /** seen face to face, share */
  ff: number | null
  /** practice size band and registered patients */
  sz: SizeKey | null
  np: number | null
}

export type Meta = {
  year: number
  minRespondents: number
  practiceCount: number
  responses: number
  themes: { key: ThemeKey; label: string; summary: string }[]
  questions: { key: string; theme: ThemeKey | "overall" | "conditions"; label: string; summary: string; median: number }[]
  conditionShareMedian: number
  /** ISO date of the NHS registered-patients extract */
  registeredAsOf: string | null
  registeredMedian: number | null
  sizeBands: { key: SizeKey; label: string; from: number; to: number | null }[]
  deprivationGroups: { label: string; from: number | null; to: number | null; overallMedian: number }[]
  dists: { key: string; label: string; categories: string[]; england: number[] }[]
}
