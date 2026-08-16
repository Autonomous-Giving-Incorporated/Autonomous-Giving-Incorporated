#!/usr/bin/env node
/**
 * Phase E stub. Fails while implements still overclaims.
 * Do not treat a future exit 0 as READY. Full fail table:
 * docs/superpowers/specs/2026-08-16-autogive-app-finish-design.md §E6
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const TRACKED_ONLY = new Set([
  "SPEC-023",
  "SPEC-024",
  "SPEC-026",
  "SPEC-027",
  "SPEC-028",
  "CONTRACT-013",
]);

const manifestPath = resolve("platform-spec/conformance.yml");
const text = readFileSync(manifestPath, "utf8");
const errors = [];

const version = text.match(/^\s+version:\s*([0-9]+\.[0-9]+\.[0-9]+)\s*$/m)?.[1];
if (version !== "2.0.0") {
  errors.push(`PIN: platform_spec.version is ${version ?? "missing"}, expected 2.0.0`);
}

const implementsBlock = text.split(/^evidence:\s*$/m)[0] ?? text;
const implementsIds = [
  ...implementsBlock.matchAll(/^\s+-\s+(SPEC-[0-9]{3}[A-Z]?|CONTRACT-[0-9]{3}|EVENT-[0-9]{3})\s*$/gm),
].map((match) => match[1]);

for (const id of implementsIds) {
  if (TRACKED_ONLY.has(id)) {
    errors.push(`TRACKED_IN_IMPLEMENTS: ${id} must stay under evidence.tracked only`);
  }
}

const hasContractIds = /contracts:[\s\S]*?(produces|consumes):[\s\S]*?-\s+CONTRACT-/.test(
  implementsBlock,
);
const hasEventIds = /events:[\s\S]*?(produces|consumes):[\s\S]*?-\s+EVENT-/.test(
  implementsBlock,
);
if (hasContractIds) {
  errors.push("OVERCLAIM_CONTRACTS: implements.contracts must be empty on this public site");
}
if (hasEventIds) {
  errors.push("OVERCLAIM_EVENTS: implements.events must be empty on this public site");
}

if (errors.length > 0) {
  console.error("conformance-check failed (honest stub; not READY):\n");
  for (const error of errors) console.error(`- ${error}`);
  console.error(
    "\nShrink implements per docs/superpowers/specs/2026-08-16-autogive-app-finish-design.md E1.",
  );
  process.exit(1);
}

console.log("conformance-check passed pin and honest-implements gates. Not a READY claim.");
