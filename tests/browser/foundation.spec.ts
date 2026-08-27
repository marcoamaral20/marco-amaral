import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

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
    page.getByText("Software Engineer", { exact: true }),
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

test("renders Marco / Prática with pending editorial copy and minimal identity", async ({
  page,
}) => {
  await page.goto("/");

  const section = page.locator("[data-practice]");
  await expect(
    section.getByRole("heading", { level: 2, name: "Marco / Prática" }),
  ).toBeVisible();
  await expect(section.locator("[data-practice-note]")).toHaveAttribute(
    "data-copy-status",
    "pending",
  );
  await expect(
    section.getByText("COPY PENDING", { exact: true }),
  ).toBeVisible();
  await expect(
    section.getByText("Marco Amaral", { exact: true }),
  ).toBeVisible();
  await expect(
    section.getByText("Software Engineer · Brasil", { exact: true }),
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

test("reserves verification-link positions without inventing destinations", async ({
  page,
}) => {
  await page.goto("/");

  const section = page.locator("[data-practice]");
  const positions = section.locator("[data-verification-position]");

  await expect(positions).toHaveCount(2);
  await expect(positions.nth(0)).toContainText("LinkedIn");
  await expect(positions.nth(1)).toContainText("GitHub");
  await expect(section.getByRole("link")).toHaveCount(0);
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
