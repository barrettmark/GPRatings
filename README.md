# GP Ratings

Find and compare GP practices in England using the GP Patient Survey. A web rebuild of the
2013 GP Ratings iPhone app.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # prerenders every practice page (~1 minute)
```

## Data

The app reads three generated files:

| File | What | Used by |
|---|---|---|
| `data/practices.json` | Full results per practice (~14 MB) | Practice and compare pages (server) |
| `data/meta.json` | Questions, themes, England medians | All pages |
| `public/data/index.json` | Compact list for search (~0.9 MB) | Search page (browser) |

### Refresh with a new survey year

1. Download the practice-level weighted CSV from https://www.gp-patient.co.uk/surveysandreports
2. Fetch addresses and coordinates (about 25 minutes; re-runs skip practices already fetched):
   ```bash
   python3 -I scripts/fetch_locations.py <survey.csv> data/raw/locations.json
   ```
3. Download the latest practice totals ("Totals (GP practice-all persons)", `gp-reg-pat-prac-all.zip`) from
   https://digital.nhs.uk/data-and-information/publications/statistical/patients-registered-at-a-gp-practice
   and unzip it into `data/raw/nhs-registered/`.
4. Download practice deprivation scores (OHID Fingertips indicator 94240, "Deprivation score (IMD 2025)"):
   ```bash
   curl -s -o data/raw/deprivation/practice-imd.csv \
     "https://fingertips.phe.org.uk/api/all_data/csv/by_indicator_id?indicator_ids=94240&child_area_type_id=7"
   ```
   Build the app data:
   ```bash
   python3 -I scripts/build_data.py <survey.csv> data/raw/locations.json \
     data/raw/nhs-registered/gp-reg-pat-prac-all.csv data/raw/deprivation/practice-imd.csv
   ```
5. Update `SURVEY_YEAR` in `scripts/build_data.py`, and check that the keys in `QUESTIONS` and `DISTRIBUTIONS` still
   exist in the new CSV (the questionnaire changes occasionally). The survey's "List of reporting variables"
   workbook (second sheet) gives the wording and answer options for every column; option numbers in
   `DISTRIBUTIONS` come from it.

Sources: GP Patient Survey (Ipsos for NHS England), NHS Organisation Data Service (ORD API),
Patients Registered at a GP Practice (NHS England), Deprivation score IMD 2025 (OHID Fingertips), postcodes.io.

## How ratings work

- Each question uses the survey's published "% positive" with its 95% confidence interval.
  `-97` / `-98` in the CSV mean the result was suppressed (too few responses).
- Shrinkage: each result is pulled towards the national mean by its uncertainty before ranking (empirical
  Bayes, beta-binomial; effective sample size from the published 95% interval on the log-odds scale, so survey
  weighting is respected). Displayed percentages are unchanged.
- Stars: national percentile rank of the shrunk value in deciles, 0.5 to 5.0 (same idea as the 2013 app).
- Similar areas: practices split into fifths by IMD 2025 deprivation of their registered population; each is
  also ranked within its fifth.
- "Better/worse than England average" only when the whole confidence interval is above/below the median.
- Results from fewer than 30 respondents are flagged.
- Theme stars (Getting through, Appointments, Care) re-rank the mean percentile of the theme's questions.

## Notes

- Map tiles come from the public OpenStreetMap server, which is fine for light use. For real
  traffic, switch to a tile provider (e.g. MapTiler, Stadia) per the OSM tile usage policy.
- Unknown practice codes show the not-found page with a 200 status plus `noindex`. This is
  how Next.js 16 behaves with Cache Components (`dynamicParams` isn't available).
