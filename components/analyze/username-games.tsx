"use client"

import Link from "next/link"
import { useEffect, useMemo, useState, type KeyboardEvent } from "react"
import { createApiClient } from "@/lib/api/client"
import {
  ANALYZE_LIMITS_COPY,
  FALSE_POSITIVE_COPY,
  messageForApiError,
  siteDisplayName,
} from "@/lib/api/messages"
import {
  ApiClientError,
  type AnalyzeQueuedResponse,
  type SupportedSiteId,
  type UsernameGameRef,
} from "@/lib/api/types"

type UsernameGamesProps = {
  site: SupportedSiteId
  username: string
  apiBaseUrl?: string
}

export const UsernameGames = ({
  site,
  username,
  apiBaseUrl,
}: UsernameGamesProps) => {
  const [games, setGames] = useState<UsernameGameRef[]>([])
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [analyzingId, setAnalyzingId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [result, setResult] = useState<AnalyzeQueuedResponse | null>(null)

  const client = useMemo(
    () => createApiClient(apiBaseUrl ? { baseUrl: apiBaseUrl } : undefined),
    [apiBaseUrl],
  )

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      setErrorMessage(null)
      try {
        const response = await client.listUsernameGames({
          site,
          username,
          page: 1,
          pageSize: 10,
        })
        if (cancelled) return
        setGames(response.games)
        setHasMore(response.hasMore)
        setPage(1)
      } catch (error) {
        if (cancelled) return
        if (error instanceof ApiClientError) {
          setErrorMessage(messageForApiError(error))
        } else {
          setErrorMessage("Unexpected error while listing public games.")
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [client, site, username])

  const handleLoadMore = async () => {
    const nextPage = page + 1
    setLoading(true)
    setErrorMessage(null)
    try {
      const response = await client.listUsernameGames({
        site,
        username,
        page: nextPage,
        pageSize: 10,
      })
      setGames((current) => [...current, ...response.games])
      setHasMore(response.hasMore)
      setPage(nextPage)
    } catch (error) {
      if (error instanceof ApiClientError) {
        setErrorMessage(messageForApiError(error))
      } else {
        setErrorMessage("Unexpected error while listing public games.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAnalyze = async (game: UsernameGameRef) => {
    setAnalyzingId(game.gameId)
    setErrorMessage(null)
    setResult(null)
    try {
      const response = await client.analyzeByUrl(game.sourceUrl)
      setResult(response)
    } catch (error) {
      if (error instanceof ApiClientError) {
        setErrorMessage(messageForApiError(error))
      } else {
        setErrorMessage("Unexpected error while starting analysis.")
      }
    } finally {
      setAnalyzingId(null)
    }
  }

  const handleAnalyzeKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    game: UsernameGameRef,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      void handleAnalyze(game)
    }
  }

  return (
    <div className="analyze-panel">
      <p className="analyze-limits">{ANALYZE_LIMITS_COPY}</p>
      <p className="analyze-limits">{FALSE_POSITIVE_COPY}</p>
      <p className="analyze-subtitle">
        Recent public games for {username} on {siteDisplayName(site)}
      </p>

      {loading && games.length === 0 ? (
        <p className="analyze-muted" role="status">
          Loading public games
        </p>
      ) : null}

      {errorMessage ? (
        <p className="analyze-error" role="alert">
          {errorMessage}
        </p>
      ) : null}

      {result ? (
        <div className="analyze-result" role="status">
          <p className="analyze-result-line">
            Analysis {result.status}:{" "}
            <span className="analyze-mono">{result.id}</span>
          </p>
          <Link
            className="analyze-result-link"
            href={`/report/${encodeURIComponent(result.id)}`}
            aria-label={`Open report for analysis ${result.id}`}
          >
            Open report
          </Link>
        </div>
      ) : null}

      {games.length > 0 ? (
        <ul className="analyze-game-list" aria-label="Recent public games">
          {games.map((game) => (
            <li key={`${game.site}-${game.gameId}`} className="analyze-game-item">
              <div className="analyze-game-meta">
                <span className="analyze-mono">{game.gameId}</span>
                <a
                  className="analyze-game-source"
                  href={game.sourceUrl}
                  aria-label={`Open public game ${game.gameId} on ${siteDisplayName(site)}`}
                >
                  Source
                </a>
              </div>
              <button
                type="button"
                className="analyze-game-action"
                disabled={analyzingId === game.gameId || loading}
                aria-busy={analyzingId === game.gameId}
                aria-label={`Analyze public game ${game.gameId}`}
                tabIndex={0}
                onClick={() => void handleAnalyze(game)}
                onKeyDown={(event) => handleAnalyzeKeyDown(event, game)}
              >
                {analyzingId === game.gameId ? "Starting" : "Analyze"}
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {!loading && games.length === 0 && !errorMessage ? (
        <p className="analyze-muted" role="status">
          No recent public finished games were returned for this username.
        </p>
      ) : null}

      {hasMore ? (
        <button
          type="button"
          className="analyze-submit"
          disabled={loading}
          onClick={() => void handleLoadMore()}
          aria-label="Load more public games"
        >
          {loading ? "Loading" : "Load more"}
        </button>
      ) : null}
    </div>
  )
}
