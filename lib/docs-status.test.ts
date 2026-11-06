import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it, vi } from "vitest"
import { createApiClient } from "./api/client"
import { ApiClientError } from "./api/types"
import { DOCS_LINKS, DOCS_SITE_URL } from "./docs"

const root = process.cwd()
const docsPage = readFileSync(join(root, "app", "docs", "page.tsx"), "utf8")
const statusPage = readFileSync(join(root, "app", "status", "page.tsx"), "utf8")
const statusPanel = readFileSync(
  join(root, "components", "status", "status-panel.tsx"),
  "utf8",
)
const layout = readFileSync(join(root, "app", "layout.tsx"), "utf8")
const docsLib = readFileSync(join(root, "lib", "docs.ts"), "utf8")

const combined = [docsPage, statusPage, statusPanel, layout, docsLib].join("\n")

const jsonResponse = (status: number, body: unknown): Response => {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  })
}

describe("docs and status routes (T25)", () => {
  it("links /docs to the published docs site", () => {
    expect(DOCS_SITE_URL).toBe("https://axiomchess.github.io/docs/")
    expect(docsPage).toContain("DOCS_SITE_URL")
    expect(docsPage).toContain("DOCS_LINKS")
    expect(docsLib).toContain("https://axiomchess.github.io/docs/")
    expect(docsLib).toContain("ethics.html")
    expect(docsLib).toContain("api-overview.html")
    expect(docsLib).toContain("supported-sites.html")
    expect(DOCS_LINKS.some((link) => link.href === DOCS_SITE_URL)).toBe(true)
    expect(layout).toContain('href="/docs"')
  })

  it("wires /status to GET /v1/health and handles API down", () => {
    expect(statusPage).toContain("StatusPanel")
    expect(statusPanel).toContain("getHealth")
    expect(statusPanel).toContain("API unavailable")
    expect(statusPanel).toContain("network_error")
    expect(statusPanel).toContain('role="alert"')
    expect(layout).toContain('href="/status"')
  })

  it("keeps copy free of placeholder, emoji, and cheater labels", () => {
    expect(combined.toLowerCase()).not.toContain("lorem")
    expect(combined.toLowerCase()).not.toContain("placeholder")
    expect(combined.toLowerCase()).not.toContain("cheater")
    expect(combined).not.toMatch(/[\u{1F300}-\u{1FAFF}]/u)
  })

  it("getHealth returns ok payload from mock API", async () => {
    const fetchImpl = vi.fn(async () =>
      jsonResponse(200, {
        status: "ok",
        service: "axiomchess-api",
        apiVersion: "v1",
      }),
    )
    const client = createApiClient({
      baseUrl: "http://api.test",
      fetchImpl: fetchImpl as unknown as typeof fetch,
    })

    const health = await client.getHealth()
    expect(health).toEqual({
      status: "ok",
      service: "axiomchess-api",
      apiVersion: "v1",
    })
    expect(fetchImpl).toHaveBeenCalledWith(
      "http://api.test/v1/health",
      expect.objectContaining({
        headers: expect.objectContaining({ accept: "application/json" }),
      }),
    )
  })

  it("getHealth maps network failure to ApiClientError", async () => {
    const fetchImpl = vi.fn(async () => {
      throw new TypeError("Failed to fetch")
    })
    const client = createApiClient({
      baseUrl: "http://api.test",
      fetchImpl: fetchImpl as unknown as typeof fetch,
    })

    await expect(client.getHealth()).rejects.toBeInstanceOf(ApiClientError)
    await expect(client.getHealth()).rejects.toMatchObject({
      code: "network_error",
      status: 0,
    })
  })
})
