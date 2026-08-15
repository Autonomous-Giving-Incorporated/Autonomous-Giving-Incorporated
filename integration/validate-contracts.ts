/**
 * Runtime validation for the versioned narrative contracts.
 * Used by fixture tests. The live public-source adapter does not
 * deserialize remote documents into these types.
 */

import {
  INTEGRATION_CONTRACT_VERSION,
  type FundingDecision,
  type ImpactEvent,
  type PublicImpactNarrative,
} from "./contracts.ts";
import {
  FUNDING_DECISION_STATUSES,
  IMPACT_EVENT_TYPES,
  PUBLIC_VERIFICATION_STATUSES,
  isAllocationId,
} from "./glossary.ts";

export type ContractValidationFailure = {
  kind: "malformed" | "policy_rejected";
  reason: string;
};

const DONOR_LEVEL_KEYS = [
  "donor_id",
  "donorId",
  "donation_id",
  "donationId",
  "donorName",
  "donorEmail",
  "approved_by",
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isIsoTimestamp(value: unknown): value is string {
  return typeof value === "string" && Number.isFinite(Date.parse(value));
}

function malformed(reason: string): ContractValidationFailure {
  return { kind: "malformed", reason };
}

function rejected(reason: string): ContractValidationFailure {
  return { kind: "policy_rejected", reason };
}

function containsDonorLevelKey(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.some(containsDonorLevelKey);
  }
  if (!isRecord(value)) {
    return false;
  }
  return Object.entries(value).some(([key, nested]) => {
    return (
      DONOR_LEVEL_KEYS.includes(key as (typeof DONOR_LEVEL_KEYS)[number]) ||
      containsDonorLevelKey(nested)
    );
  });
}

function isPublicSafeReference(value: unknown): value is string {
  if (!isNonEmptyString(value)) {
    return false;
  }
  if (/^https?:\/\//i.test(value) || value.includes("/") || value.includes("@")) {
    return false;
  }
  return /^[a-z0-9][a-z0-9_-]*$/i.test(value);
}

export function validateFundingDecision(
  value: unknown,
): FundingDecision | ContractValidationFailure {
  if (!isRecord(value)) {
    return malformed("decision.schema.root");
  }
  if (containsDonorLevelKey(value)) {
    return rejected("decision.donor_level_data");
  }
  if (value.schemaVersion !== INTEGRATION_CONTRACT_VERSION) {
    return malformed("decision.schema.schemaVersion");
  }
  if (!isAllocationId(value.allocationId)) {
    return malformed("decision.schema.allocationId");
  }
  if (!isNonEmptyString(value.fundName)) {
    return malformed("decision.schema.fundName");
  }
  if (!isNonEmptyString(value.rationale)) {
    return malformed("decision.schema.rationale");
  }
  if (
    typeof value.status !== "string" ||
    !FUNDING_DECISION_STATUSES.includes(
      value.status as (typeof FUNDING_DECISION_STATUSES)[number],
    )
  ) {
    return malformed("decision.schema.status");
  }
  if (!isIsoTimestamp(value.publishedAt)) {
    return malformed("decision.schema.publishedAt");
  }
  return {
    schemaVersion: INTEGRATION_CONTRACT_VERSION,
    allocationId: value.allocationId,
    fundName: value.fundName,
    rationale: value.rationale,
    status: "approved",
    publishedAt: value.publishedAt,
  };
}

export function validateImpactEvent(
  value: unknown,
): ImpactEvent | ContractValidationFailure {
  if (!isRecord(value)) {
    return malformed("event.schema.root");
  }
  if (containsDonorLevelKey(value)) {
    return rejected("event.donor_level_data");
  }
  if (value.schemaVersion !== INTEGRATION_CONTRACT_VERSION) {
    return malformed("event.schema.schemaVersion");
  }
  if (!isAllocationId(value.allocationId)) {
    return malformed("event.schema.allocationId");
  }
  if (!isNonEmptyString(value.eventId)) {
    return malformed("event.schema.eventId");
  }
  if (
    typeof value.type !== "string" ||
    !IMPACT_EVENT_TYPES.includes(value.type as (typeof IMPACT_EVENT_TYPES)[number])
  ) {
    return malformed("event.schema.type");
  }
  if (!isIsoTimestamp(value.occurredAt)) {
    return malformed("event.schema.occurredAt");
  }
  if (
    typeof value.verificationStatus !== "string" ||
    !PUBLIC_VERIFICATION_STATUSES.includes(
      value.verificationStatus as (typeof PUBLIC_VERIFICATION_STATUSES)[number],
    )
  ) {
    return malformed("event.schema.verificationStatus");
  }
  if (
    value.evidenceReference !== undefined &&
    !isPublicSafeReference(value.evidenceReference)
  ) {
    return rejected("event.evidence_reference_not_public_safe");
  }

  const event: ImpactEvent = {
    schemaVersion: INTEGRATION_CONTRACT_VERSION,
    allocationId: value.allocationId,
    eventId: value.eventId,
    type: value.type as ImpactEvent["type"],
    occurredAt: value.occurredAt,
    verificationStatus: value.verificationStatus as ImpactEvent["verificationStatus"],
  };
  if (typeof value.evidenceReference === "string") {
    event.evidenceReference = value.evidenceReference;
  }
  return event;
}

export function validatePublicImpactNarrative(
  value: unknown,
): PublicImpactNarrative | ContractValidationFailure {
  if (!isRecord(value)) {
    return malformed("narrative.schema.root");
  }
  if (containsDonorLevelKey(value)) {
    return rejected("narrative.donor_level_data");
  }

  const decision = validateFundingDecision(value.decision);
  if ("kind" in decision) {
    return decision;
  }
  if (!Array.isArray(value.events)) {
    return malformed("narrative.schema.events");
  }

  const events: ImpactEvent[] = [];
  for (const item of value.events) {
    const event = validateImpactEvent(item);
    if ("kind" in event) {
      return event;
    }
    if (event.allocationId !== decision.allocationId) {
      return malformed("narrative.join.allocationId");
    }
    events.push(event);
  }

  return { decision, events };
}
