type PieceColor = "w" | "b"
type PieceKind = "k" | "q" | "r" | "b" | "n" | "p"

type ChessPieceProps = {
  color: PieceColor
  kind: PieceKind
  className?: string
  placed?: boolean
}

/** Original geometric piece silhouettes (AxiomChess, MIT). */
const PATHS: Record<PieceKind, string> = {
  k: "M19 3h2v3h3v2h-3v3h-2V8h-3V6h3V3zm-7 12c0-4 3.5-7 8-7s8 3 8 7v2H12v-2zm-1 4h18l-1 4H12l-1-4zm-1 6h20v3H10v-3zm-1 5h22v2H9v-2z",
  q: "M8 8l3 5 3-7 3 7 3-5 2 9H6l2-9zm2 11h16l-1 4H11l-1-4zm-1 6h18v3H10v-3zm-1 5h20v2H9v-2z",
  r: "M9 6h4v4h2V6h4v4h2V6h4v7H9V6zm0 9h18v9H9v-9zm-1 11h20v3H8v-3zm-1 5h22v2H7v-2z",
  b: "M18 4c4 5 8 9 8 14 0 4-3 8-8 10-5-2-8-6-8-10 0-5 4-9 8-14zm0 8l2 8h-4l2-8zm-7 18h14v2H11v-2z",
  n: "M28 32H10c0-5 2-8 6-11 3-2 4-4 3-7l5-2c1 3 0 6-2 8 5 2 8 6 8 12h-2zm-12-9c2 0 4 1 5 3H14l2-3z",
  p: "M20 6a5 5 0 110 10 5 5 0 010-10zm-5 12h10l2 10H13l2-10zm-3 12h16v3H12v-3z",
}

export const ChessPiece = ({
  color,
  kind,
  className = "",
  placed = false,
}: ChessPieceProps) => {
  const classes = [
    "ax-piece",
    `is-${color}`,
    placed ? "is-placed" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <svg
      className={classes}
      viewBox="0 0 40 40"
      width="72%"
      height="72%"
      aria-hidden="true"
      focusable="false"
    >
      <path d={PATHS[kind]} />
    </svg>
  )
}

export type { PieceColor, PieceKind }
