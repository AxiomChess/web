export const DOCS_SITE_URL = "https://axiomchess.github.io/docs/"

export const DOCS_LINKS = [
  {
    href: DOCS_SITE_URL,
    label: "Product wiki home",
    description: "Long-form AxiomChess documentation hub.",
  },
  {
    href: `${DOCS_SITE_URL}getting-started.html`,
    label: "Getting started",
    description: "Web analyze flow and API quick path.",
  },
  {
    href: `${DOCS_SITE_URL}ethics.html`,
    label: "Ethics and public-API-only policy",
    description:
      "Hard limits: documented public endpoints only, no private-game access.",
  },
  {
    href: `${DOCS_SITE_URL}privacy.html`,
    label: "Privacy notice",
    description:
      "What is stored, 30-day retention default, and analysis erasure.",
  },
  {
    href: `${DOCS_SITE_URL}methodology.html`,
    label: "Methodology and calibration",
    description: "engine-v1 and calibration-v1 formula, priors, uncertainty.",
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
  {
    href: `${DOCS_SITE_URL}architecture.html`,
    label: "Architecture",
    description: "Multi-repo services, pipeline, and storage.",
  },
] as const
