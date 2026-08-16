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

## 2026-08-15 audit continuation — boundary reconciliation

The full evidence record is in [AGI_SPEC_AUDIT_2026-08-15.md](AGI_SPEC_AUDIT_2026-08-15.md).

Engineering direction for a later control-plane slice is recorded in [Specs ADR-014](https://github.com/Autonomous-Giving-Incorporated/Autonomous-Giving-Specs/blob/main/adr/ADR-014-agi-control-plane.md) (**non-normative** current-status; not the v2.0.0 pin) and [Specs architecture/secure-cross-repo-harness.md](https://github.com/Autonomous-Giving-Incorporated/Autonomous-Giving-Specs/blob/main/architecture/secure-cross-repo-harness.md) (**non-normative**). That slice is **PARKED**. AGI remains responsible for implementing and evidencing its own control-plane behavior when unparked; the proposed Specs contracts are not an AGI conformance claim.

**Public-site execution brief (2026-08-16):** [superpowers/specs/2026-08-16-autogive-app-finish-design.md](superpowers/specs/2026-08-16-autogive-app-finish-design.md). An implementer can run Phase E without director login. Do not claim READY. C3 stays **PROPOSED**.

### Audit verdict

The application tree is clean from unrelated projects such as Abraxas Orchestra, Hermes, OpenClaw, Enochian, and SafetyPass. Portfolio Signals / Fund-Intel, Impact Relay, Cloudflare, Supabase, and Zero State are intentional suite or builder references. The remaining risk after this slice is parked login / SPEC-028 runtime (not this public-site code) and C3 still **PROPOSED**. The public demo is Community AI Lab. The manifest `implements` list is the public narrative/projection only.

### Phase E — Conformance and boundary reconciliation

**Goal:** make AGI’s declared responsibility no broader than its evidence-backed public workbench while preserving suite integration boundaries.

**Status (2026-08-16):** Public-site E1–E7 code slice landed against [2026-08-16-autogive-app-finish-design.md](superpowers/specs/2026-08-16-autogive-app-finish-design.md). Login / Phase 2 / SPEC-028 runtime / Ed / director JWT is **PARKED**. Pin is **v2.0.0**. C3 is **PROPOSED**. This is not READY.

| ID | Task | Priority | Status | Exit evidence |
|----|------|----------|--------|---------------|
| E1 | Shrink `platform-spec/conformance.yml` `implements` to SPEC-011/012/013 only. Empty `contracts`/`events`. Keep SPEC-023/024/026/027/028 and CONTRACT-013 in `evidence.tracked` only. | P0 | Landed | Manifest IDs match the design YAML; no runtime capability is implied by a static projection. |
| E2 | Make Community AI Lab / 25 laptops / 2500 USD the canonical public `SPEC-011` demo with the required lifecycle order. Keep Hacker Dojo $250/18-attendee only as a labeled non-canonical integration fixture. | P0 | Landed | Demo test proves Community AI Lab and required stage order. |
| E3 | Remove `donor.name` and “Delivered to Jane” from the public deterministic demo. Neutral notification copy. Regression test required. | P0 | Landed; re-confirmed after E2 | Source and rendered-copy scan finds no donor identity on the public demo surface. |
| E4 | Keep the normative Specs pin at **v2.0.0**. Label floating `main` links non-normative. Do not revert to v1.0.0. Bump `CONTRACT_VERSIONING.platformSpecPin` to `2.0.0`. | P1 | Landed | Link audit distinguishes pinned authority from discovery/status links. |
| E5 | Record login / Phase 2 / SPEC-028 / Ed / director JWT as **PARKED** (2026-08-16 PT). Keep Fund-Intel execution steps in Fund-Intel. Do not write a new “operator-complete” evidence record. | P1 | Landed | README, platform docs, foundation status, and login/admin copy agree: **PARKED**. |
| E6 | Add `npm run conformance-check` that validates the manifest against the pinned v2.0.0 catalog and requires evidence paths. Do not fake a pass against overclaimed IDs. | P1 | Landed; hooked in CI after E1 | CI fails on unknown IDs, tracked IDs in `implements`, missing evidence, floating normative pins, or unsupported claims. |
| E7 | Upgrade transitive `nanoid` to `>=3.3.18` through a reviewed lockfile change. | P2 | Landed (`nanoid@3.3.18` in lockfile; `npm audit --omit=dev` clean) | `npm audit --omit=dev` has no high-severity finding, or an approved exception is documented. |

### Phase E guardrails

- Do not add a backend, database, authentication, payments, secrets, or runtime writes to the AGI public site to satisfy a conformance declaration.
- Do not merge Fund-Intel or Impact Relay application code into this repository.
- Keep public fixtures synthetic, aggregate-safe, and free of donor identity.
- Keep the platform pin at `Autonomous-Giving-Specs v2.0.0`. Do not revert to v1.0.0.
- Do not unpark login, SPEC-028 runtime, Ed, or director JWT from this repository.
- Do not claim C3 approved. Do not claim READY. Do not invent live Worker URLs or freeze SHAs.

### Phase E definition of done

Phase E is complete when the manifest, demo, privacy copy, documentation status, and tests tell the same story; login is unmistakably parked; the pin is v2.0.0; unrelated-project scans remain clean; lint, typecheck, tests, production build, and the conformance check pass; and every cross-repository responsibility links to its owning repository without duplicating its execution plan. See the design spec for the file-level checklist. Phase E done is **not** READY and **not** C3 approval.
