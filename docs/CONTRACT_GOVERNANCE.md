# Contract governance (Phase C engineering draft)

This document is the Phase C index for the shared public narrative contracts. It is an **engineering draft**. It does not record leadership approval, READY, or a freeze SHA.

| Item | Status |
|------|--------|
| C1 Field owners | Recorded as continuation-plan roles; current operator `scrimshawlife-ctrl` / Danny |
| C2 Vocabulary / `allocationId` | Shared glossary + matching fixtures in this repo |
| C3 Public-data policy | **PROPOSED** — not approved |
| C4 Public-safe fixtures | Published and validated in this repo |
| C5 Versioning | Existing date-string + SPEC-012 language formalized; no version bump |
| Phase D | Still gated |

Related: [INTEGRATION_CONTRACTS.md](INTEGRATION_CONTRACTS.md) · [SUITE_GLOSSARY.md](SUITE_GLOSSARY.md) · [PUBLIC_DATA_POLICY.md](PUBLIC_DATA_POLICY.md) · [THREE_REPO_INTEGRATION.md](THREE_REPO_INTEGRATION.md) · [CONTINUATION_PLAN.md](CONTINUATION_PLAN.md)

Contract version: `2026-08-02` (`integration/contracts.ts`). Unchanged by this draft.

---

## C1 — Field ownership

Named in [INTEGRATION_CONTRACTS.md](INTEGRATION_CONTRACTS.md#c1--field-owners) and `integration/contracts.ts`.

Role seats (from the continuation plan):

| Role | Current human filling the seat |
|------|--------------------------------|
| Portfolio Signals owner | Danny (`scrimshawlife-ctrl`) |
| Impact Relay owner | Danny (`scrimshawlife-ctrl`) |
| AGI engineering | Danny (`scrimshawlife-ctrl`) |

No other people are named. This table is not a sign-off.

---

## C2 — Identifier and vocabulary alignment

Canonical glossary: [SUITE_GLOSSARY.md](SUITE_GLOSSARY.md) and `integration/glossary.ts`.

Matching fixtures in this repository use `allocationId: alloc_community_hardware` on:

- the narrative contract (`integration/fixtures.ts` and `integration/fixtures/community-hardware-narrative.json`)
- the public-campaign test document (`integration/public-document-fixtures.ts`)
- the public-impact test document (same file)

Live product semantics are unchanged. The build-time adapter still projects the published public-document slice and fail-closes as in Phase B.

---

## C3 — Public-data rules

Draft: [PUBLIC_DATA_POLICY.md](PUBLIC_DATA_POLICY.md).

**Status: PROPOSED.** Leadership and engineering sign-off have not been recorded.

---

## C4 — Representative fixtures

| Artifact | Location | Validates against |
|----------|----------|-------------------|
| Narrative TypeScript fixture | `integration/fixtures.ts` | `FundingDecision` / `ImpactEvent` |
| Narrative JSON fixture | `integration/fixtures/community-hardware-narrative.json` | same contracts |
| Public-campaign fixture | `integration/public-document-fixtures.ts` | published campaign shape |
| Public-impact fixture | `integration/public-document-fixtures.ts` | published impact shape |

No donor-level fields. Fund-Intel and Impact Relay still need matching published copies in those repositories; this PR does not claim they exist.

---

## C5 — Versioning and change management

Formalized in [INTEGRATION_CONTRACTS.md](INTEGRATION_CONTRACTS.md#change-management) and `CONTRACT_VERSIONING` in `integration/contracts.ts`.

- Narrative contracts: date-string `schemaVersion`. Compatibility break requires a new date string.
- Platform specification: SemVer per SPEC-012. This repo remains pinned at `1.0.0`.
- Public campaign/impact documents: their own `1.0.0` semver strings.
- Additive optional fields may keep the current narrative version if unknown fields stay ignorable.
- Fail-closed Phase B behavior must survive any bump.

This draft does not bump `2026-08-02`.

---

Last updated: 2026-08-15  
Status: **engineering draft — C3 PROPOSED, Phase D gated**
