const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"] as const

type PieceColor = "w" | "b"
type PieceKind = "k" | "q" | "r" | "b" | "n" | "p"

type BoardPiece = {
  file: number
  rank: number
  color: PieceColor
  kind: PieceKind
}

/** Midgame sample for the landing product surface (not a live game). */
const SAMPLE_PIECES: BoardPiece[] = [
  { file: 0, rank: 0, color: "w", kind: "r" },
  { file: 2, rank: 0, color: "w", kind: "b" },
  { file: 3, rank: 0, color: "w", kind: "q" },
  { file: 4, rank: 0, color: "w", kind: "k" },
  { file: 5, rank: 0, color: "w", kind: "b" },
  { file: 6, rank: 0, color: "w", kind: "n" },
  { file: 7, rank: 0, color: "w", kind: "r" },
  { file: 0, rank: 1, color: "w", kind: "p" },
  { file: 1, rank: 1, color: "w", kind: "p" },
  { file: 2, rank: 1, color: "w", kind: "p" },
  { file: 5, rank: 1, color: "w", kind: "p" },
  { file: 6, rank: 1, color: "w", kind: "p" },
  { file: 7, rank: 1, color: "w", kind: "p" },
  { file: 3, rank: 2, color: "w", kind: "p" },
  { file: 4, rank: 3, color: "w", kind: "p" },
  { file: 6, rank: 2, color: "w", kind: "n" },
  { file: 0, rank: 7, color: "b", kind: "r" },
  { file: 2, rank: 7, color: "b", kind: "b" },
  { file: 3, rank: 7, color: "b", kind: "q" },
  { file: 4, rank: 7, color: "b", kind: "k" },
  { file: 5, rank: 7, color: "b", kind: "b" },
  { file: 6, rank: 7, color: "b", kind: "n" },
  { file: 7, rank: 7, color: "b", kind: "r" },
  { file: 0, rank: 6, color: "b", kind: "p" },
  { file: 1, rank: 6, color: "b", kind: "p" },
  { file: 2, rank: 6, color: "b", kind: "p" },
  { file: 5, rank: 6, color: "b", kind: "p" },
  { file: 6, rank: 6, color: "b", kind: "p" },
  { file: 7, rank: 6, color: "b", kind: "p" },
  { file: 3, rank: 5, color: "b", kind: "p" },
  { file: 4, rank: 4, color: "b", kind: "p" },
  { file: 1, rank: 5, color: "b", kind: "n" },
]

/** Last ply: black knight to b6 (file 1, rank 5). */
const LAST_MOVE = [
  { file: 6, rank: 7 },
  { file: 1, rank: 5 },
] as const

const GLYPH: Record<PieceColor, Record<PieceKind, string>> = {
  w: { k: "\u2654", q: "\u2655", r: "\u2656", b: "\u2657", n: "\u2658", p: "\u2659" },
  b: { k: "\u265A", q: "\u265B", r: "\u265C", b: "\u265D", n: "\u265E", p: "\u265F" },
}

const isLastMove = (file: number, rank: number): boolean =>
  LAST_MOVE.some((square) => square.file === file && square.rank === rank)

export const HeroBoard = () => {
  const piecesBySquare = new Map<string, BoardPiece>()
  for (const piece of SAMPLE_PIECES) {
    piecesBySquare.set(`${piece.file}-${piece.rank}`, piece)
  }

  return (
    <div
      className="hero-board"
      role="img"
      aria-label="Sample analysis board with last-move highlight on the black knight jump to b6"
    >
      <div className="hero-board-grid">
        {Array.from({ length: 64 }, (_, index) => {
          const file = index % 8
          const rank = 7 - Math.floor(index / 8)
          const light = (file + rank) % 2 === 1
          const piece = piecesBySquare.get(`${file}-${rank}`)
          const last = isLastMove(file, rank)
          const squareClasses = [
            "hero-board-square",
            light ? "is-light" : "is-dark",
            last ? "is-last-move" : "",
          ]
            .filter(Boolean)
            .join(" ")

          return (
            <div
              key={`${FILES[file]}${rank + 1}`}
              className={squareClasses}
              data-square={`${FILES[file]}${rank + 1}`}
            >
              {piece ? (
                <span
                  className={`hero-board-piece is-${piece.color}${
                    last && piece.file === 1 && piece.rank === 5
                      ? " is-placed"
                      : ""
                  }`}
                  aria-hidden="true"
                >
                  {GLYPH[piece.color][piece.kind]}
                </span>
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}
