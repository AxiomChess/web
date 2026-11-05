import { describe, expect, it } from "vitest"
import {
  isThemePreference,
  resolveTheme,
  THEME_ATTRIBUTE,
  THEME_STORAGE_KEY,
} from "./theme"

describe("theme helpers", () => {
  it("accepts only light, dark, and system preferences", () => {
    expect(isThemePreference("light")).toBe(true)
    expect(isThemePreference("dark")).toBe(true)
    expect(isThemePreference("system")).toBe(true)
    expect(isThemePreference("neon")).toBe(false)
  })

  it("resolves system preference from prefers-color-scheme", () => {
    expect(resolveTheme("system", true)).toBe("dark")
    expect(resolveTheme("system", false)).toBe("light")
    expect(resolveTheme("light", true)).toBe("light")
    expect(resolveTheme("dark", false)).toBe("dark")
  })

  it("uses stable storage and attribute names for token wiring", () => {
    expect(THEME_STORAGE_KEY).toBe("ax-theme")
    expect(THEME_ATTRIBUTE).toBe("data-theme")
  })
})
