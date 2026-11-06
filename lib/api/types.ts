export type SupportedSiteId = "lichess" | "chesscom"

export type HealthResponse = {
  status: "ok"
  service: "axiomchess-api"
  apiVersion: "v1"
}

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

export type SuspicionBand = "low" | "elevated" | "high" | "inconclusive"

export type AnalysisResultV1 = {
  version: "v1"
  analyzedAt: string
  engine: {
    policyId: "engine-v1"
    multiPv: 3
    depth: number
    threads: number
    hashMb: number
  }
  calibrationPolicyId: "calibration-v1"
  features: {
    book: {
      bookId: string
      bookPlyCount: number
      noveltyPly: number | null
    }
    match: {
      top1Rate: number
      top3Rate: number
      top1RateWhite: number
      top1RateBlack: number
      top3RateWhite: number
      top3RateBlack: number
      usablePlies: number
      usablePliesWhite: number
      usablePliesBlack: number
    }
    cpl: {
      average: number
      median: number
      p90: number
      averageWhite: number
      averageBlack: number
      values: number[]
    }
    timing: {
      meanMoveTimeSec: number
      medianMoveTimeSec: number
      fastHighMatchStreakMax: number
      fastMoveThresholdSec: number
      moveTimesSec: number[]
    } | null
  }
  suspicion: {
    score: number
    uncertainty: {
      low: number
      high: number
      halfWidth: number
    }
    band: SuspicionBand
  }
  methodologyNote: string
  falsePositiveWarning: string
  featuresUsed: string[]
  sampleSizeCaveats: string[]
}

export type AnalysisSnapshot = {
  id: string
  status: string
  enginePolicyId: string
  normalizedPgn: string
  result: AnalysisResultV1 | null | unknown
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
