# Typography Bake-off

Status: **COMPARISON COMPLETE — NO FINAL FONT INSTALLED**  
Production checkpoint: `58c6162`  
Comparison date: 2026-08-27

## 1. Methodology

The approved static page was rendered under four conditions:

1. Arial / Helvetica development baseline;
2. Inter;
3. Source Sans 3;
4. IBM Plex Sans.

Every render used the same commit, content, theme state, viewport, section
geometry, font sizes, line heights, tracking, widths, absolute offsets, and
breakpoints. Candidate CSS was injected only by a temporary Playwright test
against one production build. It overrode the existing `--font-sans` value but
did not edit production CSS. No candidate-specific compensation was applied.

The test used one Roman variable WOFF2 per candidate and declared only the
weight range used by the page: `400 500`. `font-display: block` and explicit
`document.fonts.load()` waits made capture timing deterministic. All candidates
used the Latin subset, which contains the Portuguese characters present on the
page. The comparison mechanism and font files were removed after capture.

Captured states were identical:

- desktop light: 1440 × 900 viewport;
- desktop dark: 1440 × 900 viewport;
- tablet light: 820 × 1180 viewport;
- mobile light: 390 × 844 viewport;
- default Contact decision state;
- full page at scroll position zero;
- focused desktop-light crops of Hero, Territórios, and Contact.

`metrics.json` records the computed family, measured text widths, line counts,
critical vertical gaps, option wrapping estimates, and document overflow for
each render.

## 2. Candidate sources and licenses

All three candidates were validated before use. No commercial font was sought
or downloaded.

| Candidate     | Comparison package                         | Upstream                                                        | License     | File used                                |
| ------------- | ------------------------------------------ | --------------------------------------------------------------- | ----------- | ---------------------------------------- |
| Inter         | `@fontsource-variable/inter@5.3.0`         | [RSMS Inter](https://github.com/rsms/inter)                     | SIL OFL 1.1 | Latin Roman variable WOFF2, 48,256 bytes |
| Source Sans 3 | `@fontsource-variable/source-sans-3@5.3.0` | [Adobe Source Sans](https://github.com/adobe-fonts/source-sans) | SIL OFL 1.1 | Latin Roman variable WOFF2, 28,740 bytes |
| IBM Plex Sans | `@fontsource-variable/ibm-plex-sans@5.3.0` | [IBM Plex](https://github.com/IBM/plex)                         | SIL OFL 1.1 | Latin Roman variable WOFF2, 45,712 bytes |

The packages came from the public npm registry and identify
`fontsource/font-files` as their repository and `OFL-1.1` as their font
license. Fontsource documents its reviewed provenance and family-level license
records in its [registry](https://github.com/fontsource/fontsource/blob/main/registry/README.md).
The package code/distribution tooling is MIT; the font binaries retain their
upstream OFL licenses.

## 3. Screenshot evidence

All preserved evidence is under `docs/assets/typography-bakeoff/`.

Each candidate folder (`arial/`, `inter/`, `source-sans-3/`, and
`ibm-plex-sans/`) contains:

- `desktop-1440-light-full.png`;
- `desktop-1440-dark-full.png`;
- `tablet-820-light-full.png`;
- `mobile-390-light-full.png`;
- `hero.png`;
- `territories.png`;
- `contact.png`.

Direct sheets:

- [`comparison-hero.png`](assets/typography-bakeoff/comparison-hero.png)
- [`comparison-territories.png`](assets/typography-bakeoff/comparison-territories.png)
- [`comparison-contact.png`](assets/typography-bakeoff/comparison-contact.png)
- Raw measurements: [`metrics.json`](assets/typography-bakeoff/metrics.json)

The sheets retain candidate order: Arial / Helvetica, Inter, Source Sans 3,
IBM Plex Sans. They place unmodified 1440px crops beside one another and add
only neutral labels.

## 4. Metric observations

### Hero

| Candidate         | First line at 1440 | Difference from Arial | Block height | First line at 820 | First line at 390 / box | Result                                                    |
| ----------------- | -----------------: | --------------------: | -----------: | ----------------: | ----------------------: | --------------------------------------------------------- |
| Arial / Helvetica |           629.83px |                     — |     176.63px |          514.98px |          347.84 / 346px | Existing 1.84px fallback clipping at mobile edge          |
| Inter             |           663.17px |                +5.29% |     176.63px |          542.52px |          366.69 / 346px | **20.69px clipped on mobile**; materially wider           |
| Source Sans 3     |           580.33px |                −7.86% |     176.63px |          474.08px |          319.88 / 346px | Robust fit, but noticeably reduces headline tension       |
| IBM Plex Sans     |           629.02px |                −0.13% |     176.63px |          514.30px |          347.39 / 346px | Closest to baseline; 1.39px fallback-like mobile clipping |

The explicit two-line structure remains in all cases because the markup authors
the break. CSS fixes the block height, so the principal cost is horizontal and
optical rather than vertical. Inter's mobile excess is hidden by the Hero's
`overflow: clip`; the absence of document-level overflow does not make it a
valid fit.

Supporting-copy line counts:

- Arial: 3 desktop / 4 tablet / 4 mobile;
- Inter: 3 / **5** / 4;
- Source Sans 3: 3 / 4 / **3**;
- IBM Plex Sans: 3 / **5** / 4.

### Territórios and Selected Work

Desktop title widths:

| Candidate         |   WEB | PRODUTOS | SISTEMAS | Selected Work WEB / PRODUTO / SISTEMAS |
| ----------------- | ----: | -------: | -------: | -------------------------------------: |
| Arial / Helvetica | 60.84 |   150.34 |   133.75 |               102.86 / 224.02 / 225.45 |
| Inter             | 59.81 |   147.14 |   132.95 |               101.08 / 219.75 / 224.09 |
| Source Sans 3     | 50.30 |   125.73 |   109.11 |                84.78 / 188.23 / 183.20 |
| IBM Plex Sans     | 56.63 |   135.92 |   124.83 |                95.63 / 203.44 / 210.16 |

Inter stays close to Arial in the uppercase labels but does not retain that
advantage elsewhere. IBM Plex Sans is approximately 7–10% narrower while
maintaining comparable visual weight. Source Sans 3 is about 16–19% narrower,
materially changing the balance between words, empty space, and geometry.

At 820px, Inter adds one line to the PRODUTOS description. Source Sans 3 removes
one line from SISTEMAS, and on mobile it reduces every territory description
from four lines to three. IBM Plex Sans preserves the Arial territory line
counts at all measured widths.

### Marco / Prática

| Candidate         | Note lines 1440 / 820 / 390 | Note-to-first-principle gap 1440 / 820 / 390 |
| ----------------- | --------------------------- | -------------------------------------------- |
| Arial / Helvetica | 7 / 10 / 10                 | 4.56 / −99.69 / 57.81px                      |
| Inter             | **8 / 11 / 11**             | **−30.19 / −134.44 / 26.81px**               |
| Source Sans 3     | 7 / 10 / 10                 | 4.56 / −99.69 / 57.81px                      |
| IBM Plex Sans     | 7 / 10 / 10                 | 4.56 / −99.69 / 57.81px                      |

The negative tablet value already exists in the pending-copy baseline and is
not corrected here. Inter worsens it by 34.75px and introduces a desktop
overlap where the fallback retains a small positive gap. This is a concrete
font-metric cost, not a preference judgment.

### Contact

- Arial, Source Sans 3, and IBM Plex Sans keep the intro at two lines on all
  measured viewports.
- Inter changes the intro to **three lines at desktop and tablet**.
- Default 820px decision wrapping is 1 / 2 / 2 / 2 lines for every candidate.
- Across all branch options at 820px, Inter and IBM Plex Sans change
  “Ainda estou tentando entender” from two lines to three. Source Sans 3 changes
  “Já consigo explicar” from two lines to one. Other measured option counts
  match the baseline.
- No candidate creates document-level horizontal overflow at 390, 820, or
  1440px. No missing glyph or contrast regression was observed.

### Absolute-position effects

- Inter materially affects Hero mobile clipping, Hero supporting-copy height,
  Practice spacing, Contact intro height, and one Contact branch option.
- Source Sans 3 produces no collision, but its compact widths change the
  intended spatial tension across Hero, Territórios, Selected Work, and mobile
  paragraph rhythm.
- IBM Plex Sans preserves the most important absolute relationships. Its costs
  are the already-near-boundary mobile headline and one additional tablet
  Contact line in a secondary branch.

## 5. Evaluation matrix

For positive criteria, 5 means strongest fit. For the two risk criteria, 1
means low risk and 5 means high risk. Scores guide discussion; they are not
summed to select a winner.

| Criterion                         | Arial / Helvetica                         | Inter                                                           | Source Sans 3                                            | IBM Plex Sans                                                   |
| --------------------------------- | ----------------------------------------- | --------------------------------------------------------------- | -------------------------------------------------------- | --------------------------------------------------------------- |
| Hero authority                    | **4** — broad and direct, but generic     | **4** — strong, though width becomes forceful                   | **3** — calmer and smaller in perceived scale            | **5** — authoritative without extra size                        |
| Quiet confidence                  | **4** — neutral and unobtrusive           | **4** — controlled but familiar                                 | **4** — restrained and open                              | **4** — assured; distinctive details remain quiet               |
| Editorial character               | **2** — utilitarian baseline              | **2** — product-oriented                                        | **5** — strongest textual/editorial voice                | **4** — editorial with industrial structure                     |
| Engineering precision             | **3** — functional neutrality             | **4** — highly systematic                                       | **3** — more humanist than engineered                    | **5** — precise structure and technical lineage                 |
| Human warmth                      | **3** — serviceable                       | **2** — cool and interface-led                                  | **5** — open, readable, humane                           | **4** — human details within a constructed frame                |
| Distinctiveness                   | **2** — intentionally disposable          | **2** — highly familiar on the web                              | **3** — recognizable but not dominant                    | **5** — clearest non-generic identity                           |
| Readability                       | **4** — stable screen default             | **5** — excellent screen optimization                           | **5** — excellent reading color                          | **5** — strong at display and text sizes                        |
| Portuguese rendering              | **4** — complete for current copy         | **5** — clean diacritics                                        | **5** — especially natural text rhythm                   | **5** — clear diacritics and punctuation                        |
| Body-text quality                 | **3** — adequate, uneven color            | **4** — crisp but somewhat UI-like                              | **5** — best paragraph texture                           | **4** — readable with slightly firmer texture                   |
| Metadata quality                  | **3** — adequate                          | **5** — compact and exact                                       | **4** — clear but softer                                 | **4** — distinctive while remaining legible                     |
| Contact conversational quality    | **4** — neutral baseline                  | **2** — intro breaks and UI association weaken speech           | **5** — most conversational and approachable             | **4** — clear and human, with one tablet wrapping cost          |
| Dark-mode character               | **3** — functional                        | **4** — crisp, potentially product-like                         | **4** — calm and readable                                | **5** — strongest material presence without glow                |
| Desktop metric fit                | **5** — reference condition               | **2** — Practice and Contact disruptions                        | **4** — no breakage, but broad compositional compression | **5** — closest headline and stable relationships               |
| Tablet robustness                 | **5** — reference condition               | **2** — added lines across multiple critical areas              | **5** — most robust wrapping                             | **4** — stable except support and one Contact branch            |
| Mobile robustness                 | **4** — slight existing headline clipping | **1** — 20.69px headline clipping and extra Practice line       | **5** — cleanest fit                                     | **4** — baseline-like 1.39px headline clipping                  |
| Intended Söhne direction          | **3** — only a neutral placeholder        | **4** — contemporary grotesque behavior, but more product-coded | **2** — more humanist and text-led                       | **3** — less neutral, but similarly controlled and contemporary |
| Generic SaaS appearance risk      | **3** — generic system default            | **5** — strongest product/SaaS association                      | **2** — more editorial than SaaS                         | **1** — most ownable identity                                   |
| Excessive “tech” personality risk | **1** — no particular voice               | **3** — web-product coding                                      | **1** — low technology signaling                         | **4** — IBM/engineering association is explicit                 |

## 6. Candidate assessment and adaptation cost

### Inter — HIGH ADAPTATION COST

**Strengths:** crisp metadata, strong technical control, good dark rendering,
and uppercase widths close to the fallback.

**Risks:** the 1440/820 Contact intro becomes three lines; the pending Practice
note gains a line and overlaps the first principle on desktop; Hero support
gains a tablet line; and the mobile Hero first line exceeds its box by 20.69px.
It also makes the page read more like a familiar product interface. Fixing these
issues would require exactly the candidate-specific spacing and metric tuning
this phase forbids.

### Source Sans 3 — LOW TECHNICAL COST, MEDIUM IDENTITY COST

**Strengths:** best body text, Portuguese rhythm, Contact voice, and responsive
robustness. It creates no new collisions or overflows and is the smallest test
asset.

**Risks:** display and uppercase widths contract by roughly 8–19%. The Hero,
territory labels, and Selected Work identities lose some of the approved
compact tension and authority. It fits easily, but part of that ease comes from
making the design quieter and more editorial than the intended
editorial-engineering balance.

### IBM Plex Sans — LOW–MEDIUM ADAPTATION COST

**Strengths:** the Hero first-line width is within 0.13% of Arial at desktop;
Practice line counts and gaps match the fallback; Territory paragraph rhythm
is preserved; dark mode gains material authority; and the family provides the
most distinctive engineering/editorial identity without becoming decorative.

**Risks:** uppercase labels are 7–10% narrower, the Hero support gains one line
at tablet, and one secondary Contact option gains a third line at 820px. The
mobile headline retains the fallback's near-edge condition. Its IBM/technology
association is also more explicit than the Söhne reference, so final review
must confirm that the type remains subordinate to the overall identity.

## 7. Qualitative relationship to Söhne

Söhne was not rendered and no exact metric comparison is claimed.

- Inter shares a contemporary grotesque logic and compact metadata discipline,
  but its current web familiarity pushes the page toward product/SaaS language.
- Source Sans 3 provides greater humanist warmth and editorial reading quality,
  but less of the compact, controlled tension associated with the reference.
- IBM Plex Sans is more visibly designed and industrial than the reference. It
  is less neutral, yet its measured Hero behavior and balance of precision with
  human detail best preserve the intended identity among these free candidates.

## 8. Recommendation

**C — IBM PLEX SANS RECOMMENDED FOR FINAL REVIEW**

This is not a final selection and does not authorize installation. IBM Plex
Sans does not win solely by score: it is recommended because it best preserves
the page's dominant identity relationship—Software Developering expressed with
editorial precision and quiet confidence—while requiring fewer structural
compensations than Inter and sacrificing less visual tension than Source Sans 3.

The final review should focus on two questions:

1. Does IBM Plex Sans's explicit technology/IBM character remain sufficiently
   quiet in the full composition?
2. Is the localized 820px Contact wrapping cost acceptable before any approved
   final-integration tuning?

Until that review is approved, production remains on
`Arial, "Helvetica Neue", Helvetica, sans-serif` through the unchanged
`--font-sans-development` and `--font-sans` tokens.
