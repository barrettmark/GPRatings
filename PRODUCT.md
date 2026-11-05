# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

People in England choosing a GP practice: usually moving house, newly registering, or unhappy with their current practice. They are typically on a phone, comparing roughly 3 to 10 practices near a postcode, and are not data specialists.

## Product Purpose

GP Ratings turns the national GP Patient Survey into ratings anyone can read. Success is a confident shortlist: the visitor leaves knowing which nearby practices patients rate well, on what (getting through, appointments, care), and how certain that is, then calls or registers.

## Positioning

Independent and honest about uncertainty. Every practice in England is ranked against every other on each survey question, and a practice is only called better or worse than average when the survey's margin of error confirms it. Small samples are flagged rather than hidden.

## Operating Context

- Entry points: postcode, postcode district, town or practice name, or device location.
- Results: nearest practices as a list or map, sortable by distance or rating; up to 3 practices compared side by side.
- Practice pages: overall stars, three themes, 16 question results with likely range and England average, call and directions, nearby practices.
- Data refreshes yearly when the new survey is published (scripts in `scripts/`).

## Capabilities and Constraints

- Next.js 16 (App Router, Cache Components), Tailwind 4, shadcn tokens, Leaflet with OpenStreetMap tiles.
- No accounts, no database: data is precomputed JSON (`data/`, `public/data/index.json`).
- Coverage: 6,166 practices in England; 2026 survey, 654,714 responses.
- Question labels are plain-English paraphrases of survey question codes; official wording not yet confirmed.

## Brand Commitments

- Name: GP Ratings.
- Independent, not NHS: must never look or sound like an official NHS service, and says so plainly.
- Honest about uncertainty: always show how many people answered and the likely range; never overstate a difference.
- Plain English: no jargon such as "deciles", "confidence interval" or "weighted" in the interface; explain as to a friend. Method detail lives on the "How ratings work" page.

## Evidence on Hand

- 2026 GP Patient Survey practice results (Ipsos for NHS England), NHS Organisation Data Service addresses, postcodes.io coordinates.
- No testimonials, press, partners or usage figures exist; do not invent any.

## Product Principles

1. Help people decide, not browse: lead with the shortlist and the reasons behind it.
2. Show certainty alongside every number; never let stars imply more precision than the data has.
3. Patient experience is not clinical quality; say so where it matters.
4. Phone first: the main scene is someone comparing practices on a mobile.

## Accessibility & Inclusion

Public audience of all ages, including older and less confident users. Aim for WCAG 2.2 AA: readable type sizes, strong contrast, large tap targets, and support for reduced motion, reduced transparency and increased contrast.
