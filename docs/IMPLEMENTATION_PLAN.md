# Implementation plan

This plan translates the roadmap into an engineering sequence. It is intentionally limited to the static, read-only public product.

## Current baseline

- Static Next.js export for Cloudflare Workers static assets (intended production); Vercel and GitHub Pages remain fallbacks until cutover.
- AGI visual system and reciprocal suite navigation.
- Deterministic contribution lifecycle.
- Build-time Portfolio Signals and Impact Relay public projections.
- Fail-closed fallback for unavailable or disallowed source data.
- CI for lint, typecheck, and production build.
- Platform pin **v2.0.0** (documentation pin, not READY). Login / Phase 2 / SPEC-028 runtime **PARKED**.
- Phase E design locked; E1–E7 implementation is the next public-site slice. C3 remains **PROPOSED**.

## Workstream 1 — Public-source reliability (Phase B)

Landed in [PR #5](https://github.com/Autonomous-Giving-Incorporated/Autonomous-Giving-Incorporated/pull/5). See [CONTINUATION_PLAN.md](CONTINUATION_PLAN.md) Phase B and [INTEGRATION_CONTRACTS.md](INTEGRATION_CONTRACTS.md).

1. Source freshness thresholds and clock assumptions (24 h soft / 7 d hard; build-time clock).
2. Runtime schema validation for both public documents (Fund-Intel schema + Impact-Relay public-impact shape).
3. Explicit `live`, `fallback`, `stale`, `malformed`, and `policy_rejected` states.
4. Deterministic tests for every selection and rejection path.
5. Accessible freshness and provenance copy without exposing payloads.
6. Privacy-safe build diagnostics (source, age, state, reason only).

## Workstream 2 — Contract governance (Phase C)

Engineering draft in this repository. C3 is **PROPOSED**, not approved. Phase D remains gated.

1. Name the owner of every shared field (continuation-plan roles; current operator recorded).
2. Reconcile allocation identifiers and status vocabulary across the suite (glossary + matching fixtures).
3. Draft public evidence, retention, redaction, and publication rules — approval still required.
4. Version incompatible contract changes (date-string bump required; no bump in this draft).
5. Maintain representative public-safe fixtures in this repository; other repos still need matching copies.

Cross-repository surface and checklist live in [THREE_REPO_INTEGRATION.md](THREE_REPO_INTEGRATION.md).

## Workstream 3 — Phase E public-site finish (not started as a complete slice)

Execution brief: [superpowers/specs/2026-08-16-autogive-app-finish-design.md](superpowers/specs/2026-08-16-autogive-app-finish-design.md). Pin **v2.0.0**. Login **PARKED**. Honest conformance. C3 remains **PROPOSED**. Not READY.

1. Shrink `platform-spec/conformance.yml` `implements` to SPEC-011/012/013; tracked-only IDs stay out of `implements`.
2. Replace the public demo with Community AI Lab / 25 laptops / 2500 USD and the required lifecycle order.
3. Keep donor identity off the public surface; keep the privacy regression test green.
4. Normative Specs links stay on v2.0.0; label floating `main` links non-normative.
5. Keep README / PLATFORM / login / admin copy on **PARKED** for login and SPEC-028 runtime.
6. Add `npm run conformance-check` with the design’s fail conditions; hook CI only when it can fail honestly.
7. Reviewed `nanoid` lockfile bump to `>=3.3.18`.

Do not start Phase D, auth, payments, or director JWT from this workstream.

## Workstream 4 — Release quality

1. Automate internal-link and Markdown checks.
2. Add focused tests for metadata and source selection.
3. Maintain desktop/mobile, keyboard, contrast, and reduced-motion smoke coverage.
4. Record material deployments in `RELEASES.md`.

## Definition of done

A change is complete when:

- behavior and documentation agree;
- data and authority boundaries remain fail-closed;
- lint, typecheck, Pages-mode build, and diff checks pass;
- relevant source and fallback states are exercised;
- accessibility and responsive behavior are reviewed for UI changes;
- the production release is linked to its commit, PR, CI, and deployment run.

Runtime APIs, accounts, payments, persistence, notifications, and unparking login / SPEC-028 require a new approved plan rather than an extension of these workstreams. Do not claim READY.
