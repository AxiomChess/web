import type { ApiClientError } from "./types"

export const ANALYZE_LIMITS_COPY =
  "AxiomChess analyzes public finished games and PGN you paste. Private or login-only games are not supported."

export const FALSE_POSITIVE_COPY =
  "Reports use suspicion bands with uncertainty. They are educational aids, not definitive findings."

const MESSAGE_BY_CODE: Record<string, string> = {
  private_or_unavailable:
    "This game is private or unavailable through the public API. Only public finished games can be analyzed.",
  not_found:
    "No public game matched that request. Check the URL, id, or username and try again.",
  rate_limited:
    "Rate limit reached. Wait at least one minute before retrying, or try again later.",
  ssrf_rejected:
    "Only public Lichess and Chess.com game URLs are accepted.",
  unsupported_variant:
    "This game uses a variant that AxiomChess does not support in v1 (standard chess only).",
  payload_too_large:
    "That PGN is too large. Paste a shorter finished game.",
  validation_error:
    "The request could not be validated. Check the URL, PGN, site, or username.",
  upstream_error:
    "The chess site returned an error. Try again later.",
  network_error:
    "Could not reach the AxiomChess API at the configured base URL (default http://127.0.0.1:3000). Start the api package, then retry.",
}

export const messageForApiError = (error: ApiClientError): string => {
  return MESSAGE_BY_CODE[error.code] ?? error.message
}

export const isSupportedSiteId = (value: string): value is "lichess" | "chesscom" => {
  return value === "lichess" || value === "chesscom"
}

export const siteDisplayName = (site: "lichess" | "chesscom"): string => {
  if (site === "lichess") return "Lichess"
  return "Chess.com"
}
