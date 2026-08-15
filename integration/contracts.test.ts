import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import {
  CONTRACT_VERSIONING,
  CURRENT_ROLE_OPERATOR,
  FUNDING_DECISION_FIELD_OWNERS,
  IMPACT_EVENT_FIELD_OWNERS,
  INTEGRATION_CONTRACT_VERSION,
  PUBLIC_DATA_POLICY_STATUS,
} from "./contracts.ts";
import { communityHardwareFixture } from "./fixtures.ts";
import {
  ALLOCATION_ID_EXAMPLE,
  EVENT_TYPE_MAP,
  EVIDENCE_STATE_MAP,
  isAllocationId,
  mapEventType,
  mapEvidenceState,
} from "./glossary.ts";
import {
  validPublicCampaign,
  validPublicImpact,
} from "./public-document-fixtures.ts";
import {
  validateFundingDecision,
  validateImpactEvent,
  validatePublicImpactNarrative,
} from "./validate-contracts.ts";

const narrativeJson = JSON.parse(
  readFileSync(
    new URL("./fixtures/community-hardware-narrative.json", import.meta.url),
    "utf8",
  ),
) as unknown;

describe("Phase C contract ownership", () => {
  it("names a role owner for every FundingDecision field", () => {
    assert.deepEqual(Object.keys(FUNDING_DECISION_FIELD_OWNERS).sort(), [
      "allocationId",
      "fundName",
      "publishedAt",
      "rationale",
      "schemaVersion",
      "status",
    ]);
  });

  it("names a role owner for every ImpactEvent field", () => {
    assert.deepEqual(Object.keys(IMPACT_EVENT_FIELD_OWNERS).sort(), [
      "allocationId",
      "eventId",
      "evidenceReference",
      "occurredAt",
      "schemaVersion",
      "type",
      "verificationStatus",
    ]);
  });

  it("records the observed operator without treating that as sign-off", () => {
    assert.equal(CURRENT_ROLE_OPERATOR.githubLogin, "scrimshawlife-ctrl");
    assert.equal(CURRENT_ROLE_OPERATOR.displayName, "Danny");
  });
});

describe("shared glossary", () => {
  it("accepts the published allocationId pattern and example", () => {
    assert.equal(isAllocationId(ALLOCATION_ID_EXAMPLE), true);
    assert.equal(isAllocationId("donor_123"), false);
    assert.equal(isAllocationId("READY"), false);
  });

  it("maps Impact Relay evidence and event vocabulary without inventing values", () => {
    assert.equal(mapEvidenceState("VERIFIED"), "verified");
    assert.equal(mapEvidenceState("PENDING"), "pending");
    assert.equal(mapEvidenceState("REJECTED"), "rejected");
    assert.equal(mapEvidenceState("READY"), null);
    assert.equal(mapEventType("CLASS_HELD"), "program_held");
    assert.equal(mapEventType("freeze"), null);
    assert.equal(EVIDENCE_STATE_MAP.VERIFIED, "verified");
    assert.equal(EVENT_TYPE_MAP.CLASS_HELD, "program_held");
  });
});

describe("narrative contract fixtures", () => {
  it("validates the TypeScript community-hardware fixture", () => {
    const result = validatePublicImpactNarrative(communityHardwareFixture);
    assert.ok(!("kind" in result));
    assert.equal(result.decision.allocationId, ALLOCATION_ID_EXAMPLE);
    assert.equal(result.decision.schemaVersion, INTEGRATION_CONTRACT_VERSION);
    assert.equal(result.events.length, 3);
  });

  it("validates the published JSON fixture and keeps it aligned", () => {
    const result = validatePublicImpactNarrative(narrativeJson);
    assert.ok(!("kind" in result));
    assert.deepEqual(narrativeJson, communityHardwareFixture);
  });

  it("joins campaign, impact, and narrative fixtures on the same allocationId", () => {
    assert.equal(
      validPublicCampaign.allocations[0]?.allocationId,
      ALLOCATION_ID_EXAMPLE,
    );
    assert.equal(
      validPublicImpact.outcomes[0]?.allocationId,
      ALLOCATION_ID_EXAMPLE,
    );
    assert.equal(
      communityHardwareFixture.decision.allocationId,
      ALLOCATION_ID_EXAMPLE,
    );
    for (const event of communityHardwareFixture.events) {
      assert.equal(event.allocationId, ALLOCATION_ID_EXAMPLE);
    }
  });

  it("contains no donor-level keys", () => {
    const forbidden = new Set([
      "donor_id",
      "donorId",
      "donation_id",
      "donationId",
      "donorName",
      "donorEmail",
      "approved_by",
    ]);
    const keys: string[] = [];
    const walk = (value: unknown) => {
      if (Array.isArray(value)) {
        value.forEach(walk);
        return;
      }
      if (value && typeof value === "object") {
        for (const [key, nested] of Object.entries(value)) {
          keys.push(key);
          walk(nested);
        }
      }
    };
    walk({
      narrative: communityHardwareFixture,
      campaign: validPublicCampaign,
      impact: validPublicImpact,
    });
    for (const key of keys) {
      assert.equal(forbidden.has(key), false, key);
    }
  });
});

describe("narrative contract validation", () => {
  it("rejects a donor-shaped allocationId", () => {
    const result = validateFundingDecision({
      ...communityHardwareFixture.decision,
      allocationId: "donor_123",
    });
    assert.ok("kind" in result);
    assert.equal(result.kind, "malformed");
    assert.equal(result.reason, "decision.schema.allocationId");
  });

  it("rejects donor-level fields as policy_rejected", () => {
    const result = validateFundingDecision({
      ...communityHardwareFixture.decision,
      donorId: "don_1",
    });
    assert.ok("kind" in result);
    assert.equal(result.kind, "policy_rejected");
    assert.equal(result.reason, "decision.donor_level_data");
  });

  it("rejects a secret URL evidence reference", () => {
    const result = validateImpactEvent({
      ...communityHardwareFixture.events[0],
      evidenceReference: "https://example.com/secret/receipt",
    });
    assert.ok("kind" in result);
    assert.equal(result.kind, "policy_rejected");
    assert.equal(result.reason, "event.evidence_reference_not_public_safe");
  });

  it("rejects a join-key mismatch", () => {
    const result = validatePublicImpactNarrative({
      decision: communityHardwareFixture.decision,
      events: [
        {
          ...communityHardwareFixture.events[0],
          allocationId: "alloc_other_fund",
        },
      ],
    });
    assert.ok("kind" in result);
    assert.equal(result.reason, "narrative.join.allocationId");
  });
});

describe("contract versioning and C3 status", () => {
  it("keeps the existing date-string version and requires a bump on break", () => {
    assert.equal(CONTRACT_VERSIONING.current, "2026-08-02");
    assert.equal(CONTRACT_VERSIONING.scheme, "date-string");
    assert.equal(CONTRACT_VERSIONING.bumpRequiredOnCompatibilityBreak, true);
    assert.equal(CONTRACT_VERSIONING.platformSpecPin, "1.0.0");
    assert.equal(CONTRACT_VERSIONING.platformSpecScheme, "semver");
  });

  it("leaves the public-data policy PROPOSED", () => {
    assert.equal(PUBLIC_DATA_POLICY_STATUS, "PROPOSED");
    assert.notEqual(PUBLIC_DATA_POLICY_STATUS, "approved");
  });
});
