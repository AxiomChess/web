import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

const root = process.cwd()
const checklistPath = join(root, "docs", "visual-qa-v1.md")
const shotDir = join(root, "docs", "visual-qa")

const requiredShots = [
  "landing-light.png",
  "landing-dark.png",
  "report-light-band.png",
  "report-light-board.png",
  "report-dark-band.png",
  "report-dark-board.png",
] as const

describe("visual QA v1 (T29)", () => {
  it("records a completed checklist with no FAIL rows", () => {
    expect(existsSync(checklistPath)).toBe(true)
    const text = readFileSync(checklistPath, "utf8")
    expect(text).toContain("B01")
    expect(text).toContain("B15")
    expect(text).toContain("R01")
    expect(text).toContain("R08")
    expect(text).toContain("PASS")
    expect(text).not.toMatch(/\|\s*FAIL\b/)
    expect(text).toContain("B14")
    expect(text.toLowerCase()).toContain("definitive cheater label")
  })

  it("keeps production screenshots for landing and report", () => {
    for (const name of requiredShots) {
      const path = join(shotDir, name)
      expect(existsSync(path), path).toBe(true)
      const bytes = readFileSync(path)
      expect(bytes.byteLength).toBeGreaterThan(10_000)
    }
  })
})
