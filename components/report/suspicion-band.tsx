import type { AnalysisResultV1 } from "@/lib/api/types"
import {
  formatBandLabel,
  formatPercent,
  formatScore,
} from "@/lib/report/parse-result"

type SuspicionBandProps = {
  result: AnalysisResultV1
}

export const SuspicionBandPanel = ({ result }: SuspicionBandProps) => {
  const { score, uncertainty, band } = result.suspicion
  const scorePct = `${(score * 100).toFixed(1)}%`
  const lowPct = `${(uncertainty.low * 100).toFixed(1)}%`
  const highPct = `${(uncertainty.high * 100).toFixed(1)}%`
  const widthPct = `${(score * 100).toFixed(1)}%`

  return (
    <section
      className="report-band"
      aria-labelledby="report-band-heading"
      data-band={band}
    >
      <h2 id="report-band-heading" className="report-section-title">
        Suspicion band
      </h2>
      <p className="report-band-value" aria-live="polite">
        <span className="report-band-label">{formatBandLabel(band)}</span>
        <span className="report-band-score">
          score {formatScore(score)} ({formatPercent(score)})
        </span>
      </p>
      <p className="report-band-uncertainty">
        Uncertainty interval {formatScore(uncertainty.low)} to{" "}
        {formatScore(uncertainty.high)} (half-width{" "}
        {formatScore(uncertainty.halfWidth)})
      </p>
      <div
        className="report-band-track"
        role="img"
        aria-label={`Suspicion score ${scorePct} with uncertainty from ${lowPct} to ${highPct}`}
      >
        <div className="report-band-fill-wrap" style={{ width: widthPct }}>
          <div className="report-band-fill" data-motion="band-reveal" />
        </div>
        <div
          className="report-band-range"
          style={{
            left: lowPct,
            width: `calc(${highPct} - ${lowPct})`,
          }}
        />
      </div>
      <p className="report-band-ethics">
        Bands are informational only. Reports never issue a raw accusation.
      </p>
    </section>
  )
}
