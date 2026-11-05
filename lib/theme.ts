export type ThemePreference = "light" | "dark" | "system"
export type ResolvedTheme = "light" | "dark"

export const THEME_STORAGE_KEY = "ax-theme"
export const THEME_ATTRIBUTE = "data-theme"

export const isThemePreference = (value: string): value is ThemePreference =>
  value === "light" || value === "dark" || value === "system"

export const resolveTheme = (
  preference: ThemePreference,
  prefersDark: boolean,
): ResolvedTheme => {
  if (preference === "system") {
    return prefersDark ? "dark" : "light"
  }
  return preference
}

export const themeInitScript = `(() => {
  try {
    const key = ${JSON.stringify(THEME_STORAGE_KEY)};
    const stored = localStorage.getItem(key);
    const preference = stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const resolved = preference === "system" ? (prefersDark ? "dark" : "light") : preference;
    document.documentElement.setAttribute(${JSON.stringify(THEME_ATTRIBUTE)}, resolved);
  } catch (_) {
    document.documentElement.setAttribute(${JSON.stringify(THEME_ATTRIBUTE)}, "light");
  }
})();`
