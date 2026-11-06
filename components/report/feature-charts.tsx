import type { AnalysisResultV1 } from "@/lib/api/types"
import { formatPercent } from "@/lib/report/parse-result"

type FeatureChartsProps = {
  result: AnalysisResultV1
}

const MatchBar = ({
  label,
  value,
}: {
  label: string
  value: number
}) => {
  const width = `${Math.max(0, Math.min(1, value)) * 100}%`
  return (
    <div className="report-match-row">
      <span className="report-match-label">{label}</span>
      <div
        className="report-match-track"
        role="img"
        aria-label={`${label} ${formatPercent(value)}`}
      >
        <div className="report-match-fill" style={{ width }} />
      </div>
      <span className="report-match-value analyze-mono">
        {formatPercent(value)}
      </span>
    </div>
  )
}

export const FeatureCharts = ({ result }: FeatureChartsProps) => {
  const values = result.features.cpl.values
  const maxCpl = Math.max(40, ...values, 1)
  const points = values.map((cpl, index) => {
    const x =
      values.length <= 1 ? 8 : 8 + (index / (values.length - 1)) * 84
    const y = 52 - (cpl / maxCpl) * 44
    return `${x.toFixed(2)},${y.toFixed(2)}`
  })
  const polyline = points.join(" ")

  return (
    <section className="report-charts" aria-labelledby="report-charts-heading">
      <h2 id="report-charts-heading" className="report-section-title">
        Feature charts
      </h2>

      <div className="report-chart-block">
        <h3 className="report-chart-title">Match to engine</h3>
        <MatchBar label="Top-1 overall" value={result.features.match.top1Rate} />
        <MatchBar label="Top-3 overall" value={result.features.match.top3Rate} />
        <MatchBar
          label="Top-1 white"
          value={result.features.match.top1RateWhite}
        />
        <MatchBar
          label="Top-1 black"
          value={result.features.match.top1RateBlack}
        />
      </div>

      <div className="report-chart-block">
        <h3 className="report-chart-title">Centipawn loss by usable ply</h3>
        {values.length === 0 ? (
          <p className="report-muted">No usable non-book plies for CPL.</p>
        ) : (
          <svg
            className="report-cpl-chart"
            viewBox="0 0 100 60"
            role="img"
            aria-label={`CPL series across ${values.length} usable plies; average ${result.features.cpl.average.toFixed(1)}`}
          >
            <line
              className="report-cpl-axis"
              x1="8"
              y1="52"
              x2="92"
              y2="52"
            />
            <line
              className="report-cpl-axis"
              x1="8"
              y1="8"
              x2="8"
              y2="52"
            />
            <polyline
              className="report-cpl-line"
              fill="none"
              points={polyline}
            />
            {values.map((cpl, index) => {
              const x =
                values.length <= 1
                  ? 8
                  : 8 + (index / (values.length - 1)) * 84
              const y = 52 - (cpl / maxCpl) * 44
              return (
                <circle
                  key={`cpl-${index}`}
                  className="report-cpl-point"
                  cx={x}
                  cy={y}
                  r={1.4}
                />
              )
            })}
          </svg>
        )}
        <p className="report-muted">
          Average CPL {result.features.cpl.average.toFixed(1)}; median{" "}
          {result.features.cpl.median.toFixed(1)}; p90{" "}
          {result.features.cpl.p90.toFixed(1)}.
        </p>
      </div>
    </section>
  )
}
