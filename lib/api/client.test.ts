import { describe, expect, it, vi } from "vitest"
import { createApiClient } from "./client"
import { messageForApiError } from "./messages"
import { ApiClientError } from "./types"

const jsonResponse = (status: number, body: unknown): Response => {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  })
}

describe("API client analyze smoke (mock)", () => {
  it("posts PGN analyze and returns queued job", async () => {
    const fetchImpl = vi.fn(async () =>
      jsonResponse(202, {
        id: "11111111-1111-4111-8111-111111111111",
        status: "queued",
      }),
    )
    const client = createApiClient({
      baseUrl: "http://api.test",
      fetchImpl: fetchImpl as unknown as typeof fetch,
    })

    const result = await client.analyzeByPgn('[Event "Test"]\n1. e4 e5')
    expect(result.id).toBe("11111111-1111-4111-8111-111111111111")
    expect(result.status).toBe("queued")
    expect(fetchImpl).toHaveBeenCalledWith(
      "http://api.test/v1/analyze/pgn",
      expect.objectContaining({ method: "POST" }),
    )
  })

  it("maps private_or_unavailable to a clear user message", async () => {
    const fetchImpl = vi.fn(async () =>
      jsonResponse(404, {
        code: "private_or_unavailable",
        message: "Game is private",
        requestId: "req-private",
      }),
    )
    const client = createApiClient({
      baseUrl: "http://api.test",
      fetchImpl: fetchImpl as unknown as typeof fetch,
    })

    let caught: unknown
    try {
      await client.analyzeByUrl("https://lichess.org/abcd1234")
    } catch (error) {
      caught = error
    }

    expect(caught).toBeInstanceOf(ApiClientError)
    const apiError = caught as ApiClientError
    expect(apiError.code).toBe("private_or_unavailable")
    expect(apiError.status).toBe(404)
    expect(messageForApiError(apiError)).toContain("private or unavailable")
    expect(messageForApiError(apiError).toLowerCase()).not.toContain(
      "encourage",
    )
  })

  it("maps rate_limited with retry guidance", async () => {
    const fetchImpl = vi.fn(async () =>
      jsonResponse(429, {
        code: "rate_limited",
        message: "Analysis quota exceeded",
        requestId: "req-rl",
      }),
    )
    const client = createApiClient({
      baseUrl: "http://api.test",
      fetchImpl: fetchImpl as unknown as typeof fetch,
    })

    await expect(
      client.analyzeByUrl("https://lichess.org/abcd1234"),
    ).rejects.toMatchObject({ code: "rate_limited", status: 429 })

    try {
      await client.analyzeByUrl("https://lichess.org/abcd1234")
    } catch (error) {
      expect(messageForApiError(error as ApiClientError)).toContain(
        "Rate limit reached",
      )
    }
  })

  it("lists username games without analyze flag", async () => {
    const fetchImpl = vi.fn(async (_url: string, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body)) as Record<string, unknown>
      expect(body.analyze).toBe(false)
      expect(body.site).toBe("lichess")
      expect(body.username).toBe("alice")
      return jsonResponse(200, {
        site: "lichess",
        username: "alice",
        page: 1,
        pageSize: 10,
        hasMore: false,
        games: [
          {
            site: "lichess",
            gameId: "abcd1234",
            sourceUrl: "https://lichess.org/abcd1234",
          },
        ],
      })
    })
    const client = createApiClient({
      baseUrl: "http://api.test",
      fetchImpl: fetchImpl as unknown as typeof fetch,
    })

    const listed = await client.listUsernameGames({
      site: "lichess",
      username: "alice",
    })
    expect(listed.games).toHaveLength(1)
    expect(listed.games[0]?.gameId).toBe("abcd1234")
  })
})
