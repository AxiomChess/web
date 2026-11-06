# Changelog

All notable changes to `@axiomchess/web` are documented in this file.

## [1.0.0] - 2026-11-06

### Added

- Next.js App Router app with design tokens (Ink and Felt), light/dark theme, Syne + IBM Plex fonts
- Brand-first landing page with product board visual and anti-slop constraints
- Analyze flows: URL, PGN paste, username lookup against the public API
- Report pages: keyboard board replay, move table, custom SVG charts, suspicion band with uncertainty
- `/docs`, `/status`, and `/privacy` routes; visual QA checklist and screenshots for v1
- CI secret-pattern scan

### Notes

- First-party code: MIT. `chess.js` BSD-2-Clause recorded in NOTICE.
- Suspicion bands only (`low` / `elevated` / `high` / `inconclusive`); no definitive cheater label.
