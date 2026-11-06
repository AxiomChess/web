import { Chess, type Square } from "chess.js"
import type { AnalysisResultV1 } from "@/lib/api/types"

export type PieceColor = "w" | "b"
export type PieceKind = "k" | "q" | "r" | "b" | "n" | "p"

export type ReplayPiece = {
  square: Square
  file: number
  rank: number
  color: PieceColor
  kind: PieceKind
}

export type ReplayMoveRow = {
  ply: number
  san: string
  color: PieceColor
  from: Square
  to: Square
  inBook: boolean
  cpl: number | null
  moveTimeSec: number | null
}

export type ReplayModel = {
  moves: ReplayMoveRow[]
  positions: ReplayPiece[][]
  lastMoveByPly: Array<{ from: Square; to: Square } | null>
}

const FILES = "abcdefgh"

const squareToCoords = (square: Square): { file: number; rank: number } => {
  const file = FILES.indexOf(square[0] ?? "")
  const rank = Number(square[1]) - 1
  return { file, rank }
}

const boardToPieces = (chess: Chess): ReplayPiece[] => {
  const pieces: ReplayPiece[] = []
  for (const row of chess.board()) {
    for (const cell of row) {
      if (!cell) continue
      const coords = squareToCoords(cell.square)
      pieces.push({
        square: cell.square,
        file: coords.file,
        rank: coords.rank,
        color: cell.color,
        kind: cell.type,
      })
    }
  }
  return pieces
}

/**
 * Build ply-indexed board positions and move rows from normalized PGN + features.
 */
export const buildReplayModel = (
  normalizedPgn: string,
  result: AnalysisResultV1,
): ReplayModel | null => {
  const chess = new Chess()
  try {
    chess.loadPgn(normalizedPgn, { strict: false })
  } catch {
    return null
  }

  const history = chess.history({ verbose: true })
  const replay = new Chess()
  const positions: ReplayPiece[][] = [boardToPieces(replay)]
  const lastMoveByPly: Array<{ from: Square; to: Square } | null> = [null]
  const moves: ReplayMoveRow[] = []

  const bookPlyCount = result.features.book.bookPlyCount
  let usableIndex = 0

  for (let i = 0; i < history.length; i += 1) {
    const move = history[i]
    if (!move) continue
    const ply = i + 1
    const inBook = ply <= bookPlyCount
    let cpl: number | null = null
    let moveTimeSec: number | null = null
    if (!inBook) {
      cpl = result.features.cpl.values[usableIndex] ?? null
      moveTimeSec = result.features.timing?.moveTimesSec[usableIndex] ?? null
      usableIndex += 1
    }

    replay.move({
      from: move.from,
      to: move.to,
      promotion: move.promotion,
    })
    positions.push(boardToPieces(replay))
    lastMoveByPly.push({ from: move.from, to: move.to })
    moves.push({
      ply,
      san: move.san,
      color: move.color,
      from: move.from,
      to: move.to,
      inBook,
      cpl,
      moveTimeSec,
    })
  }

  return { moves, positions, lastMoveByPly }
}

export const FILES_LABELS = ["a", "b", "c", "d", "e", "f", "g", "h"] as const

export const GLYPH: Record<PieceColor, Record<PieceKind, string>> = {
  w: { k: "\u2654", q: "\u2655", r: "\u2656", b: "\u2657", n: "\u2658", p: "\u2659" },
  b: { k: "\u265A", q: "\u265B", r: "\u265C", b: "\u265D", n: "\u265E", p: "\u265F" },
}
