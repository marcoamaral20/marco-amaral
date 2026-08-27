import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("renders the frozen Hero copy with a single primary heading", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.getByRole("banner")).toBeVisible();
  await expect(page.getByRole("main")).toBeVisible();
  await expect(page.getByText("Marco Amaral", { exact: true })).toBeVisible();
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

  const territories = await Promise.all(
    ["WEB", "PRODUTOS", "SISTEMAS"].map(async (name) => {
      const heading = page.getByRole("heading", { level: 3, name });
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

  await expect(page.locator("[data-territories]")).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 3, name: "WEB" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 3, name: "PRODUTOS" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 3, name: "SISTEMAS" }),
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
