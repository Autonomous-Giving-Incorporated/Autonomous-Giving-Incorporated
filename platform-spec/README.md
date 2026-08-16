# Platform specification pin

This repository **pins** the Autonomous Giving Platform Specification at:

| Field | Value |
| --- | --- |
| Repository | [Autonomous-Giving-Incorporated/Autonomous-Giving-Specs](https://github.com/Autonomous-Giving-Incorporated/Autonomous-Giving-Specs) |
| Version | **2.0.0** |
| Release | https://github.com/Autonomous-Giving-Incorporated/Autonomous-Giving-Specs/releases/tag/v2.0.0 |
| Published tag commit | `c089739` (release target of tag `v2.0.0`; not a runtime freeze receipt) |
| Service role | Governance surface (`autonomous-giving`) |

Do **not** track floating `main` of the specs repository for production behavior. Consume the tagged release package or git tag `v2.0.0`.

This pin is a **documentation alignment**. It is not a READY claim, not runtime conformance, and does not invent live workers.dev URLs, live gifts, or leadership sign-off.

## Manifest

[`conformance.yml`](conformance.yml) declares the platform artifacts this product surface aligns with. Schema:

https://github.com/Autonomous-Giving-Incorporated/Autonomous-Giving-Specs/blob/v2.0.0/schemas/meta/conformance-manifest.schema.json

### Docs pin vs implemented

**E1 not landed.** `implements` still overclaims. The locked target is SPEC-011/012/013 only, with empty `contracts`/`events`. SPEC-023/024/026/027/028 and CONTRACT-013 stay in `evidence.tracked` only. See [2026-08-16-autogive-app-finish-design.md](../docs/superpowers/specs/2026-08-16-autogive-app-finish-design.md). `npm run conformance-check` is an honest stub and **exits 1** until E1 shrinks the YAML. This is not a READY claim.

| Artifact | Status on this public site |
| --- | --- |
| SPEC-001, SPEC-002, SPEC-004–008, SPEC-011–013 | Documented alignment for the static workbench and public narrative |
| [SPEC-023](https://github.com/Autonomous-Giving-Incorporated/Autonomous-Giving-Specs/blob/v2.0.0/specs/SPEC-023-financial-ledger-invariants.md) tracking ledger | **Tracked.** Money lock observed here (AGI never processes donations). This site does not run a tracking ledger. |
| [SPEC-024](https://github.com/Autonomous-Giving-Incorporated/Autonomous-Giving-Specs/blob/v2.0.0/specs/SPEC-024-integration-boundaries.md) every.org P0 / Stripe billing-only | **Tracked.** Boundary only. This site has no Stripe and no donation connector. |
| [SPEC-026](https://github.com/Autonomous-Giving-Incorporated/Autonomous-Giving-Specs/blob/v2.0.0/specs/SPEC-026-donation-source-connectors.md) connectors | **Tracked.** P0 every.org lives in [Portfolio Signals](https://github.com/Autonomous-Giving-Incorporated/Portfolio-Signals) allocation middleware, not this static export. |
| [SPEC-027](https://github.com/Autonomous-Giving-Incorporated/Autonomous-Giving-Specs/blob/v2.0.0/specs/SPEC-027-impact-loop.md) impact loop | **Tracked.** Not implemented on this public site. |
| [SPEC-028](https://github.com/Autonomous-Giving-Incorporated/Autonomous-Giving-Specs/blob/v2.0.0/specs/SPEC-028-agi-control-plane.md) control plane | **Tracked.** This repo is the public workbench, not an authenticated control plane. Operator auth stays on Portfolio Signals workspace. |
| [CONTRACT-013](https://github.com/Autonomous-Giving-Incorporated/Autonomous-Giving-Specs/blob/v2.0.0/contracts/CONTRACT-013-impact-notice.md) ImpactNotice | **Tracked** in evidence only (not produced or consumed at runtime here). Impact Relay is the producer. |

## Boundary note

AGI’s public site explains the funding-to-evidence journey and fails closed on public aggregates. Allocation and Approval **authority** remain governed by platform rules (human approval before allocation). This site does not move money or store donor PII.

**Money lock:** AGI never processes donations. Stripe is tenant/SaaS billing only (unused on this site). Gift tracking is third-party connectors (P0 every.org).

**Host lock:** Cloudflare + existing Supabase. Render / Fly / Railway / Cloud Run are historical or optional only, not the target.

## Updating the pin

1. Review the specs release notes and migration guide.
2. Bump `platform_spec.version` in `conformance.yml`.
3. Confirm public narrative and demo scenario still match the pinned lifecycle and glossary.
