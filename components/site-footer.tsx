import Link from "next/link"
import { DOCS_SITE_URL } from "@/lib/docs"

export const SiteFooter = () => {
  return (
    <footer className="site-footer" aria-label="Site footer">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <Link
            className="site-footer-logo"
            href="/"
            aria-label="AxiomChess home"
          >
            <span className="site-footer-mark" aria-hidden="true" />
            AxiomChess
          </Link>
          <p className="site-footer-tagline">
            Calibrated fair-play analysis for finished games. Open-source.
            Public-API-only. Never a raw accusation.
          </p>
        </div>

        <nav className="site-footer-col" aria-label="Product">
          <p className="site-footer-heading">Product</p>
          <ul>
            <li>
              <Link href="/analyze" aria-label="Analyze a finished game">
                Analyze
              </Link>
            </li>
            <li>
              <Link href="/status" aria-label="API status">
                Status
              </Link>
            </li>
            <li>
              <Link href="/docs" aria-label="Documentation entry">
                Docs entry
              </Link>
            </li>
          </ul>
        </nav>

        <nav className="site-footer-col" aria-label="Documentation">
          <p className="site-footer-heading">Documentation</p>
          <ul>
            <li>
              <a href={DOCS_SITE_URL} aria-label="Product wiki home">
                Wiki home
              </a>
            </li>
            <li>
              <a
                href={`${DOCS_SITE_URL}methodology.html`}
                aria-label="Methodology"
              >
                Methodology
              </a>
            </li>
            <li>
              <a
                href={`${DOCS_SITE_URL}api-overview.html`}
                aria-label="API reference"
              >
                API reference
              </a>
            </li>
            <li>
              <a href={`${DOCS_SITE_URL}ethics.html`} aria-label="Ethics">
                Ethics
              </a>
            </li>
          </ul>
        </nav>

        <nav className="site-footer-col" aria-label="Project">
          <p className="site-footer-heading">Project</p>
          <ul>
            <li>
              <a
                href="https://github.com/AxiomChess"
                aria-label="AxiomChess on GitHub"
              >
                GitHub org
              </a>
            </li>
            <li>
              <a
                href="https://github.com/AxiomChess/web"
                aria-label="Web repository"
              >
                web
              </a>
            </li>
            <li>
              <a
                href="https://github.com/AxiomChess/api"
                aria-label="API repository"
              >
                api
              </a>
            </li>
            <li>
              <Link href="/privacy" aria-label="Privacy notice">
                Privacy
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="site-footer-bottom">
        <p>MIT first-party code. English only. Finished games only.</p>
        <p className="site-footer-meta">Ink and Felt design system</p>
      </div>
    </footer>
  )
}
