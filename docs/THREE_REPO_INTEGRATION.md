# Three-Repo Integration Surface

This document is the canonical cross-repository integration list for the Autonomously Giving Incorporated suite.

| Repository | Role | Public surface consumed by AGI |
|------------|------|--------------------------------|
| **Autonomous-Giving-Incorporated** (AGI) | Public explanatory workbench and narrative layer | — |
| **Portfolio-Signals** | Decision workspace + public advisory campaign state | `data/public-campaign.json` |
| **Impact-Relay** | Ledger, evidence, impact receipts, public aggregate outcomes | `data/public-impact.json` |

AGI public workbench is deliberately the thinnest and most constrained surface today. It never writes, never authenticates, and never sees donor-level data.

## Allocation middleware (authenticated client ops)

The **allocation middleware** product ([PRODUCT-ALLOCATION-MIDDLEWARE.md](PRODUCT-ALLOCATION-MIDDLEWARE.md)) is a separate client-ops surface that authenticates and writes tenant data. It is **not** the current public AGI workbench.

**Status:** MVP implemented in [Portfolio Signals `services/allocation-middleware/`](https://github.com/Autonomous-Giving-Incorporated/Portfolio-Signals/tree/main/services/allocation-middleware) (Hacker Dojo pilot seed, Supabase director login, every.org webhook). Named host + live webhook are operator steps.

| Concern | Public AGI workbench (now) | Allocation middleware (MVP) |
| --- | --- | --- |
| Auth | None | Supabase director / campaign_lead JWT (operator token fallback) |
| Money path | Narrative only | every.org gift summaries → pots → allocation |
| Writes | None | Pots, allocations, exceptions, proof links |
| Host | Cloudflare Workers static assets (Vercel until DNS cutover) | Cloudflare + existing Supabase (auth/data); not Render/Fly/Railway |
| Specs | Pin v2.0.0 (docs pin; not READY) | Capability-first modular monolith |

Cross-repo implementation should keep **public aggregate JSON** contracts stable while middleware modules map to Portfolio Signals (observe/credit), Autonomous Giving (allocate/approve), and Impact Relay (proof/trail) **capabilities**—not three mandatory deployables.

## Current live integration (build-time only)

| Source | Exact URL | Required authority | Required content | Failure behavior |
|--------|-----------|--------------------|------------------|------------------|
| Portfolio Signals | `https://raw.githubusercontent.com/Autonomous-Giving-Incorporated/Portfolio-Signals/main/data/public-campaign.json` | `advisory_only` | `updatedAt` + `execution.state` | Fail closed → deterministic fixture |
| Impact-Relay | `https://raw.githubusercontent.com/Autonomous-Giving-Incorporated/Impact-Relay/main/data/public-impact.json` | `public_aggregate_only` | At least one outcome with `evidenceState: "VERIFIED"` | Fail closed → deterministic fixture |

Implementation: `integration/public-sources.ts`.

## Shared public contracts (versioned)

Defined in AGI `integration/contracts.ts` (version `2026-08-02`):

- `FundingDecision` — allocationId, fundName, rationale, status, publishedAt
- `ImpactEvent` — allocationId, eventId, type, occurredAt, verificationStatus, optional public-safe evidenceReference
- `PublicImpactNarrative` — decision + ordered events

These contracts are the intended governed seam. The current public-source adapter still projects a narrower slice; full remote deserialization is Phase D work and remains gated.

## Full integration checklist

### A. Public data contracts (must stay stable)

- [ ] Portfolio Signals continues publishing `authority: "advisory_only"`
- [ ] Impact-Relay continues publishing `authority: "public_aggregate_only"`
- [ ] Impact-Relay always has at least one `evidenceState: "VERIFIED"` outcome when live projection is desired
- [ ] Both documents remain free of PII, donor identity, contact data, and private evidence URLs
- [ ] Schema validation is enforced in each source repository’s CI

### B. Identifier and vocabulary alignment (Phase C)

Engineering draft in AGI. C3 is **PROPOSED**, not approved. Phase D stays gated.

- [x] Shared definition of `allocationId` (generation rules + format) — AGI [SUITE_GLOSSARY.md](SUITE_GLOSSARY.md); matching fixtures only
- [x] Shared status / verification vocabulary mapped across the three systems — same glossary; unmapped values are not coerced
- [x] Named field owners for every contract field — continuation-plan roles in [INTEGRATION_CONTRACTS.md](INTEGRATION_CONTRACTS.md); current operator `scrimshawlife-ctrl` / Danny
- [x] Representative public-safe fixtures published in all three repositories — AGI fixtures published and validated; Impact Relay copies landed in [PR 5](https://github.com/Autonomous-Giving-Incorporated/Impact-Relay/pull/5) (`fixtures/agi_phase_c/`); Portfolio Signals copies landed in [PR 34](https://github.com/Autonomous-Giving-Incorporated/Portfolio-Signals/pull/34)
- [x] Contract version bump process documented — date-string bump on compatibility break; SPEC-012 SemVer unchanged for the platform pin
- [ ] C3 evidence-access / retention / redaction / publication rules approved — draft is [PUBLIC_DATA_POLICY.md](PUBLIC_DATA_POLICY.md) (**PROPOSED**)

### C. Reliability & observability (Phase B)

- [x] Freshness thresholds defined and documented (24 h soft / 7 d hard)
- [x] Explicit states: live / fallback / stale / malformed / policy_rejected
- [x] Runtime schema validation in AGI build
- [x] Deterministic tests covering every rejection path
- [x] Privacy-safe build diagnostics (no payload leakage)
- [x] Accessible provenance labels in the AGI UI

### D. Navigation and identity consistency

- [ ] Reciprocal suite navigation links remain correct on all three public surfaces
- [ ] Shared design tokens / visual language stay coherent (AGI tokens.css is the public reference)
- [ ] Canonical production origins documented (`autogive.app` family)

### E. Explicit non-integrations (do not implement inside AGI)

- Authentication / user accounts
- Payment processing or donation collection
- Runtime writes to Portfolio Signals or Impact-Relay
- Donor-level or private evidence access
- Notification delivery
- Direct Supabase or Postgres connections from AGI

### F. Future runtime path (Phase D gate)

Only after B + C are complete and a separate architecture review is approved:

- Narrow read-only server adapter
- Same fail-closed + freshness labeling rules
- No expansion of authority or data scope

## Source ownership summary

| Concern | Primary owner |
|---------|---------------|
| Public campaign advisory document | Portfolio Signals |
| Public verified impact outcomes | Impact-Relay |
| Narrative presentation + fail-closed projection | AGI |
| Shared contract vocabulary + allocationId rules | Joint (all three); AGI glossary draft in [SUITE_GLOSSARY.md](SUITE_GLOSSARY.md) |
| Public-data / retention / redaction policy | Leadership + all three eng leads; AGI draft is **PROPOSED** in [PUBLIC_DATA_POLICY.md](PUBLIC_DATA_POLICY.md) |

## Change control

Any change that affects the public JSON shapes, authority values, or contract fields must:

1. Update the relevant schema or TypeScript contract
2. Update fixtures in the affected repositories
3. Bump the contract version if compatibility is broken
4. Update this document and the AGI INTEGRATION_CONTRACTS.md
5. Keep the AGI fail-closed path intact

---

Last updated: 2026-08-17
Related: [INTEGRATION_CONTRACTS.md](INTEGRATION_CONTRACTS.md) · [ARCHITECTURE.md](ARCHITECTURE.md) · [CONTINUATION_PLAN.md](CONTINUATION_PLAN.md) · [suite stack audit](SUITE_STACK_AUDIT_2026-08-17.md)
