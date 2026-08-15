import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  assessFreshness,
  FRESHNESS_HARD_MS,
  FRESHNESS_SOFT_MS,
  isHardStale,
  isSoftStale,
  parseUpdatedAt,
} from "./freshness.ts";

const NOW = Date.parse("2026-08-15T12:00:00.000Z");

describe("parseUpdatedAt", () => {
  it("parses date-only as UTC midnight", () => {
    assert.equal(parseUpdatedAt("2026-08-14"), Date.parse("2026-08-14T00:00:00.000Z"));
  });

  it("parses full ISO timestamps", () => {
    assert.equal(
      parseUpdatedAt("2026-08-14T16:00:00.000Z"),
      Date.parse("2026-08-14T16:00:00.000Z"),
    );
  });

  it("returns null for empty or invalid values", () => {
    assert.equal(parseUpdatedAt(""), null);
    assert.equal(parseUpdatedAt("not-a-date"), null);
  });
});

describe("assessFreshness", () => {
  it("labels fresh data within the soft window", () => {
    const updatedAt = new Date(NOW - FRESHNESS_SOFT_MS + 60_000).toISOString();
    const result = assessFreshness(updatedAt, NOW);
    assert.equal(result.label, "fresh");
    assert.ok(result.ageMs !== null && result.ageMs < FRESHNESS_SOFT_MS);
  });

  it("labels stale data past the soft window and within the hard window", () => {
    const updatedAt = new Date(NOW - FRESHNESS_SOFT_MS - 60_000).toISOString();
    const result = assessFreshness(updatedAt, NOW);
    assert.equal(result.label, "stale");
    assert.equal(isSoftStale(result.label), true);
    assert.equal(isHardStale(result.label), false);
  });

  it("labels very_stale data past the hard window", () => {
    const updatedAt = new Date(NOW - FRESHNESS_HARD_MS - 60_000).toISOString();
    const result = assessFreshness(updatedAt, NOW);
    assert.equal(result.label, "very_stale");
    assert.equal(isHardStale(result.label), true);
  });

  it("labels unknown when the timestamp cannot be parsed", () => {
    const result = assessFreshness("bogus", NOW);
    assert.equal(result.label, "unknown");
    assert.equal(result.ageMs, null);
    assert.equal(isHardStale(result.label), true);
  });
});

describe("freshness helpers", () => {
  it("treats only the soft window as soft-stale", () => {
    assert.equal(isSoftStale("fresh"), false);
    assert.equal(isSoftStale("stale"), true);
    assert.equal(isSoftStale("very_stale"), false);
    assert.equal(isSoftStale("unknown"), false);
  });
});
