import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import { FIXTURE_PGN, FIXTURE_RESULT } from "./fixture"
import { parseAnalysisResultV1 } from "./parse-result"
import { buildReplayModel } from "./pgn-replay"

const root = process.cwd()
const reportPage = readFileSync(
  join(root, "app", "report", "[id]", "page.tsx"),
  "utf8",
)
const reportView = readFileSync(
  join(root, "components", "report", "report-view.tsx"),
  "utf8",
)
const suspicionBand = readFileSync(
  join(root, "components", "report", "suspicion-band.tsx"),
  "utf8",
)
const featureCharts = readFileSync(
  join(root, "components", "report", "feature-charts.tsx"),
  "utf8",
)
const replayBoard = readFileSync(
  join(root, "components", "report", "replay-board.tsx"),
  "utf8",
)
const moveTable = readFileSync(
  join(root, "components", "report", "move-table.tsx"),
  "utf8",
)
const cssSource = readFileSync(join(root, "app", "globals.css"), "utf8")

const combined = [
  reportPage,
  reportView,
  suspicionBand,
  featureCharts,
  replayBoard,
  moveTable,
].join("\n")

describe("report pages (T24)", () => {
  it("parses AnalysisResultV1 and rejects cheater fields", () => {
    const parsed = parseAnalysisResultV1(FIXTURE_RESULT)
    expect(parsed?.suspicion.band).toBe("inconclusive")
    expect(parseAnalysisResultV1({ ...FIXTURE_RESULT, cheater: true })).toBe(
      null,
    )
    expect(
      parseAnalysisResultV1({
        ...FIXTURE_RESULT,
        suspicion: { ...FIXTURE_RESULT.suspicion, band: "cheater" },
      }),
    ).toBe(null)
  })

  it("builds keyboard-ready replay model from fixture PGN", () => {
    const model = buildReplayModel(FIXTURE_PGN, FIXTURE_RESULT)
    expect(model).not.toBeNull()
    expect(model?.moves.length).toBe(8)
    expect(model?.positions).toHaveLength(9)
    expect(model?.moves[0]?.san).toBe("e4")
    expect(model?.moves[0]?.inBook).toBe(true)
    expect(model?.moves[4]?.inBook).toBe(false)
    expect(model?.moves[4]?.cpl).toBe(40)
    expect(model?.moves[4]?.moveTimeSec).toBe(5)
  })

  it("wires report route with board, table, charts, and methodology", () => {
    expect(reportPage).toContain("ReportView")
    expect(reportView).toContain("SuspicionBandPanel")
    expect(reportView).toContain("FeatureCharts")
    expect(reportView).toContain("ReplayBoard")
    expect(reportView).toContain("MoveTable")
    expect(reportView).toContain("methodologyNote")
    expect(reportView).toContain("falsePositiveWarning")
    expect(replayBoard).toContain("ArrowRight")
    expect(replayBoard).toContain("ArrowLeft")
    expect(moveTable).toContain("<table")
    expect(featureCharts).toContain("<svg")
    expect(featureCharts).toContain("report-cpl-line")
  })

  it("passes visual no-slop and ethics checks", () => {
    expect(combined.toLowerCase()).not.toContain("lorem")
    expect(combined.toLowerCase()).not.toContain("placeholder")
    expect(combined.toLowerCase()).not.toContain("cheater")
    expect(combined).not.toMatch(/[\u{1F300}-\u{1FAFF}]/u)
    expect(cssSource.toLowerCase()).not.toContain("purple")
    expect(cssSource).not.toContain("rounded-full")
    expect(cssSource).not.toContain("glow")
    expect(cssSource).toContain("@keyframes band-reveal")
    expect(cssSource).toContain("var(--ax-board-square-light)")
    expect(cssSource).toContain("var(--ax-board-last-move)")
    expect(cssSource).toContain("var(--ax-accent)")
    expect(suspicionBand).toContain("raw accusation")
  })
})
