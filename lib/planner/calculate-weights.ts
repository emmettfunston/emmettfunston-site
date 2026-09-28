/**
 * Chapter-slot weight calculation — pure and deterministic.
 */

import {
  BASE_BOOK_WEIGHTS,
  CATEGORY_PRIORITY,
  WEIGHTING_CONFIG,
} from "@/lib/planner/config";
import type { BookCategory } from "@/lib/planner/types";

export type WeightInput = {
  currentMathScore: number;
  currentRwScore: number;
  targetTotalScore: number;
  /** Categories currently participating in the rotation. */
  includedCategories: readonly BookCategory[];
};

/**
 * R&W section reference scales with the total target. At a 1500 total the
 * reference is 700; at 1600 it scales to ~747, etc.
 */
export function rwReferenceForTarget(targetTotal: number): number {
  const { rwReferenceAt1500, rwReferenceTotal } = WEIGHTING_CONFIG;
  const scaled =
    Math.round((rwReferenceAt1500 * targetTotal) / rwReferenceTotal / 10) * 10;
  return Math.min(800, Math.max(200, scaled));
}

function clampBoost(value: number): number {
  return Math.min(WEIGHTING_CONFIG.maxDeficitBoost, Math.max(0, value));
}

function emptyWeights(): Record<BookCategory, number> {
  return { math: 0, grammar: 0, reading: 0 };
}

function enforceGrammarAboveReading(
  weights: Record<BookCategory, number>,
  included: ReadonlySet<BookCategory>
): void {
  if (!included.has("grammar") || !included.has("reading")) return;
  if (weights.grammar <= weights.reading) {
    weights.grammar = weights.reading + 0.05;
  }
}

function normalize(
  raw: Record<BookCategory, number>,
  included: ReadonlySet<BookCategory>
): Record<BookCategory, number> {
  const out = emptyWeights();
  let total = 0;
  for (const c of CATEGORY_PRIORITY) {
    if (!included.has(c)) continue;
    out[c] = raw[c];
    total += raw[c];
  }
  if (total <= 0) {
    const share = 1 / included.size;
    for (const c of included) out[c] = share;
    return out;
  }
  for (const c of included) out[c] = out[c] / total;
  return out;
}

/**
 * Compute normalized weights across the included categories only.
 * Grammar weight is always forced above Reading when both are present.
 */
export function calculateWeights(
  input: WeightInput
): Record<BookCategory, number> {
  const included = new Set(input.includedCategories);
  if (included.size === 0) return emptyWeights();

  const mathDeficit = Math.max(
    0,
    WEIGHTING_CONFIG.mathReference - input.currentMathScore
  );
  const rwRef = rwReferenceForTarget(input.targetTotalScore);
  const rwDeficit = Math.max(0, rwRef - input.currentRwScore);

  // Normalize deficits to 0–1 against a 600-point gap (200→800).
  const mathBoost = clampBoost(mathDeficit / 600);
  const rwBoost = clampBoost(rwDeficit / 600);

  const raw = emptyWeights();
  if (included.has("math")) {
    raw.math = BASE_BOOK_WEIGHTS.math + mathBoost;
  }
  if (included.has("grammar")) {
    raw.grammar =
      BASE_BOOK_WEIGHTS.grammar +
      rwBoost * WEIGHTING_CONFIG.rwDeficitToGrammarShare;
  }
  if (included.has("reading")) {
    raw.reading =
      BASE_BOOK_WEIGHTS.reading +
      rwBoost * WEIGHTING_CONFIG.rwDeficitToReadingShare;
  }

  enforceGrammarAboveReading(raw, included);
  return normalize(raw, included);
}

/** Renormalize existing weights after a book is exhausted from the rotation. */
export function renormalizeWeights(
  weights: Readonly<Partial<Record<BookCategory, number>>>,
  remaining: readonly BookCategory[]
): Record<BookCategory, number> {
  const included = new Set(remaining);
  if (included.size === 0) return emptyWeights();

  const raw = emptyWeights();
  for (const c of remaining) {
    raw[c] = weights[c] ?? 0;
  }
  enforceGrammarAboveReading(raw, included);
  return normalize(raw, included);
}
