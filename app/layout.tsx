import type { Metadata } from "next"
import type { ReactNode } from "react"
import { IBM_Plex_Mono, IBM_Plex_Sans, Syne } from "next/font/google"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { themeInitScript } from "@/lib/theme"
import "./globals.css"

type RootLayoutProps = {
  children: ReactNode
}

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-ax-display",
  display: "swap",
})

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ax-body",
  display: "swap",
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ax-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "AxiomChess",
  description:
    "Open-source chess fair-play analysis with calibrated suspicion bands and clear methodology limits.",
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <style
          dangerouslySetInnerHTML={{
            __html: `:root{--ax-font-display:var(--font-ax-display), "Syne", "Segoe UI", "Helvetica Neue", sans-serif;--ax-font-body:var(--font-ax-body), "IBM Plex Sans", "Segoe UI", "Helvetica Neue", sans-serif;--ax-font-mono:var(--font-ax-mono), "IBM Plex Mono", Consolas, Menlo, monospace;}`,
          }}
        />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <div className="shell">
          <header className="shell-header">
            <Link className="shell-brand" href="/" aria-label="AxiomChess home">
              AxiomChess
            </Link>
            <nav className="shell-nav" aria-label="Primary">
              <Link
                className="shell-nav-link"
                href="/analyze"
                aria-label="Analyze a finished game"
              >
                Analyze
              </Link>
              <ThemeToggle />
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  )
}
