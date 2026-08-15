/**
 * Build-time schema validation for the two public documents AGI consumes.
 *
 * Campaign shape follows the published Fund-Intel / Portfolio Signals
 * `public-campaign.schema.json`. Impact shape follows the published
 * Impact Relay `public-impact.schema.json`, plus AGI's projection rule
 * that a live path requires one `evidenceState: "VERIFIED"` outcome.
 *
 * Fail closed:
 * - unknown authority is never accepted;
 * - privacy constants must remain fail-closed (`false`);
 * - unknown fields are ignored (additive public-safe fields);
 * - invented execution states such as READY/freeze are rejected;
 * - no evidence is inferred from a document that fails validation.
 */

import { isAllocationId } from "./glossary.ts";

export type ValidationFailure = {
  kind: "malformed" | "policy_rejected";
  reason: string;
};

export type ValidatedCampaignAllocation = {
  allocationId: string;
  fundName: string;
  status: string;
};

export type ValidatedCampaign = {
  updatedAt: string;
  authority: "advisory_only";
  execution: { state: string; reason: string };
  allocations: ValidatedCampaignAllocation[];
};

export type ValidatedImpactOutcome = {
  organizationName: string;
  programName: string;
  allocationName: string;
  allocationId: string | null;
  participantsPublic: number;
  evidenceState: "VERIFIED";
  eventDate: string;
};

export type ValidatedImpact = {
  updatedAt: string;
  authority: "public_aggregate_only";
  outcome: ValidatedImpactOutcome;
};

const CAMPAIGN_EXECUTION_STATES = [
  "blocked",
  "review",
  "authorized",
  "active",
  "sealed",
] as const;

const GATE_STATES = ["pending", "approved", "blocked", "not_applicable"] as const;

const ALLOCATION_STATUSES = ["proposed", "approved", "active", "closed"] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isSemver(value: unknown): value is string {
  return typeof value === "string" && /^\d+\.\d+\.\d+$/.test(value);
}

function isDateOnly(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  return Number.isFinite(Date.parse(`${value}T00:00:00.000Z`));
}

function isNonNegInt(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

function isGateId(value: unknown): value is string {
  return typeof value === "string" && /^[a-z0-9_]+$/.test(value);
}

function malformed(reason: string): ValidationFailure {
  return { kind: "malformed", reason };
}

function rejected(reason: string): ValidationFailure {
  return { kind: "policy_rejected", reason };
}

function validateCampaignBlock(
  value: unknown,
): ValidationFailure | null {
  if (!isRecord(value)) {
    return malformed("campaign.schema.campaign");
  }
  if (!isNonNegInt(value.minimumTarget) || !isNonNegInt(value.stretchTarget)) {
    return malformed("campaign.schema.campaign.targets");
  }
  if (value.currency !== "USD") {
    return malformed("campaign.schema.campaign.currency");
  }
  if (
    !isNonEmptyString(value.minimumCaseState) ||
    !isNonEmptyString(value.stretchCaseState)
  ) {
    return malformed("campaign.schema.campaign.caseState");
  }
  return null;
}

function validateRegistryBlock(value: unknown): ValidationFailure | null {
  if (!isRecord(value)) {
    return malformed("campaign.schema.registry");
  }
  const counts = [
    "normalizedMemberIds",
    "bayAreaRecords",
    "organizerLabels",
    "privateRelayOccurrences",
    "highEngagementRecords",
    "outreachReadyRecords",
  ] as const;
  for (const key of counts) {
    if (!isNonNegInt(value[key])) {
      return malformed(`campaign.schema.registry.${key}`);
    }
  }
  if (!isNonEmptyString(value.qualification)) {
    return malformed("campaign.schema.registry.qualification");
  }
  return null;
}

function validateGates(value: unknown): ValidationFailure | null {
  if (!Array.isArray(value) || value.length < 1) {
    return malformed("campaign.schema.gates");
  }
  for (const item of value) {
    if (!isRecord(item)) {
      return malformed("campaign.schema.gates.entry");
    }
    if (!isGateId(item.id) || !isNonEmptyString(item.label)) {
      return malformed("campaign.schema.gates.entry");
    }
    if (
      typeof item.state !== "string" ||
      !GATE_STATES.includes(item.state as (typeof GATE_STATES)[number])
    ) {
      return malformed("campaign.schema.gates.state");
    }
  }
  return null;
}

function validateCampaignPrivacy(value: unknown): ValidationFailure | null {
  if (!isRecord(value)) {
    return malformed("campaign.schema.privacy");
  }
  if (value.classification !== "public_aggregate_only") {
    return rejected("campaign.privacy_policy_rejected");
  }
  if (
    value.piiAllowed !== false ||
    value.rawRegistryAllowed !== false ||
    value.donorHistoryAllowed !== false ||
    value.privateNotesAllowed !== false
  ) {
    return rejected("campaign.privacy_policy_rejected");
  }
  return null;
}

function validateAllocations(
  value: unknown,
): ValidatedCampaignAllocation[] | ValidationFailure {
  if (value === undefined) return [];
  if (!Array.isArray(value)) {
    return malformed("campaign.schema.allocations");
  }
  const allocations: ValidatedCampaignAllocation[] = [];
  for (const item of value) {
    if (!isRecord(item)) {
      return malformed("campaign.schema.allocations.entry");
    }
    if (!isAllocationId(item.allocationId)) {
      return malformed("campaign.schema.allocations.allocationId");
    }
    if (!isNonEmptyString(item.fundName)) {
      return malformed("campaign.schema.allocations.fundName");
    }
    if (
      typeof item.status !== "string" ||
      !ALLOCATION_STATUSES.includes(
        item.status as (typeof ALLOCATION_STATUSES)[number],
      )
    ) {
      return malformed("campaign.schema.allocations.status");
    }
    allocations.push({
      allocationId: item.allocationId,
      fundName: item.fundName,
      status: item.status,
    });
  }
  return allocations;
}

export function validatePublicCampaign(
  value: unknown,
): ValidatedCampaign | ValidationFailure {
  if (!isRecord(value)) {
    return malformed("campaign.schema.root");
  }

  if (value.authority !== "advisory_only") {
    return rejected("campaign.authority_rejected");
  }

  if (!isSemver(value.version)) {
    return malformed("campaign.schema.version");
  }
  if (!isDateOnly(value.updatedAt)) {
    return malformed("campaign.schema.updatedAt");
  }

  const campaignBlock = validateCampaignBlock(value.campaign);
  if (campaignBlock) return campaignBlock;

  const registryBlock = validateRegistryBlock(value.registry);
  if (registryBlock) return registryBlock;

  if (!isRecord(value.execution)) {
    return malformed("campaign.schema.execution");
  }
  if (
    typeof value.execution.state !== "string" ||
    !CAMPAIGN_EXECUTION_STATES.includes(
      value.execution.state as (typeof CAMPAIGN_EXECUTION_STATES)[number],
    )
  ) {
    return malformed("campaign.schema.execution.state");
  }
  if (!isNonEmptyString(value.execution.reason)) {
    return malformed("campaign.schema.execution.reason");
  }

  const gates = validateGates(value.gates);
  if (gates) return gates;

  const privacy = validateCampaignPrivacy(value.privacy);
  if (privacy) return privacy;

  const allocations = validateAllocations(value.allocations);
  if ("kind" in allocations) return allocations;

  return {
    updatedAt: value.updatedAt,
    authority: "advisory_only",
    execution: {
      state: value.execution.state,
      reason: value.execution.reason,
    },
    allocations,
  };
}

function validateImpactPrivacy(value: unknown): ValidationFailure | null {
  if (!isRecord(value)) {
    return malformed("impact.schema.privacy");
  }
  if (value.classification !== "public_aggregate_only") {
    return rejected("impact.privacy_policy_rejected");
  }
  if (
    value.piiAllowed !== false ||
    value.donorNamesAllowed !== false ||
    value.individualDonorAttributionAllowed !== false ||
    value.operatorIdentityAllowed !== false
  ) {
    return rejected("impact.privacy_policy_rejected");
  }
  return null;
}

function validateVerifiedOutcome(
  value: Record<string, unknown>,
): ValidatedImpactOutcome | ValidationFailure {
  if (!isNonEmptyString(value.publicId)) {
    return malformed("impact.schema.outcome.publicId");
  }
  if (!isNonEmptyString(value.impactEventId)) {
    return malformed("impact.schema.outcome.impactEventId");
  }
  if (!isNonEmptyString(value.organizationName)) {
    return malformed("impact.schema.outcome.organizationName");
  }
  if (!isNonEmptyString(value.programName)) {
    return malformed("impact.schema.outcome.programName");
  }
  if (!isNonEmptyString(value.allocationName)) {
    return malformed("impact.schema.outcome.allocationName");
  }
  if (!isNonEmptyString(value.eventType)) {
    return malformed("impact.schema.outcome.eventType");
  }
  if (!isNonEmptyString(value.eventDate)) {
    return malformed("impact.schema.outcome.eventDate");
  }
  if (!isNonNegInt(value.participantsPublic)) {
    return malformed("impact.schema.outcome.participantsPublic");
  }
  if (!isNonEmptyString(value.attributionMethod)) {
    return malformed("impact.schema.outcome.attributionMethod");
  }
  if (!isNonEmptyString(value.receiptHash)) {
    return malformed("impact.schema.outcome.receiptHash");
  }
  if (!isNonEmptyString(value.createdAt)) {
    return malformed("impact.schema.outcome.createdAt");
  }

  if (value.allocationId !== undefined && !isAllocationId(value.allocationId)) {
    return malformed("impact.schema.outcome.allocationId");
  }
  const allocationId = isAllocationId(value.allocationId)
    ? value.allocationId
    : null;

  return {
    organizationName: value.organizationName,
    programName: value.programName,
    allocationName: value.allocationName,
    allocationId,
    participantsPublic: value.participantsPublic,
    evidenceState: "VERIFIED",
    eventDate: value.eventDate,
  };
}

export function validatePublicImpact(
  value: unknown,
): ValidatedImpact | ValidationFailure {
  if (!isRecord(value)) {
    return malformed("impact.schema.root");
  }

  if (value.authority !== "public_aggregate_only") {
    return rejected("impact.authority_rejected");
  }

  if (!isSemver(value.version)) {
    return malformed("impact.schema.version");
  }
  if (!isDateOnly(value.updatedAt)) {
    return malformed("impact.schema.updatedAt");
  }
  if (!isNonEmptyString(value.source)) {
    return malformed("impact.schema.source");
  }

  const privacy = validateImpactPrivacy(value.privacy);
  if (privacy) return privacy;

  if (!isRecord(value.summary)) {
    return malformed("impact.schema.summary");
  }
  if (
    !isNonNegInt(value.summary.outcomeCount) ||
    !isNonNegInt(value.summary.totalParticipantsPublic)
  ) {
    return malformed("impact.schema.summary");
  }

  if (!Array.isArray(value.outcomes)) {
    return malformed("impact.schema.outcomes");
  }

  const verified = value.outcomes.find((item) => {
    return isRecord(item) && item.evidenceState === "VERIFIED";
  });

  if (!verified || !isRecord(verified)) {
    return rejected("impact.missing_verified_outcome");
  }

  const outcome = validateVerifiedOutcome(verified);
  if ("kind" in outcome) return outcome;

  return {
    updatedAt: value.updatedAt,
    authority: "public_aggregate_only",
    outcome,
  };
}
