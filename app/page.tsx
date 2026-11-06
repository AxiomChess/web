import Link from "next/link"
import { HeroReport } from "@/components/hero-report"

export default function HomePage() {
  return (
    <main id="main-content" className="landing" tabIndex={-1}>
      <section className="landing-hero" aria-labelledby="landing-brand">
        <div className="landing-copy">
          <p id="landing-brand" className="landing-brand">
            AxiomChess
          </p>
          <h1 className="landing-headline">
            Calibrated fair-play analysis for finished games
          </h1>
          <p className="landing-support">
            Engine-backed reports with suspicion bands, uncertainty, and
            methodology notes -- never a raw accusation.
          </p>
          <div className="landing-cta">
            <Link
              className="landing-cta-primary"
              href="/analyze"
              aria-label="Analyze a finished game"
            >
              Analyze a game
            </Link>
            <a
              className="landing-cta-secondary"
              href="https://axiomchess.github.io/docs/"
              aria-label="Read AxiomChess documentation"
            >
              Documentation
            </a>
          </div>
        </div>
        <div className="landing-visual">
          <HeroReport />
        </div>
      </section>

      <section className="landing-section" aria-labelledby="landing-how">
        <h2 id="landing-how" className="landing-section-title">
          How a report is built
        </h2>
        <p className="landing-section-lead">
          Public game or PGN in. Stockfish MultiPV eval. Features, calibrated
          score, ordinal band. Human report and versioned JSON out.
        </p>
        <ol className="landing-steps">
          <li>
            <strong>Ingest</strong>
            <span>
              Public URL, PGN paste, or username list from allowlisted Lichess
              and Chess.com endpoints only.
            </span>
          </li>
          <li>
            <strong>Evaluate</strong>
            <span>
              Policy <code>engine-v1</code>: MultiPV 3, depth 18 (standard) /
              16 (bullet). Book plies excluded from match stats.
            </span>
          </li>
          <li>
            <strong>Calibrate</strong>
            <span>
              Score in [0, 1] with uncertainty. Bands: low, elevated, high, or
              inconclusive -- never a raw accusation.
            </span>
          </li>
        </ol>
      </section>

      <section className="landing-section landing-section-alt" aria-labelledby="landing-limits">
        <h2 id="landing-limits" className="landing-section-title">
          Hard limits
        </h2>
        <p className="landing-section-lead">
          Education-first analysis aid. Not a tribunal. Public-API-only ingest.
          Short games, missing clocks, and book-heavy openings widen uncertainty.
        </p>
        <div className="landing-limits-row">
          <p>
            <a href="https://axiomchess.github.io/docs/ethics.html">
              Ethics and public-API-only policy
            </a>
          </p>
          <p>
            <a href="https://axiomchess.github.io/docs/methodology.html">
              Methodology and calibration
            </a>
          </p>
          <p>
            <a href="/privacy">Privacy and retention</a>
          </p>
        </div>
      </section>
    </main>
  )
}
