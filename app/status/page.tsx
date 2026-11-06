import type { Metadata } from "next"
import { StatusPanel } from "@/components/status/status-panel"

export const metadata: Metadata = {
  title: "Status | AxiomChess",
  description: "Live AxiomChess API health from GET /v1/health.",
}

export default function StatusPage() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

  return (
    <main id="main-content" className="analyze-page" tabIndex={-1}>
      <header className="analyze-header">
        <h1 className="analyze-title">Service status</h1>
        <p className="analyze-lead">
          Reads the public API health endpoint. If the API is down, this page
          stays usable and shows a clear unavailable state.
        </p>
      </header>
      <StatusPanel apiBaseUrl={apiBaseUrl} />
    </main>
  )
}
