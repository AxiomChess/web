"use client"

import { useEffect, useState } from "react"
import { createApiClient } from "@/lib/api/client"
import { ApiClientError, type HealthResponse } from "@/lib/api/types"

type StatusPanelProps = {
  apiBaseUrl?: string
}

type StatusState =
  | { kind: "loading" }
  | { kind: "ok"; health: HealthResponse; checkedAt: string }
  | { kind: "down"; message: string; checkedAt: string }

const formatCheckedAt = (): string => new Date().toISOString()

const resolveBaseUrl = (apiBaseUrl?: string): string => {
  return createApiClient(apiBaseUrl ? { baseUrl: apiBaseUrl } : undefined)
    .baseUrl
}

export const StatusPanel = ({ apiBaseUrl }: StatusPanelProps) => {
  const endpointBase = resolveBaseUrl(apiBaseUrl)
  const [tick, setTick] = useState(0)
  const [state, setState] = useState<StatusState>({ kind: "loading" })

  useEffect(() => {
    let cancelled = false
    const client = createApiClient(
      apiBaseUrl ? { baseUrl: apiBaseUrl } : undefined,
    )

    const loadHealth = async () => {
      setState({ kind: "loading" })
      try {
        const health = await client.getHealth()
        if (cancelled) {
          return
        }
        if (health.status !== "ok") {
          setState({
            kind: "down",
            message: `API returned unexpected status "${String(health.status)}".`,
            checkedAt: formatCheckedAt(),
          })
          return
        }
        setState({
          kind: "ok",
          health,
          checkedAt: formatCheckedAt(),
        })
      } catch (error) {
        if (cancelled) {
          return
        }
        const message =
          error instanceof ApiClientError
            ? error.code === "network_error"
              ? "The AxiomChess API is unreachable from this browser."
              : error.message
            : "The AxiomChess API is unavailable."
        setState({
          kind: "down",
          message,
          checkedAt: formatCheckedAt(),
        })
      }
    }

    void loadHealth()
    return () => {
      cancelled = true
    }
  }, [apiBaseUrl, tick])

  const handleRefresh = () => {
    setTick((value) => value + 1)
  }

  return (
    <section className="analyze-panel" aria-labelledby="status-heading">
      <div className="status-header-row">
        <h2 id="status-heading" className="report-section-title">
          API health
        </h2>
        <button
          type="button"
          className="analyze-submit"
          onClick={handleRefresh}
          aria-label="Refresh API health status"
          disabled={state.kind === "loading"}
        >
          Refresh
        </button>
      </div>

      <p className="analyze-help">
        Endpoint:{" "}
        <span className="analyze-mono">{endpointBase}/v1/health</span>
      </p>

      {state.kind === "loading" ? (
        <p className="analyze-muted" role="status">
          Checking API health...
        </p>
      ) : null}

      {state.kind === "ok" ? (
        <div className="status-ok" role="status" aria-live="polite">
          <p className="status-badge status-badge-ok">API reachable</p>
          <dl className="status-dl">
            <div>
              <dt>status</dt>
              <dd className="analyze-mono">{state.health.status}</dd>
            </div>
            <div>
              <dt>service</dt>
              <dd className="analyze-mono">{state.health.service}</dd>
            </div>
            <div>
              <dt>apiVersion</dt>
              <dd className="analyze-mono">{state.health.apiVersion}</dd>
            </div>
            <div>
              <dt>checkedAt</dt>
              <dd className="analyze-mono">{state.checkedAt}</dd>
            </div>
          </dl>
        </div>
      ) : null}

      {state.kind === "down" ? (
        <div className="status-down" role="alert" aria-live="assertive">
          <p className="status-badge status-badge-down">API unavailable</p>
          <p className="analyze-error">{state.message}</p>
          <p className="analyze-muted">
            Analyze and report pages will not work until the API responds. Start
            the api package locally (<code>pnpm start</code>, default port
            3000). Browser calls use same-origin <code>/v1/*</code> rewritten to{" "}
            <span className="analyze-mono">
              {endpointBase || "API_PROXY_TARGET"}
            </span>
            . Checked at{" "}
            <span className="analyze-mono">{state.checkedAt}</span>.
          </p>
        </div>
      ) : null}
    </section>
  )
}
