#!/usr/bin/env node
/**
 * Honest public-site conformance check. Exit 0 is not READY.
 * Fail table: docs/superpowers/specs/2026-08-16-autogive-app-finish-design.md §E6
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const TRACKED_ONLY = new Set([
  "SPEC-023",
  "SPEC-024",
  "SPEC-026",
  "SPEC-027",
  "SPEC-028",
  "CONTRACT-013",
]);

const SPEC011_EVIDENCE = [
  "demo/scenario.ts",
  "components/donation-demo.tsx",
  "integration/demo-scenario.test.ts",
];

const ID_PATTERN = /^(SPEC-[0-9]{3}[A-Z]?|CONTRACT-[0-9]{3}|EVENT-[0-9]{3})$/;
const PATH_PATTERN = /\.(md|ts|tsx|mjs|yml)$/;

const root = process.cwd();
const manifestPath = resolve(root, "platform-spec/conformance.yml");
const catalogPath = resolve(root, "platform-spec/ids-v2.0.0.json");
const text = readFileSync(manifestPath, "utf8");
const errors = [];

const version = text.match(/^\s+version:\s*([0-9]+\.[0-9]+\.[0-9]+)\s*$/m)?.[1];
if (version !== "2.0.0") {
  errors.push(`PIN: platform_spec.version is ${version ?? "missing"}, expected 2.0.0`);
}

if (
  !/^platform_spec:/m.test(text) ||
  !/^service:/m.test(text) ||
  !/^implements:/m.test(text)
) {
  errors.push("SCHEMA: missing required keys platform_spec, service, or implements");
}

const implementsBlock = text.split(/^evidence:\s*$/m)[0] ?? text;
const evidenceBlock = text.split(/^evidence:\s*$/m)[1] ?? "";
const implementsIds = [
  ...implementsBlock.matchAll(
    /^\s+-\s+(SPEC-[0-9]{3}[A-Z]?|CONTRACT-[0-9]{3}|EVENT-[0-9]{3})\s*$/gm,
  ),
].map((match) => match[1]);

const catalog = JSON.parse(readFileSync(catalogPath, "utf8"));
const knownIds = new Set([
  ...catalog.specs,
  ...catalog.contracts,
  ...catalog.events,
]);

for (const id of implementsIds) {
  if (!ID_PATTERN.test(id) || !knownIds.has(id)) {
    errors.push(`UNKNOWN_ID: ${id} is not in the v2.0.0 catalog`);
  }
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

const evidencePaths = [
  ...evidenceBlock.matchAll(/^\s+[a-z_]+:\s+(\S+)\s*$/gm),
]
  .map((match) => match[1])
  .filter((value) => PATH_PATTERN.test(value));

for (const relative of evidencePaths) {
  if (!existsSync(resolve(root, relative))) {
    errors.push(`MISSING_EVIDENCE: ${relative} is not a readable file`);
  }
}

if (implementsIds.includes("SPEC-011")) {
  for (const relative of SPEC011_EVIDENCE) {
    if (!existsSync(resolve(root, relative))) {
      errors.push(`MISSING_SPEC011_EVIDENCE: ${relative} is required when SPEC-011 is implemented`);
    }
  }
}

function walkMarkdown(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === "out" || entry === ".next") continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) walkMarkdown(full, files);
    else if (/\.(md|yml|yaml)$/.test(entry)) files.push(full);
  }
  return files;
}

const scanRoots = [
  resolve(root, "README.md"),
  resolve(root, "platform-spec"),
  resolve(root, "docs"),
];
const scanFiles = [];
for (const start of scanRoots) {
  if (!existsSync(start)) continue;
  if (statSync(start).isDirectory()) walkMarkdown(start, scanFiles);
  else scanFiles.push(start);
}

const specsMain = /github\.com\/Autonomous-Giving-Incorporated\/Autonomous-Giving-Specs\/(?:blob|tree)\/main\//;
for (const file of scanFiles) {
  const lines = readFileSync(file, "utf8").split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    if (!specsMain.test(lines[index])) continue;
    const nearby = `${lines[index]}\n${lines[index + 1] ?? ""}`;
    if (!/non-normative/i.test(nearby)) {
      errors.push(
        `FLOATING_NORMATIVE: ${file.replace(`${root}/`, "")}:${index + 1} Specs main link lacks a non-normative label`,
      );
    }
  }
}

function hasUnnegatedReady(source) {
  for (const line of source.split(/\n/)) {
    if (/\bREADY\b/.test(line) && !/not(?: a)? READY/i.test(line)) return true;
    if (/\bfreeze SHA\b/.test(line) && !/not a runtime freeze/i.test(line)) {
      return true;
    }
  }
  return false;
}

const readme = readFileSync(resolve(root, "platform-spec/README.md"), "utf8");
if (hasUnnegatedReady(evidenceBlock) || hasUnnegatedReady(readme)) {
  errors.push("READY_CLAIM: unnegated READY or freeze SHA claim in manifest notes or platform-spec/README.md");
}

if (errors.length > 0) {
  console.error("conformance-check failed (not READY):\n");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  "conformance-check passed pin, honest implements, evidence, and link gates. Not a READY claim.",
);
