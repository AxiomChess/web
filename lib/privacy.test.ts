import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

const root = process.cwd()
const privacyPage = readFileSync(
  join(root, "app", "privacy", "page.tsx"),
  "utf8",
)
const layout = readFileSync(join(root, "app", "layout.tsx"), "utf8")
const docsLib = readFileSync(join(root, "lib", "docs.ts"), "utf8")

describe("privacy notice (T27)", () => {
  it("publishes /privacy with retention and erasure copy", () => {
    expect(privacyPage).toContain("Privacy notice")
    expect(privacyPage).toContain("30 days")
    expect(privacyPage).toContain("DELETE /v1/analyses")
    expect(privacyPage).toContain("does not sell personal data")
    expect(privacyPage.toLowerCase()).not.toContain("lorem")
    expect(privacyPage).not.toMatch(/[\u{1F300}-\u{1FAFF}]/u)
  })

  it("links privacy from the shell footer and docs links", () => {
    expect(layout).toContain('href="/privacy"')
    expect(layout).toContain("shell-footer")
    expect(docsLib).toContain("privacy.html")
  })

  it("states reports never emit a definitive cheater label", () => {
    expect(privacyPage.toLowerCase()).toContain(
      "never emit a definitive cheater label",
    )
  })
})

