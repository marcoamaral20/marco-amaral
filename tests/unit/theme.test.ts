import { describe, expect, test } from "vitest";

import { resolveTheme, toggleTheme } from "../../src/scripts/theme";

describe("resolveTheme", () => {
  test("uses an explicit light preference before the system preference", () => {
    expect(resolveTheme("light", true)).toBe("light");
  });

  test("uses an explicit dark preference before the system preference", () => {
    expect(resolveTheme("dark", false)).toBe("dark");
  });

  test("uses the dark system preference when no explicit preference exists", () => {
    expect(resolveTheme(null, true)).toBe("dark");
  });

  test("falls back to light when no explicit or dark system preference exists", () => {
    expect(resolveTheme(null, false)).toBe("light");
  });

  test("ignores unrecognized persisted values", () => {
    expect(resolveTheme("sepia", false)).toBe("light");
  });
});

describe("toggleTheme", () => {
  test("returns the opposite supported theme", () => {
    expect(toggleTheme("light")).toBe("dark");
    expect(toggleTheme("dark")).toBe("light");
  });
});
