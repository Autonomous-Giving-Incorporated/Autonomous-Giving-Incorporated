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

1. Define source freshness thresholds and clock assumptions.
2. Add runtime schema validation for both public documents (Fund-Intel schema + Impact-Relay public-impact shape).
3. Represent `live`, `fallback`, `stale`, `malformed`, and `policy_rejected` as explicit internal states.
4. Add deterministic tests for every selection and rejection path.
5. Render accessible freshness and provenance copy without exposing payloads.
6. Document privacy-safe build diagnostics.

See the detailed task table in [CONTINUATION_PLAN.md](CONTINUATION_PLAN.md).

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
