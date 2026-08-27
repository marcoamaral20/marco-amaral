# Marco Amaral Personal Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build marcoamaral.com.br as a static-first, authored personal brand site that expresses possibility, convergence, system, human decompression, and a natural opening to contact.

**Architecture:** Astro renders the five major moments as semantic static HTML. Authored CSS owns the continuous editorial composition, authored region-specific SVG owns Convergence, and small framework-free TypeScript modules own theme resolution and the Contact state machine.

**Tech Stack:** Astro, strict TypeScript, authored CSS, authored SVG, native browser APIs, Vitest, Playwright, automated accessibility checks.

**Spec:** `docs/superpowers/specs/2026-08-26-marco-amaral-site-design.md`

## Global Constraints

- Use Astro, TypeScript, authored CSS, and authored SVG.
- Do not add React, Preact, Vue, Svelte, a UI framework, or a component library without a later concrete and approved need.
- Render exactly five major moments: Hero, Territórios, Selected Work, Marco / Prática, and Contact.
- Preserve all frozen Portuguese copy verbatim.
- Preserve the grammar `POSSIBILIDADE → CONVERGÊNCIA → SISTEMA`, reopening toward possibility in Contact.
- Use purpose-built Convergence geometry per region; do not create a generic decorative preset system.
- Do not use radial focal points, network nodes, randomized geometry, Canvas, WebGL, or a motion library in the static implementation.
- Keep Contact state ephemeral and client-local, with no transmission before explicit contact activation.
- Give WhatsApp slightly higher reading priority than email; treat LinkedIn and GitHub as verification/identity links.
- Use the fixed Selected Work classifications and fabricate no evidence.
- Treat Lighthouse 95+ as a strong target, with real quality and visual fidelity taking priority over score chasing.
- Complete and approve the static experience before proposing motion.
- After plan approval, execute Phase 0 and Phase 1 only, then stop for review.

---

## Planned File Map

```text
package.json                         project scripts and dependencies
astro.config.mjs                     static Astro configuration
tsconfig.json                        strict TypeScript configuration
eslint.config.js                     lint rules
.prettierrc                          formatting policy
.gitignore                           generated/local exclusions
src/env.d.ts                         Astro type declarations
src/layouts/SiteLayout.astro         document shell, metadata, theme bootstrap
src/pages/index.astro                five-section page composition
src/content/site-content.ts          frozen copy and verified destinations
src/styles/tokens.css                theme, spacing, type, line, and grid tokens
src/styles/fonts.css                 licensed font declarations or documented fallback
src/styles/global.css                reset, canvas, typography, accessibility defaults
src/styles/grid.css                  shared relational-grid variables and helpers
src/styles/sections/*.css            section-owned compositions
src/components/theme/*               framework-free theme control
src/components/convergence/*         primitives plus region-specific authored geometry
src/components/contact/*             router markup, options, and state machine
src/components/work/*                three distinct abstract evidence compositions
src/sections/*.astro                 five major page moments
src/scripts/theme.ts                 theme resolution and persistence
tests/unit/*                          theme and Contact state tests
tests/browser/*                       accessibility, interaction, viewport, and visual tests
public/fonts/*                        licensed production fonts when supplied
public/icons/*                        approved identity icons when supplied
public/images/*                       approved evidence and social assets when supplied
```

## Phase 0 — Repository and Tooling Foundation

**Goal:** Create a reproducible Astro project with strict types, quality scripts, test harnesses, and no client-side framework.

**Likely files:** `package.json`, `astro.config.mjs`, `tsconfig.json`, `eslint.config.js`, `.prettierrc`, `.gitignore`, `src/env.d.ts`, test configuration, initial CI configuration.

**Dependencies:** revised spec/plan approval; deployment target may remain configurable if it does not affect static output.

**Steps:**

- [x] Initialize Astro with TypeScript and static output, without a framework integration.
- [x] Pin direct dependencies and document the supported Node version.
- [x] Configure strict type checking, linting, formatting, Vitest, and Playwright.
- [x] Add scripts for development, production build, typecheck, lint, unit tests, browser tests, and formatting checks.
- [x] Add a minimal semantic page shell solely to prove the toolchain; do not begin the authored visual composition.
- [x] Run install, typecheck, lint, unit test, browser smoke test, and production build.
- [x] Confirm the production output contains no React/Preact/runtime framework bundle.
- [x] Record the exact verification commands and results in the phase review.

**Validation:** all configured commands exit successfully; the generated static site opens locally; no framework integration appears in configuration or dependencies.

**Visual acceptance:** no visual-design judgment is made in this phase. The shell must not introduce generic template styling that later needs to be undone.

**Review checkpoint:** stop if foundation choices differ from the spec or the deployment target requires architectural changes.

## Phase 1 — Tokens, Typography, Canvas, and Relational Grid

**Goal:** Establish the material and spatial foundation without beginning serious section composition before visual references arrive.

**Likely files:** `src/layouts/SiteLayout.astro`, `src/pages/index.astro`, `src/styles/tokens.css`, `src/styles/fonts.css`, `src/styles/global.css`, `src/styles/grid.css`, initial theme bootstrap module and foundation tests.

**Dependencies:** Phase 0; Söhne status controls whether production font declarations can be finalized. The non-visual token structure may proceed before the frames arrive.

**Steps:**

- [x] Define semantic light and dark tokens from the approved Silent Aluminum and Sky palettes.
- [x] Define the approved spacing scale, readable-width constraints, type roles, line weights, and restrained radius rules.
- [x] Implement the desktop 12-column, tablet eight-column, and mobile four-column relational-grid variables without a generic centered max-width container.
- [x] Add semantic reset, canvas, text, link, selection, focus, and reduced-motion defaults.
- [x] Add Söhne declarations only if licensed assets/instructions are available; otherwise document and use the explicit development fallback.
- [x] Implement pre-paint theme resolution using explicit local choice, then system preference, then light fallback.
- [x] Add a quiet semantic theme utility shell without final visual positioning.
- [x] Verify token contrast, absence of theme flash, absence of horizontal overflow, and stable font behavior.
- [x] Capture foundation screenshots in light and dark mode, clearly labeling fallback-font captures as non-final where applicable.
- [x] Run build, typecheck, lint, unit tests, browser smoke tests, and accessibility scan.

**Validation:** semantic tokens map correctly in both themes; theme resolution follows the frozen priority; grid variables inspect correctly at representative widths; no layout shift or horizontal overflow is introduced.

**Visual acceptance:** the canvas is quiet and material rather than SaaS-like; dark mode is the same identity under different lighting; no glow, generic shadows, rounded-card language, or blue-as-default-accent appears.

**Review checkpoint:** stop after Phase 1. Do not start Hero or serious visual implementation until the owner reviews Phase 0/1 and supplies the required visual inputs.

## Phase 2 — Static Hero and Possibility Geometry

**Goal:** Reproduce the approved hero hierarchy and POSSIBILIDADE state.

**Likely files:** `src/sections/Hero.astro`, `src/styles/sections/hero.css`, `src/components/convergence/ConvergenceGeometry.astro`, `HeroConvergence.astro`.

**Dependencies:** approved Phase 0/1; Final Frame; Frame V2; font status; supporting references when available.

**Validation:** exact-copy checks, semantic-heading review, 1440×900/mobile screenshots, focus/theme checks, overflow checks.

**Visual acceptance:** headline is perceived first, identity second, structural field third; support remains offset; negative space remains empty; geometry is distributed and non-radial.

## Phase 3 — Territórios

**Goal:** Place Web, Produtos, and Sistemas as equivalent territories in a shared CONVERGÊNCIA field.

**Likely files:** `src/sections/Territories.astro`, `src/styles/sections/territories.css`, `TerritoriesConvergence.astro`, `site-content.ts`.

**Dependencies:** Phase 2 and visual references.

**Validation:** frozen-copy comparison; desktop/tablet/mobile screenshots; semantic-order check.

**Visual acceptance:** Web reads first without becoming larger, blue, or premium; entries are not cards, equal columns, tabs, or a feature grid; shared axes become clearer than in Hero.

## Phase 4 — Selected Work Placeholder System

**Goal:** Build the page's density peak using three honest and visibly abstract evidence compositions.

**Likely files:** `src/sections/SelectedWork.astro`, `src/styles/sections/selected-work.css`, three work placeholder components, `WorkConvergence.astro`.

**Dependencies:** Phase 3 and visual references.

**Validation:** automated copy/classification check; manual fabricated-claim audit; responsive screenshot comparison.

**Visual acceptance:** fixed classifications are visible; Web reserves the largest field; Produto is fragmented; Sistemas participates in the layout; no fake project, client, metric, interface, result, or generic project card appears.

## Phase 5 — Marco / Prática

**Goal:** Create the approved low-density human-professional interlude without waiting for final note copy.

**Likely files:** `src/sections/Practice.astro`, `src/styles/sections/practice.css`, `PracticeConvergence.astro`, `site-content.ts`.

**Dependencies:** Phase 4. Real LinkedIn/GitHub destinations may be inserted later without changing layout.

**Validation:** approved-principle copy check; placeholder-volume check; semantic link review; responsive screenshots.

**Visual acceptance:** editorial placeholder is clearly marked and occupies the expected 90–130-word region; two principles, minimal facts, and reserved verification links are present; density falls sharply; no portrait, résumé, timeline, KPI, or third principle appears.

## Phase 6 — Contact Field and Intent Router

**Goal:** Implement the frozen zero-to-two-decision router and restrained Contact channel hierarchy.

**Likely files:** `src/sections/Contact.astro`, `src/styles/sections/contact.css`, `ContactRouter.astro`, `contact-machine.ts`, `contact-options.ts`, `ContactConvergence.astro`, unit and browser tests.

**Dependencies:** Phase 5; real contact URLs are needed before production completion; generated-message wording may remain disabled until approved.

**Validation:** exhaustive state-transition tests; escape/back/short-route tests; keyboard, touch, screen-reader, and network-inspection tests proving no pre-activation transmission.

**Visual acceptance:** choices read as phrases in a spatial field, not form rows/cards/pills/chat; WhatsApp has slightly higher reading priority than email without becoming a generic oversized CTA; LinkedIn/GitHub remain identity links; Contact geometry opens toward possibility and becomes more determined with choices.

## Phase 7 — Responsive Recompositions

**Goal:** Tune all five sections as distinct desktop, tablet, and mobile compositions.

**Likely files:** every section stylesheet and region-specific responsive SVG.

**Dependencies:** Phases 2–6 and authoritative visual references.

**Validation:** representative wide desktop, 1440px, tablet, 390px, and narrow-mobile screenshots; Web-lead scenario; horizontal-overflow test.

**Visual acceptance:** mobile is recomposed rather than stacked; territory order remains correct with differentiated offsets; work entries remain distinct; Contact offers comfortable targets and clear reading order.

## Phase 8 — Theme Material Parity

**Goal:** Complete light/dark visual tuning while preserving identical identity and hierarchy.

**Likely files:** theme token overrides, all section styles, all Convergence components, theme browser tests.

**Dependencies:** Phase 7.

**Validation:** first-paint tests, explicit/system theme tests, screenshot comparison, contrast review.

**Visual acceptance:** dark mode uses subtle reflection and luminance differences only; geometry, Sky relationships, evidence, and hierarchy remain consistent; no glow or technological restyling appears.

## Phase 9 — Accessibility, Performance, and SEO

**Goal:** Meet production standards without compromising the approved composition.

**Likely files:** layout metadata, structured data, robots/sitemap configuration, icons/social assets, CI and browser tests.

**Dependencies:** real URLs, metadata, and approved production assets.

**Validation:** build, typecheck, lint, unit tests, Playwright, accessibility scans, manual keyboard review, Core Web Vitals, Lighthouse, metadata and structured-data inspection.

**Visual acceptance:** accessibility controls and focus states feel native to the design; optimizations preserve typography, spatial relationships, and truthful imagery. Lighthouse 95+ remains a quality target rather than a score-chasing mandate.

## Phase 10 — Visual Regression and Final Static Polish

**Goal:** Tune proportion, optical alignment, density, and material behavior against the authoritative frames.

**Likely files:** section CSS, region-specific SVG, screenshot baselines.

**Dependencies:** all static sections, both themes, all required visual references.

**Validation:** full-page overlays and side-by-side comparisons; static-first, five-second Hero, Web-lead, CTO, recruiter, and longevity reviews.

**Visual acceptance:** static composition alone communicates possibility → convergence → system → human decompression → new possibility, with the Final Frame as primary visual truth.

## Phase 11 — Motion, Separately Approved

**Goal:** Add only structural micro-response that materially improves relationships.

**Likely files:** narrowly scoped section CSS or framework-free TypeScript.

**Dependencies:** explicit approval after Phase 10 static acceptance.

**Validation:** reduced-motion parity, performance profiling, interaction review with motion disabled.

**Visual acceptance:** the site remains complete when motion is removed; no spectacle, scroll hijacking, loader, custom cursor, or identity-defining animation is introduced.

## Execution Boundary

This revision authorizes no implementation. After explicit approval, execute Phase 0 and Phase 1 only and stop for review. Do not begin Phase 2 or serious visual implementation until the required visual inputs have been supplied and the Phase 0/1 checkpoint has been approved.
