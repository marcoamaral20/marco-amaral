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
