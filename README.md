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

## License

MIT. See `LICENSE` and `NOTICE`.
