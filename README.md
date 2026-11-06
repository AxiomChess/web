# web

Marketing site, analyzer UI, and report pages for AxiomChess (Next.js App Router).

## Stack

- Next.js 16 App Router + React 19 + TypeScript
- Tailwind CSS 4 (via `@tailwindcss/turbopack`)
- Design tokens from `AxiomChess/design` (Ink and Felt), synced into `styles/tokens.css`
- Display face Syne; body IBM Plex Sans; mono IBM Plex Mono (`next/font/google`, OFL-1.1)

## Scripts

```bash
pnpm install
pnpm tokens:sync   # copies ../design/tokens/tokens.css when sibling exists
pnpm lint
pnpm test
pnpm build
pnpm dev
```

## Theme

Light and dark share the same CSS variable names. Preference cycles light / dark / system via `data-theme` on `<html>`.

## Analyze flows

- `/analyze` -- public game URL, PGN paste, or username lookup entry
- `/u/[site]/[username]` -- recent public games for `lichess` or `chesscom`

Set `NEXT_PUBLIC_API_BASE_URL` (see `.env.example`) to a running AxiomChess API. Private games are rejected with a clear error; reports never use a definitive cheater label.

## License

MIT. See `LICENSE` and `NOTICE`.
