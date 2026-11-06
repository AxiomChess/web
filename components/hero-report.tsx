/** Stylized report surface for the landing hero (fixture numbers, not a live analysis). */
export const HeroReport = () => {
  return (
    <div
      className="hero-report"
      role="img"
      aria-label="Sample fair-play report with elevated suspicion band, match rates, and centipawn-loss chart"
    >
      <div className="hero-report-top">
        <p className="hero-report-kicker">Analysis report</p>
        <p className="hero-report-policy">policy engine-v1 · calibration-v1</p>
      </div>

      <div className="hero-report-band">
        <div className="hero-report-band-row">
          <span className="hero-report-band-label">elevated</span>
          <span className="hero-report-band-score">S = 0.58</span>
        </div>
        <div className="hero-report-track" aria-hidden="true">
          <div className="hero-report-fill" style={{ width: "58%" }} />
          <div className="hero-report-range" style={{ left: "42%", width: "32%" }} />
        </div>
        <p className="hero-report-note">
          Uncertainty half-width 0.16 · usable plies 34 · not a raw accusation
        </p>
      </div>

      <div className="hero-report-metrics" aria-hidden="true">
        <div className="hero-report-metric">
          <span>Top-1 match</span>
          <div className="hero-report-bar">
            <i style={{ width: "54%" }} />
          </div>
          <strong>54%</strong>
        </div>
        <div className="hero-report-metric">
          <span>Top-3 match</span>
          <div className="hero-report-bar">
            <i style={{ width: "78%" }} />
          </div>
          <strong>78%</strong>
        </div>
        <div className="hero-report-metric">
          <span>Avg CPL</span>
          <div className="hero-report-bar">
            <i style={{ width: "36%" }} />
          </div>
          <strong>41</strong>
        </div>
      </div>

      <svg
        className="hero-report-chart"
        viewBox="0 0 320 96"
        aria-hidden="true"
        focusable="false"
      >
        <title>Sample CPL by ply</title>
        <line className="hero-report-axis" x1="8" y1="80" x2="312" y2="80" />
        <polyline
          className="hero-report-line"
          fill="none"
          points="12,62 36,48 60,55 84,30 108,42 132,28 156,50 180,22 204,38 228,44 252,18 276,34 300,26"
        />
      </svg>

      <p className="hero-report-foot">
        Methodology and false-positive notes ship with every result.
      </p>
    </div>
  )
}
