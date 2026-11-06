import type { Metadata } from "next"
import { DOCS_LINKS, DOCS_SITE_URL } from "@/lib/docs"

export const metadata: Metadata = {
  title: "Docs | AxiomChess",
  description:
    "Entry point to AxiomChess product documentation on GitHub Pages.",
}

export default function DocsPage() {
  return (
    <main id="main-content" className="analyze-page" tabIndex={-1}>
      <header className="analyze-header">
        <h1 className="analyze-title">Documentation</h1>
        <p className="analyze-lead">
          Product docs live on the AxiomChess GitHub Pages site. This page is the
          in-app entry; it does not invent metrics or API fields.
        </p>
      </header>

      <section className="analyze-panel" aria-labelledby="docs-links-heading">
        <h2 id="docs-links-heading" className="report-section-title">
          Open the docs site
        </h2>
        <p className="analyze-help">
          Published URL:{" "}
          <a
            href={DOCS_SITE_URL}
            aria-label="Open AxiomChess documentation home"
          >
            {DOCS_SITE_URL}
          </a>
        </p>
        <ul className="docs-link-list">
          {DOCS_LINKS.map((link) => (
            <li key={link.href} className="docs-link-item">
              <a
                className="docs-link-title"
                href={link.href}
                aria-label={link.label}
              >
                {link.label}
              </a>
              <p className="analyze-muted">{link.description}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
