"use client"

import { useState, type KeyboardEvent } from "react"
import type { Square } from "chess.js"
import { ChessPiece } from "@/components/chess-piece"
import {
  FILES_LABELS,
  type ReplayModel,
  type ReplayPiece,
} from "@/lib/report/pgn-replay"

type ReplayBoardProps = {
  model: ReplayModel
  ply: number
  onPlyChange: (ply: number) => void
}

const BOARD_LABEL_ID = "report-board-heading"
const BOARD_LIVE_ID = "report-board-live"

const squareKey = (file: number, rank: number): string =>
  `${FILES_LABELS[file]}${rank + 1}`

const isLastMoveSquare = (
  file: number,
  rank: number,
  last: { from: Square; to: Square } | null,
): boolean => {
  if (!last) return false
  const from = `${FILES_LABELS[file]}${rank + 1}`
  return last.from === from || last.to === from
}

export const ReplayBoard = ({
  model,
  ply,
  onPlyChange,
}: ReplayBoardProps) => {
  const maxPly = model.moves.length
  const pieces = model.positions[ply] ?? []
  const last = model.lastMoveByPly[ply] ?? null
  const placedKey = last?.to ?? null
  const [selected, setSelected] = useState<{ file: number; rank: number }>({
    file: 4,
    rank: 0,
  })

  const piecesBySquare = new Map<string, ReplayPiece>()
  for (const piece of pieces) {
    piecesBySquare.set(piece.square, piece)
  }

  const currentMove = ply === 0 ? null : model.moves[ply - 1]
  const liveText =
    ply === 0
      ? "Starting position"
      : `Ply ${ply}: ${currentMove?.san ?? ""}`

  const handleStep = (delta: number) => {
    const next = Math.max(0, Math.min(maxPly, ply + delta))
    onPlyChange(next)
  }

  const handleBoardKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault()
      handleStep(1)
      return
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault()
      handleStep(-1)
      return
    }
    if (event.key === "Home") {
      event.preventDefault()
      onPlyChange(0)
      return
    }
    if (event.key === "End") {
      event.preventDefault()
      onPlyChange(maxPly)
    }
  }

  const handleSquareKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    file: number,
    rank: number,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      setSelected({ file, rank })
      return
    }
    let nextFile = file
    let nextRank = rank
    if (event.key === "ArrowRight") nextFile = Math.min(7, file + 1)
    if (event.key === "ArrowLeft") nextFile = Math.max(0, file - 1)
    if (event.key === "ArrowUp") nextRank = Math.min(7, rank + 1)
    if (event.key === "ArrowDown") nextRank = Math.max(0, rank - 1)
    if (nextFile !== file || nextRank !== rank) {
      event.preventDefault()
      setSelected({ file: nextFile, rank: nextRank })
      const nextId = `report-sq-${FILES_LABELS[nextFile]}${nextRank + 1}`
      const nextEl = document.getElementById(nextId)
      nextEl?.focus()
    }
  }

  return (
    <section className="report-board-panel" aria-labelledby={BOARD_LABEL_ID}>
      <div className="report-board-header">
        <h2 id={BOARD_LABEL_ID} className="report-section-title">
          Board replay
        </h2>
        <p id={BOARD_LIVE_ID} className="report-live" aria-live="polite">
          {liveText}
        </p>
      </div>

      <div
        className="report-board"
        role="application"
        tabIndex={0}
        aria-label="Chess board replay. Use left and right arrow keys to change ply. Home and End jump to start or end."
        aria-describedby={BOARD_LIVE_ID}
        onKeyDown={handleBoardKeyDown}
      >
        <div className="report-board-grid">
          {Array.from({ length: 64 }, (_, index) => {
            const file = index % 8
            const rank = 7 - Math.floor(index / 8)
            const light = (file + rank) % 2 === 1
            const name = squareKey(file, rank) as Square
            const piece = piecesBySquare.get(name)
            const lastMove = isLastMoveSquare(file, rank, last)
            const isSelected =
              selected.file === file && selected.rank === rank
            const classes = [
              "report-board-square",
              light ? "is-light" : "is-dark",
              lastMove ? "is-last-move" : "",
              isSelected ? "is-selected" : "",
            ]
              .filter(Boolean)
              .join(" ")

            return (
              <button
                key={name}
                id={`report-sq-${name}`}
                type="button"
                className={classes}
                aria-label={`Square ${name}${piece ? `, ${piece.color === "w" ? "white" : "black"} ${piece.kind}` : ""}`}
                aria-pressed={isSelected}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => setSelected({ file, rank })}
                onKeyDown={(event) => handleSquareKeyDown(event, file, rank)}
              >
                {piece ? (
                  <ChessPiece
                    key={`${ply}-${piece.square}`}
                    color={piece.color}
                    kind={piece.kind}
                    className="report-board-piece"
                    placed={placedKey === piece.square}
                  />
                ) : null}
              </button>
            )
          })}
        </div>
      </div>

      <div className="report-board-controls" role="group" aria-label="Ply controls">
        <button
          type="button"
          className="report-control-btn"
          aria-label="Go to starting position"
          onClick={() => onPlyChange(0)}
          disabled={ply === 0}
        >
          Start
        </button>
        <button
          type="button"
          className="report-control-btn"
          aria-label="Previous ply"
          onClick={() => handleStep(-1)}
          disabled={ply === 0}
        >
          Previous
        </button>
        <span className="report-ply-readout analyze-mono" aria-live="polite">
          Ply {ply} / {maxPly}
        </span>
        <button
          type="button"
          className="report-control-btn"
          aria-label="Next ply"
          onClick={() => handleStep(1)}
          disabled={ply === maxPly}
        >
          Next
        </button>
        <button
          type="button"
          className="report-control-btn"
          aria-label="Go to final position"
          onClick={() => onPlyChange(maxPly)}
          disabled={ply === maxPly}
        >
          End
        </button>
      </div>
    </section>
  )
}
