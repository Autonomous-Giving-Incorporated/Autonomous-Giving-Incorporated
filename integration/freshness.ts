/**
 * Freshness policy for AGI public projections.
 *
 * Clock: the build-time reference instant is `Date.now()` (injectable as
 * `nowMs` in tests). Source `updatedAt` values are UTC. Date-only strings
 * (`YYYY-MM-DD`) are treated as UTC midnight so age does not depend on the
 * builder's local timezone.
 *
 * Soft threshold (24 h): the remote document may still be projected, but the
 * adapter state is `stale` and the UI must label the delay. Delayed records
 * are not treated as current evidence.
 *
 * Hard threshold (7 d): fail closed. The remote document is not projected;
 * the deterministic fixture is the only fallback content.
 */

export const FRESHNESS_SOFT_MS = 24 * 60 * 60 * 1000;
export const FRESHNESS_HARD_MS = 7 * 24 * 60 * 60 * 1000;

export type FreshnessLabel = "fresh" | "stale" | "very_stale" | "unknown";

export type FreshnessAssessment = {
  label: FreshnessLabel;
  ageMs: number | null;
  updatedAt: string;
};

/**
 * Parse a source `updatedAt` value into epoch ms.
 * Accepts date-only (YYYY-MM-DD) and full ISO date-time strings.
 * Returns null when the value cannot be parsed honestly.
 */
export function parseUpdatedAt(value: string): number | null {
  if (typeof value !== "string" || value.trim().length === 0) return null;

  // Date-only: treat as UTC midnight so age is stable across timezones.
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const ms = Date.parse(`${value}T00:00:00.000Z`);
    return Number.isFinite(ms) ? ms : null;
  }

  const ms = Date.parse(value);
  return Number.isFinite(ms) ? ms : null;
}

export function assessFreshness(
  updatedAt: string,
  nowMs: number = Date.now(),
): FreshnessAssessment {
  const parsed = parseUpdatedAt(updatedAt);
  if (parsed === null) {
    return { label: "unknown", ageMs: null, updatedAt };
  }

  const ageMs = Math.max(0, nowMs - parsed);

  if (ageMs > FRESHNESS_HARD_MS) {
    return { label: "very_stale", ageMs, updatedAt };
  }
  if (ageMs > FRESHNESS_SOFT_MS) {
    return { label: "stale", ageMs, updatedAt };
  }
  return { label: "fresh", ageMs, updatedAt };
}

/** Soft window exceeded, but still within the hard window. */
export function isSoftStale(label: FreshnessLabel): boolean {
  return label === "stale";
}

/**
 * Hard window exceeded or timestamp cannot be assessed.
 * These records are not projected.
 */
export function isHardStale(label: FreshnessLabel): boolean {
  return label === "very_stale" || label === "unknown";
}
