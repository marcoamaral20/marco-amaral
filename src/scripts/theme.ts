export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "marco-amaral-theme";

export function resolveTheme(
  storedTheme: string | null,
  prefersDark: boolean,
): Theme {
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return prefersDark ? "dark" : "light";
}

export function toggleTheme(theme: Theme): Theme {
  return theme === "light" ? "dark" : "light";
}
