# Typography Foundation

Status: **FINAL FONT INTEGRATED — IBM PLEX SANS**

Audit baseline: commit `d450958`; bake-off decision: commit `7053ddc`

Production integration: IBM Plex Sans variable Roman, weights 400–500

The original Arial/Helvetica audit below is preserved as the decision record.
Production now uses the single local family described in section 12; the
fallback captures remain historical evidence rather than a fidelity target.

This document began as an audit of the approved static page rendered with the
temporary Arial/Helvetica stack. Phase 8 integrates the bake-off winner without
authorizing composition, content, Convergence, architecture, or motion changes.

## 1. Current typography audit

### Global foundation

- The only active family is
  `Arial, "Helvetica Neue", Helvetica, sans-serif`, declared as
  `--font-sans-development` and assigned through `--font-sans` in
  `src/styles/tokens.css`.
- `html` applies `font-family: var(--font-sans)`, `font-synthesis: none`, and
  `text-rendering: optimizeLegibility`. Buttons and links inherit the complete
  font shorthand.
- `src/styles/fonts.css` intentionally contains no `@font-face`. Its comment
  identifies the stack as development-only. A repository scan found no WOFF,
  WOFF2, TTF, or OTF files outside dependencies/build output.
- Only upright weights `400` and `500` are requested. There are no italics.
  Because Arial commonly has no distinct 500 face and synthesis is disabled,
  the current 500 role may render like the nearest real face. This must be
  checked when the final family is installed.
- Shared sizes are metadata `12px`, utility `14px`, body `16px`, and large body
  `20px`. Shared body leading is `1.55`; shared tracking is `-0.012em` for quiet
  text and `0.04em` for metadata.
- Breakpoints are mobile-first, `48rem` (768px), and `75rem` (1200px). The Hero
  and Contact also use `clamp()` for display sizes. Uppercase is limited to
  context/classification labels and placeholder narrative metadata.
- Most major text groups are absolutely positioned within fixed/minimum-height
  sections. Font replacement therefore changes internal text height without
  automatically moving the following anchored groups.

### Section map

| Area                                      | Active typography                                                                                                       | Position/measure behavior                                                                      |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Site identity and theme utility           | 14px; identity 500, utility inherited 400; tight tracking                                                               | Absolute header; identity spans grid columns and toggle has a 44px target                      |
| Hero eyebrow                              | 13px/500, `0.025em` tracking                                                                                            | Absolute; inset changes at 768px and 1200px                                                    |
| Hero headline                             | 48–52px mobile via `clamp()`, 76–92px tablet, 92px desktop; 400; `0.96–0.98` leading; `-0.046em` to `-0.035em` tracking | Two authored, non-wrapping lines; absolute; desktop width 760px                                |
| Hero supporting copy                      | 18px mobile, 20px from 768px; `1.48/1.45` leading; tight tracking                                                       | Absolute and spatially displaced; 272px mobile, up to 440px desktop                            |
| Section indices/context labels            | 12px metadata or 14px utility; regular; label tracking varies by role                                                   | Absolute and paired by fixed offsets                                                           |
| Territory titles                          | 26px mobile, 28px from 768px; line-height 1; `-0.035em`                                                                 | Absolute cards, 304px mobile and 256–288px desktop/tablet                                      |
| Territory descriptions                    | 16px/1.55 with tight tracking                                                                                           | Fixed card measures; height depends directly on wrapping                                       |
| Selected Work classifications             | 12px/1.35 with `0.04em`; classification values preserve case                                                            | Absolute identity blocks; widths differ by entry and breakpoint                                |
| Selected Work large labels                | 40px mobile, 48px from 768px; `0.96`; `-0.045em`                                                                        | Absolute identity blocks adjacent to evidence fields                                           |
| Narrative/evidence labels                 | 12px/1.35, uppercase, `0.04em`                                                                                          | Narrative rows reserve at least 120px for labels; long label can exceed that intrinsic minimum |
| Practice note                             | 20px mobile, 22px from 768px; `1.55–1.58`; tight tracking                                                               | Absolute; 346px mobile and 560–576px wider measure; principles remain independently anchored   |
| Practice principles and identity metadata | 12px, `0.04em`; `1.55–1.65`                                                                                             | Absolute; principles use a 320px box, identity is a bottom-anchored flex row                   |
| Contact intro                             | 32–44px heading via `clamp()`/fixed desktop; `1.02`; `-0.035em`; supporting copy 20px/1.45                              | Absolute; heading measure is 272px and intentionally wraps to two lines                        |
| Contact questions                         | 20px/1.35 with tight tracking                                                                                           | Router is absolute; question measure up to 384px desktop                                       |
| Contact decisions                         | 16px with inherited 1.55; regular                                                                                       | One column mobile, two columns from 768px; 60px minimum row height                             |
| Quiet controls/destination metadata       | 12px with `0.04em`                                                                                                      | Inline controls and bottom/right status anchors                                                |

The audit found no section-specific font-family override. The single
`--font-sans` seam already reaches every required role, so no token refactor is
needed before font comparison.

## 2. Required typography roles

The implementation needs a compact role model, not a second design system:

1. **Display:** Hero headline; large but quiet, tight, stable at two authored
   lines, and authoritative without becoming promotional.
2. **Section display:** Territory titles, Selected Work large labels, and
   Contact intro; the same neutral voice at smaller scales, with reliable
   uppercase widths.
3. **Body/supporting:** Hero support, territory descriptions, Practice note,
   and Contact supporting copy; highly legible Portuguese with predictable
   paragraph color and vertical rhythm.
4. **Decision text:** Contact questions and choices; clear at interactive sizes
   and resistant to awkward tablet wrapping.
5. **Metadata/labels:** indices, classifications, narrative labels, principles,
   evidence states, identity details, and pending states; compact at 12–14px,
   with good diacritics and disciplined uppercase spacing.
6. **Quiet controls:** identity utility, theme toggle, and Contact controls;
   readable without competing with page content.

The final family must perform all six roles in one coherent sans-serif family.
The current implementation only requires regular and medium intent; additional
weights should not be licensed or shipped without a demonstrated role.

## 3. Metric-sensitive areas

Sensitivity describes the likelihood that different glyph widths, vertical
metrics, or weight realization will disturb the approved composition.

| Relationship                                            | Sensitivity | Reason / future decision                                                                                                                                                                                                        |
| ------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hero headline line break                                | **HIGH**    | Each line is `white-space: nowrap`, authored explicitly, and 92px on desktop. A wider face can overflow the 760px desktop box or the 346px mobile viewport. Do not resize or retrack until candidate captures are reviewed.     |
| Hero headline ↔ supporting copy/Convergence             | **HIGH**    | All are independently absolute. Changed cap height or line box alters perceived spacing even if boxes do not collide.                                                                                                           |
| Hero supporting measure                                 | **MEDIUM**  | Current line count is controlled by 272/440px measures; changed widths alter paragraph height, though surrounding empty space is generous.                                                                                      |
| Territory title widths                                  | **HIGH**    | Uppercase `PRODUTOS` and `SISTEMAS` carry strong visual widths inside fixed, absolute cards. Width changes affect balance against purpose-built geometry.                                                                       |
| Territory description wrapping                          | **MEDIUM**  | Cards have fixed measures and absolute starts. One extra line changes local density but current section heights provide some reserve.                                                                                           |
| Selected Work large labels                              | **HIGH**    | 40/48px uppercase labels sit in narrow absolute identity blocks; `SISTEMAS` is the critical width on mobile and `PRODUTO` at wider breakpoints.                                                                                 |
| Selected Work metadata/classifications                  | **MEDIUM**  | 12px tracked text is width-sensitive; `Experiência profissional` and the long narrative label may alter row balance.                                                                                                            |
| Practice note measure/height                            | **HIGH**    | The 20/22px paragraph is absolute while principles are separately anchored. A line-count increase can reduce or eliminate the intended interstitial gap. Record any collision as a font decision risk, not a silent layout fix. |
| Practice principles                                     | **MEDIUM**  | Each uses a 320px box at 12px with positive tracking. A wide candidate may wrap a principle and change its vertical footprint.                                                                                                  |
| Practice identity footer                                | **MEDIUM**  | A bottom-anchored flex row combines identity and verification columns; wider metadata can compress or wrap around tablet/mobile widths.                                                                                         |
| Contact intro wrapping                                  | **HIGH**    | The 272px two-line heading is a core composition decision. Glyph metrics determine the exact break and visual rag.                                                                                                              |
| Contact choices near 768–900px                          | **HIGH**    | At 768px the router becomes two columns while each choice retains padding and a 60px minimum. Longer Portuguese choices can gain a line and disturb the stagger.                                                                |
| Contact questions/context                               | **MEDIUM**  | Question boxes have finite measure; branch-specific strings vary substantially in length. All router states require testing.                                                                                                    |
| Site identity, section labels, theme and quiet controls | **LOW**     | Short strings have adequate space and do not control section height, though 500-weight realization must still be reviewed.                                                                                                      |

Additional risk: the final font's ascent, descent, and line-gap can change
perceived alignment even where CSS line-height is numeric. Absolute top values
position line boxes, not cap lines. Candidate QA must judge optical alignment,
not only overflow.

## 4. Final font architecture

Keep the Astro/static architecture simple and local:

- Accept only legitimately licensed webfont files supplied for this project.
- Prefer WOFF2. Use versioned filenames under `public/fonts/` so the source URL
  is explicit and the immutable asset can be cached for a year. Add WOFF only
  if an approved browser-support requirement demonstrates a need; do not ship
  desktop OTF/TTF files to the web.
- Define faces only in `src/styles/fonts.css`, then change only the existing
  `--font-sans` token. Section CSS must not name a candidate.
- The current design needs upright Regular (400) and Medium (500) intent. If
  the licensed family offers a suitable variable Roman file, one WOFF2 with a
  deliberately narrow weight range (for example 400–500) can reduce requests
  and preserve real 500 interpolation. A variable file is beneficial only if
  it is smaller than the equivalent approved static subset and covered by the
  license.
- Use `font-display: swap` for predictable access to text and an explicit
  fallback state. Preload the dominant regular WOFF2 in `SiteLayout.astro`;
  preload the medium file only if measurement shows it is critical above the
  fold and worth the extra request. The preload `type` must be `font/woff2`
  with `crossorigin`.
- Keep `Arial, "Helvetica Neue", Helvetica, sans-serif` after the final family
  name as the failure fallback. Do not tune a chain of look-alike system fonts.
- Continue `font-synthesis: none`; supply every approved weight rather than
  allowing artificial bold/italic faces.
- Prevent CLS through early same-origin preload, stable authored line heights,
  and candidate comparison before release. If metrics still shift materially,
  evaluate CSS Fonts metric overrides (`size-adjust`, `ascent-override`,
  `descent-override`, `line-gap-override`) from measured licensed files. Do not
  guess these values or use them to disguise a poor candidate.
- Cloudflare serves these as same-origin static assets. Use versioned filenames
  and `Cache-Control: public, max-age=31536000, immutable`; HTML remains
  independently revalidatable. Confirm the deployed content type is
  `font/woff2` and that no CORS exception is introduced unnecessarily.

## 5. Söhne integration path

Söhne remains the preferred conceptual candidate but is unavailable. Later
integration requires all of the following:

1. Proof that the project may self-host the webfont on this domain.
2. Licensed WOFF2 Roman files covering the actual 400 and 500 roles, or a
   licensed variable Roman file whose range covers them.
3. Confirmed family/subfamily names and licensed deployment limits.
4. Placement in the approved local font directory with versioned filenames.
5. `@font-face` declarations in `src/styles/fonts.css`, preload wiring in
   `SiteLayout.astro`, and a single `--font-sans` update.
6. Full QA at 1440, 820, and 390px in light/dark, including every Contact
   branch, overflow, keyboard/accessibility checks, CLS observation, and a
   production build/deployment response-header check.

No unofficial source, substitute file, recreated outline, or externally hosted
commercial copy is acceptable.

## 6. Alternative shortlist for later evaluation

These are candidates for a future visual comparison, not a final choice. Their
license and files must be revalidated at the candidate's official distribution
source immediately before any installation.

| Candidate         | Why it fits                                                                                                                                        | Difference from Söhne reference                                                                         | Likely metric impact                                                                                                  | Availability/license category                                               | Visual risk                                                            |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| **Inter**         | Excellent screen legibility, broad Portuguese/Latin support, strong variable-font implementation, compact metadata, and dependable web performance | More product/UI-oriented and familiar; less editorial tension and less distinctive in large display use | Generally compact; headline and Contact wrapping may tighten, while its vertical metrics can change optical centering | Open source, SIL Open Font License 1.1; official files are widely available | **Medium** — technically safest, but may feel too generic              |
| **IBM Plex Sans** | Strong Portuguese support, clear engineering character, useful distinction at body and metadata sizes, broad family support                        | More visibly humanist/industrial and expressive; less neutral and quieter than the reference            | Wider or more characterful capitals can pressure territory/work labels; body copy may reflow noticeably               | Open source, SIL Open Font License 1.1                                      | **Medium–High** — personality may become a stronger read than intended |
| **Source Sans 3** | Mature text rendering, excellent Latin/Portuguese coverage, calm body color, variable option, and reliable small-size legibility                   | More humanist and text-led; large headlines are softer and less compact than the reference              | Likely to increase some display widths and alter headline/contact rags; body measures should remain highly readable   | Open source, SIL Open Font License 1.1                                      | **Medium** — robust but may soften the engineered precision            |

All three deserve measurement, but the recommended comparison order is **Inter
first for metric/performance control**, then **Source Sans 3 for editorial body
quality**, then **IBM Plex Sans as the higher-personality boundary test**. A
candidate should be rejected if it requires broad section-specific spacing
changes to preserve the approved page.

## 7. Temporary fallback strategy

Keep the existing Arial/Helvetica stack unchanged until a final candidate and
licensed files are approved. It is already clearly named
`--font-sans-development`, produces no network request, and is disposable at a
single token seam. Replacing it with a marginally closer system font would make
the temporary baseline less explicit without removing metric uncertainty.

## 8. Typography token recommendation

Do not add display/body/label family tokens now. Every role currently uses one
family, and the existing `--font-sans-development` → `--font-sans` indirection
already isolates future integration. The existing size, weight, leading, and
tracking variables cover genuinely repeated values; section-specific display
values encode deliberate composition and should remain local.

Revisit role tokens only if the approved final font requires a second family or
if at least three sections need the same coordinated metric adjustment. Neither
condition exists in this audit.

## 9. Preserved fallback baseline

Full-page PNGs are committed under `docs/assets/typography-baseline/`:

| Capture                           | Rendered dimensions | SHA-256                                                            |
| --------------------------------- | ------------------: | ------------------------------------------------------------------ |
| `fallback-desktop-1440-light.png` |         1440 × 6608 | `53fabc7d73582d9179505bb2d45760fe0635136c96c6cea68bb8fcf05c1829f4` |
| `fallback-desktop-1440-dark.png`  |         1440 × 6608 | `0abfa373f7e64c0ad1e768eec9797e7a3c3d9a1dcc0951e3b8503fef2d7c7f97` |
| `fallback-tablet-820-light.png`   |          820 × 6888 | `a95f2d6896fd209e9b29174ec7910d7709cb95be0614f14894a7082415a24374` |
| `fallback-mobile-390-light.png`   |          390 × 7632 | `966325b170bfba20de15314af147e5338536d58d47feb322c9863a11f5eed111` |
| `fallback-mobile-390-dark.png`    |          390 × 7632 | `2e6b91ff661bee139691787c7ce0700911b3a50da6db1ccff6a5e3ff3ee4cd93` |

They were captured from the approved page with the development fallback at
viewport sizes 1440×900, 820×1180, and 390×844. Full-page output height follows
the responsive document height. These are comparison baselines, not final
visual-fidelity approval.

## 10. Future font comparison strategy

Do not build a public switcher. Once legitimate candidate files are available:

1. Add one candidate behind the existing `--font-sans` seam on an isolated
   comparison branch; no section CSS rewrite is required.
2. Use the same scripted viewport/theme matrix and filenames suffixed with the
   candidate name. Capture full-page and critical-section crops at 1440, 820,
   and 390px.
3. Compare against this baseline side by side and with image diff. Review Hero,
   Territories, all three Selected Work entries, Practice, and every Contact
   state—not only the default route.
4. Record line counts, overflow, element bounding boxes, font request count,
   WOFF2 transfer size, and observed layout shift.
5. Revert the candidate before evaluating the next one, or use separate
   isolated branches. Never expose the experiment through production markup or
   URL parameters.

A development-only capture script is justified only after legitimate font
files exist. Until then, the existing Playwright/browser workflow and the
single family token are sufficient.

## 11. QA checklist for final installation

- [x] License explicitly permits the chosen web deployment and expected traffic.
- [x] Only approved WOFF2 files and required upright weights/range are present.
- [x] Family names, weight descriptors, and style descriptors match the files.
- [x] Regular is preloaded; every preload is used and has the correct MIME type.
- [x] No synthetic face appears; computed 400/500 roles resolve as intended.
- [x] Hero remains exactly two authored lines at 1440, 820, and 390px.
- [x] Hero support remains spatially displaced and Convergence remains secondary.
- [x] Territory titles/descriptions retain their approved balance and line counts.
- [x] Selected Work labels, classifications, and narrative rows do not collide.
- [x] Practice note preserves separation from both principles at all widths.
- [x] Practice identity and verification positions remain legible without collision.
- [x] Contact intro retains its intended break; every branch is tested at tablet width.

## 12. Phase 8 production integration

### Decision and provenance

- **Family:** IBM Plex Sans.
- **Source artifact:** `@fontsource-variable/ibm-plex-sans@5.3.0`, whose files
  reproduce the upstream IBM Plex family for self-hosting.
- **License:** SIL Open Font License 1.1. The complete license and IBM copyright
  notice are preserved at `public/fonts/IBM-Plex-Sans-OFL-1.1.txt`.
- **Production asset:**
  `public/fonts/ibm-plex-sans-latin-wght-normal.woff2`, Latin Roman variable,
  45,712 bytes, SHA-256
  `e2291e842cf5af167122a22881a740c7f2dda7716f1e8cd76680264f4a859470`.
- **Scope:** one `@font-face`, upright style, deliberately constrained to the
  implemented 400–500 range. No italic, width axis, additional subset, package
  dependency, or remote font request ships in production.

`--font-sans` is the only family integration point and resolves to
`"IBM Plex Sans", Arial, "Helvetica Neue", Helvetica, sans-serif`. The system
families remain failure fallbacks only; the development-only token was removed.
The face uses `font-display: swap`, and `font-synthesis: none` remains active.

### Loading strategy

The single WOFF2 is used by the above-the-fold identity, eyebrow, and dominant
Hero headline, so `SiteLayout.astro` preloads that same-origin asset once with
`as="font"`, `type="font/woff2"`, and `crossorigin`. There is no second preload,
font CDN, runtime loader, or client-side font mechanism.

### Layout policy and review result

The bake-off is a visual reference, not a pixel-parity contract. Phase 8 made no
preventive tracking, size, line-height, measure, breakpoint, position, or section
layout adjustments. Hero, Territórios, Selected Work, Marco / Prática, Contact,
Convergence, content, architecture, and motion remain compositionally unchanged.

The IBM Plex metrics preserve the authored two-line Hero headline and the
approved hierarchy. At 820px, one secondary Contact option may occupy an extra
natural line compared with Arial; it remains contained, legible, and separated,
with no collision, hierarchy loss, or material degradation. It is therefore an
acceptable natural wrap and does not justify a correction.

### Verification matrix

Final QA covers 390, 430, 768, 820, 1024, 1280, and 1440px, with light/dark
parity checks at the representative 390, 820, and 1440px widths. The review
includes font resolution and local loading, horizontal overflow, authored line
counts, collisions, Contact states, keyboard/accessibility smoke checks, and the
production build. The complete repository verification is run through
`npm run verify` before the Phase 8 commit.

Full-page evidence is preserved under `docs/assets/typography-final/`. Every
light/dark pair uses identical content, state, geometry, and viewport:

| Capture                           | Rendered dimensions | SHA-256                                                            |
| --------------------------------- | ------------------: | ------------------------------------------------------------------ |
| `ibm-plex-desktop-1440-light.png` |         1440 × 6608 | `afe501108a7ba744743e70462e06714f0a79e6a516be3990647e3da4a5fd8052` |
| `ibm-plex-desktop-1440-dark.png`  |         1440 × 6608 | `69e7a954059cb4bea299c354c265652df05a3939747f39ebb284ff569153d2e0` |
| `ibm-plex-tablet-820-light.png`   |          820 × 6888 | `99d2ea2d5a45e89ba4e668bbc21fe7c58eb249b3375289fc28e30b5e0adb529c` |
| `ibm-plex-tablet-820-dark.png`    |          820 × 6888 | `25d390a799e60468d09d469a691df9bedafa8b1169baf971271f9f9704e649d0` |
| `ibm-plex-mobile-390-light.png`   |          390 × 7632 | `8313b6ef6ff6d34b07c00e36e0d00a52b2aa416eb533bb7c3decbce05ddd3aa3` |
| `ibm-plex-mobile-390-dark.png`    |          390 × 7632 | `c42ae50685b65df074b9285ab0a0d3346f1be0b74717467ee3de001a6e6813d3` |

- [ ] Light and dark modes retain the same material identity.
- [ ] No horizontal overflow occurs at 390, 820, or 1440px.
- [ ] Keyboard focus, accessibility smoke checks, and no-JavaScript reading remain green.
- [ ] Font loading produces no unacceptable CLS and no console/network errors.
- [ ] Static production build and Cloudflare font caching/MIME behavior are verified.
- [ ] New captures and diffs are reviewed before any metric or layout adjustment.

## Phase 7 conclusion

The implementation already has a safe single-family integration seam. The
remaining dependency is an approved final font with legitimate files; all
layout effects must be decided through candidate comparison rather than hidden
changes in this phase.

**Verdict: A — READY FOR FONT DECISION**
