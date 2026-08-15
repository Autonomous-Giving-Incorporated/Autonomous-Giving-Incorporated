import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  validPublicCampaign,
  validPublicImpact,
} from "./public-document-fixtures.ts";
import {
  validatePublicCampaign,
  validatePublicImpact,
} from "./validate-public.ts";

describe("validatePublicCampaign", () => {
  it("accepts a document matching the published public-campaign shape", () => {
    const result = validatePublicCampaign(validPublicCampaign);
    assert.ok(!("kind" in result));
    assert.equal(result.authority, "advisory_only");
    assert.equal(result.execution.state, "blocked");
    assert.equal(result.allocations[0]?.allocationId, "alloc_community_hardware");
  });

  it("ignores unknown additive fields", () => {
    const result = validatePublicCampaign({
      ...validPublicCampaign,
      extraPublicNote: "ignored",
    });
    assert.ok(!("kind" in result));
  });

  it("rejects non-objects as malformed", () => {
    const result = validatePublicCampaign(null);
    assert.ok("kind" in result);
    assert.equal(result.kind, "malformed");
    assert.equal(result.reason, "campaign.schema.root");
  });

  it("rejects wrong authority as policy_rejected", () => {
    const result = validatePublicCampaign({
      ...validPublicCampaign,
      authority: "public_aggregate_only",
    });
    assert.ok("kind" in result);
    assert.equal(result.kind, "policy_rejected");
    assert.equal(result.reason, "campaign.authority_rejected");
  });

  it("rejects unknown authority as policy_rejected", () => {
    const result = validatePublicCampaign({
      ...validPublicCampaign,
      authority: "operator_override",
    });
    assert.ok("kind" in result);
    assert.equal(result.kind, "policy_rejected");
  });

  it("rejects invented READY and freeze execution states", () => {
    for (const state of ["READY", "freeze"]) {
      const result = validatePublicCampaign({
        ...validPublicCampaign,
        execution: { state, reason: "not a published state" },
      });
      assert.ok("kind" in result);
      assert.equal(result.kind, "malformed");
      assert.equal(result.reason, "campaign.schema.execution.state");
    }
  });

  it("rejects missing execution reason as malformed", () => {
    const result = validatePublicCampaign({
      ...validPublicCampaign,
      execution: { state: "blocked" },
    });
    assert.ok("kind" in result);
    assert.equal(result.kind, "malformed");
  });

  it("rejects privacy flags that are not fail-closed", () => {
    const result = validatePublicCampaign({
      ...validPublicCampaign,
      privacy: {
        ...validPublicCampaign.privacy,
        piiAllowed: true,
      },
    });
    assert.ok("kind" in result);
    assert.equal(result.kind, "policy_rejected");
    assert.equal(result.reason, "campaign.privacy_policy_rejected");
  });

  it("rejects an invalid allocation id pattern", () => {
    const result = validatePublicCampaign({
      ...validPublicCampaign,
      allocations: [
        {
          allocationId: "donor_123",
          fundName: "Community Hardware Fund",
          status: "approved",
        },
      ],
    });
    assert.ok("kind" in result);
    assert.equal(result.kind, "malformed");
    assert.equal(result.reason, "campaign.schema.allocations.allocationId");
  });
});

describe("validatePublicImpact", () => {
  it("accepts a document with a VERIFIED outcome and allocationId", () => {
    const result = validatePublicImpact(validPublicImpact);
    assert.ok(!("kind" in result));
    assert.equal(result.outcome.participantsPublic, 18);
    assert.equal(result.outcome.evidenceState, "VERIFIED");
    assert.equal(result.outcome.allocationId, "alloc_community_hardware");
  });

  it("accepts VERIFIED outcomes without allocationId", () => {
    const outcome = { ...validPublicImpact.outcomes[0] };
    delete outcome.allocationId;
    const result = validatePublicImpact({
      ...validPublicImpact,
      outcomes: [outcome],
    });
    assert.ok(!("kind" in result));
    assert.equal(result.outcome.allocationId, null);
  });

  it("rejects wrong authority as policy_rejected", () => {
    const result = validatePublicImpact({
      ...validPublicImpact,
      authority: "advisory_only",
    });
    assert.ok("kind" in result);
    assert.equal(result.kind, "policy_rejected");
    assert.equal(result.reason, "impact.authority_rejected");
  });

  it("rejects missing VERIFIED outcome as policy_rejected", () => {
    const result = validatePublicImpact({
      ...validPublicImpact,
      outcomes: [
        {
          ...validPublicImpact.outcomes[0],
          evidenceState: "PENDING",
        },
      ],
    });
    assert.ok("kind" in result);
    assert.equal(result.kind, "policy_rejected");
    assert.equal(result.reason, "impact.missing_verified_outcome");
  });

  it("rejects an empty outcomes list as missing VERIFIED", () => {
    const result = validatePublicImpact({
      ...validPublicImpact,
      summary: { outcomeCount: 0, totalParticipantsPublic: 0 },
      outcomes: [],
    });
    assert.ok("kind" in result);
    assert.equal(result.kind, "policy_rejected");
    assert.equal(result.reason, "impact.missing_verified_outcome");
  });

  it("rejects malformed outcome fields", () => {
    const result = validatePublicImpact({
      ...validPublicImpact,
      outcomes: [
        {
          ...validPublicImpact.outcomes[0],
          participantsPublic: "eighteen",
        },
      ],
    });
    assert.ok("kind" in result);
    assert.equal(result.kind, "malformed");
    assert.equal(result.reason, "impact.schema.outcome.participantsPublic");
  });

  it("rejects privacy flags that are not fail-closed", () => {
    const result = validatePublicImpact({
      ...validPublicImpact,
      privacy: {
        ...validPublicImpact.privacy,
        donorNamesAllowed: true,
      },
    });
    assert.ok("kind" in result);
    assert.equal(result.kind, "policy_rejected");
    assert.equal(result.reason, "impact.privacy_policy_rejected");
  });
});
