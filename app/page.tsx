export default function HomePage() {
  return (
    <main id="main-content" className="shell-main" tabIndex={-1}>
      <h1 className="shell-title">AxiomChess</h1>
      <p className="shell-lead">
        App shell with Ink and Felt design tokens. Marketing landing and
        analysis flows arrive in later roadmap tasks.
      </p>
      <ul className="token-swatches" aria-label="Design token color samples">
        <li className="token-swatch">
          <span
            className="token-swatch-chip"
            style={{ background: "var(--ax-bg)" }}
          />
          <span className="token-swatch-label">bg</span>
        </li>
        <li className="token-swatch">
          <span
            className="token-swatch-chip"
            style={{ background: "var(--ax-accent)" }}
          />
          <span className="token-swatch-label">accent</span>
        </li>
        <li className="token-swatch">
          <span
            className="token-swatch-chip"
            style={{ background: "var(--ax-board-square-light)" }}
          />
          <span className="token-swatch-label">board light</span>
        </li>
        <li className="token-swatch">
          <span
            className="token-swatch-chip"
            style={{ background: "var(--ax-board-square-dark)" }}
          />
          <span className="token-swatch-label">board dark</span>
        </li>
      </ul>
    </main>
  )
}
