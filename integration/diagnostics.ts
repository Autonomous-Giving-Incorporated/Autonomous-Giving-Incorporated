import type { PublicSignals } from "./public-sources.ts";

/**
 * Privacy-safe diagnostic summary for build logs and CI.
 *
 * Reports source state, age, freshness label, and reason only.
 * Never includes raw payloads, donor data, organization names,
 * program names, evidence hashes, or URLs.
 */
export type PublicSignalDiagnostic = {
  source: PublicSignals["source"];
  reason?: string;
  fundIntel: {
    freshness: PublicSignals["fundIntel"]["freshness"]["label"];
    ageMs: number | null;
  };
  impactRelay: {
    freshness: PublicSignals["impactRelay"]["freshness"]["label"];
    ageMs: number | null;
  };
};

const FORBIDDEN_DIAGNOSTIC_KEYS = [
  "organizationName",
  "programName",
  "allocationName",
  "executionState",
  "participants",
  "receiptHash",
  "body",
  "payload",
] as const;

export function toDiagnostic(signals: PublicSignals): PublicSignalDiagnostic {
  return {
    source: signals.source,
    reason: signals.reason,
    fundIntel: {
      freshness: signals.fundIntel.freshness.label,
      ageMs: signals.fundIntel.freshness.ageMs,
    },
    impactRelay: {
      freshness: signals.impactRelay.freshness.label,
      ageMs: signals.impactRelay.freshness.ageMs,
    },
  };
}

/** Single-line log string safe for CI output. */
export function formatDiagnosticLine(signals: PublicSignals): string {
  const d = toDiagnostic(signals);
  const parts = [
    `agi.public_signals source=${d.source}`,
    d.reason ? `reason=${d.reason}` : null,
    `fund_freshness=${d.fundIntel.freshness}`,
    `fund_age_ms=${d.fundIntel.ageMs ?? "unknown"}`,
    `impact_freshness=${d.impactRelay.freshness}`,
    `impact_age_ms=${d.impactRelay.ageMs ?? "unknown"}`,
  ].filter(Boolean);
  return parts.join(" ");
}

export function diagnosticContainsForbiddenKeys(
  diagnostic: PublicSignalDiagnostic,
): boolean {
  const serialized = JSON.stringify(diagnostic);
  return FORBIDDEN_DIAGNOSTIC_KEYS.some((key) => serialized.includes(`"${key}"`));
}
