import type { AnalysisResultV1, SuspicionBand } from "@/lib/api/types"

const BANDS: ReadonlySet<string> = new Set([
  "low",
  "elevated",
  "high",
  "inconclusive",
])

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

const isFiniteNumber = (value: unknown): value is number => {
  return typeof value === "number" && Number.isFinite(value)
}

const isSuspicionBand = (value: unknown): value is SuspicionBand => {
  return typeof value === "string" && BANDS.has(value)
}

/**
 * Narrow API analysis result JSON to AnalysisResultV1.
 * Rejects cheater labels and unknown bands.
 */
export const parseAnalysisResultV1 = (
  value: unknown,
): AnalysisResultV1 | null => {
  if (!isRecord(value)) return null
  if (value.version !== "v1") return null
  if (typeof value.analyzedAt !== "string" || value.analyzedAt.length < 1) {
    return null
  }
  if (!isRecord(value.engine)) return null
  if (value.engine.policyId !== "engine-v1") return null
  if (value.engine.multiPv !== 3) return null
  if (!isFiniteNumber(value.engine.depth) || value.engine.depth < 1) return null
  if (!isFiniteNumber(value.engine.threads) || value.engine.threads < 1) {
    return null
  }
  if (!isFiniteNumber(value.engine.hashMb) || value.engine.hashMb < 1) {
    return null
  }
  if (value.calibrationPolicyId !== "calibration-v1") return null
  if (!isRecord(value.features)) return null
  if (!isRecord(value.features.book)) return null
  if (!isRecord(value.features.match)) return null
  if (!isRecord(value.features.cpl)) return null
  if (!isRecord(value.suspicion)) return null
  if (!isSuspicionBand(value.suspicion.band)) return null
  if (Object.prototype.hasOwnProperty.call(value, "cheater")) return null
  if (
    typeof value.methodologyNote !== "string" ||
    value.methodologyNote.length < 1
  ) {
    return null
  }
  if (
    typeof value.falsePositiveWarning !== "string" ||
    value.falsePositiveWarning.length < 1
  ) {
    return null
  }
  if (!Array.isArray(value.featuresUsed) || value.featuresUsed.length < 1) {
    return null
  }
  if (!Array.isArray(value.sampleSizeCaveats)) return null
  if (!isRecord(value.suspicion.uncertainty)) return null

  const book = value.features.book
  const match = value.features.match
  const cpl = value.features.cpl
  const timingRaw = value.features.timing
  const uncertainty = value.suspicion.uncertainty

  if (typeof book.bookId !== "string" || book.bookId.length < 1) return null
  if (!Number.isInteger(book.bookPlyCount) || (book.bookPlyCount as number) < 0) {
    return null
  }
  if (
    book.noveltyPly !== null &&
    (!Number.isInteger(book.noveltyPly) || (book.noveltyPly as number) < 1)
  ) {
    return null
  }
  if (!Array.isArray(cpl.values)) return null
  if (!cpl.values.every((entry) => isFiniteNumber(entry) && entry >= 0)) {
    return null
  }
  if (
    !isFiniteNumber(value.suspicion.score) ||
    value.suspicion.score < 0 ||
    value.suspicion.score > 1
  ) {
    return null
  }
  if (
    !isFiniteNumber(uncertainty.low) ||
    !isFiniteNumber(uncertainty.high) ||
    !isFiniteNumber(uncertainty.halfWidth)
  ) {
    return null
  }

  let timing: AnalysisResultV1["features"]["timing"] = null
  if (timingRaw !== null) {
    if (!isRecord(timingRaw)) return null
    if (!Array.isArray(timingRaw.moveTimesSec)) return null
    if (
      !isFiniteNumber(timingRaw.meanMoveTimeSec) ||
      !isFiniteNumber(timingRaw.medianMoveTimeSec) ||
      !Number.isInteger(timingRaw.fastHighMatchStreakMax) ||
      !isFiniteNumber(timingRaw.fastMoveThresholdSec)
    ) {
      return null
    }
    timing = {
      meanMoveTimeSec: timingRaw.meanMoveTimeSec,
      medianMoveTimeSec: timingRaw.medianMoveTimeSec,
      fastHighMatchStreakMax: timingRaw.fastHighMatchStreakMax as number,
      fastMoveThresholdSec: timingRaw.fastMoveThresholdSec,
      moveTimesSec: timingRaw.moveTimesSec as number[],
    }
  }

  return {
    version: "v1",
    analyzedAt: value.analyzedAt,
    engine: {
      policyId: "engine-v1",
      multiPv: 3,
      depth: value.engine.depth,
      threads: value.engine.threads as number,
      hashMb: value.engine.hashMb as number,
    },
    calibrationPolicyId: "calibration-v1",
    features: {
      book: {
        bookId: book.bookId,
        bookPlyCount: book.bookPlyCount as number,
        noveltyPly: book.noveltyPly as number | null,
      },
      match: {
        top1Rate: match.top1Rate as number,
        top3Rate: match.top3Rate as number,
        top1RateWhite: match.top1RateWhite as number,
        top1RateBlack: match.top1RateBlack as number,
        top3RateWhite: match.top3RateWhite as number,
        top3RateBlack: match.top3RateBlack as number,
        usablePlies: match.usablePlies as number,
        usablePliesWhite: match.usablePliesWhite as number,
        usablePliesBlack: match.usablePliesBlack as number,
      },
      cpl: {
        average: cpl.average as number,
        median: cpl.median as number,
        p90: cpl.p90 as number,
        averageWhite: cpl.averageWhite as number,
        averageBlack: cpl.averageBlack as number,
        values: cpl.values as number[],
      },
      timing,
    },
    suspicion: {
      score: value.suspicion.score,
      uncertainty: {
        low: uncertainty.low,
        high: uncertainty.high,
        halfWidth: uncertainty.halfWidth,
      },
      band: value.suspicion.band,
    },
    methodologyNote: value.methodologyNote,
    falsePositiveWarning: value.falsePositiveWarning,
    featuresUsed: value.featuresUsed as string[],
    sampleSizeCaveats: value.sampleSizeCaveats as string[],
  }
}

export const formatBandLabel = (band: SuspicionBand): string => {
  if (band === "low") return "Low"
  if (band === "elevated") return "Elevated"
  if (band === "high") return "High"
  return "Inconclusive"
}

export const formatPercent = (value: number): string => {
  return `${(value * 100).toFixed(1)}%`
}

export const formatScore = (value: number): string => {
  return value.toFixed(3)
}
