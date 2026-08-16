import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { scenario } from "../demo/scenario.ts";

const FORBIDDEN_KEYS = new Set([
  "donor",
  "donor.name",
  "donorName",
  "donor_id",
  "donorId",
  "donorEmail",
]);

const PUBLIC_DEMO_SOURCES = [
  new URL("../demo/scenario.ts", import.meta.url),
  new URL("../components/donation-demo.tsx", import.meta.url),
  new URL("../app/page.tsx", import.meta.url),
];

function collectKeys(value: unknown): string[] {
  const keys: string[] = [];
  const walk = (node: unknown) => {
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (node && typeof node === "object") {
      for (const [key, nested] of Object.entries(node)) {
        keys.push(key);
        walk(nested);
      }
    }
  };
  walk(value);
  return keys;
}

describe("public demo privacy", () => {
  it("omits donor identity fields from the public scenario object", () => {
    const keys = collectKeys(scenario);
    for (const key of keys) {
      assert.equal(FORBIDDEN_KEYS.has(key), false, key);
    }
    assert.equal("donor" in scenario, false);
  });

  it("rejects Jane, Delivered to, and donor identity in public demo sources", () => {
    const combined = PUBLIC_DEMO_SOURCES.map((url) =>
      readFileSync(url, "utf8"),
    ).join("\n");
    assert.doesNotMatch(combined, /\bJane\b/);
    assert.doesNotMatch(combined, /Delivered to /);
    assert.doesNotMatch(combined, /donor\.name/);
    assert.doesNotMatch(combined, /donorName/);
    assert.doesNotMatch(combined, /donorEmail/);
    assert.match(combined, /Notification delivered/);
  });
});
