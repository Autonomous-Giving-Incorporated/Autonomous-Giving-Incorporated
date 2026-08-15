import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { assessFreshness } from "./freshness.ts";
import {
  SOURCE_STATUS_DESCRIPTION,
  SOURCE_STATUS_LABEL,
  formatAge,
  freshnessSpokenLabel,
  freshnessVisualLabel,
  publicReasonCopy,
} from "./signal-copy.ts";

const NOW = Date.parse("2026-08-15T12:00:00.000Z");

describe("publicReasonCopy", () => {
  it("maps known reason codes to payload-free sentences", () => {
    assert.equal(
      publicReasonCopy("impact.missing_verified_outcome"),
      "Impact Relay did not publish a VERIFIED aggregate outcome.",
    );
    assert.equal(
      publicReasonCopy("http_non_2xx campaign=500 impact=200"),
      "A public source returned a non-success HTTP status.",
    );
    assert.match(
      publicReasonCopy("campaign.schema.execution.state") ?? "",
      /published public-campaign schema/,
    );
  });

  it("never echoes a raw payload or invented READY/freeze language", () => {
    const copy = [
      publicReasonCopy("campaign.authority_rejected"),
      publicReasonCopy("hard_stale"),
      publicReasonCopy("json_parse_failure"),
    ].join(" ");
    assert.doesNotMatch(copy, /\{/);
    assert.doesNotMatch(copy, /READY/);
    assert.doesNotMatch(copy, /freeze/);
    assert.doesNotMatch(copy, /receiptHash/);
  });
});

describe("status copy", () => {
  it("labels every explicit source state", () => {
    for (const state of [
      "live",
      "stale",
      "fallback",
      "malformed",
      "policy_rejected",
    ] as const) {
      assert.ok(SOURCE_STATUS_LABEL[state].length > 0);
      assert.ok(SOURCE_STATUS_DESCRIPTION[state].length > 0);
    }
  });

  it("tells screen readers that delayed data is not current evidence", () => {
    assert.match(SOURCE_STATUS_DESCRIPTION.stale, /not treated as current evidence/);
    const spoken = freshnessSpokenLabel(assessFreshness("2026-08-13", NOW));
    assert.match(spoken, /Delayed/);
    assert.match(spoken, /24-hour/);
  });
});

describe("age formatting", () => {
  it("uses readable units instead of compact jargon", () => {
    assert.equal(formatAge(30 * 60 * 1000), "less than 1 hour old");
    assert.equal(formatAge(2 * 60 * 60 * 1000), "2 hours old");
    assert.equal(formatAge(26 * 60 * 60 * 1000), "1 day old");
    assert.equal(formatAge(3 * 24 * 60 * 60 * 1000), "3 days old");
  });

  it("labels delayed visual copy honestly", () => {
    const visual = freshnessVisualLabel(assessFreshness("2026-08-13", NOW));
    assert.match(visual ?? "", /Delayed/);
  });
});
