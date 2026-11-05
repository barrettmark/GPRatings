---
name: GP Ratings
description: Patient survey ratings for every GP practice in England, set like a well-edited newspaper page.
colors:
  paper: "oklch(0.985 0.006 85)"
  ink: "oklch(0.23 0.03 205)"
  card-white: "oklch(1 0 0)"
  primary: "oklch(0.36 0.07 195)"
  primary-foreground: "oklch(0.985 0.006 85)"
  secondary: "oklch(0.95 0.012 85)"
  secondary-foreground: "oklch(0.27 0.04 200)"
  muted-foreground: "oklch(0.47 0.025 205)"
  accent: "oklch(0.93 0.03 190)"
  accent-foreground: "oklch(0.27 0.05 195)"
  border: "oklch(0.9 0.012 85)"
  input: "oklch(0.88 0.014 85)"
  ring: "oklch(0.55 0.08 195)"
  star: "oklch(0.76 0.15 72)"
  star-empty: "oklch(0.88 0.02 85)"
  better: "oklch(0.47 0.11 155)"
  better-soft: "oklch(0.94 0.04 155)"
  worse: "oklch(0.5 0.15 32)"
  worse-soft: "oklch(0.95 0.035 32)"
  destructive: "oklch(0.52 0.16 30)"
typography:
  display:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(2.75rem, 7.2vw, 5.5rem)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.03em"
    fontVariation: "'SOFT' 30"
  headline:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(2.25rem, 5.2vw, 4rem)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.03em"
    fontVariation: "'SOFT' 30"
  section:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "1.875rem"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.375
    letterSpacing: "-0.005em"
  figure:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 1.33
    fontFeature: "'tnum' 1"
  body:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  body-strong:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 500
    lineHeight: 1.6
  label:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
  caption:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.33
    letterSpacing: "0.01em"
rounded:
  button-xs: "6px"
  button-sm: "7px"
  button: "8px"
  segmented: "9px"
  field: "10px"
  notice: "12px"
  full: "9999px"
spacing:
  gutter: "16px"
  gutter-sm: "24px"
  row: "20px"
  section: "64px"
  section-md: "80px"
  container: "64rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.button}"
    padding: "0 12px"
    height: "32px"
  button-primary-large:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.button}"
    padding: "0 20px"
    height: "48px"
  button-outline:
    backgroundColor: "{colors.card-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.button}"
    padding: "0 16px"
    height: "44px"
  button-outline-hover:
    backgroundColor: "{colors.secondary}"
  button-ghost:
    textColor: "{colors.muted-foreground}"
    rounded: "{rounded.button-sm}"
    padding: "0 10px"
    height: "28px"
  button-ghost-hover:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.ink}"
  input-search:
    backgroundColor: "{colors.card-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "0 12px 0 40px"
    height: "48px"
  segmented-control:
    backgroundColor: "{colors.card-white}"
    rounded: "{rounded.segmented}"
    padding: "2px"
  segmented-thumb:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.button-sm}"
    height: "32px"
  badge-better:
    backgroundColor: "{colors.better-soft}"
    textColor: "{colors.better}"
    rounded: "{rounded.full}"
    padding: "2px 10px"
  badge-worse:
    backgroundColor: "{colors.worse-soft}"
    textColor: "{colors.worse}"
    rounded: "{rounded.full}"
    padding: "2px 10px"
  notice-caution:
    backgroundColor: "{colors.worse-soft}"
    textColor: "{colors.worse}"
    rounded: "{rounded.notice}"
    padding: "16px"
  compare-chip:
    backgroundColor: "{colors.card-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "2px 2px 2px 10px"
---

# Design System: GP Ratings

## Overview

**Creative North Star: "The Refined Editorial Page"**

GP Ratings reads like the data pages of a good newspaper, not like a health-service portal. The ground is warm off-white paper; text is a deep teal-black ink; one deep teal does the work of action and data; amber is kept for stars and for the England-average mark. Big Fraunces headlines at normal weight sit above generous white space, and Figtree carries everything people actually read and tap.

Structure comes from rules rather than boxes. A 2px ink rule opens a section, list or scorecard; 1px warm hairlines separate the rows inside it. Data is shown as clean horizontal bars and ruled, ranked lists, with numbers set in tabular figures. The only things that float are the things that move: the frosted masthead, the frosted compare bar, the sliding segmented-control thumb and the result dot.

The look is deliberately independent of the NHS visual language (no NHS blue, no NHS-style panels). It follows the operating system: light and dark come from `prefers-color-scheme`, and reduced motion, reduced transparency and increased contrast each have explicit fallbacks.

**Key Characteristics:**
- Warm paper ground, teal ink, amber stars; one action colour.
- Fraunces display at weight 400, tightening as it grows; Figtree body at 17px.
- 2px ink rule to open, 1px hairline to divide; no cards around lists.
- Data as bars and ranked lists, always with tabular numerals.
- Frosted, translucent chrome only on fixed elements.
- Full dark scheme and accessibility-preference fallbacks.

## Colors

A warm-neutral paper and ink palette with one deep teal for action and data, amber for ratings, and a green/red pair kept only for verdicts.

### Primary
- **Deep Harbour Teal** (primary): primary buttons, the segmented-control thumb, the practice dot on result bars, inline text links and the checkbox accent. In dark mode it becomes a pale sea-glass teal (`oklch(0.8 0.08 190)`) on a dark ground.
- **Harbour Teal Wash** (primary at 25%): the "likely range" band on result bars. It is always drawn as a translucent primary, never as a separate hue.

### Secondary
- **Amber Star** (star): filled stars, the masthead star mark, and the 2px England-average tick on result bars. Amber means rating or benchmark and nothing else.
- **Unlit Star** (star-empty): the empty part of a star row.

### Tertiary
- **Verdict Green** (better / better-soft) and **Verdict Brick** (worse / worse-soft): only for statistically confirmed "better than" / "worse than England average" pills, the best-value highlight on the compare table, the low-sample caution notice and error text. "Similar" never gets a colour.

### Neutral
- **Warm Paper** (paper): the page ground and the base of the frosted chrome.
- **Teal Ink** (ink): body text, headlines, and the 2px opening rule.
- **Sheet White** (card-white): field, outline-button and segmented-control fills; the white ring around the result dot.
- **Pale Newsprint** (secondary): the result-bar track, hover fills, ghost-button hover, the "similar" state.
- **Slate Teal Grey** (muted-foreground): supporting text, metadata, captions, inactive nav.
- **Hairline** (border) and **Field Edge** (input): 1px row dividers and control outlines.
- **Focus Teal** (ring): the 2px focus outline (offset 2px) and the input focus ring.

### Named Rules
**The Amber Means Rating Rule.** Amber marks stars and the England average and nothing else: no amber buttons, links or decoration.

**The Quiet Similar Rule.** Colour is earned by a confirmed difference. "Not clearly different" stays plain muted text; only better/worse get tinted pills.

**The Tokens-Only Rule.** UI colours come from the CSS custom properties so both schemes stay in step. The only allowed exception is the Leaflet marker ramp (see Components), because SVG path attributes cannot read CSS variables.

## Typography

**Display Font:** Fraunces (with Georgia, serif), variable, with optical sizing on and the `SOFT` axis
**Body Font:** Figtree (with system-ui, sans-serif)

**Character:** A soft, high-contrast old-style serif for the voice of the page, paired with a plain, friendly geometric sans for reading and controls. The serif is never bold. Weight 400 at large sizes is what makes it read as editorial.

### Hierarchy
- **Display** (400, clamp 2.75rem–5.5rem, line-height 1.02, -0.03em, SOFT 30): the home headline only, at most about 4xl measure.
- **Headline** (400, clamp 2.25rem–4rem, 1.02): a practice name as the page h1.
- **Section** (400, 1.875rem rising to 2.25rem on the home page, 1.15, -0.015em): section heads, always sitting on a 2px ink rule.
- **Title** (400, 1.25–1.375rem, snug): practice names in ranked lists, theme names on the home page.
- **Figure** (Fraunces 400, 1.5–1.875rem, tabular): percentages beside a question and the overall star value. Big numbers are set in the serif.
- **Body** (400, 1.0625rem / 17px, 1.6): running text; lead paragraphs step up to 1.125–1.25rem and are capped near 38rem.
- **Body strong** (Figtree 500): question labels, link names in lists, nav-level emphasis.
- **Label** (400, 0.875rem): metadata, captions, verdict text, controls.
- **Caption** (0.75rem, +0.01em): map key, compare count, footnotes.

### Named Rules
**The Tracking Follows Size Rule.** Headings tighten as they grow (h1 -0.03em, h2 -0.015em, h3/h4 -0.005em); the smallest text opens up slightly (+0.01em). Headings use `text-wrap: balance`, paragraphs use `pretty`.

**The Tabular Figures Rule.** Every number that can sit next to another number (percentages, counts, distances, ranks) uses tabular numerals.

## Layout

A single centred column with a 64rem maximum width and 16px gutters (24px from the small breakpoint up). Home sections run 64px top and bottom (80px from md). Ruled rows have 20px vertical padding (14px in compact lists). Two-column splits appear only from md/lg (home explainer 1fr / 1.35fr; practice header 1.25fr / 1fr scorecard) and collapse to one column on phones, the primary scene. Text measure is held near 38rem for leads and about 42rem for the search field. Section anchors scroll to 112px below the top so the sticky masthead never covers them. The footer reserves 96px of bottom padding so the compare bar never hides content. Tap targets are at least 44px (compare toggle, theme rows, search controls).

## Elevation & Depth

The system is flat paper with material chrome. Content surfaces have no shadows; hierarchy comes from rules, type scale and white space. Depth appears only on elements that are fixed or that move: the masthead and compare bar are translucent paper (72% background, 20px blur, 180% saturate), and the masthead grows a soft 14px shadow only once content has scrolled under it (scroll-driven; a 1px hairline where scroll timelines are unsupported). Reduced transparency and increased contrast both turn the material solid; increased contrast adds a 1px ink edge.

### Shadow Vocabulary
- **Scroll edge** (14px gradient of ink at 7% fading to transparent, under the masthead): appears over the first 40px of scroll.
- **Lifted bar** (`box-shadow: 0 -10px 30px -14px rgb(0 0 0 / 0.25)`): the compare bar only.
- **Small lift** (Tailwind `shadow-sm`): the result-bar dot and the segmented thumb, the two moving markers.
- **Hairline lift** (`shadow-xs`): the search field and compare chips.

### Named Rules
**The Only-What-Floats Rule.** A shadow or blur means the element sits above the page or is moving. Static content never gets one.

## Shapes

Gently rounded controls, square editorial structure. Buttons are 8px (7px small, 6px extra-small), the search field 10px, the segmented control 9px outside and 7px inside. Verdict pills, compare chips, result-bar tracks, bands and dots are fully round. Structure (sections, lists, scorecards) has no corners at all, because it is drawn with rules, not boxes. The star is one five-point shape used as a CSS mask, tiled at 1.14× its size so half ratings cut a star exactly down the middle; the same path is the masthead mark.

## Components

### Buttons
Restrained and tactile: ink-solid primary with a turning arrow.
- **Shape:** gently curved (8px; 7px small; 6px extra-small).
- **Primary:** teal fill, paper text softened 12% toward teal at rest and full paper on hover. A trailing arrow turns 360° once on hover (300ms). Pressing scales to 0.98 and lightens the fill 14% toward white. Heights 32px default, 48px large in the hero search.
- **Loading:** a spinning circular-arrows icon before the label; the arrow is hidden and the button disabled.
- **Outline:** white sheet fill, field-edge border, ink text, pale-newsprint hover. Used at 44px with a leading icon for Call and Directions, and without the arrow.
- **Ghost:** muted text, newsprint fill on hover (compare bar Clear).
- **Link:** no box; a 1px underline grows in from the left on hover (300ms, `cubic-bezier(0.65,0.05,0.36,1)`).
- **Focus:** a 3px teal ring at 40%.

### Chips
- **Verdict pills:** fully round, 2px × 10px, 14px medium text, green-on-soft-green or brick-on-soft-brick. "Similar" is plain muted text.
- **Compare chips:** fully round white sheet at 80%, 1px hairline ring, 12px text, with a 24px round remove button.

### Inputs / Fields
- **Style:** white sheet, 1px field edge, 10px radius, hairline lift, leading search icon in muted grey. 48px tall in the hero, 44px on phones and 40px on desktop elsewhere. The caret is teal.
- **Focus:** the border turns focus teal with a 3px focus-teal ring at 30%.
- **Error:** a brick message under the field; no red outline.
- **Select:** matches the segmented-control height (38px) and its 9px radius.

### Navigation
- **Masthead:** sticky, 80px, frosted paper. Wordmark in Fraunces semibold 20px (24px from sm) beside the logo mark (56px); two plain links (Search, How ratings work) in muted 14px that turn ink on hover and dim to 60% when pressed.
- **Compare bar:** frosted, fixed to the bottom, respects the safe area. It slides in and out along the same path (380ms, `cubic-bezier(0.25,1,0.5,1)`) and keeps its last chips while leaving.

### Segmented Control
A white track with a 1px field edge and 2px padding. A single teal thumb slides between equal-width segments (300ms, `cubic-bezier(0.25,1,0.5,1)`) instead of jumping. The active label is paper; inactive labels are muted and turn ink on hover. Used for List/Map and Nearest/Highest rated.

### Ruled Result List
Opens with a 2px ink rule; rows are separated by 1px hairlines with 20px padding. The practice name is a serif title whose link covers the whole row, underlined on hover. Overall stars (40px) sit on the right with a "% rate it good overall" line, then three theme star rows (14px) and a Compare toggle. Rank numbers appear in muted serif only when sorted by rating, so "1" never means "best" in a distance sort.

### Result Bar
The data signature. A 6px rounded newsprint track from 0–100%; a translucent teal band for the likely range; a 2px amber tick for the England average; a 14px teal dot with a 2px white ring for the practice. A three-item key (dot, band, tick) always appears near the first bar on a page.

### Spread Table
For answers that describe how a practice works rather than how good it is ("What to expect", "Who answered here"). Opens on a 1px hairline with a Figtree 500 title and the "N people answered" count (brick, with "treat with caution", under 30). Each category is a row: label, an 8px newsprint track with a teal (primary 85%) fill for the practice's share and a 2px amber England tick, the practice share in tabular figures, then England's share in muted text under small "This practice" / "England" column heads. No stars and no verdict colour, because these are not ratings. Two columns from lg, one on phones.

### Logo
A map pin holding a medical plus, redrawn from the 2013 GP Ratings app icon (`components/logo.tsx`). Teal pin, white disc, teal plus, drawn from theme tokens so it follows light and dark mode. The plus is never red on white (the Red Cross emblem is legally protected) and the pin is never NHS blue. Browser-tab icon: `app/icon.svg` (switches to sea-glass teal in dark mode). Phone home-screen icon: `app/apple-icon.png`, rendered from `assets/app-icon.svg`: a paper-white pin on teal with the original five amber stars beneath. Amber stays reserved for ratings, which is why the stars appear only in the app icon and the home emblem, not in the header mark. **Home emblem** (`LogoEmblem`): the pin above the five amber stars, beside the headline on desktop (240–288px wide) and above it on phones (112px). Its one authored moment: the pin settles in with a slight overshoot (700ms), then the stars light left to right (110ms apart). Reduced motion shows it still.

### Stars
Rating stars: a CSS-mask star tiled five times. An unlit row sits under an amber row clipped to value × 20%. Half-star steps only. Null shows the words "No rating", never zero stars. Sizes run 14px (inline themes) to 28px (scorecard).

### Map Markers
Leaflet circle markers with a white stroke, coloured by a five-step hard-coded ramp (deep teal → teal → ochre → orange → brick) with a dark-slate search pin. They use hex because SVG attributes cannot read CSS variables. The ramp is mirrored in the map key and must be changed in both places together.

## Do's and Don'ts

### Do:
- **Do** open every section, list and scorecard with a 2px ink rule and divide its rows with 1px hairlines.
- **Do** set headlines in Fraunces at weight 400 with tracking that tightens with size; keep the serif for headlines, titles and big figures.
- **Do** show every percentage alongside its likely range, the England average and the number of people who answered, using the result bar and tabular figures.
- **Do** keep amber for stars and the England-average tick only.
- **Do** keep blur and shadow to fixed or moving elements, with solid fallbacks for reduced transparency and increased contrast.
- **Do** give touch targets at least 44px and keep each animation's reduced-motion fallback.

### Don't:
- **Don't** wrap lists or data rows in rounded, bordered cards; structure is drawn with rules.
- **Don't** colour the "similar" verdict or use green/brick for anything but confirmed differences and cautions.
- **Don't** use NHS blue or NHS-style panels; the product must never look like an official NHS service.
- **Don't** set the display serif bold, or set big numbers in the sans.
- **Don't** hard-code colours in components; the Leaflet marker ramp is the only exception.
- **Don't** show star ranks as position numbers in a distance-sorted list.
