import type { Metadata } from "next"
import Link from "next/link"
import { DOCS_SITE_URL } from "@/lib/docs"

export const metadata: Metadata = {
  title: "Privacy | AxiomChess",
  description:
    "Privacy notice for AxiomChess: what is stored, retention, and erasure.",
}

export default function PrivacyPage() {
  return (
    <main id="main-content" className="analyze-page" tabIndex={-1}>
      <header className="analyze-header">
        <h1 className="analyze-title">Privacy notice</h1>
        <p className="analyze-lead">
          Short notice for operators and users of the AxiomChess web app and
          public API. AxiomChess does not sell personal data.
        </p>
      </header>

      <section className="analyze-panel" aria-labelledby="what-we-store-heading">
        <h2 id="what-we-store-heading" className="report-section-title">
          What we store
        </h2>
        <ul className="docs-link-list">
          <li className="docs-link-item">
            <p className="analyze-help">
              Analysis inputs you submit (PGN text or public game references) and
              the resulting analysis JSON, until retention expiry.
            </p>
          </li>
          <li className="docs-link-item">
            <p className="analyze-help">
              Optional API key metadata: hashed key material only (SHA-256 with a
              server pepper). Raw keys are never stored.
            </p>
          </li>
          <li className="docs-link-item">
            <p className="analyze-help">
              Request logs with a request id; IP-based rate limits may retain
              counters briefly. Info-level logs use a PGN content hash, not full
              PGN bodies.
            </p>
          </li>
        </ul>
      </section>

      <section className="analyze-panel" aria-labelledby="legal-basis-heading">
        <h2 id="legal-basis-heading" className="report-section-title">
          Public games and user-supplied PGN
        </h2>
        <p className="analyze-help">
          Analysis uses publicly available finished games from documented site
          APIs, or PGN you paste. Private games are out of scope. Prefer
          analyzing your own games or clearly public games.
        </p>
      </section>

      <section className="analyze-panel" aria-labelledby="retention-heading">
        <h2 id="retention-heading" className="report-section-title">
          Retention and erasure
        </h2>
        <p className="analyze-help">
          Default retention for stored analyses is 30 days
          (<code>ANALYSIS_RETENTION_DAYS</code>), configurable by the operator.
          Expired analyses are not returned by{" "}
          <code>GET /v1/analyses/{"{id}"}</code>. You can request hard deletion
          with <code>DELETE /v1/analyses/{"{id}"}</code>.
        </p>
      </section>

      <section className="analyze-panel" aria-labelledby="reports-heading">
        <h2 id="reports-heading" className="report-section-title">
          Reports and limits
        </h2>
        <p className="analyze-help">
          Reports show calibrated suspicion bands with uncertainty and
          methodology notes. They never emit a definitive cheater label.
          False-positive risk is real, especially on short games or missing
          clocks.
        </p>
      </section>

      <section className="analyze-panel" aria-labelledby="more-heading">
        <h2 id="more-heading" className="report-section-title">
          More detail
        </h2>
        <p className="analyze-help">
          Product docs:{" "}
          <a
            href={`${DOCS_SITE_URL}privacy.html`}
            aria-label="Open privacy notice on the docs site"
          >
            {DOCS_SITE_URL}privacy.html
          </a>
          . Ethics:{" "}
          <Link href="/docs" aria-label="Open in-app documentation entry">
            Documentation
          </Link>
          .
        </p>
      </section>
    </main>
  )
}
