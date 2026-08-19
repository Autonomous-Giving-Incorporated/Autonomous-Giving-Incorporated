import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  diagnosticContainsForbiddenKeys,
  formatDiagnosticLine,
  toDiagnostic,
} from "./diagnostics.ts";
import { assessFreshness } from "./freshness.ts";
import type { PublicSignals } from "./public-sources.ts";

const NOW = Date.parse("2026-08-15T12:00:00.000Z");

function sample(source: PublicSignals["source"], reason?: string): PublicSignals {
  return {
    source,
    reason,
    fundIntel: {
      updatedAt: "2026-08-14",
      executionState: "blocked",
      allocationId: "alloc_community_hardware",
      freshness: assessFreshness("2026-08-14", NOW),
    },
    impactRelay: {
      updatedAt: "2026-08-14",
      organizationName: "Community AI Lab",
      programName: "Neighborhood AI learning lab",
      allocationName: "Community Hardware Fund",
      allocationId: "alloc_community_hardware",
      participants: 25,
      verified: true,
      freshness: assessFreshness("2026-08-14", NOW),
    },
  };
}

describe("toDiagnostic", () => {
  it("reports source, age, freshness, and reason only", () => {
    const diagnostic = toDiagnostic(sample("stale", "soft_stale"));
    assert.equal(diagnostic.source, "stale");
    assert.equal(diagnostic.reason, "soft_stale");
    assert.equal(diagnostic.fundIntel.freshness, "stale");
    assert.ok(typeof diagnostic.fundIntel.ageMs === "number");
    assert.equal(diagnosticContainsForbiddenKeys(diagnostic), false);
    assert.equal("organizationName" in diagnostic.impactRelay, false);
    assert.equal("programName" in diagnostic.impactRelay, false);
    assert.equal("executionState" in diagnostic.fundIntel, false);
  });
});

describe("formatDiagnosticLine", () => {
  it("emits a single privacy-safe line", () => {
    const line = formatDiagnosticLine(sample("live"));
    assert.match(line, /^agi\.public_signals source=live /);
    assert.match(line, /fund_freshness=/);
    assert.match(line, /fund_age_ms=/);
    assert.match(line, /impact_freshness=/);
    assert.match(line, /impact_age_ms=/);
    assert.doesNotMatch(line, /Community AI Lab/);
    assert.doesNotMatch(line, /Neighborhood AI learning lab/);
    assert.doesNotMatch(line, /Hacker Dojo/);
    assert.doesNotMatch(line, /Intro to Robotics/);
    assert.doesNotMatch(line, /receiptHash/);
    assert.doesNotMatch(line, /alloc_community_hardware/);
  });

  it("includes the reason code and never a raw payload", () => {
    const line = formatDiagnosticLine(
      sample("policy_rejected", "impact.missing_verified_outcome"),
    );
    assert.match(line, /source=policy_rejected/);
    assert.match(line, /reason=impact.missing_verified_outcome/);
    assert.doesNotMatch(line, /\{/);
    assert.doesNotMatch(line, /participantsPublic/);
  });
});
