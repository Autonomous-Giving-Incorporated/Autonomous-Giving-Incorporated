import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { scenario } from "../demo/scenario.ts";
import {
  CIVIC_FORGE_ALLOCATION_IDS,
  CIVIC_FORGE_CAMPAIGN_ID,
  CIVIC_FORGE_CLASSIFICATION,
  CIVIC_FORGE_DATASET,
  CIVIC_FORGE_SEED,
  CIVIC_FORGE_TENANT_ID,
  CIVIC_FORGE_UNMAPPED_EVENT_TYPES,
  CIVIC_FORGE_VERSION,
} from "./civic-forge.ts";
import { SUITE_ALLOCATION_IDS, isAllocationId, mapEventType } from "./glossary.ts";
import {
  FUND_INTEL_PUBLIC_URL,
  IMPACT_RELAY_PUBLIC_URL,
  selectPublicSignals,
} from "./public-sources.ts";
import { validatePublicImpactNarrative } from "./validate-contracts.ts";
import { validatePublicCampaign, validatePublicImpact } from "./validate-public.ts";

const tenant = JSON.parse(
  readFileSync(new URL("./fixtures/civic-forge-tenant.json", import.meta.url), "utf8"),
) as {
  classification: string;
  dataset: string;
  version: string;
  seed: number;
  campaign_id: string;
  client_id: string;
  tenant_id: string;
  name: string;
  reference_tenant: boolean;
  canonical_demo: boolean;
  allocations: { allocationId: string; status: string }[];
};

const campaign = JSON.parse(
  readFileSync(
    new URL("./fixtures/civic-forge-public-campaign.json", import.meta.url),
    "utf8",
  ),
) as unknown;

const impact = JSON.parse(
  readFileSync(
    new URL("./fixtures/civic-forge-public-impact.json", import.meta.url),
    "utf8",
  ),
) as {
  source: string;
  outcomes: { eventType: string; allocationId: string; evidenceState: string }[];
};

const narrative = JSON.parse(
  readFileSync(
    new URL("./fixtures/civic-forge-narrative.json", import.meta.url),
    "utf8",
  ),
) as { classification: string; decision: unknown; events: unknown[] };

const BANNED = [
  "donor_alice",
  "Alice Patron",
  "Jane",
  "donorEmail",
  "donor_id",
  "OBSERVED",
  "READY",
];

function fixtureBlob(): string {
  return [
    readFileSync(new URL("./fixtures/civic-forge-tenant.json", import.meta.url), "utf8"),
    readFileSync(
      new URL("./fixtures/civic-forge-public-campaign.json", import.meta.url),
      "utf8",
    ),
    readFileSync(
      new URL("./fixtures/civic-forge-public-impact.json", import.meta.url),
      "utf8",
    ),
    readFileSync(new URL("./fixtures/civic-forge-narrative.json", import.meta.url), "utf8"),
  ].join("\n");
}

describe("Civic Forge synthetic v1 identity", () => {
  it("is a disposable second tenant beside Hacker Dojo", () => {
    assert.equal(tenant.classification, CIVIC_FORGE_CLASSIFICATION);
    assert.equal(tenant.dataset, CIVIC_FORGE_DATASET);
    assert.equal(tenant.version, CIVIC_FORGE_VERSION);
    assert.equal(tenant.seed, CIVIC_FORGE_SEED);
    assert.equal(tenant.campaign_id, CIVIC_FORGE_CAMPAIGN_ID);
    assert.equal(tenant.client_id, tenant.tenant_id);
    assert.equal(tenant.tenant_id, CIVIC_FORGE_TENANT_ID);
    assert.equal(tenant.reference_tenant, false);
    assert.equal(tenant.canonical_demo, false);
    assert.equal(tenant.name, "Civic Forge Makerspace");
  });

  it("is not the SPEC-011 public demo", () => {
    assert.equal(scenario.id, "community-ai-lab");
    assert.equal(scenario.organization.name, "Community AI Lab");
    assert.notEqual(scenario.organization.name, tenant.name);
    assert.notEqual(scenario.allocation.allocationId, tenant.allocations[0]?.allocationId);
  });

  it("keeps the four stable suite allocation IDs", () => {
    const ids = tenant.allocations.map((row) => row.allocationId);
    assert.deepEqual(ids, [...SUITE_ALLOCATION_IDS]);
    assert.deepEqual(ids, [...CIVIC_FORGE_ALLOCATION_IDS]);
    assert.ok(ids.every(isAllocationId));
    const programs = tenant.allocations.find(
      (row) => row.allocationId === "alloc_community_programs",
    );
    assert.equal(programs?.status, "proposed");
  });
});

describe("Civic Forge public documents", () => {
  it("validates the campaign shape without becoming the live source", () => {
    const result = validatePublicCampaign(campaign);
    assert.ok(!("kind" in result));
    assert.equal(result.authority, "advisory_only");
    assert.equal(result.execution.state, "review");
    assert.deepEqual(
      result.allocations.map((row) => row.allocationId),
      [...SUITE_ALLOCATION_IDS],
    );
    assert.match(FUND_INTEL_PUBLIC_URL, /\/data\/public-campaign\.json$/);
    assert.doesNotMatch(FUND_INTEL_PUBLIC_URL, /civic-forge|synthetic/);
  });

  it("validates the public-impact shape and keeps unmapped event types unmapped", () => {
    const result = validatePublicImpact(impact);
    assert.ok(!("kind" in result));
    assert.equal(result.authority, "public_aggregate_only");
    assert.equal(result.outcome.organizationName, "Civic Forge Makerspace");
    assert.equal(result.outcome.allocationId, "alloc_community_hardware");
    assert.equal(impact.source, "fixture:autogive-synthetic-v1");
    assert.equal(mapEventType("CLASS_HELD"), "program_held");
    for (const eventType of CIVIC_FORGE_UNMAPPED_EVENT_TYPES) {
      assert.equal(mapEventType(eventType), null, eventType);
      assert.ok(impact.outcomes.some((row) => row.eventType === eventType));
    }
    assert.ok(
      !impact.outcomes.some((row) => row.allocationId === "alloc_community_programs"),
    );
    assert.match(IMPACT_RELAY_PUBLIC_URL, /\/data\/public-impact\.json$/);
    assert.doesNotMatch(IMPACT_RELAY_PUBLIC_URL, /civic-forge|synthetic/);
  });

  it("accepts the hardware narrative on the existing contract version", () => {
    assert.equal(narrative.classification, CIVIC_FORGE_CLASSIFICATION);
    const result = validatePublicImpactNarrative({
      decision: narrative.decision,
      events: narrative.events,
    });
    assert.ok(!("kind" in result));
    assert.equal(result.decision.allocationId, "alloc_community_hardware");
    assert.equal(result.events.length, 3);
  });

  it("omits donor identity, OBSERVED, and READY from the fixture pack", () => {
    const blob = fixtureBlob();
    for (const bad of BANNED) {
      assert.equal(blob.includes(bad), false, bad);
    }
  });
});

describe("Civic Forge is not the fail-closed fallback", () => {
  it("keeps Community AI Lab as the only fallback projection", () => {
    const now = Date.parse("2026-08-22T12:00:00.000Z");
    const fallback = selectPublicSignals(
      { kind: "network" },
      { kind: "network" },
      now,
    );
    assert.equal(fallback.source, "fallback");
    assert.equal(fallback.impactRelay.organizationName, "Community AI Lab");
    assert.notEqual(fallback.impactRelay.organizationName, "Civic Forge Makerspace");
  });

  it("can project Civic Forge only when those documents are explicitly selected", () => {
    const now = Date.parse("2026-08-21T18:00:00.000Z");
    const selected = selectPublicSignals(
      { kind: "ok", body: campaign },
      { kind: "ok", body: impact },
      now,
    );
    assert.equal(selected.source, "live");
    assert.equal(selected.impactRelay.organizationName, "Civic Forge Makerspace");
    assert.equal(selected.fundIntel.executionState, "review");
  });
});
