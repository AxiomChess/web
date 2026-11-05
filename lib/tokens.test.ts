import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

const tokensCss = readFileSync(
  join(process.cwd(), "styles", "tokens.css"),
  "utf8",
)

describe("ingested design tokens", () => {
  it("exposes Ink and Felt light accent and chalk background", () => {
    expect(tokensCss).toContain("--ax-accent: #0e7a5f")
    expect(tokensCss).toContain("--ax-bg: #f2f4f3")
    expect(tokensCss).toContain('--ax-font-display: "Syne"')
    expect(tokensCss).toContain('--ax-font-body: "IBM Plex Sans"')
  })

  it("exposes dark theme via data-theme attribute selectors", () => {
    expect(tokensCss).toContain('[data-theme="dark"]')
    expect(tokensCss).toContain("--ax-accent: #3db892")
    expect(tokensCss).toContain("--ax-bg: #121816")
  })

  it("does not use banned brand faces or pure black large fields", () => {
    expect(tokensCss.toLowerCase()).not.toContain("inter")
    expect(tokensCss.toLowerCase()).not.toContain("roboto")
    expect(tokensCss).not.toContain("#000000")
    expect(tokensCss).not.toContain("#000;")
  })
})
