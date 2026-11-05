import Link from "next/link"
import { HeroBoard } from "@/components/hero-board"

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
          <HeroBoard />
        </div>
      </section>
    </main>
  )
}
