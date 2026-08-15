# Implementation plan

This plan translates the roadmap into an engineering sequence. It is intentionally limited to the static, read-only public product.

## Current baseline

- Static Next.js export for Cloudflare Workers static assets (intended production); Vercel and GitHub Pages remain fallbacks until cutover.
- AGI visual system and reciprocal suite navigation.
- Deterministic contribution lifecycle.
- Build-time Portfolio Signals and Impact Relay public projections.
- Fail-closed fallback for unavailable or disallowed source data.
- CI for lint, typecheck, and production build.

## Workstream 1 — Public-source reliability (Phase B)

Landed. See [CONTINUATION_PLAN.md](CONTINUATION_PLAN.md) Phase B and [INTEGRATION_CONTRACTS.md](INTEGRATION_CONTRACTS.md).

1. Source freshness thresholds and clock assumptions (24 h soft / 7 d hard; build-time clock).
2. Runtime schema validation for both public documents (Fund-Intel schema + Impact-Relay public-impact shape).
3. Explicit `live`, `fallback`, `stale`, `malformed`, and `policy_rejected` states.
4. Deterministic tests for every selection and rejection path.
5. Accessible freshness and provenance copy without exposing payloads.
6. Privacy-safe build diagnostics (source, age, state, reason only).

## Workstream 2 — Contract governance (Phase C)

1. Name the owner of every shared field.
2. Reconcile allocation identifiers and status vocabulary across the suite.
3. Approve public evidence, retention, redaction, and publication rules.
4. Version incompatible contract changes.
5. Maintain representative public-safe fixtures in all affected repositories.

Cross-repository surface and checklist live in [THREE_REPO_INTEGRATION.md](THREE_REPO_INTEGRATION.md).

## Workstream 3 — Release quality

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

Runtime APIs, accounts, payments, persistence, and notifications require a new approved plan rather than an extension of these workstreams.
