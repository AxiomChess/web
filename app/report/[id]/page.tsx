import { Suspense } from "react"
import { ReportView } from "@/components/report/report-view"

type ReportPageProps = {
  params: Promise<{ id: string }>
}

const ReportFallback = () => {
  return (
    <main id="main-content" className="report-shell" tabIndex={-1}>
      <div className="report-page">
        <header className="report-header">
          <h1 className="analyze-title">Analysis report</h1>
          <p className="analyze-lead">Loading report</p>
        </header>
      </div>
    </main>
  )
}

const ReportPageContent = async ({ params }: ReportPageProps) => {
  const { id } = await params
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

  return (
    <main id="main-content" className="report-shell" tabIndex={-1}>
      <ReportView analysisId={id} apiBaseUrl={apiBaseUrl} />
    </main>
  )
}

export default function ReportPage(props: ReportPageProps) {
  return (
    <Suspense fallback={<ReportFallback />}>
      <ReportPageContent {...props} />
    </Suspense>
  )
}
