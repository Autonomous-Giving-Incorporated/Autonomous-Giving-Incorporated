/**
 * Shared public-narrative vocabulary for Fund-Intel / Portfolio Signals,
 * Impact Relay, and AGI. Matching fixtures only. Does not change the
 * live build-time adapter.
 */

export const ALLOCATION_ID_PATTERN = /^alloc_[a-z0-9_]+$/;
export const ALLOCATION_ID_EXAMPLE = "alloc_community_hardware";

export const ALLOCATION_ID_RULES = {
  issuer: "portfolio_signals_owner",
  issuedWhen: "decision publish time",
  format: "alloc_<lowercase_snake_slug>",
  pattern: ALLOCATION_ID_PATTERN.source,
  example: ALLOCATION_ID_EXAMPLE,
  consumer: "Impact Relay stores and exports the same value; AGI joins only on it",
  neverADonorId: true,
} as const;

export const FUNDING_DECISION_STATUSES = ["approved"] as const;
export const CAMPAIGN_ALLOCATION_STATUSES = [
  "proposed",
  "approved",
  "active",
  "closed",
] as const;
export const CAMPAIGN_EXECUTION_STATES = [
  "blocked",
  "review",
  "authorized",
  "active",
  "sealed",
] as const;
export const PUBLIC_VERIFICATION_STATUSES = [
  "pending",
  "verified",
  "rejected",
] as const;
export const IMPACT_EVENT_TYPES = [
  "purchase_approved",
  "receipt_attached",
  "equipment_delivered",
  "program_held",
  "attendance_verified",
  "notification_delivered",
] as const;

/** Impact Relay evidenceState → AGI verificationStatus. Unmapped values stay unmapped. */
export const EVIDENCE_STATE_MAP = {
  VERIFIED: "verified",
  PENDING: "pending",
  REJECTED: "rejected",
} as const;

/** Impact Relay domain / export eventType → AGI ImpactEventType. */
export const EVENT_TYPE_MAP = {
  CLASS_HELD: "program_held",
  PURCHASE_APPROVED: "purchase_approved",
  RECEIPT_ATTACHED: "receipt_attached",
  EQUIPMENT_DELIVERED: "equipment_delivered",
  ATTENDANCE_VERIFIED: "attendance_verified",
  NOTIFICATION_DELIVERED: "notification_delivered",
} as const;

export const AUTHORITY_VALUES = {
  portfolioSignals: "advisory_only",
  impactRelay: "public_aggregate_only",
} as const;

export function isAllocationId(value: unknown): value is string {
  return typeof value === "string" && ALLOCATION_ID_PATTERN.test(value);
}

export function mapEvidenceState(
  value: string,
): (typeof PUBLIC_VERIFICATION_STATUSES)[number] | null {
  if (value in EVIDENCE_STATE_MAP) {
    return EVIDENCE_STATE_MAP[value as keyof typeof EVIDENCE_STATE_MAP];
  }
  return null;
}

export function mapEventType(
  value: string,
): (typeof IMPACT_EVENT_TYPES)[number] | null {
  if (value in EVENT_TYPE_MAP) {
    return EVENT_TYPE_MAP[value as keyof typeof EVENT_TYPE_MAP];
  }
  return null;
}
