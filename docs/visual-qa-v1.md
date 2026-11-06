# Visual QA v1 -- landing and report

Language: English only. No emoji.

Date: 2026-11-06
Surfaces: `/` (landing), `/report/fixture` (offline report fixture)
Build: production (`pnpm build` + `pnpm start`), light and dark themes
Screenshots: `docs/visual-qa/`

Companion checklist (design bans authority): `../design/docs/visual-qa-v1.md` (same results).

## Screenshots

| File | Surface | Theme |
| --- | --- | --- |
| `docs/visual-qa/landing-light.png` | Landing hero | light |
| `docs/visual-qa/landing-dark.png` | Landing hero | dark |
| `docs/visual-qa/report-light-band.png` | Report band + methodology | light |
| `docs/visual-qa/report-light-board.png` | Report board + move table | light |
| `docs/visual-qa/report-dark-band.png` | Report band + methodology | dark |
| `docs/visual-qa/report-dark-board.png` | Report board + move table | dark |

## Banned patterns (B01-B15)

| ID | Landing | Report | Notes |
| --- | --- | --- | --- |
| B01 Purple / indigo gradient theme | PASS | PASS | Ink/Felt chalk + emerald only |
| B02 Warm cream + terracotta artisan | PASS | PASS | Light bg cool chalk `#F2F4F3` |
| B03 Broadsheet newspaper pastiche | PASS | PASS | No hairline news columns |
| B04 Gradient text | PASS | PASS | Solid ink / accent text |
| B05 Multi-layer glow shadows | PASS | PASS | Border + restrained elevation |
| B06 Rounded-full pill clusters | PASS | PASS | No pill clusters |
| B07 Emoji | PASS | PASS | None in UI copy or icons |
| B08 Placeholder / lorem | PASS | PASS | Specific product copy only |
| B09 Stock illustration collage hero | PASS | n/a | Product board is the hero visual |
| B10 Feature-card grid in hero | PASS | n/a | One composition; no hero cards |
| B11 Floating badges on hero media | PASS | n/a | None |
| B12 Inter/Roboto/Arial/system brand face | PASS | PASS | Display Syne; body IBM Plex Sans; mono IBM Plex Mono |
| B13 Pure `#000000` large fields | PASS | PASS | Ink `#1A2421` / dark surfaces from tokens |
| B14 Definitive cheater label | PASS | PASS | Bands only; methodology + false-positive copy |
| B15 Second competing accent | PASS | PASS | Single felt green accent |

## Required positives (R01-R08)

| ID | Landing | Report | Notes |
| --- | --- | --- | --- |
| R01 Ink and Felt direction | PASS | PASS | Cool chalk / ink + emerald felt |
| R02 At most two brand+body families | PASS | PASS | Syne + IBM Plex Sans; mono for data |
| R03 4-based spacing | PASS | PASS | Token spacing scale |
| R04 Shared CSS variables light/dark | PASS | PASS | `data-theme` + `--ax-*` |
| R05 Border + one restrained shadow | PASS | PASS | No glow stacks |
| R06 At most three intentional motions | PASS | PASS | brand-settle, piece-place, band-reveal |
| R07 Board theme match | PASS | PASS | Square + last-move + selection tokens |
| R08 Brand hero-level (nav removed test) | PASS | n/a | `#landing-brand` remains hero signal |

## Verdict

All checklist items PASS. No UI failures to fix before v1 tag for these surfaces.
Offline fixture route: `/report/fixture` (client-loaded recorded fixture; no live API).
