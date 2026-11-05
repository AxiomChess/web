import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

const pageSource = readFileSync(join(process.cwd(), "app", "page.tsx"), "utf8")
const boardSource = readFileSync(
  join(process.cwd(), "components", "hero-board.tsx"),
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

  it("uses a product board visual with board theme hooks", () => {
    expect(pageSource).toContain("HeroBoard")
    expect(boardSource).toContain("is-last-move")
    expect(cssSource).toContain("var(--ax-board-square-light)")
    expect(cssSource).toContain("var(--ax-board-square-dark)")
    expect(cssSource).toContain("var(--ax-board-last-move)")
  })

  it("limits landing motion to brand-settle and piece-place", () => {
    expect(cssSource).toContain("@keyframes brand-settle")
    expect(cssSource).toContain("@keyframes piece-place")
    expect(cssSource).toContain("animation: brand-settle")
    expect(cssSource).toContain("animation: piece-place")
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
