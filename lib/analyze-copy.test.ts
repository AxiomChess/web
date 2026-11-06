import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import {
  ANALYZE_LIMITS_COPY,
  FALSE_POSITIVE_COPY,
  messageForApiError,
} from "./api/messages"
import { ApiClientError } from "./api/types"

const root = process.cwd()
const analyzePage = readFileSync(join(root, "app", "analyze", "page.tsx"), "utf8")
const analyzeForm = readFileSync(
  join(root, "components", "analyze", "analyze-form.tsx"),
  "utf8",
)
const usernamePage = readFileSync(
  join(root, "app", "u", "[site]", "[username]", "page.tsx"),
  "utf8",
)
const usernameGames = readFileSync(
  join(root, "components", "analyze", "username-games.tsx"),
  "utf8",
)
const messages = readFileSync(join(root, "lib", "api", "messages.ts"), "utf8")

const combined = [
  analyzePage,
  analyzeForm,
  usernamePage,
  usernameGames,
  messages,
].join("\n")

describe("analyze flows copy (T23)", () => {
  it("states public-only limits and never encourages private games", () => {
    expect(ANALYZE_LIMITS_COPY.toLowerCase()).toContain("public")
    expect(ANALYZE_LIMITS_COPY.toLowerCase()).toContain("private")
    expect(ANALYZE_LIMITS_COPY.toLowerCase()).toContain("not supported")
    expect(combined.toLowerCase()).not.toContain("bypass")
    expect(combined.toLowerCase()).not.toContain("login cookie")
    expect(combined.toLowerCase()).not.toContain("access private")
    expect(combined.toLowerCase()).not.toContain("unlock private")
  })

  it("keeps false-positive guidance and bans cheater labels", () => {
    expect(FALSE_POSITIVE_COPY.toLowerCase()).toContain("uncertainty")
    expect(combined.toLowerCase()).not.toContain("cheater")
    expect(combined.toLowerCase()).not.toContain("lorem")
    expect(combined).not.toMatch(/[\u{1F300}-\u{1FAFF}]/u)
  })

  it("exposes clear messages for private and rate-limit errors", () => {
    const privateMsg = messageForApiError(
      new ApiClientError({
        code: "private_or_unavailable",
        message: "hidden",
        status: 404,
      }),
    )
    const rateMsg = messageForApiError(
      new ApiClientError({
        code: "rate_limited",
        message: "hidden",
        status: 429,
      }),
    )
    expect(privateMsg.toLowerCase()).toContain("private or unavailable")
    expect(rateMsg.toLowerCase()).toContain("rate limit")
  })

  it("wires analyze and username routes", () => {
    expect(analyzePage).toContain("AnalyzeForm")
    expect(analyzeForm).toContain("analyzeByUrl")
    expect(analyzeForm).toContain("analyzeByPgn")
    expect(analyzeForm).toContain("/u/")
    expect(usernamePage).toContain("UsernameGames")
    expect(usernameGames).toContain("listUsernameGames")
    expect(usernameGames).toContain("analyzeByUrl")
  })
})
