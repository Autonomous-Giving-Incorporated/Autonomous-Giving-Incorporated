import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  validPublicCampaign,
  validPublicImpact,
} from "./public-document-fixtures.ts";
import {
  FUND_INTEL_PUBLIC_URL,
  IMPACT_RELAY_PUBLIC_URL,
  getPublicSignals,
  selectPublicSignals,
} from "./public-sources.ts";

const FIXTURE_ALLOCATION_ID = "alloc_community_hardware";
const FIXTURE_PUBLISHED_AT = "2026-08-02T16:00:00.000Z";
const FIXTURE_FUND_NAME = "Community Hardware Fund";

const NOW = Date.parse("2026-08-15T12:00:00.000Z");
const FRESH_DATE = "2026-08-15";
const SOFT_STALE_DATE = "2026-08-13";
const HARD_STALE_DATE = "2026-08-01";

function campaign(overrides: Record<string, unknown> = {}) {
  return { ...validPublicCampaign, updatedAt: FRESH_DATE, ...overrides };
}

function impact(overrides: Record<string, unknown> = {}) {
  return { ...validPublicImpact, updatedAt: FRESH_DATE, ...overrides };
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function fetchImplFor(map: {
  campaign?: Response | Error | "invalid-json";
  impact?: Response | Error | "invalid-json";
}): typeof fetch {
  return async (input) => {
    const url = String(input);
    const which = url.includes("public-campaign") ? "campaign" : "impact";
    const value = map[which];
    if (value instanceof Error) throw value;
    if (value === "invalid-json") {
      return new Response("{not-json", {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }
    if (!value) {
      throw new Error(`unexpected fetch ${url}`);
    }
    return value;
  };
}

describe("selectPublicSignals happy path", () => {
  it("returns live when both documents are valid, authorized, verified, and fresh", () => {
    const result = selectPublicSignals(
      { kind: "ok", body: campaign() },
      { kind: "ok", body: impact() },
      NOW,
    );
    assert.equal(result.source, "live");
    assert.equal(result.reason, undefined);
    assert.equal(result.fundIntel.executionState, "blocked");
    assert.equal(result.fundIntel.allocationId, "alloc_community_hardware");
    assert.equal(result.impactRelay.verified, true);
    assert.equal(result.impactRelay.participants, 18);
    assert.equal(result.impactRelay.allocationId, "alloc_community_hardware");
    assert.notEqual(result.fundIntel.updatedAt, FIXTURE_PUBLISHED_AT);
  });
});

describe("selectPublicSignals rejection paths", () => {
  it("returns fallback on network failure", () => {
    const result = selectPublicSignals(
      { kind: "network" },
      { kind: "ok", body: impact() },
      NOW,
    );
    assert.equal(result.source, "fallback");
    assert.equal(result.reason, "network_failure");
    assert.equal(result.fundIntel.allocationId, FIXTURE_ALLOCATION_ID);
    assert.equal(result.impactRelay.programName, "Intro to Robotics");
  });

  it("returns fallback on non-2xx", () => {
    const result = selectPublicSignals(
      { kind: "http", status: 404 },
      { kind: "ok", body: impact() },
      NOW,
    );
    assert.equal(result.source, "fallback");
    assert.equal(result.reason, "http_non_2xx campaign=404 impact=200");
    assert.equal(result.impactRelay.allocationName, FIXTURE_FUND_NAME);
  });

  it("returns malformed on JSON parse failure", () => {
    const result = selectPublicSignals(
      { kind: "parse" },
      { kind: "ok", body: impact() },
      NOW,
    );
    assert.equal(result.source, "malformed");
    assert.equal(result.reason, "json_parse_failure");
    assert.equal(result.fundIntel.updatedAt, FIXTURE_PUBLISHED_AT);
  });

  it("returns policy_rejected on wrong campaign authority", () => {
    const result = selectPublicSignals(
      { kind: "ok", body: campaign({ authority: "operator_override" }) },
      { kind: "ok", body: impact() },
      NOW,
    );
    assert.equal(result.source, "policy_rejected");
    assert.equal(result.reason, "campaign.authority_rejected");
  });

  it("returns policy_rejected on wrong impact authority", () => {
    const result = selectPublicSignals(
      { kind: "ok", body: campaign() },
      { kind: "ok", body: impact({ authority: "advisory_only" }) },
      NOW,
    );
    assert.equal(result.source, "policy_rejected");
    assert.equal(result.reason, "impact.authority_rejected");
  });

  it("returns policy_rejected when no VERIFIED outcome is present", () => {
    const result = selectPublicSignals(
      { kind: "ok", body: campaign() },
      {
        kind: "ok",
        body: impact({
          outcomes: [
            { ...validPublicImpact.outcomes[0], evidenceState: "PENDING" },
          ],
        }),
      },
      NOW,
    );
    assert.equal(result.source, "policy_rejected");
    assert.equal(result.reason, "impact.missing_verified_outcome");
  });

  it("returns stale when a source is past the 24-hour soft window", () => {
    const result = selectPublicSignals(
      { kind: "ok", body: campaign({ updatedAt: SOFT_STALE_DATE }) },
      { kind: "ok", body: impact() },
      NOW,
    );
    assert.equal(result.source, "stale");
    assert.equal(result.reason, "soft_stale");
    assert.equal(result.fundIntel.freshness.label, "stale");
    assert.equal(result.fundIntel.updatedAt, SOFT_STALE_DATE);
    assert.equal(result.impactRelay.participants, 18);
  });

  it("returns fallback when a source is past the seven-day hard window", () => {
    const result = selectPublicSignals(
      { kind: "ok", body: campaign({ updatedAt: HARD_STALE_DATE }) },
      { kind: "ok", body: impact() },
      NOW,
    );
    assert.equal(result.source, "fallback");
    assert.equal(result.reason, "hard_stale");
    assert.equal(result.fundIntel.allocationId, FIXTURE_ALLOCATION_ID);
    assert.notEqual(result.fundIntel.updatedAt, HARD_STALE_DATE);
  });

  it("returns malformed when the campaign schema does not match", () => {
    const result = selectPublicSignals(
      { kind: "ok", body: { authority: "advisory_only", updatedAt: FRESH_DATE } },
      { kind: "ok", body: impact() },
      NOW,
    );
    assert.equal(result.source, "malformed");
    assert.match(result.reason ?? "", /^campaign\.schema\./);
  });
});

describe("getPublicSignals fetch adapter", () => {
  it("projects the live path through fetchImpl", async () => {
    const result = await getPublicSignals({
      nowMs: NOW,
      fetchImpl: fetchImplFor({
        campaign: jsonResponse(campaign()),
        impact: jsonResponse(impact()),
      }),
    });
    assert.equal(result.source, "live");
  });

  it("maps a thrown fetch to network_failure", async () => {
    const result = await getPublicSignals({
      nowMs: NOW,
      fetchImpl: fetchImplFor({
        campaign: new Error("socket hang up"),
        impact: jsonResponse(impact()),
      }),
    });
    assert.equal(result.source, "fallback");
    assert.equal(result.reason, "network_failure");
  });

  it("maps invalid JSON to malformed", async () => {
    const result = await getPublicSignals({
      nowMs: NOW,
      fetchImpl: fetchImplFor({
        campaign: "invalid-json",
        impact: jsonResponse(impact()),
      }),
    });
    assert.equal(result.source, "malformed");
    assert.equal(result.reason, "json_parse_failure");
  });

  it("uses the documented source URLs", async () => {
    const seen: string[] = [];
    await getPublicSignals({
      nowMs: NOW,
      fetchImpl: async (input) => {
        seen.push(String(input));
        return jsonResponse(
          String(input).includes("public-campaign") ? campaign() : impact(),
        );
      },
    });
    assert.deepEqual(seen, [FUND_INTEL_PUBLIC_URL, IMPACT_RELAY_PUBLIC_URL]);
  });
});
