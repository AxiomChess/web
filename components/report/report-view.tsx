"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { FeatureCharts } from "@/components/report/feature-charts"
import { MoveTable } from "@/components/report/move-table"
import { ReplayBoard } from "@/components/report/replay-board"
import { SuspicionBandPanel } from "@/components/report/suspicion-band"
import { createApiClient } from "@/lib/api/client"
import { messageForApiError } from "@/lib/api/messages"
import { ApiClientError, type AnalysisSnapshot } from "@/lib/api/types"
import { parseAnalysisResultV1 } from "@/lib/report/parse-result"
import { buildReplayModel } from "@/lib/report/pgn-replay"

type ReportViewProps = {
  analysisId: string
  apiBaseUrl?: string
}

export const ReportView = ({ analysisId, apiBaseUrl }: ReportViewProps) => {
  const [snapshot, setSnapshot] = useState<AnalysisSnapshot | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [ply, setPly] = useState(0)

  const client = useMemo(
    () => createApiClient(apiBaseUrl ? { baseUrl: apiBaseUrl } : undefined),
    [apiBaseUrl],
  )

  useEffect(() => {
    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | null = null

    const load = async () => {
      try {
        const next = await client.getAnalysis(analysisId)
        if (cancelled) return
        setSnapshot(next)
        setErrorMessage(null)
        if (next.status === "queued" || next.status === "running") {
          timer = setTimeout(() => {
            void load()
          }, 1500)
        }
      } catch (error) {
        if (cancelled) return
        if (error instanceof ApiClientError) {
          setErrorMessage(messageForApiError(error))
        } else {
          setErrorMessage("Unexpected error while loading the report.")
        }
      }
    }

    void load()
    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
    }
  }, [analysisId, client])

  const result = snapshot ? parseAnalysisResultV1(snapshot.result) : null
  const replay =
    snapshot && result
      ? buildReplayModel(snapshot.normalizedPgn, result)
      : null

  return (
    <div className="report-page">
      <header className="report-header">
        <p className="analyze-kicker">
          <Link href="/analyze" aria-label="Back to analyze">
            Analyze
          </Link>
          {" / Report"}
        </p>
        <h1 className="analyze-title">Analysis report</h1>
        <p className="analyze-lead">
          Board replay, move quality table, and calibrated suspicion band with
          methodology notes.
        </p>
      </header>

      {errorMessage ? (
        <p className="analyze-error" role="alert">
          {errorMessage}
        </p>
      ) : null}

      {!errorMessage && !snapshot ? (
        <p className="report-muted">Loading analysis...</p>
      ) : null}

      {snapshot && (snapshot.status === "queued" || snapshot.status === "running") ? (
        <p className="report-muted" aria-live="polite">
          Analysis status: {snapshot.status}. This page refreshes automatically.
        </p>
      ) : null}

      {snapshot?.error ? (
        <p className="analyze-error" role="alert">
          Analysis failed: {snapshot.error.message || snapshot.error.code}
        </p>
      ) : null}

      {snapshot && snapshot.status === "completed" && !result ? (
        <p className="analyze-error" role="alert">
          The analysis result could not be parsed.
        </p>
      ) : null}

      {result ? (
        <>
          <SuspicionBandPanel result={result} />

          <section
            className="report-notes"
            aria-labelledby="report-notes-heading"
          >
            <h2 id="report-notes-heading" className="report-section-title">
              Methodology and limits
            </h2>
            <p className="report-note">{result.methodologyNote}</p>
            <p className="report-note">{result.falsePositiveWarning}</p>
            {result.sampleSizeCaveats.length > 0 ? (
              <ul className="report-caveats">
                {result.sampleSizeCaveats.map((caveat) => (
                  <li key={caveat}>{caveat}</li>
                ))}
              </ul>
            ) : null}
            <p className="report-muted">
              Engine policy {result.engine.policyId}; depth {result.engine.depth};
              MultiPV {result.engine.multiPv}; calibration{" "}
              {result.calibrationPolicyId}.
            </p>
          </section>

          <FeatureCharts result={result} />

          {replay ? (
            <div className="report-replay-grid">
              <ReplayBoard model={replay} ply={ply} onPlyChange={setPly} />
              <MoveTable
                model={replay}
                activePly={ply}
                onSelectPly={setPly}
              />
            </div>
          ) : (
            <p className="analyze-error" role="alert">
              Board replay is unavailable because the stored PGN could not be
              parsed.
            </p>
          )}
        </>
      ) : null}
    </div>
  )
}
