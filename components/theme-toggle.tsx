"use client"

import { useEffect, useSyncExternalStore, type KeyboardEvent } from "react"
import {
  isThemePreference,
  resolveTheme,
  THEME_ATTRIBUTE,
  THEME_STORAGE_KEY,
  type ThemePreference,
} from "@/lib/theme"

const THEME_EVENT = "ax-theme"

const cyclePreference = (current: ThemePreference): ThemePreference => {
  if (current === "system") return "light"
  if (current === "light") return "dark"
  return "system"
}

const labelFor = (preference: ThemePreference): string => {
  if (preference === "light") return "Theme: light"
  if (preference === "dark") return "Theme: dark"
  return "Theme: system"
}

const subscribePreference = (onStoreChange: () => void) => {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY || event.key === null) {
      onStoreChange()
    }
  }
  window.addEventListener("storage", handleStorage)
  window.addEventListener(THEME_EVENT, onStoreChange)
  return () => {
    window.removeEventListener("storage", handleStorage)
    window.removeEventListener(THEME_EVENT, onStoreChange)
  }
}

const getPreferenceSnapshot = (): ThemePreference => {
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
  if (stored && isThemePreference(stored)) return stored
  return "system"
}

const getServerPreferenceSnapshot = (): ThemePreference => "system"

export const ThemeToggle = () => {
  const preference = useSyncExternalStore(
    subscribePreference,
    getPreferenceSnapshot,
    getServerPreferenceSnapshot,
  )

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const apply = () => {
      document.documentElement.setAttribute(
        THEME_ATTRIBUTE,
        resolveTheme(preference, media.matches),
      )
    }
    apply()
    media.addEventListener("change", apply)
    return () => media.removeEventListener("change", apply)
  }, [preference])

  const handleClick = () => {
    const next = cyclePreference(preference)
    window.localStorage.setItem(THEME_STORAGE_KEY, next)
    window.dispatchEvent(new Event(THEME_EVENT))
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      handleClick()
    }
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={labelFor(preference)}
      tabIndex={0}
    >
      {labelFor(preference)}
    </button>
  )
}
