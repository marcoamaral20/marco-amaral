import AxeBuilder from "@axe-core/playwright";
import { devices, expect, test } from "@playwright/test";

test("loads IBM Plex Sans as the primary production family", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveCSS(
    "font-family",
    '"IBM Plex Sans", Arial, "Helvetica Neue", Helvetica, sans-serif',
  );
  await page.evaluate(() => document.fonts.ready);
  expect(
    await page.evaluate(() => document.fonts.check('400 16px "IBM Plex Sans"')),
  ).toBe(true);
});

test("serves and preloads the final font locally without a font CDN", async ({
  page,
}) => {
  await page.goto("/");

  const preload = page.locator(
    'link[rel="preload"][as="font"][href="/fonts/ibm-plex-sans-latin-wght-normal.woff2"]',
  );
  await expect(preload).toHaveAttribute("type", "font/woff2");
  await expect(preload).toHaveAttribute("crossorigin", "");

  const responseStatus = await page.evaluate(async () =>
    fetch("/fonts/ibm-plex-sans-latin-wght-normal.woff2").then(
      (response) => response.status,
    ),
  );
  expect(responseStatus).toBe(200);

  const remoteFontRequests = await page.evaluate(() =>
    performance
      .getEntriesByType("resource")
      .map((entry) => entry.name)
      .filter((url) => /fonts\.(googleapis|gstatic)\.com/.test(url)),
  );
  expect(remoteFontRequests).toEqual([]);
});

test("renders the frozen Hero copy with a single primary heading", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.getByRole("banner")).toBeVisible();
  await expect(page.getByRole("main")).toBeVisible();
  await expect(
    page.getByRole("banner").getByText("Marco Amaral", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Software Developer", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Clareza também é engenharia.",
    }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Entender o problema, encontrar sua estrutura e construir um sistema real fazem parte do mesmo trabalho.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(page.getByRole("navigation")).toHaveCount(0);
  await expect(page.getByRole("link")).toHaveCount(0);
});

test("keeps Convergence decorative and outside the accessibility tree", async ({
  page,
}) => {
  await page.goto("/");

  const fields = page.locator("[data-hero-convergence]");
  await expect(fields).toHaveCount(2);

  for (const field of await fields.all()) {
    await expect(field).toHaveAttribute("aria-hidden", "true");
    await expect(field).toHaveAttribute("focusable", "false");
  }
});

test("organizes Hero Convergence into three restrained perceptual layers", async ({
  page,
}) => {
  await page.goto("/");

  const motionRoot = page.locator("[data-hero-motion]");
  await expect(motionRoot).toHaveAttribute("data-motion", "active");
  await expect(motionRoot.locator('[data-depth-layer="far"]')).toHaveCount(2);
  await expect(motionRoot.locator('[data-depth-layer="mid"]')).toHaveCount(2);
  await expect(motionRoot.locator('[data-depth-layer="near"]')).toHaveCount(4);

  const activeAnimationNames = await motionRoot
    .locator('[data-depth-layer="far"]')
    .evaluateAll((layers) =>
      layers
        .filter((layer) => {
          const field = layer.closest("svg");
          return field && getComputedStyle(field).display !== "none";
        })
        .map((layer) => getComputedStyle(layer).animationName),
    );
  expect(activeAnimationNames).toHaveLength(1);
  expect(activeAnimationNames[0]).toMatch(/^hero-depth-drift-far(?:-mobile)?$/);
});

test("increases Hero density while preserving an open headline field", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const desktopField = page.locator(".hero-convergence__field--desktop");
  expect(await desktopField.locator("path").count()).toBeGreaterThanOrEqual(90);
  await expect(page.locator(".hero__copy")).toHaveCSS("z-index", "2");
  await expect(page.locator(".hero-convergence")).toHaveCSS("z-index", "1");
});

test("moves a small set of existing relationships from entrance into a living field", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  await page.goto("/");

  const motionRoot = page.locator("[data-hero-motion]");
  await expect(motionRoot).toHaveAttribute("data-motion-phase", "entering");

  const macroRelationships = motionRoot.locator(
    ".hero-convergence__field--desktop [data-macro-relationship]",
  );
  await expect(macroRelationships).toHaveCount(4);
  await expect(macroRelationships.first()).toHaveCSS(
    "animation-name",
    /hero-macro-converge/,
  );

  await expect(motionRoot).toHaveAttribute("data-motion-phase", "living", {
    timeout: 3000,
  });
  await context.close();
});

test("keeps macro relationships moving throughout the living state", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  await page.goto("/");

  const motionRoot = page.locator("[data-hero-motion]");
  await expect(motionRoot).toHaveAttribute("data-motion-phase", "living", {
    timeout: 3000,
  });

  const livingMotion = await motionRoot
    .locator(".hero-convergence__field--desktop [data-macro-relationship]")
    .evaluateAll((relationships) =>
      relationships.map((relationship) => {
        const style = getComputedStyle(relationship);
        return {
          name: style.animationName,
          delay: style.animationDelay,
          duration: Number.parseFloat(style.animationDuration),
          iterations: style.animationIterationCount,
          state: style.animationPlayState,
          timing: style.animationTimingFunction,
        };
      }),
    );

  expect(livingMotion).toHaveLength(4);
  expect(
    livingMotion.every(({ name }) => name.startsWith("hero-living-")),
  ).toBe(true);
  expect(
    livingMotion.every(({ iterations }) => iterations === "infinite"),
  ).toBe(true);
  expect(livingMotion.every(({ state }) => state === "running")).toBe(true);
  expect(new Set(livingMotion.map(({ duration }) => duration)).size).toBe(4);
  expect(
    livingMotion.every(({ duration }) => duration >= 6 && duration <= 10),
  ).toBe(true);
  expect(new Set(livingMotion.map(({ delay }) => delay)).size).toBe(4);
  expect(livingMotion.every(({ delay }) => Number.parseFloat(delay) < 0)).toBe(
    true,
  );
  expect(
    new Set(livingMotion.map(({ timing }) => timing)).size,
  ).toBeGreaterThan(1);

  await page.evaluate(() => window.scrollTo(0, 1100));
  await expect(motionRoot).toHaveAttribute("data-motion", "paused");
  await expect(
    motionRoot.locator("[data-macro-relationship]").first(),
  ).toHaveCSS("animation-play-state", "paused");
  await context.close();
});

test("turns desktop pointer position into progressively stronger depth perspective and returns to neutral", async ({
  browser,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Desktop-only pointer input");
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  await page.goto("/");

  const hero = page.locator(".hero");
  const motionRoot = page.locator("[data-hero-motion]");
  await expect(motionRoot).toHaveAttribute("data-motion-phase", "living", {
    timeout: 3000,
  });

  await hero.hover({ position: { x: 1300, y: 140 } });
  await expect
    .poll(() =>
      motionRoot.evaluate((root) =>
        Math.hypot(
          Number.parseFloat(
            getComputedStyle(root).getPropertyValue("--hero-pointer-near-x"),
          ),
          Number.parseFloat(
            getComputedStyle(root).getPropertyValue("--hero-pointer-near-y"),
          ),
        ),
      ),
    )
    .toBeGreaterThan(4);

  const depth = await motionRoot.evaluate((root) =>
    ["far", "mid", "near"].map((name) =>
      Math.hypot(
        Number.parseFloat(
          root.style.getPropertyValue(`--hero-pointer-${name}-x`),
        ),
        Number.parseFloat(
          root.style.getPropertyValue(`--hero-pointer-${name}-y`),
        ),
      ),
    ),
  );
  expect(depth[0]).toBeGreaterThan(0);
  expect(depth[1]).toBeGreaterThan(depth[0]!);
  expect(depth[2]).toBeGreaterThan(depth[1]!);

  await hero.dispatchEvent("pointerleave");
  await expect
    .poll(() =>
      motionRoot.evaluate((root) =>
        Math.hypot(
          Number.parseFloat(
            root.style.getPropertyValue("--hero-pointer-near-x"),
          ),
          Number.parseFloat(
            root.style.getPropertyValue("--hero-pointer-near-y"),
          ),
        ),
      ),
    )
    .toBeLessThan(0.5);
  await context.close();
});

test("keeps pointer perspective disabled on mobile while retaining an entrance", async ({
  browser,
}) => {
  const context = await browser.newContext({
    ...devices["Pixel 7"],
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  await page.goto("/");

  const motionRoot = page.locator("[data-hero-motion]");
  await expect(motionRoot).toHaveAttribute("data-motion-phase", "entering");
  await expect(
    motionRoot.locator(
      ".hero-convergence__field--mobile [data-macro-relationship]",
    ),
  ).toHaveCount(2);
  await page.dispatchEvent(".hero", "pointermove", {
    pointerType: "touch",
    clientX: 350,
    clientY: 100,
  });
  expect(
    await motionRoot.evaluate((root) =>
      Number.parseFloat(root.style.getPropertyValue("--hero-pointer-near-x")),
    ),
  ).toBe(0);
  await context.close();
});

test("starts desktop drift inside its perceptible phase with restrained cycles", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const calibration = await page
    .locator(".hero-convergence__field--desktop")
    .evaluate((field) =>
      [
        ".hero-convergence__secondary",
        ".hero-convergence__primary",
        ".hero-convergence__relationship",
        ".hero-convergence__planes",
      ].map((selector) => {
        const layer = field.querySelector(selector);
        const style = getComputedStyle(layer!);
        return {
          delay: Number.parseFloat(style.animationDelay),
          duration: Number.parseFloat(style.animationDuration),
        };
      }),
    );

  expect(calibration.map(({ duration }) => duration)).toEqual([28, 25, 22, 26]);
  expect(calibration.every(({ delay }) => delay < 0)).toBe(true);
});

test("makes scroll depth progressively stronger from FAR to NEAR", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const readTranslations = () =>
    page.locator(".hero-convergence__field--desktop").evaluate((field) => {
      const selectors = [
        ".hero-convergence__secondary",
        ".hero-convergence__primary",
        ".hero-convergence__planes",
      ];
      return selectors.map((selector) => {
        const transform = getComputedStyle(
          field.querySelector(selector)!,
        ).transform;
        const matrix = new DOMMatrixReadOnly(transform);
        return { x: matrix.m41, y: matrix.m42 };
      });
    });

  await page.evaluate(() =>
    document.getAnimations().forEach((animation) => animation.pause()),
  );
  const start = await readTranslations();
  await page.evaluate(() => window.scrollTo(0, 840));
  await expect
    .poll(() =>
      page
        .locator("[data-hero-motion]")
        .evaluate((root) =>
          Number.parseFloat(
            getComputedStyle(root).getPropertyValue("--hero-scroll-depth"),
          ),
        ),
    )
    .toBeGreaterThan(0.9);
  const end = await readTranslations();
  const displacement = end.map((point, index) =>
    Math.hypot(point.x - start[index]!.x, point.y - start[index]!.y),
  );

  expect(displacement[0]).toBeGreaterThanOrEqual(2);
  expect(displacement[0]).toBeLessThanOrEqual(4);
  expect(displacement[1]).toBeGreaterThanOrEqual(4);
  expect(displacement[1]).toBeLessThanOrEqual(7);
  expect(displacement[2]).toBeGreaterThanOrEqual(7);
  expect(displacement[2]).toBeLessThanOrEqual(11);
});

test("keeps the approved Hero static when reduced motion is requested", async ({
  browser,
}) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/");

  const motionRoot = page.locator("[data-hero-motion]");
  await expect(motionRoot).toHaveAttribute("data-motion", "reduced");
  const motionState = await motionRoot.evaluate((root) => ({
    scrollDepth: getComputedStyle(root).getPropertyValue("--hero-scroll-depth"),
    animations: Array.from(
      root.querySelectorAll<SVGGElement>("[data-depth-layer]"),
    ).map((layer) => getComputedStyle(layer).animationName),
    macroAnimations: Array.from(
      root.querySelectorAll<SVGGElement>("[data-macro-relationship]"),
    ).map((layer) => getComputedStyle(layer).animationName),
  }));

  expect(motionState.scrollDepth.trim()).toBe("0");
  expect(new Set(motionState.animations)).toEqual(new Set(["none"]));
  expect(new Set(motionState.macroAnimations)).toEqual(new Set(["none"]));
  await context.close();
});

test("leaves the Hero production-quality when client-side motion is unavailable", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");

  const motionRoot = page.locator("[data-hero-motion]");
  await expect(motionRoot).not.toHaveAttribute("data-motion", "active");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("[data-hero-supporting]")).toBeVisible();
  expect(
    await motionRoot
      .locator('[data-depth-layer="far"]')
      .first()
      .evaluate((layer) => getComputedStyle(layer).transform),
  ).toBe("none");
  await context.close();
});

test("freezes the current Hero frame instead of snapping when it leaves view", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, 1100));

  const motionRoot = page.locator("[data-hero-motion]");
  await expect(motionRoot).toHaveAttribute("data-motion", "paused");
  const farLayer = motionRoot.locator('[data-depth-layer="far"]').first();
  await expect(farLayer).toHaveCSS("animation-name", "hero-depth-drift-far");
  await expect(farLayer).toHaveCSS("animation-play-state", "paused");
});

test("suspends entrance convergence while the Hero is outside the viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const motionRoot = page.locator("[data-hero-motion]");
  await expect(motionRoot).toHaveAttribute("data-motion-phase", "entering");

  await page.evaluate(() => window.scrollTo(0, 1100));
  await expect(motionRoot).toHaveAttribute("data-motion", "paused");
  await expect(
    motionRoot.locator("[data-macro-relationship]").first(),
  ).toHaveCSS("animation-play-state", "paused");
  await page.waitForTimeout(2400);
  await expect(motionRoot).toHaveAttribute("data-motion-phase", "entering");

  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(motionRoot).toHaveAttribute("data-motion", "active");
  await expect(motionRoot).toHaveAttribute("data-motion-phase", "living", {
    timeout: 3000,
  });
});

test("keeps relational alignment disabled when the mobile Hero pauses", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, 1000));

  const motionRoot = page.locator("[data-hero-motion]");
  await expect(motionRoot).toHaveAttribute("data-motion", "paused");
  await expect(
    motionRoot.locator(".hero-convergence__relationship").last(),
  ).toHaveCSS("animation-name", "none");
});

test("preserves the desktop headline and displaced supporting relationship", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const headline = page.getByRole("heading", { level: 1 });
  const supporting = page.locator("[data-hero-supporting]");
  await expect(headline).toBeVisible();
  await expect(supporting).toBeVisible();
  const headlineBox = await headline.boundingBox();
  const supportingBox = await supporting.boundingBox();
  const headlineSize = await headline.evaluate((element) =>
    Number.parseFloat(getComputedStyle(element).fontSize),
  );

  expect(headlineBox).not.toBeNull();
  expect(supportingBox).not.toBeNull();
  expect(headlineBox!.x).toBeGreaterThanOrEqual(150);
  expect(headlineBox!.x).toBeLessThanOrEqual(210);
  expect(headlineBox!.y).toBeGreaterThanOrEqual(210);
  expect(headlineBox!.y).toBeLessThanOrEqual(270);
  expect(headlineSize).toBeGreaterThanOrEqual(80);
  expect(headlineSize).toBeLessThanOrEqual(96);
  expect(supportingBox!.x).toBeGreaterThan(headlineBox!.x + 570);
  expect(supportingBox!.y).toBeGreaterThan(headlineBox!.y + 340);
});

test("recomposes supporting copy away from the headline on mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const headlineBox = await page
    .getByRole("heading", { level: 1 })
    .boundingBox();
  const supportingBox = await page
    .locator("[data-hero-supporting]")
    .boundingBox();

  expect(headlineBox).not.toBeNull();
  expect(supportingBox).not.toBeNull();
  expect(supportingBox!.y).toBeGreaterThan(
    headlineBox!.y + headlineBox!.height + 80,
  );
  expect(supportingBox!.x).toBeGreaterThan(headlineBox!.x + 30);
});

test("renders Territórios in semantic reading order with the frozen copy", async ({
  page,
}) => {
  await page.goto("/");

  const section = page.locator("[data-territories]");
  const headings = section.getByRole("heading");

  await expect(
    section.getByRole("heading", {
      level: 2,
      name: "Onde essa engenharia ganha forma",
    }),
  ).toBeVisible();
  await expect(headings).toHaveCount(4);
  await expect(headings.nth(1)).toHaveText("WEB");
  await expect(headings.nth(2)).toHaveText("PRODUTOS");
  await expect(headings.nth(3)).toHaveText("SISTEMAS");
  await expect(
    section.getByText(
      "Sites criados, reconstruídos e evoluídos como software que precisa funcionar bem e continuar fazendo sentido depois da entrega.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(
    section.getByText(
      "Quando uma necessidade precisa ganhar interface, comportamento e estrutura para se tornar algo que alguém realmente possa usar.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(
    section.getByText(
      "Quando o trabalho está menos no que se vê e mais em fazer processos, dados e softwares diferentes funcionarem como uma coisa só.",
      { exact: true },
    ),
  ).toBeVisible();
  await expect(section.getByRole("button")).toHaveCount(0);
  await expect(section.getByRole("link")).toHaveCount(0);
});

test("awakens each page composition once and keeps it living after it leaves view", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const compositions = page.locator("[data-section-motion]");
  await expect(compositions).toHaveCount(6);
  const territories = page.locator('[data-section-motion="territories"]');
  await expect(territories).toHaveAttribute("data-motion-state", "dormant");

  await territories.scrollIntoViewIfNeeded();
  await expect(territories).toHaveAttribute("data-motion-state", "living", {
    timeout: 3000,
  });
  await expect(territories.locator("[data-motion-group]").first()).toHaveCSS(
    "animation-iteration-count",
    "infinite",
  );

  await page
    .locator('[data-section-motion="contact"]')
    .scrollIntoViewIfNeeded();
  await expect(territories).toHaveAttribute("data-motion-state", "living");
  await expect(territories.locator("[data-motion-group]").first()).toHaveCSS(
    "animation-play-state",
    "running",
  );

  await territories.scrollIntoViewIfNeeded();
  await expect(territories).toHaveAttribute("data-motion-state", "living");
});

test("keeps every page composition static for reduced motion and without JavaScript", async ({
  browser,
}) => {
  const reducedContext = await browser.newContext({ reducedMotion: "reduce" });
  const reducedPage = await reducedContext.newPage();
  await reducedPage.goto("/");
  const reducedCompositions = reducedPage.locator("[data-section-motion]");
  await expect(reducedCompositions).toHaveCount(6);
  await expect(reducedCompositions.first()).toHaveAttribute(
    "data-motion-state",
    "reduced",
  );
  expect(
    await reducedCompositions.evaluateAll((roots) =>
      roots.every((root) =>
        Array.from(root.querySelectorAll("[data-motion-group]")).every(
          (group) => getComputedStyle(group).animationName === "none",
        ),
      ),
    ),
  ).toBe(true);
  await reducedContext.close();

  const staticContext = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await staticContext.newPage();
  await staticPage.goto("/");
  const staticCompositions = staticPage.locator("[data-section-motion]");
  await expect(staticCompositions).toHaveCount(6);
  await expect(staticCompositions.first()).not.toHaveAttribute(
    "data-motion-state",
    /.+/,
  );
  expect(
    await staticCompositions.evaluateAll((roots) =>
      roots.every((root) =>
        Array.from(root.querySelectorAll("[data-motion-group]")).every(
          (group) => getComputedStyle(group).animationName === "none",
        ),
      ),
    ),
  ).toBe(true);
  await staticContext.close();
});

test("keeps Territórios geometry decorative and purpose-built", async ({
  page,
}) => {
  await page.goto("/");

  const field = page.locator("[data-territories-convergence]");
  await expect(field).toHaveCount(2);

  for (const geometry of await field.all()) {
    await expect(geometry).toHaveAttribute("aria-hidden", "true");
    await expect(geometry).toHaveAttribute("focusable", "false");
  }
});

test("places territories as unequal positions in one desktop field", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const section = page.locator("[data-territories]");
  const territories = await Promise.all(
    ["WEB", "PRODUTOS", "SISTEMAS"].map(async (name) => {
      const heading = section.getByRole("heading", { level: 3, name });
      return {
        box: await heading.boundingBox(),
        size: await heading.evaluate((element) =>
          Number.parseFloat(getComputedStyle(element).fontSize),
        ),
      };
    }),
  );

  const [web, products, systems] = territories;
  expect(web.box).not.toBeNull();
  expect(products.box).not.toBeNull();
  expect(systems.box).not.toBeNull();
  expect(web.box!.x).toBeLessThan(products.box!.x);
  expect(products.box!.x).toBeLessThan(systems.box!.x);
  expect(new Set(territories.map(({ box }) => Math.round(box!.y))).size).toBe(
    3,
  );
  expect(new Set(territories.map(({ size }) => size)).size).toBe(1);
});

test("keeps Territórios readable without client-side JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  await page.goto("/");

  const section = page.locator("[data-territories]");
  await expect(section).toBeVisible();
  await expect(
    section.getByRole("heading", { level: 3, name: "WEB" }),
  ).toBeVisible();
  await expect(
    section.getByRole("heading", { level: 3, name: "PRODUTOS" }),
  ).toBeVisible();
  await expect(
    section.getByRole("heading", { level: 3, name: "SISTEMAS" }),
  ).toBeVisible();

  await context.close();
});

test("renders Selected Work roles and transparency labels in semantic order", async ({
  page,
}) => {
  await page.goto("/");

  const section = page.locator("[data-selected-work]");
  const entries = section.locator("[data-work-entry]");

  await expect(
    section.getByRole("heading", { level: 2, name: "Selected Work" }),
  ).toBeVisible();
  await expect(entries).toHaveCount(3);
  await expect(entries.nth(0)).toHaveAttribute("data-work-entry", "web");
  await expect(entries.nth(1)).toHaveAttribute("data-work-entry", "product");
  await expect(entries.nth(2)).toHaveAttribute("data-work-entry", "systems");
  await expect(entries.nth(0).getByRole("heading", { level: 3 })).toHaveText(
    "WEB",
  );
  await expect(entries.nth(1).getByRole("heading", { level: 3 })).toHaveText(
    "PRODUTO",
  );
  await expect(entries.nth(2).getByRole("heading", { level: 3 })).toHaveText(
    "SISTEMAS",
  );
  await expect(
    section.getByText("Independent Concept", { exact: true }),
  ).toBeVisible();
  await expect(
    section.getByText("Produto próprio", { exact: true }),
  ).toBeVisible();
  await expect(
    section.getByText("Experiência profissional", { exact: true }),
  ).toBeVisible();
  await expect(section.getByText("SITUAÇÃO", { exact: true })).toHaveCount(3);
  await expect(section.getByText("DECISÃO", { exact: true })).toHaveCount(3);
  await expect(
    section.getByText("O QUE PASSOU A EXISTIR", { exact: true }),
  ).toHaveCount(3);
  await expect(section.getByRole("button")).toHaveCount(0);
  await expect(section.getByRole("link")).toHaveCount(0);
});

test("uses three distinct evidence compositions without fake case content", async ({
  page,
}) => {
  await page.goto("/");

  const section = page.locator("[data-selected-work]");
  await expect(section.locator('[data-evidence-layout="single"]')).toHaveCount(
    1,
  );
  await expect(
    section.locator('[data-evidence-layout="fragmented"]'),
  ).toHaveCount(1);
  await expect(
    section.locator('[data-evidence-layout="structural"]'),
  ).toHaveCount(1);
  await expect(
    section.locator(
      '[data-evidence-layout="fragmented"] [data-evidence-region]',
    ),
  ).toHaveCount(3);
  await expect(
    section.getByText("EVIDÊNCIA RESERVADA", { exact: true }),
  ).toHaveCount(3);
});

test("reserves the strongest single desktop evidence field for Web", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  const webField = await page
    .locator('[data-evidence-layout="single"]')
    .boundingBox();
  const productFragments = await page
    .locator('[data-evidence-layout="fragmented"] [data-evidence-region]')
    .all();
  const productBoxes = await Promise.all(
    productFragments.map((fragment) => fragment.boundingBox()),
  );

  expect(webField).not.toBeNull();
  expect(productBoxes.every(Boolean)).toBe(true);
  expect(webField!.width).toBeGreaterThanOrEqual(650);
  expect(webField!.height).toBeGreaterThanOrEqual(440);
  expect(webField!.width * webField!.height).toBeGreaterThan(
    Math.max(...productBoxes.map((box) => box!.width * box!.height)),
  );
});

test("keeps Selected Work placeholders decorative and inaccessible", async ({
  page,
}) => {
  await page.goto("/");

  const graphics = page.locator("[data-work-placeholder-graphic]");
  await expect(graphics).toHaveCount(5);

  for (const graphic of await graphics.all()) {
    await expect(graphic).toHaveAttribute("aria-hidden", "true");
    await expect(graphic).toHaveAttribute("focusable", "false");
  }
});

test("keeps Selected Work readable without client-side JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  await page.goto("/");

  const section = page.locator("[data-selected-work]");
  await expect(section).toBeVisible();
  await expect(
    section.getByRole("heading", { level: 3, name: "WEB" }),
  ).toBeVisible();
  await expect(
    section.getByRole("heading", { level: 3, name: "PRODUTO" }),
  ).toBeVisible();
  await expect(
    section.getByRole("heading", { level: 3, name: "SISTEMAS" }),
  ).toBeVisible();

  await context.close();
});

test("renders Marco / Prática with final editorial copy and minimal identity", async ({
  page,
}) => {
  await page.goto("/");

  const section = page.locator("[data-practice]");
  await expect(
    section.getByRole("heading", { level: 2, name: "Marco / Prática" }),
  ).toBeVisible();
  await expect(section.locator("[data-practice-note]")).toHaveAttribute(
    "data-copy-status",
    "final",
  );
  await expect(section.locator("[data-practice-note]")).toContainText(
    "Costumo chegar quando a solução ainda não está clara.",
  );
  await expect(section.getByText("COPY PENDING", { exact: true })).toHaveCount(
    0,
  );
  await expect(
    section.getByText("Marco Amaral", { exact: true }),
  ).toBeVisible();
  await expect(
    section.getByText("Software Developer · Brasil", { exact: true }),
  ).toBeVisible();
  await expect(section.locator("img")).toHaveCount(0);
});

test("renders exactly the two approved practice principles", async ({
  page,
}) => {
  await page.goto("/");

  const section = page.locator("[data-practice]");
  const principles = section.locator("[data-practice-principle]");

  await expect(principles).toHaveCount(2);
  await expect(principles.nth(0)).toHaveText(
    "01 — ENTENDER ANTES DE PRESCREVER",
  );
  await expect(principles.nth(1)).toHaveText(
    "02 — COMPLEXIDADE PRECISA SE JUSTIFICAR",
  );
});

test("links the verified public identity destinations", async ({ page }) => {
  await page.goto("/");

  const section = page.locator("[data-practice]");
  await expect(section.locator(".practice__verification")).toHaveAttribute(
    "aria-label",
    "Destinos de verificação",
  );
  const positions = section.locator("[data-verification-position]");

  await expect(positions).toHaveCount(2);

  const linkedin = section.getByRole("link", { name: "LinkedIn" });
  await expect(linkedin).toHaveAttribute(
    "href",
    "https://www.linkedin.com/in/marcoaamaral/",
  );
  await expect(linkedin).toHaveAttribute("target", "_blank");
  await expect(linkedin).toHaveAttribute("rel", "noreferrer");

  const github = section.getByRole("link", { name: "GitHub" });
  await expect(github).toHaveAttribute(
    "href",
    "https://github.com/marcoamaral20",
  );
  await expect(github).toHaveAttribute("target", "_blank");
  await expect(github).toHaveAttribute("rel", "noreferrer");
});

test("keeps Practice residual geometry decorative", async ({ page }) => {
  await page.goto("/");

  const geometry = page.locator("[data-practice-convergence]");
  await expect(geometry).toHaveCount(1);
  await expect(geometry).toHaveAttribute("aria-hidden", "true");
  await expect(geometry).toHaveAttribute("focusable", "false");
});

test("keeps Marco / Prática readable without client-side JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  await page.goto("/");

  const section = page.locator("[data-practice]");
  await expect(section).toBeVisible();
  await expect(
    section.getByText("01 — ENTENDER ANTES DE PRESCREVER", { exact: true }),
  ).toBeVisible();
  await expect(
    section.getByText("02 — COMPLEXIDADE PRECISA SE JUSTIFICAR", {
      exact: true,
    }),
  ).toBeVisible();

  await context.close();
});

const contactBranches = [
  {
    first: "Já tenho algo",
    question: "O que está pedindo atenção agora?",
    options: [
      "Quero melhorar",
      "Talvez precise mudar bastante",
      "Não está funcionando tão bem",
      "Prefiro explicar",
    ],
  },
  {
    first: "Estou começando algo",
    question: "Como isso está tomando forma?",
    options: [
      "Já tenho uma direção",
      "Ainda estou entendendo",
      "Quero tornar isso concreto",
      "Prefiro explicar",
    ],
  },
  {
    first: "Tem algo que preciso resolver",
    question: "Como você está enxergando isso hoje?",
    options: [
      "Já consigo explicar",
      "Ainda estou tentando entender",
      "Tem partes que não funcionam bem juntas",
      "Prefiro explicar",
    ],
  },
] as const;

test("renders Contact with its exact intro and first decisions", async ({
  page,
}) => {
  await page.goto("/");

  const section = page.locator("[data-contact]");
  await expect(
    section.getByRole("heading", {
      level: 2,
      name: "Comece pelo que você tem.",
    }),
  ).toBeVisible();
  await expect(
    section.getByText("O resto pode ganhar clareza na conversa.", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    section.getByRole("heading", {
      level: 3,
      name: "De onde estamos partindo?",
    }),
  ).toBeVisible();
  await expect(section.locator("[data-decision-one] button")).toHaveCount(4);
  await expect(
    section.getByText("CONTACT DESTINATION PENDING", { exact: true }),
  ).toHaveCount(0);
  await expect(
    section.getByRole("link", { name: "contato@marcoamaral.dev" }),
  ).toHaveAttribute("href", "mailto:contato@marcoamaral.dev");
});

test("maps Contact decisions to its own geometric branch state", async ({
  page,
}) => {
  await page.goto("/");
  const contact = page.locator("[data-contact]");
  await contact.scrollIntoViewIfNeeded();
  await expect(contact).toHaveAttribute("data-contact-geometry-state", "start");

  await page.getByRole("button", { name: "Já tenho algo" }).click();
  await expect(contact).toHaveAttribute(
    "data-contact-geometry-state",
    "existing",
  );

  await page.getByRole("button", { name: "Alterar ponto de partida" }).click();
  await page.getByRole("button", { name: "Prefiro explicar direto" }).click();
  await expect(contact).toHaveAttribute(
    "data-contact-geometry-state",
    "direct",
  );
});

for (const branch of contactBranches) {
  for (const option of branch.options) {
    test(`${branch.first} resolves through ${option}`, async ({ page }) => {
      await page.goto("/");

      const section = page.locator("[data-contact]");
      await section
        .getByRole("button", { name: branch.first, exact: true })
        .click();
      await expect(
        section.getByRole("heading", { level: 3, name: branch.question }),
      ).toBeFocused();
      await section.getByRole("button", { name: option, exact: true }).click();

      await expect(
        section.getByRole("heading", {
          level: 3,
          name: "Já temos um ponto de partida.",
        }),
      ).toBeFocused();
      await expect(
        section.getByText("Podemos seguir daqui.", { exact: true }),
      ).toBeVisible();
      await expect(section.locator("[data-contact-context]")).toContainText(
        `${branch.first} → ${option}`,
      );
    });
  }
}

test("the direct path skips the contextual question", async ({ page }) => {
  await page.goto("/");

  const section = page.locator("[data-contact]");
  await section
    .getByRole("button", { name: "Prefiro explicar direto", exact: true })
    .click();

  await expect(section.locator("[data-decision-two]:visible")).toHaveCount(0);
  await expect(
    section.getByRole("heading", {
      level: 3,
      name: "Já temos um ponto de partida.",
    }),
  ).toBeFocused();
  await expect(section.locator("[data-contact-context]")).toHaveText(
    "Prefiro explicar direto",
  );
  await expect(
    section.getByRole("link", { name: "Continuar por e-mail" }),
  ).toHaveAttribute("href", "mailto:contato@marcoamaral.dev");
});

test("keeps Contact convergence decorative", async ({ page }) => {
  await page.goto("/");

  const geometry = page.locator("[data-contact-convergence]");
  await expect(geometry).toHaveCount(1);
  await expect(geometry).toHaveAttribute("aria-hidden", "true");
  await expect(geometry).toHaveAttribute("focusable", "false");
});

test("back and changing the first decision clear incompatible context", async ({
  page,
}) => {
  await page.goto("/");

  const section = page.locator("[data-contact]");
  await section
    .getByRole("button", { name: "Já tenho algo", exact: true })
    .click();
  await section
    .getByRole("button", { name: "Quero melhorar", exact: true })
    .click();
  await section.getByRole("button", { name: "Voltar", exact: true }).click();
  await expect(
    section.getByRole("heading", {
      level: 3,
      name: "O que está pedindo atenção agora?",
    }),
  ).toBeFocused();

  await section
    .getByRole("button", { name: "Alterar ponto de partida", exact: true })
    .click();
  await section
    .getByRole("button", { name: "Estou começando algo", exact: true })
    .click();
  await expect(section.locator("[data-contact-context]")).toHaveText(
    "Estou começando algo",
  );
  await expect(
    section.getByRole("button", { name: "Quero melhorar", exact: true }),
  ).toHaveCount(0);
});

test("restart clears the router and never navigates externally", async ({
  page,
}) => {
  await page.goto("/");
  const initialUrl = page.url();

  const section = page.locator("[data-contact]");
  await section
    .getByRole("button", { name: "Estou começando algo", exact: true })
    .click();
  await section
    .getByRole("button", { name: "Ainda estou entendendo", exact: true })
    .click();
  await section.getByRole("button", { name: "Recomeçar", exact: true }).click();

  await expect(
    section.getByRole("heading", {
      level: 3,
      name: "De onde estamos partindo?",
    }),
  ).toBeFocused();
  await expect(section.locator("[data-contact-context]")).toBeEmpty();
  expect(page.url()).toBe(initialUrl);
});

test("completes Contact with keyboard controls and visible focus", async ({
  page,
}) => {
  await page.goto("/#contact");

  const section = page.locator("[data-contact]");
  const firstChoice = section.getByRole("button", {
    name: "Já tenho algo",
    exact: true,
  });
  await firstChoice.focus();
  await page.keyboard.press("Enter");
  await expect(
    section.getByRole("heading", {
      level: 3,
      name: "O que está pedindo atenção agora?",
    }),
  ).toBeFocused();

  const secondChoice = section.getByRole("button", {
    name: "Quero melhorar",
    exact: true,
  });
  await secondChoice.focus();
  await expect
    .poll(() =>
      secondChoice.evaluate((button) => getComputedStyle(button).outlineStyle),
    )
    .not.toBe("none");
  await page.keyboard.press("Space");
  await expect(
    section.getByRole("heading", {
      level: 3,
      name: "Já temos um ponto de partida.",
    }),
  ).toBeFocused();
  await expect(secondChoice).toHaveCount(0);
});

test("keeps Contact truthful and readable without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/#contact");

  const section = page.locator("[data-contact]");
  await expect(
    section.getByRole("heading", {
      level: 2,
      name: "Comece pelo que você tem.",
    }),
  ).toBeVisible();
  await expect(
    section.getByText("O resto pode ganhar clareza na conversa.", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    section.getByRole("link", { name: "contato@marcoamaral.dev" }),
  ).toHaveAttribute("href", "mailto:contato@marcoamaral.dev");

  await context.close();
});

test("uses system dark preference when no explicit preference exists", async ({
  browser,
}) => {
  const context = await browser.newContext({ colorScheme: "dark" });
  const page = await context.newPage();

  await page.goto("/");

  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(
    page.getByRole("button", { name: "Usar tema claro" }),
  ).toBeVisible();
  await context.close();
});

test("explicit choice overrides the system and persists", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");

  await page.getByRole("button", { name: "Usar tema escuro" }).click();

  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem("marco-amaral-theme")))
    .toBe("dark");

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("has no detectable accessibility violations in the foundation shell", async ({
  page,
}) => {
  await page.goto("/");

  const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations).toEqual([]);
});

for (const viewport of [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 820, height: 1180 },
  { name: "desktop", width: 1440, height: 900 },
]) {
  test(`does not overflow horizontally at ${viewport.name} width`, async ({
    page,
  }) => {
    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    });
    await page.goto("/");

    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));

    expect(dimensions.scrollWidth).toBe(dimensions.clientWidth);
  });
}
