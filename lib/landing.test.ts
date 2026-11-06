import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

const pageSource = readFileSync(join(process.cwd(), "app", "page.tsx"), "utf8")
const reportSource = readFileSync(
  join(process.cwd(), "components", "hero-report.tsx"),
  "utf8",
)
const cssSource = readFileSync(
  join(process.cwd(), "app", "globals.css"),
  "utf8",
)

describe("landing page (T22)", () => {
  it("keeps AxiomChess as a hero-level brand signal", () => {
    expect(pageSource).toContain('id="landing-brand"')
    expect(pageSource).toContain("AxiomChess")
    expect(pageSource).toContain("landing-brand")
    expect(pageSource).toContain("Calibrated fair-play analysis for finished games")
    expect(pageSource).toContain("never a raw accusation")
  })

  it("ships one CTA group without placeholder or cheater copy", () => {
    expect(pageSource).toContain('href="/analyze"')
    expect(pageSource).toContain("https://axiomchess.github.io/docs/")
    expect(pageSource).toContain("Analyze a game")
    expect(pageSource).toContain("Documentation")
    expect(pageSource.toLowerCase()).not.toContain("lorem")
    expect(pageSource.toLowerCase()).not.toContain("placeholder")
    expect(pageSource.toLowerCase()).not.toContain("cheater")
    expect(pageSource).not.toMatch(/[\u{1F300}-\u{1FAFF}]/u)
  })

  it("uses a product report visual instead of a hero board", () => {
    expect(pageSource).toContain("HeroReport")
    expect(pageSource).not.toContain("HeroBoard")
    expect(reportSource).toContain("elevated")
    expect(reportSource).toContain("Top-1 match")
    expect(cssSource).toContain("hero-report")
    expect(cssSource).toContain("animation: band-reveal")
  })

  it("limits landing motion to brand-settle and band-reveal", () => {
    expect(cssSource).toContain("@keyframes brand-settle")
    expect(cssSource).toContain("@keyframes band-reveal")
    expect(cssSource).toContain("animation: brand-settle")
    expect(cssSource).toContain("@keyframes piece-place")
    expect(cssSource).not.toContain("glow")
    expect(cssSource.toLowerCase()).not.toContain("purple")
    expect(cssSource).not.toContain("rounded-full")
  })

  it("keeps focus-visible styles for keyboard users", () => {
    expect(cssSource).toContain("a:focus-visible")
    expect(cssSource).toContain("button:focus-visible")
    expect(cssSource).toContain("outline: 2px solid var(--ax-focus)")
  })
})
