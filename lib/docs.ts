export const DOCS_SITE_URL = "https://axiomchess.github.io/docs/"

export const DOCS_LINKS = [
  {
    href: DOCS_SITE_URL,
    label: "Documentation home",
    description: "Product overview and plan sources for AxiomChess.",
  },
  {
    href: `${DOCS_SITE_URL}ethics.html`,
    label: "Ethics and public-API-only policy",
    description:
      "Hard limits: documented public endpoints only, no private-game access.",
  },
  {
    href: `${DOCS_SITE_URL}api-overview.html`,
    label: "API reference",
    description: "Routes, auth quotas, and ethics constraints for integrators.",
  },
  {
    href: `${DOCS_SITE_URL}supported-sites.html`,
    label: "Supported sites",
    description: "Lichess and Chess.com capabilities from the adapters manifest.",
  },
] as const
