/** Read-only public integration contracts proposed for v0.2; this is not a live client. */

export const INTEGRATION_CONTRACT_VERSION = "2026-08-02" as const;

/**
 * Narrative-contract versioning. Distinct from platform-spec SemVer (SPEC-012)
 * and from public-document `version` strings (`1.0.0` on campaign/impact JSON).
 * A compatibility break requires a new date string. This Phase C draft does
 * not bump the version because it does not change live product semantics.
 */
export const CONTRACT_VERSIONING = {
  scheme: "date-string",
  current: INTEGRATION_CONTRACT_VERSION,
  bumpRequiredOnCompatibilityBreak: true,
  additiveOptionalFieldsKeepVersion: true,
  platformSpecPin: "1.0.0",
  platformSpecScheme: "semver",
} as const;

/** C3 public-data policy is an engineering draft. Not approved. */
export const PUBLIC_DATA_POLICY_STATUS = "PROPOSED" as const;

export type PublicVerificationStatus = "pending" | "verified" | "rejected";
export type ImpactEventType =
  | "purchase_approved"
  | "receipt_attached"
  | "equipment_delivered"
  | "program_held"
  | "attendance_verified"
  | "notification_delivered";
export type FundingDecisionStatus = "approved";

export type FundingDecision = {
  schemaVersion: typeof INTEGRATION_CONTRACT_VERSION;
  allocationId: string;
  fundName: string;
  rationale: string;
  status: FundingDecisionStatus;
  publishedAt: string;
};

export type ImpactEvent = {
  schemaVersion: typeof INTEGRATION_CONTRACT_VERSION;
  allocationId: string;
  eventId: string;
  type: ImpactEventType;
  occurredAt: string;
  verificationStatus: PublicVerificationStatus;
  /** Public-safe reference only; never a raw receipt, personal data, or secret URL. */
  evidenceReference?: string;
};

export type PublicImpactNarrative = {
  decision: FundingDecision;
  events: readonly ImpactEvent[];
};

/** Continuation-plan role seats. Not a leadership sign-off. */
export type ContractRoleOwner =
  | "portfolio_signals_owner"
  | "impact_relay_owner"
  | "agi_engineering";

/**
 * Sole observed GitHub operator currently filling the three role seats.
 * Recording the login is not approval, READY, or a freeze SHA.
 */
export const CURRENT_ROLE_OPERATOR = {
  githubLogin: "scrimshawlife-ctrl",
  displayName: "Danny",
  observedProfileName: "Daniel Meyer",
} as const;

export const FUNDING_DECISION_FIELD_OWNERS = {
  schemaVersion: "agi_engineering",
  allocationId: "portfolio_signals_owner",
  fundName: "portfolio_signals_owner",
  rationale: "portfolio_signals_owner",
  status: "portfolio_signals_owner",
  publishedAt: "portfolio_signals_owner",
} as const satisfies Record<keyof FundingDecision, ContractRoleOwner>;

export const IMPACT_EVENT_FIELD_OWNERS = {
  schemaVersion: "agi_engineering",
  allocationId: "portfolio_signals_owner",
  eventId: "impact_relay_owner",
  type: "impact_relay_owner",
  occurredAt: "impact_relay_owner",
  verificationStatus: "impact_relay_owner",
  evidenceReference: "impact_relay_owner",
} as const satisfies Record<keyof ImpactEvent, ContractRoleOwner>;
