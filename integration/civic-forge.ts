/**
 * AutoGive Synthetic Dataset v1 — Civic Forge narrative pack.
 *
 * Labeled SYNTHETIC_ONLY. Not the SPEC-011 demo, not the Hacker Dojo
 * reference tenant, and not a live public-source document.
 */

import { SUITE_ALLOCATION_IDS } from "./glossary.ts";

export const CIVIC_FORGE_CLASSIFICATION = "SYNTHETIC_ONLY" as const;
export const CIVIC_FORGE_DATASET = "autogive-synthetic-dataset";
export const CIVIC_FORGE_VERSION = "1.0.0";
export const CIVIC_FORGE_SEED = 20260821;
export const CIVIC_FORGE_TENANT_ID = "org_synthetic_civic_forge";
export const CIVIC_FORGE_CAMPAIGN_ID = "cmp_synthetic_builder_fund_2026";

export const CIVIC_FORGE_ALLOCATION_IDS = SUITE_ALLOCATION_IDS;

/** IR event types that validate as strings but are not in EVENT_TYPE_MAP. */
export const CIVIC_FORGE_UNMAPPED_EVENT_TYPES = [
  "EQUIPMENT_DEPLOYED",
  "SCHOLARSHIP_AWARDED",
  "FACILITY_REPAIR",
] as const;
