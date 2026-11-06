import type { AnalysisResultV1 } from "@/lib/api/types"

/** Short public-style fixture PGN for offline report tests (not a private game). */
export const FIXTURE_PGN = `[Event "AxiomChess Fixture"]
[Site "https://axiomchess.github.io"]
[Date "2026.01.01"]
[White "Alice"]
[Black "Bob"]
[Result "*"]

1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 *`

export const FIXTURE_RESULT: AnalysisResultV1 = {
  version: "v1",
  analyzedAt: "2026-11-06T00:00:00.000Z",
  engine: {
    policyId: "engine-v1",
    multiPv: 3,
    depth: 18,
    threads: 1,
    hashMb: 16,
  },
  calibrationPolicyId: "calibration-v1",
  features: {
    book: {
      bookId: "opening-book-v1",
      bookPlyCount: 4,
      noveltyPly: 5,
    },
    match: {
      top1Rate: 0.25,
      top3Rate: 0.5,
      top1RateWhite: 0.25,
      top1RateBlack: 0.25,
      top3RateWhite: 0.5,
      top3RateBlack: 0.5,
      usablePlies: 4,
      usablePliesWhite: 2,
      usablePliesBlack: 2,
    },
    cpl: {
      average: 80,
      median: 70,
      p90: 120,
      averageWhite: 75,
      averageBlack: 85,
      values: [40, 100, 60, 120],
    },
    timing: {
      meanMoveTimeSec: 4,
      medianMoveTimeSec: 3.5,
      fastHighMatchStreakMax: 0,
      fastMoveThresholdSec: 3,
      moveTimesSec: [5, 2, 6, 3],
    },
  },
  suspicion: {
    score: 0.312,
    uncertainty: {
      low: 0.1,
      high: 0.52,
      halfWidth: 0.21,
    },
    band: "inconclusive",
  },
  methodologyNote:
    "Suspicion score uses policy calibration-v1 with engine policy engine-v1 (MultiPV 3, depth 18/16). Book plies are excluded from match and CPL aggregates. Bands are informational only.",
  falsePositiveWarning:
    "False positives are possible. Short games, missing clocks, long book stretches, and strong human play can raise or lower scores. This is an educational analysis aid, not a finding of cheating.",
  featuresUsed: [
    "match.top1Rate",
    "match.top3Rate",
    "cpl.average",
    "match.usablePlies",
    "timing.fastHighMatchStreakMax",
    "timing.present",
  ],
  sampleSizeCaveats: [
    "Usable non-book plies (4) are below 20; band is inconclusive.",
    "Opening book boundary at ply 5; 4 book plies excluded from match/CPL.",
  ],
}
