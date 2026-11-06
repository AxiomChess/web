"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  useId,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react"
import { createApiClient } from "@/lib/api/client"
import {
  ANALYZE_LIMITS_COPY,
  FALSE_POSITIVE_COPY,
  messageForApiError,
} from "@/lib/api/messages"
import { ApiClientError, type AnalyzeQueuedResponse } from "@/lib/api/types"

type AnalyzeMode = "url" | "pgn" | "username"

type AnalyzeFormProps = {
  apiBaseUrl?: string
}

export const AnalyzeForm = ({ apiBaseUrl }: AnalyzeFormProps) => {
  const formId = useId()
  const router = useRouter()
  const [mode, setMode] = useState<AnalyzeMode>("url")
  const [url, setUrl] = useState("")
  const [pgn, setPgn] = useState("")
  const [site, setSite] = useState<"lichess" | "chesscom">("lichess")
  const [username, setUsername] = useState("")
  const [busy, setBusy] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [result, setResult] = useState<AnalyzeQueuedResponse | null>(null)

  const client = createApiClient(
    apiBaseUrl ? { baseUrl: apiBaseUrl } : undefined,
  )

  const handleModeKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    next: AnalyzeMode,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      setMode(next)
      setErrorMessage(null)
      setResult(null)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage(null)
    setResult(null)

    if (mode === "username") {
      const trimmed = username.trim()
      if (!trimmed) {
        setErrorMessage("Enter a public username.")
        return
      }
      router.push(
        `/u/${encodeURIComponent(site)}/${encodeURIComponent(trimmed)}`,
      )
      return
    }

    setBusy(true)
    try {
      const response =
        mode === "url"
          ? await client.analyzeByUrl(url.trim())
          : await client.analyzeByPgn(pgn.trim())
      setResult(response)
    } catch (error) {
      if (error instanceof ApiClientError) {
        setErrorMessage(messageForApiError(error))
      } else {
        setErrorMessage("Unexpected error while starting analysis.")
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="analyze-panel">
      <p className="analyze-limits">{ANALYZE_LIMITS_COPY}</p>
      <p className="analyze-limits">{FALSE_POSITIVE_COPY}</p>

      <div
        className="analyze-mode"
        role="tablist"
        aria-label="Analyze input method"
      >
        {(
          [
            ["url", "Game URL"],
            ["pgn", "PGN paste"],
            ["username", "Username"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            role="tab"
            id={`${formId}-${value}`}
            className={
              mode === value ? "analyze-mode-btn is-active" : "analyze-mode-btn"
            }
            aria-selected={mode === value}
            tabIndex={0}
            onClick={() => {
              setMode(value)
              setErrorMessage(null)
              setResult(null)
            }}
            onKeyDown={(event) => handleModeKeyDown(event, value)}
          >
            {label}
          </button>
        ))}
      </div>

      <form className="analyze-form" onSubmit={handleSubmit} noValidate>
        {mode === "url" ? (
          <label className="analyze-field" htmlFor={`${formId}-url`}>
            <span className="analyze-label">Public game URL</span>
            <input
              id={`${formId}-url`}
              className="analyze-input"
              name="url"
              type="url"
              inputMode="url"
              autoComplete="off"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              aria-required="true"
              aria-describedby={`${formId}-url-help`}
              disabled={busy}
            />
            <span id={`${formId}-url-help`} className="analyze-help">
              Example: a Lichess or Chess.com public game link
            </span>
          </label>
        ) : null}

        {mode === "pgn" ? (
          <label className="analyze-field" htmlFor={`${formId}-pgn`}>
            <span className="analyze-label">PGN</span>
            <textarea
              id={`${formId}-pgn`}
              className="analyze-textarea"
              name="pgn"
              rows={12}
              spellCheck={false}
              value={pgn}
              onChange={(event) => setPgn(event.target.value)}
              aria-required="true"
              aria-describedby={`${formId}-pgn-help`}
              disabled={busy}
            />
            <span id={`${formId}-pgn-help`} className="analyze-help">
              Paste a finished standard-chess PGN. Book moves and clocks are
              used when present.
            </span>
          </label>
        ) : null}

        {mode === "username" ? (
          <div className="analyze-username-fields">
            <label className="analyze-field" htmlFor={`${formId}-site`}>
              <span className="analyze-label">Site</span>
              <select
                id={`${formId}-site`}
                className="analyze-input"
                name="site"
                value={site}
                onChange={(event) =>
                  setSite(event.target.value as "lichess" | "chesscom")
                }
                aria-label="Chess site"
              >
                <option value="lichess">Lichess</option>
                <option value="chesscom">Chess.com</option>
              </select>
            </label>
            <label className="analyze-field" htmlFor={`${formId}-username`}>
              <span className="analyze-label">Public username</span>
              <input
                id={`${formId}-username`}
                className="analyze-input"
                name="username"
                type="text"
                autoComplete="off"
                spellCheck={false}
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                aria-required="true"
              />
            </label>
          </div>
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

        <button
          type="submit"
          className="analyze-submit"
          disabled={busy}
          aria-busy={busy}
        >
          {mode === "username"
            ? "Look up public games"
            : busy
              ? "Starting analysis"
              : "Start analysis"}
        </button>
      </form>
    </div>
  )
}
