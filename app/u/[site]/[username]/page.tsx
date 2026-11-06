import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { UsernameGames } from "@/components/analyze/username-games"
import {
  isSupportedSiteId,
  siteDisplayName,
} from "@/lib/api/messages"

type UsernamePageProps = {
  params: Promise<{
    site: string
    username: string
  }>
}

export const generateMetadata = async ({
  params,
}: UsernamePageProps): Promise<Metadata> => {
  const { site, username } = await params
  const decoded = decodeURIComponent(username)
  if (!isSupportedSiteId(site)) {
    return { title: "Username lookup | AxiomChess" }
  }
  return {
    title: `${decoded} on ${siteDisplayName(site)} | AxiomChess`,
    description: `Recent public finished games for ${decoded} on ${siteDisplayName(site)}.`,
  }
}

const UsernameFallback = () => {
  return (
    <main id="main-content" className="analyze-page" tabIndex={-1}>
      <header className="analyze-header">
        <h1 className="analyze-title">Public games</h1>
        <p className="analyze-lead">Loading username lookup</p>
      </header>
    </main>
  )
}

const UsernamePageContent = async ({ params }: UsernamePageProps) => {
  const { site, username } = await params
  if (!isSupportedSiteId(site)) {
    notFound()
  }

  const decodedUsername = decodeURIComponent(username)
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

  return (
    <main id="main-content" className="analyze-page" tabIndex={-1}>
      <header className="analyze-header">
        <p className="analyze-kicker">
          <Link href="/analyze" aria-label="Back to analyze">
            Analyze
          </Link>
          <span aria-hidden="true"> / </span>
          {siteDisplayName(site)}
        </p>
        <h1 className="analyze-title">{decodedUsername}</h1>
        <p className="analyze-lead">
          Public finished games only. Private games are not listed or analyzed.
        </p>
      </header>
      <UsernameGames
        site={site}
        username={decodedUsername}
        apiBaseUrl={apiBaseUrl}
      />
    </main>
  )
}

export default function UsernamePage(props: UsernamePageProps) {
  return (
    <Suspense fallback={<UsernameFallback />}>
      <UsernamePageContent {...props} />
    </Suspense>
  )
}
