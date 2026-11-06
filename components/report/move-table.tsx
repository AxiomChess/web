import type { ReplayModel } from "@/lib/report/pgn-replay"

type MoveTableProps = {
  model: ReplayModel
  activePly: number
  onSelectPly: (ply: number) => void
}

export const MoveTable = ({
  model,
  activePly,
  onSelectPly,
}: MoveTableProps) => {
  return (
    <section className="report-moves" aria-labelledby="report-moves-heading">
      <h2 id="report-moves-heading" className="report-section-title">
        Move table
      </h2>
      <div className="report-table-wrap">
        <table className="report-table">
          <caption className="sr-only">
            Moves with book flag, centipawn loss, and move time when available
          </caption>
          <thead>
            <tr>
              <th scope="col">Ply</th>
              <th scope="col">Move</th>
              <th scope="col">Side</th>
              <th scope="col">Book</th>
              <th scope="col">CPL</th>
              <th scope="col">Time (s)</th>
            </tr>
          </thead>
          <tbody>
            {model.moves.map((move) => {
              const selected = activePly === move.ply
              return (
                <tr
                  key={move.ply}
                  className={selected ? "is-active" : undefined}
                >
                  <th scope="row">
                    <button
                      type="button"
                      className="report-table-ply"
                      aria-label={`Go to ply ${move.ply}, ${move.san}`}
                      aria-current={selected ? "true" : undefined}
                      onClick={() => onSelectPly(move.ply)}
                    >
                      {move.ply}
                    </button>
                  </th>
                  <td className="analyze-mono">{move.san}</td>
                  <td>{move.color === "w" ? "White" : "Black"}</td>
                  <td>{move.inBook ? "Yes" : "No"}</td>
                  <td className="analyze-mono">
                    {move.cpl === null ? "n/a" : move.cpl.toFixed(1)}
                  </td>
                  <td className="analyze-mono">
                    {move.moveTimeSec === null
                      ? "n/a"
                      : move.moveTimeSec.toFixed(1)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
