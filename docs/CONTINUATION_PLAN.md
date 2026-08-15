# Continuation plan

This plan starts from the deployed GitHub Pages experience. Every new capability must make the path from funding intent to verified impact more legible without overstating attribution or exposing private data.

## Current baseline

AGI is a static Next.js export. Intended production is Cloudflare Workers static assets at autogive.app; Vercel remains live until DNS cutover and GitHub Pages remains a fallback mirror. It includes a replayable deterministic scenario and reads two approved public aggregate documents during the build: a Portfolio Signals advisory state and an Impact Relay verified outcome. Invalid, unavailable, or unapproved source data falls back to the local canonical scenario.

The site does not collect donations, persist records, authenticate people, expose donor-level evidence, or perform write operations against either source system.

## Phase A — Launch hardening (complete)

**Goal:** make the current public experience dependable without expanding product scope.

- Keep canonical, sitemap, robots, favicon, and social-preview assets aligned with the GitHub Pages URL and current visual system.
- Complete a deployed desktop/mobile smoke test, keyboard-only demo replay, reduced-motion review, and metadata preview.
- Record the release owner, commit, deployment run, and verification timestamp.
- Add privacy-preserving analytics only after documenting a measurement question and privacy review.

**Exit criteria:** correct production metadata, a successful Pages deployment, a completed release record, and no new backend dependency.

**Status:** completed on 2026-08-02 through [PR #7](https://github.com/scrimshawlife-ctrl/Autonomous-Giving-Incorporated/pull/7). CI and the GitHub Pages deployment passed for the merged commit.

## Phase B — Public-source reliability (landed)

**Goal:** make the existing read-only source seam operationally explicit and testable.

### Engineering tasks

| ID | Task | Status |
|----|------|--------|
| B1 | Freshness thresholds and clock assumptions for both public documents | Landed: 24 h soft / 7 d hard; build-time `Date.now()`; date-only `updatedAt` is UTC midnight. Soft = project and label delayed. Hard = fail closed to the fixture. Documented in [INTEGRATION_CONTRACTS.md](INTEGRATION_CONTRACTS.md). |
| B2 | Runtime schema validation for both source documents | Landed: published Fund-Intel / Portfolio Signals public-campaign shape and Impact Relay public-impact shape in `integration/validate-public.ts`. Fail closed. Unknown authority rejected. Invented READY/freeze execution states rejected. |
| B3 | Explicit states `live` \| `fallback` \| `stale` \| `malformed` \| `policy_rejected` | Landed. Deterministic fixture is the only fallback content. |
| B4 | Deterministic tests for every selection and rejection path | Landed in `integration/public-sources.test.ts` (network, non-2xx, parse, wrong authority, missing VERIFIED, soft stale, hard stale, happy live). |
| B5 | Accessible provenance and freshness copy | Landed in `components/public-signals.tsx` and `integration/signal-copy.ts`. Screen-reader status, honest delay labels, no raw payloads. Status is not motion-only; reduced-motion already disables nonessential animation. |
| B6 | Privacy-safe build diagnostics | Landed: `formatDiagnosticLine` reports source, age, freshness, and reason only. Homepage logs that line at build time. |

**Exit criteria:** deterministic state coverage, reviewed freshness semantics, monitored fallback behavior, and accessible status copy.

**Status:** landed in [PR #5](https://github.com/Autonomous-Giving-Incorporated/Autonomous-Giving-Incorporated/pull/5). Phase C engineering draft follows. Phase D (runtime read-only host) is not started.

## Phase C — Contract governance

**Goal:** finish the organizational decisions around the existing versioned TypeScript contracts so the three repositories can share a stable public narrative vocabulary.

### Engineering / governance tasks

| ID | Task | Status |
|----|------|--------|
| C1 | Name ownership for every `FundingDecision` and `ImpactEvent` field | Engineering draft: role owners recorded in [INTEGRATION_CONTRACTS.md](INTEGRATION_CONTRACTS.md). Current human filling those seats: Danny (`scrimshawlife-ctrl`). Not a sign-off. |
| C2 | Align `allocationId` generation and status vocabulary across Fund-Intel, Impact-Relay, and AGI | Engineering draft: [SUITE_GLOSSARY.md](SUITE_GLOSSARY.md) + matching fixtures. Live adapter semantics unchanged. |
| C3 | Approve evidence-access, retention, redaction, and public-publication rules | **PROPOSED** draft in [PUBLIC_DATA_POLICY.md](PUBLIC_DATA_POLICY.md). Not approved. Leadership + eng sign-off still required. |
| C4 | Publish representative public-safe fixtures in all three repositories | This repo: narrative JSON/TS fixtures validate against the contracts. Impact Relay copies landed in [PR 5](https://github.com/Autonomous-Giving-Incorporated/Impact-Relay/pull/5) (`cfc611a0b12aca080b043959de4de5c5340628a4`, `fixtures/agi_phase_c/`). Fund-Intel / Portfolio Signals copies are still a follow-up. |
| C5 | Formalize contract versioning and change-management process | Formalized existing date-string + SPEC-012 language. Compatibility break requires a version bump. No bump in this draft. |

**Exit criteria:** reviewed schemas, approved public-data rules, deterministic fixtures, and named field owners.

**Status:** engineering draft in this repository. C3 is not approved. Phase C is not complete. Phase D remains gated.

## Phase D — Runtime read-only narrative

**Goal:** move beyond build-time public documents only when a runtime host and operational policy are approved.

- Add a narrow read-only server integration layer; do not introduce accounts, payments, or write operations.
- Preserve the canonical fallback and clear source/freshness labeling.
- Add loading, empty, delayed, and verification-failure states.
- Add structured observability with no sensitive data in logs.

**Exit criteria:** one production-safe runtime narrative, monitored fallback behavior, and an accessibility review.

**Gate:** Phase B and Phase C must be complete and the public contracts must be stable before any runtime work begins.

## Future — Authenticated products

Donor history, organization evidence workflows, payments, and notification delivery remain separately scoped workstreams. They require an approved threat model, consent and privacy review, retention policy, audit requirements, and service ownership before implementation.

## Decision gates

Pause or narrow scope if public data cannot be published safely, identifiers do not join reliably, verification semantics differ between systems, freshness cannot be explained honestly, or the experience implies one-to-one attribution that the evidence cannot support.

## Ownership and sequencing

| Area                                       | First owner             | Sequence |
| ------------------------------------------ | ----------------------- | -------- |
| Pages metadata and release verification    | AGI product/design      | Phase A  |
| Public-source freshness and fallback tests | AGI engineering         | Phase B  |
| Portfolio Signals decision contract               | Portfolio Signals owner        | Phase C  |
| Impact Relay event contract                | Impact Relay owner      | Phase C  |
| Runtime adapter and observability          | AGI engineering         | Phase D  |
| Auth, payments, and notifications          | Product/security owners | Future   |

See also [THREE_REPO_INTEGRATION.md](THREE_REPO_INTEGRATION.md) for the complete cross-repository surface and [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) for the engineering sequence.
