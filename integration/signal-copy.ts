import type { FreshnessAssessment } from "./freshness.ts";
import type { SignalSourceState } from "./public-sources.ts";

export const SOURCE_STATUS_LABEL: Record<SignalSourceState, string> = {
  live: "Live public projection",
  stale: "Live projection · delayed sources",
  fallback: "Deterministic fallback",
  malformed: "Deterministic fallback · malformed source",
  policy_rejected: "Deterministic fallback · policy rejected",
};

export const SOURCE_STATUS_DESCRIPTION: Record<SignalSourceState, string> = {
  live: "Both public documents passed schema, authority, verification, and freshness checks.",
  stale:
    "Approved public documents are shown with delay labels. Data older than 24 hours is not treated as current evidence.",
  fallback:
    "Public sources were unavailable or older than seven days. This page shows the bundled deterministic Community Hardware fixture only.",
  malformed:
    "A public document failed schema validation. This page shows the bundled deterministic fixture only. Raw source payloads are not displayed.",
  policy_rejected:
    "A public document used an unknown authority, failed privacy constants, or lacked a VERIFIED outcome. This page shows the bundled deterministic fixture only.",
};

const REASON_COPY: Record<string, string> = {
  network_failure: "A public source could not be retrieved.",
  json_parse_failure: "A public source was not valid JSON.",
  hard_stale:
    "A public source is older than the seven-day hard freshness window, so it is not projected.",
  soft_stale:
    "At least one public source is older than the 24-hour freshness window and is labeled delayed.",
  "campaign.authority_rejected":
    "Portfolio Signals did not declare advisory_only authority.",
  "impact.authority_rejected":
    "Impact Relay did not declare public_aggregate_only authority.",
  "campaign.privacy_policy_rejected":
    "Portfolio Signals privacy constants were not fail-closed.",
  "impact.privacy_policy_rejected":
    "Impact Relay privacy constants were not fail-closed.",
  "impact.missing_verified_outcome":
    "Impact Relay did not publish a VERIFIED aggregate outcome.",
};

export function publicReasonCopy(reason: string | undefined): string | null {
  if (!reason) return null;
  if (REASON_COPY[reason]) return REASON_COPY[reason];
  if (reason.startsWith("http_non_2xx")) {
    return "A public source returned a non-success HTTP status.";
  }
  if (reason.startsWith("campaign.schema.")) {
    return "The Portfolio Signals document did not match the published public-campaign schema.";
  }
  if (reason.startsWith("impact.schema.")) {
    return "The Impact Relay document did not match the published public-impact schema.";
  }
  return "Public sources were not accepted. The deterministic fixture is shown instead.";
}

export function formatAge(ageMs: number | null): string | null {
  if (ageMs === null) return null;
  const hours = Math.floor(ageMs / (60 * 60 * 1000));
  if (hours < 1) return "less than 1 hour old";
  if (hours < 24) return hours === 1 ? "1 hour old" : `${hours} hours old`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "1 day old" : `${days} days old`;
}

export function freshnessSpokenLabel(
  assessment: FreshnessAssessment,
): string {
  const age = formatAge(assessment.ageMs);
  if (assessment.label === "fresh") {
    return age
      ? `Fresh. Published ${age}, within the 24-hour window.`
      : "Fresh. Within the 24-hour window.";
  }
  if (assessment.label === "stale") {
    return age
      ? `Delayed. Published ${age}, past the 24-hour soft freshness window.`
      : "Delayed past the 24-hour soft freshness window.";
  }
  if (assessment.label === "very_stale") {
    return age
      ? `Too old to project. Published ${age}, past the seven-day hard window.`
      : "Too old to project. Past the seven-day hard window.";
  }
  return "Publication time could not be assessed, so the record is not treated as current evidence.";
}

export function freshnessVisualLabel(
  assessment: FreshnessAssessment,
): string | null {
  const age = formatAge(assessment.ageMs);
  if (assessment.label === "fresh") {
    return age ? `Published ${age}` : null;
  }
  if (assessment.label === "stale") {
    return age
      ? `Delayed · published ${age}`
      : "Delayed past the 24-hour window";
  }
  if (assessment.label === "very_stale") {
    return age
      ? `Older than 7 days · published ${age}`
      : "Older than the seven-day window";
  }
  return "Publication time unknown";
}
