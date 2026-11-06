export type SupportedSiteId = "lichess" | "chesscom"

export type ApiErrorBody = {
  code: string
  message: string
  details?: unknown
  requestId: string
}

export type AnalyzeQueuedResponse = {
  id: string
  status: string
  sourceUrl?: string
  site?: string
  siteGameId?: string
  cache?: "hit"
  enginePolicyId?: string
  result?: unknown
}

export type UsernameGameRef = {
  site: string
  gameId: string
  sourceUrl: string
}

export type UsernameListResponse = {
  site: string
  username: string
  page: number
  pageSize: number
  hasMore: boolean
  games: UsernameGameRef[]
  analyses?: {
    id: string
    status: string
    gameId: string
    cache?: "hit"
  }[]
}

export type AnalysisSnapshot = {
  id: string
  status: string
  enginePolicyId: string
  result: unknown
  error: { code: string; message: string } | null
  createdAt: string
  updatedAt: string
  completedAt: string | null
  expiresAt: string
}

export class ApiClientError extends Error {
  readonly code: string
  readonly status: number
  readonly requestId: string | null
  readonly details?: unknown

  constructor(input: {
    code: string
    message: string
    status: number
    requestId?: string | null
    details?: unknown
  }) {
    super(input.message)
    this.name = "ApiClientError"
    this.code = input.code
    this.status = input.status
    this.requestId = input.requestId ?? null
    if ("details" in input) {
      this.details = input.details
    }
  }
}
