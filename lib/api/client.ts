import {
  ApiClientError,
  type AnalysisSnapshot,
  type AnalyzeQueuedResponse,
  type ApiErrorBody,
  type HealthResponse,
  type SupportedSiteId,
  type UsernameListResponse,
} from "./types"

export type ApiClientOptions = {
  baseUrl?: string
  fetchImpl?: typeof fetch
}

/**
 * Empty base = same-origin `/v1/*` (Next.js rewrites to API_PROXY_TARGET).
 * Prefer this locally so the browser never has to call a cross-origin localhost port.
 */
const envBase =
  typeof process !== "undefined" ? process.env.NEXT_PUBLIC_API_BASE_URL : undefined
const DEFAULT_BASE = envBase === undefined ? "" : envBase

const trimSlash = (value: string): string => value.replace(/\/+$/u, "")

const REQUEST_TIMEOUT_MS = 45_000

const parseErrorBody = async (
  response: Response,
): Promise<ApiErrorBody | null> => {
  try {
    const body = (await response.json()) as Partial<ApiErrorBody>
    if (typeof body.code === "string" && typeof body.message === "string") {
      return {
        code: body.code,
        message: body.message,
        requestId:
          typeof body.requestId === "string" ? body.requestId : "",
        details: body.details,
      }
    }
  } catch {
    return null
  }
  return null
}

export const createApiClient = (options: ApiClientOptions = {}) => {
  const baseUrl = trimSlash(options.baseUrl ?? DEFAULT_BASE)
  const fetchImpl = options.fetchImpl ?? fetch

  const requestJson = async <T>(
    path: string,
    init?: RequestInit,
  ): Promise<T> => {
    let response: Response
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
    try {
      response = await fetchImpl(`${baseUrl}${path}`, {
        ...init,
        signal: controller.signal,
        headers: {
          accept: "application/json",
          ...(init?.body ? { "content-type": "application/json" } : {}),
          ...init?.headers,
        },
      })
    } catch {
      throw new ApiClientError({
        code: "network_error",
        message: "Network request to AxiomChess API failed",
        status: 0,
      })
    } finally {
      clearTimeout(timeoutId)
    }

    if (!response.ok) {
      const errorBody = await parseErrorBody(response)
      throw new ApiClientError({
        code: errorBody?.code ?? "upstream_error",
        message:
          errorBody?.message ??
          `API request failed with status ${response.status}`,
        status: response.status,
        requestId: errorBody?.requestId ?? null,
        details: errorBody?.details,
      })
    }

    return (await response.json()) as T
  }

  return {
    baseUrl,

    getHealth: (): Promise<HealthResponse> => {
      return requestJson<HealthResponse>("/v1/health")
    },

    analyzeByUrl: (url: string): Promise<AnalyzeQueuedResponse> => {
      return requestJson<AnalyzeQueuedResponse>("/v1/analyze/url", {
        method: "POST",
        body: JSON.stringify({ url }),
      })
    },

    analyzeByPgn: (pgn: string): Promise<AnalyzeQueuedResponse> => {
      return requestJson<AnalyzeQueuedResponse>("/v1/analyze/pgn", {
        method: "POST",
        body: JSON.stringify({ pgn }),
      })
    },

    listUsernameGames: (input: {
      site: SupportedSiteId
      username: string
      page?: number
      pageSize?: number
    }): Promise<UsernameListResponse> => {
      return requestJson<UsernameListResponse>("/v1/analyze/username", {
        method: "POST",
        body: JSON.stringify({
          site: input.site,
          username: input.username,
          page: input.page ?? 1,
          pageSize: input.pageSize ?? 10,
          analyze: false,
        }),
      })
    },

    getAnalysis: (id: string): Promise<AnalysisSnapshot> => {
      return requestJson<AnalysisSnapshot>(
        `/v1/analyses/${encodeURIComponent(id)}`,
      )
    },
  }
}

export type ApiClient = ReturnType<typeof createApiClient>

export const defaultApiClient = createApiClient()
