import type { Metadata } from "next"
import { AnalyzeForm } from "@/components/analyze/analyze-form"

export const metadata: Metadata = {
  title: "Analyze | AxiomChess",
  description:
    "Analyze a public finished chess game by URL, PGN paste, or username.",
}

export default function AnalyzePage() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

  return (
    <main id="main-content" className="analyze-page" tabIndex={-1}>
      <header className="analyze-header">
        <h1 className="analyze-title">Analyze a finished game</h1>
        <p className="analyze-lead">
          Submit a public game URL, paste a PGN, or look up recent public games
          by username on Lichess or Chess.com.
        </p>
      </header>
      <AnalyzeForm apiBaseUrl={apiBaseUrl} />
    </main>
  )
}
