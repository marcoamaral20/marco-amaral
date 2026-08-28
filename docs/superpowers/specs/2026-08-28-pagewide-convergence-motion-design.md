# Page-wide Convergence Motion — Design Specification

**Date:** 2026-08-28  
**Status:** Approved design  
**Scope:** Hero, Territórios, Selected Work, Marco / Prática, and Contact

## 1. Objective

Extend the Convergence motion language from the Hero to every major section
without turning the site into one global animated background. Each section
must own a distinct animated composition whose lines express a structural
relationship rather than merely filling space.

The Hero geometry density may increase to roughly 1.7–2× its current density.
This explicitly supersedes the earlier Phase 9.1c constraint that froze the
Hero's overall geometry density. Copy, typography, palette, Hero height,
content position, editorial hierarchy, and theme architecture remain frozen.

## 2. Experience Principles

- Every line or plane must participate in a legible relationship: approach,
  alignment, interruption, evidence, reduction, or decision.
- Each section must feel related to the same Convergence language without
  appearing to reuse a generic animation preset.
- Motion remains secondary to editorial content.
- Section boundaries remain visually independent. No line or SVG crosses from
  one section into another.
- A section awakens once, on its first viewport intersection, and then keeps
  evolving indefinitely. It does not pause, reset, or replay when it leaves or
  re-enters the viewport.
- Reduced motion and no-JavaScript states remain complete static compositions.

## 3. Motion Lifecycle

Every animated section has four conceptual states:

1. `dormant`: production-quality static composition before first visibility.
2. `entering`: one section-specific structural event on first visibility.
3. `living`: continuous, asynchronous motion that never pauses or resets.
4. `reduced`: fully static geometry when reduced motion is requested.

A lightweight shared controller uses one `IntersectionObserver` to transition a
section from `dormant` to `entering` once. CSS/SVG animations own the entrance
and living states. After reaching `living`, the section is no longer governed
by viewport visibility.

The Hero retains its existing pointer perspective and native-scroll depth.
Other sections receive neither pointer response nor scroll choreography.

## 4. Section Compositions

### 4.1 Hero — Abundant Possibility

Increase geometry density to approximately 1.7–2× through authored structural
relationships rather than duplicated decoration. Candidate additions include:

- two additional long axes;
- new interrupted vertical and horizontal relationships;
- additional near-depth planes;
- edge-originating branches;
- increased activity in the upper-right and lower-left open regions.

Maintain a low-interference field around the headline. Only a small subset of
relationships participates in the primary entrance. Secondary additions may
enter with smaller displacements or be present from the initial frame. The
living state uses asynchronous trajectories and varied rhythms.

### 4.2 Territórios — Alignment

The three territory positions gain relationships that slowly discover shared
axes without turning the content into columns, cards, or a grid. The entrance
reveals correspondence. The living state preserves small divergences so the
field never becomes fully resolved.

### 4.3 Selected Work — Evidence

Each work composition receives its own structural behavior. Interrupted lines
approach evidence points, planes reinforce depth, and small relationships gain
temporary stability without creating closed frames or invented case-study
content.

### 4.4 Marco / Prática — Reduction

The entrance reduces visible distance within an initially dispersed field. The
living state is slower and sparser than the preceding sections, reinforcing
synthesis and restraint rather than accumulation.

### 4.5 Contact — Decision

Ambient motion continues independently. Real Contact flow state may reorganize
a limited number of existing geometric paths when the visitor changes a
decision. Geometry must not imply false destinations or alter the Contact state
machine's semantics.

## 5. Technical Architecture

- Preserve purpose-built section SVG components.
- Add explicit macro and micro groups inside each section's existing SVG.
- Use CSS transforms, keyframes, custom properties, and SVG groups.
- Use one shared `IntersectionObserver` for first activation.
- Keep the Hero's current `requestAnimationFrame` pointer/scroll controller
  isolated to the Hero.
- Let Contact expose its existing state through a stable attribute consumed by
  Contact-specific visual CSS. Do not place business logic in animation code.
- Add no runtime dependency, animation framework, smooth-scroll system, Canvas,
  WebGL, or Three.js.

## 6. Responsive Behavior

Desktop receives the complete authored compositions. Tablet preserves the same
semantic relationships with reduced spatial displacement where necessary.
Mobile uses fewer simultaneously moving relationships, shorter SVG paths where
required by composition, and restrained amplitudes. Mobile motion remains
perceptible and continuous after activation.

Pointer perspective remains limited to the desktop Hero with fine hover input.

## 7. Accessibility and Fallbacks

- All Convergence SVGs remain decorative, `aria-hidden`, unfocusable, and
  non-interactive.
- `prefers-reduced-motion: reduce` disables entrance, continuous motion,
  pointer perspective, scroll depth, and Contact geometry transitions.
- Without JavaScript, every section renders a complete static composition.
- No content, meaning, decision, or navigation depends on motion.

## 8. Performance

Continuous section motion must primarily use compositor-friendly SVG group
transforms. JavaScript stops participating after first activation except for
the existing Hero pointer/scroll controller and the existing Contact state
machine. Avoid per-element event listeners, raw pointer-frame DOM writes,
layout-driven animation loops, and offscreen measurement.

Because awakened sections continue animating offscreen by explicit product
decision, keep group counts restrained and animate groups rather than individual
paths wherever possible. Performance QA must cover a full-page session after
all five sections have awakened.

## 9. Testing and Review

Automated coverage must verify behavior rather than exact intermediate frames:

- each section activates only on first viewport entry;
- awakened sections keep living motion outside the viewport;
- animations do not reset on re-entry;
- reduced motion disables all section animation;
- no-JavaScript states remain complete;
- Convergence remains contained to its owning section;
- no horizontal overflow at 1440, 820, and 390px;
- Contact decisions retain their current semantics;
- no runtime or remote dependency is introduced.

Visual QA must include:

- static light/dark captures at 1440, 820, and 390px;
- desktop light/dark recordings traversing the full page;
- a 390px mobile recording traversing the full page;
- a session that awakens all sections, then scrolls backward to confirm motion
  continuity and absence of resets;
- human perceptual review for content dominance, density, purpose, rhythm, and
  page-level coherence.

Run `npm run verify` before completion.

## 10. Delivery Boundaries

Implement and review the work section by section. Keep commits isolated enough
to calibrate or revert one composition without disturbing the others. Do not
change copy, typography, theme architecture, section order, Contact semantics,
or introduce unrelated phases.

Human perceptual review remains the final acceptance gate.
