# Marco Amaral Personal Site Implementation Spec

**Status:** Approved with amendments; implementation remains paused pending final approval of this revision.

## 1. Repository Audit

The repository is greenfield. It contains Git metadata only, has no commits, and provides no application code, framework, build configuration, styling system, assets, fonts, tests, CI, or deployment configuration. The configured remote is `git@github.com:marcoamaral20/marco-amaral.git` on branch `main`.

The supplied attachment is the master textual handoff. The Final Approved Full-Page Frame, Frame V2, LinkedIn cover reference, Söhne font/license status, external destination URLs, and any other visual references are not present yet.

## 2. Frozen Foundation

The implementation foundation is:

- Astro;
- TypeScript with strict type checking;
- authored CSS;
- authored SVG for Convergence;
- no client-side framework by default.

React, Preact, Vue, Svelte, component libraries, and UI frameworks are excluded unless a later interaction demonstrates a concrete requirement that cannot be met cleanly with native browser APIs and Astro. The initial interactive surface consists only of the theme utility and Contact router, both implemented with small framework-free TypeScript modules.

The site is static-first. Astro renders all primary content as semantic HTML. Client JavaScript is limited to theme resolution and the Contact interaction. No backend, database, CMS, lead storage, or server persistence is planned.

## 3. Visual Translation Strategy

### Canvas and material

Semantic CSS custom properties map the approved Silent Aluminum palettes for light and dark themes. Depth comes from tonal changes, edge definition, overlaps, and restrained surface differences. There is no reusable shadow system, floating-card language, or rounded-card signature.

The page remains one continuous composition. Section boundaries are communicated through negative space, density, shared axes, interruptions, and material continuity rather than boxed section wrappers or prominent dividers.

### Grid and space

Desktop uses the approved 12-column relational reference at 1440px: 72px side margins, 24px gutters, and approximately 86px columns. It must not collapse into a conventional centered `max-width: 1200px` layout. Tablet recomposes on an eight-column reference with approximately 40–48px margins and 20px gutters. Mobile uses a four-column reference with approximately 20–24px margins and 12–16px gutters.

The grid is a shared spatial language, not a visible slot system. Individual regions may align exactly, terminate optically, cross columns, or continue beyond the implied content region. Large spacing values and deliberate empty fields remain part of the identity.

### Typography

Söhne is used only if appropriately licensed production webfont assets or loading instructions are supplied. Font files are declared explicitly by available weight and optimized for stable rendering. Until the licensing decision arrives, structural work may use a clearly documented development fallback; screenshots produced with it are not fidelity approval artifacts.

The approved Portuguese copy, headline line break, hierarchy, and target scales are preserved. No separate technology or monospace identity font is introduced.

### Section compositions

Exactly five major moments are rendered:

1. Hero: sparse possibility state, headline-led hierarchy, supporting copy offset, no CTA and no traditional navbar.
2. Territórios: Web, Produtos, and Sistemas occupy distinct positions in one shared convergence field; they are not cards or equal columns.
3. Selected Work: the density peak, with three composition-specific abstract evidence regions rather than a reusable project-card grid.
4. Marco / Prática: a strong decompression containing an editorial note region, the two approved principles, minimal facts, and verification links; no portrait.
5. Contact: a spatial phrase field and zero-to-two-decision Contact router, followed by WhatsApp and email actions in the frozen hierarchy.

## 4. Component and Module Boundaries

Planned structure:

```text
src/
  components/
    theme/ThemeToggle.astro
    convergence/
      ConvergenceGeometry.astro
      HeroConvergence.astro
      TerritoriesConvergence.astro
      WorkConvergence.astro
      PracticeConvergence.astro
      ContactConvergence.astro
    contact/
      ContactRouter.astro
      contact-machine.ts
      contact-options.ts
    work/
      WebEvidencePlaceholder.astro
      ProductEvidencePlaceholder.astro
      SystemsEvidencePlaceholder.astro
  content/site-content.ts
  layouts/SiteLayout.astro
  pages/index.astro
  scripts/theme.ts
  sections/
    Hero.astro
    Territories.astro
    SelectedWork.astro
    Practice.astro
    Contact.astro
  styles/
    tokens.css
    fonts.css
    global.css
    grid.css
    sections/*.css
public/
  fonts/
  icons/
  images/
tests/
  unit/
  browser/
```

Boundaries are divided by responsibility:

- Structural: `SiteLayout`, global canvas, shared grid variables, document metadata, and continuity.
- Content: frozen copy, approved classifications, verified external destinations, and editorial placeholder text.
- Visual: section-owned layouts and region-owned Convergence geometry.
- Interaction: theme resolution and the Contact state machine.
- Decorative: SVG carries no mandatory semantic information and is hidden from assistive technology.

Internal primitives may be shared, but no generic `SectionHeader`, `ProjectCard`, or decorative preset system may flatten the composition.

## 5. Convergence Technical Strategy

Convergence is authored as SVG and styled with CSS variables. `ConvergenceGeometry.astro` may contain low-level primitives for consistent line, plane, clipping, and theme behavior. It must not expose a preset catalogue that makes all regions variants of one decorative object.

Geometry remains purpose-built for:

- Hero;
- Territórios;
- Selected Work;
- Marco / Prática;
- Contact.

Desktop, tablet, and mobile may use separately authored coordinate sets rather than shrinking one desktop SVG. All variants preserve incomplete geometry, disciplined axes, large empty regions, controlled interruptions, restrained Sky relationships, and continuation beyond viewport boundaries.

The page grammar is:

```text
POSSIBILIDADE → CONVERGÊNCIA → SISTEMA
```

Contact reopens toward possibility as the visitor brings a new situation. No region uses a radial focal point, nucleus, network nodes, generic graph geometry, randomized paths, or procedural visual noise.

Static SVG is complete before motion is considered. Future motion may reveal or reduce relationships using CSS or lightweight native scripting, but requires separate approval. Reduced-motion mode removes travel and nonessential interpolation while retaining complete static states.

## 6. Responsive Spec

### Desktop

The 1440px Final Frame is the primary source of truth. The hero preserves its headline, supporting offset, negative-space fields, and distributed geometry. Territórios uses horizontal spatial tension. Selected Work uses the largest evidence surfaces and highest density. Contact distributes phrases across a wide field.

### Tablet

The eight-column composition compresses and becomes more oblique. Headline and support remain distinct until available space makes separation harmful. Territories retain differentiated positions. Work entries keep different evidence rhythms. Contact reduces simultaneous horizontal spread.

### Mobile

The four-column composition converts horizontal relationships into vertical and diagonal relationships. It is not desktop stacked mechanically. Territory order remains Web, Produtos, Sistemas, but alignments and intervals differ. Each work entry becomes its own editorial sequence. Contact presents one readable phrase per vertical region with comfortable semantic button targets and no hover dependency.

Breakpoints are selected from observed composition failures after the Final Frame and supporting references are available, not from a generic device catalogue.

## 7. Theme Spec

Theme priority is explicit visitor choice, then system preference, then light fallback. An explicit choice is stored locally. A minimal inline bootstrap resolves the root `data-theme` attribute before first paint to prevent theme flash. The quiet theme utility is a semantic button with an accessible state/action label.

Light and dark share geometry, hierarchy, content, Sky placement, and interaction behavior. Dark mode changes material tokens only; it does not introduce neon, glow, stronger motion, or a more technological art direction.

## 8. Contact Router State Model

The Contact router uses ephemeral in-memory state only. It makes zero, one, or two decisions and never requires a selection before contact.

```text
intro
  Já tenho algo                    → existing
  Estou começando algo             → nascent
  Tem algo que preciso resolver     → problem
  Prefiro explicar direto           → ready

existing
  any second-level option           → ready

nascent
  any second-level option           → ready

problem
  any second-level option           → ready
```

All labels and contextual copy are copied verbatim from the master handoff. Every second-level `Prefiro explicar` option is an escape to `ready`. Back removes the latest selection and restores the preceding state. Refresh or abandonment discards all choices.

No selection is sent to a server, persisted, attached to analytics, or transmitted before an explicit final contact action. A later generated opening is short and editable; its exact wording remains pending.

Contact channel hierarchy is frozen:

1. WhatsApp receives slightly higher reading priority.
2. Email is secondary.
3. LinkedIn and GitHub are verification/identity links, not Contact CTAs.

Visual priority remains restrained: WhatsApp must not become a generic oversized primary button. Router choices render as semantic buttons positioned as phrases within a field, with visible focus, comfortable tap targets, logical DOM order, accessible state announcements, and no dependence on color or hover.

## 9. Marco / Prática Placeholder

The pending first-person note does not block structural implementation. The section uses a clearly marked editorial placeholder whose volume matches the expected 90–130 words. It must preserve the final note's intended measure and vertical occupation without presenting placeholder prose as approved brand copy.

The section also includes:

- `Entender antes de prescrever.`
- `Complexidade precisa se justificar.`
- minimal factual context;
- reserved LinkedIn and GitHub positions;
- no portrait.

The final note must be replaceable without changing the section structure or layout model.

## 10. Selected Work Placeholder Strategy

The classifications are fixed:

```text
01 / WEB — Independent Concept
02 / PRODUTO — Produto próprio
03 / SISTEMAS — Experiência profissional
```

All evidence remains abstract and unmistakably placeholder-only. No project, client, brand, metric, interface, testimonial, result, logo, production claim, or architecture is invented.

Web reserves the largest single evidence field. Produto uses a more fragmented editorial rhythm. Sistemas participates in the page structure rather than appearing as a small boxed architecture thumbnail. The three entries may share typed content metadata but render with separate components and layouts.

## 11. Accessibility, Performance, SEO, and Testing

### Accessibility

- Semantic landmarks and logical heading order.
- One page `h1`.
- Keyboard-operable theme and Contact interactions.
- Visible focus in both themes.
- WCAG AA contrast for text and controls.
- Comfortable mobile targets, aiming for at least 44×44 CSS pixels.
- Screen-reader-readable Contact state changes.
- Decorative SVG marked `aria-hidden="true"` and `focusable="false"`.
- No required meaning encoded by color or Convergence.
- Reduced-motion support and no pointer-only interaction.

### Performance

- Static HTML and authored CSS for primary content.
- No client-side framework by default.
- JavaScript limited to theme and Contact behavior.
- Optimized fonts and responsive images once assets exist.
- No avoidable layout shift, theme flash, or page-level horizontal overflow.
- Core Web Vitals evaluated under realistic mobile conditions.

Lighthouse scores of 95 or above are strong quality targets, not acceptance at the expense of the approved experience. Real performance, accessibility, Core Web Vitals, semantic quality, and visual fidelity take priority. Low-value score chasing that compromises the design is prohibited.

### SEO

- Portuguese document language.
- Approved title, description, canonical URL, Open Graph data, and social image.
- Sitemap and robots configuration.
- Person/website structured data containing verified facts only.
- Favicon and app icons when supplied.

### Testing

- Unit tests for Contact transitions, short routes, escapes, and back behavior.
- Unit tests for theme-resolution priority.
- Browser tests for keyboard behavior, theme persistence, and Contact state announcements.
- Automated accessibility scans plus manual keyboard review.
- Representative desktop, tablet, 390px mobile, and narrow-mobile screenshots.
- Light, dark, and reduced-motion visual baselines.
- Full-page comparison with the supplied authoritative frames.
- Production build, typecheck, lint, test, overflow, and metadata checks.

## 12. Visual Input Gate

Phase 0 and the non-visual parts of Phase 1 may begin only after this revised spec and plan receive approval. Serious visual implementation beyond the foundation waits for:

- Final Approved Full-Page Frame, which remains the primary visual source of truth;
- Frame V2;
- LinkedIn cover reference;
- Söhne font/license status;
- any additional available reference artifacts.

Older references never override the master handoff or Final Frame.

## 13. Genuinely Unresolved Inputs

The remaining inputs are:

1. Deployment target and its build/output requirements.
2. Final Approved Full-Page Frame, Frame V2, LinkedIn cover reference, and any other available visual artifacts.
3. Söhne webfont files/license/loading instructions, or an explicit production-font decision if Söhne will not be used.
4. Final first-person Marco / Prática note; this is a content replacement and does not block structural implementation.
5. Real LinkedIn, GitHub, WhatsApp, and email destinations.
6. Final short generated-message wording for Contact.
7. Production metadata: approved title, description, canonical URL, social image, favicon, and app icons.

Framework, Contact hierarchy, Selected Work classifications, placeholder-label strategy, and whether the Practice placeholder may be built are resolved and must not be reopened.

## 14. Execution Boundary

No implementation begins until this revised spec and plan receive explicit approval. After approval, execution is limited to Phase 0 and Phase 1. Later phases require a further checkpoint, and serious visual work requires the visual inputs listed above.
