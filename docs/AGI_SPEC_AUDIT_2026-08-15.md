# AGI vs Specs and contamination audit

**Audit date:** 2026-08-15  
**Repository:** `Autonomous-Giving-Incorporated/Autonomous-Giving-Incorporated`  
**Audited revision:** `71c2e42d0858bc36c50b6bd3bfadd7899545a0ce` (`main`)  
**Pinned platform release:** `Autonomous-Giving-Specs` `v1.0.0`

## Executive verdict

The AGI repository is **not contaminated at the application-code or dependency level** by Abraxas Orchestra, Hermes, OpenClaw, Enochian, SafetyPass, or other unrelated projects. The current tree contains the expected AGI suite references to Portfolio Signals / Fund-Intel, Impact Relay, Cloudflare, Supabase, and Zero State. Those are explicitly part of the AGI product and design boundary.

It **does have boundary and specification drift** that can look like contamination from the neighboring suite projects:

1. The conformance manifest claims canonical lifecycle contracts and events that this static public repository does not implement.
2. The public demo uses a Hacker Dojo / Raspberry Pi / 18-student scenario, while canonical `SPEC-011` requires the Community AI Lab / 25-laptop scenario and a complete lifecycle order.
3. The deterministic demo contains a donor name (`Jane`) and renders “Delivered to Jane”, which conflicts with the repository’s donor-privacy boundary even though the data is synthetic.
4. AGI documentation includes Fund-Intel operational plans and floating `Autonomous-Giving-Specs` `main` links despite pinning production conformance to `v1.0.0`.
5. README status says Phase 2 is operator-complete while the platform-foundation spec and platform docs still record migration/login work as operator-pending.

These are documentation, governance, demo-contract, and privacy-hygiene issues. They are not evidence that unrelated product source code was copied into AGI.

## Evidence reviewed

- AGI `main` tree and history through `71c2e42`.
- `README.md`, `AGENTS.md`, `docs/ARCHITECTURE.md`, `docs/CONTINUATION_PLAN.md`, `docs/IMPLEMENTATION_PLAN.md`, `docs/PLATFORM.md`, `docs/PRODUCT-ALLOCATION-MIDDLEWARE.md`, and `docs/superpowers/*`.
- `platform-spec/conformance.yml` and all AGI integration / worker tests.
- Canonical Specs `v1.0.0` artifacts, including `SPEC-002`, `SPEC-006`, `SPEC-011`, `SPEC-013`, and the conformance manifest schema.
- Current AGI repository refs and commit history for unrelated project names.
- Local validation: lint, typecheck, 70 tests, and production build all passed.

## Findings

### F-01 — High: conformance manifest overclaims implementation

**Evidence**

- `platform-spec/conformance.yml:10-42` declares implementation of lifecycle/event specs, production of `CONTRACT-003` and `CONTRACT-005`, consumption of five canonical contracts, and production/consumption of nine canonical events.
- `docs/ARCHITECTURE.md:18-29` says the browser receives a static export and that the repository does not call Supabase at runtime.
- `docs/ARCHITECTURE.md:80-82` explicitly excludes backend, authentication, database, payments, runtime writes, and notification delivery.
- `README.md:56-63` describes build-time public-document projection and says the marketing site does not authenticate, persist records, or expose donor-level evidence.
- The source tree contains AGI-local narrative contracts in `integration/contracts.ts`, but no canonical `CONTRACT-*` or `EVENT-*` implementation or schema-validation evidence matching the manifest.

**Why it matters**

`SPEC-013` measures conformance by declared artifacts, schema validation, and lifecycle behavior. The current declaration describes a broader governance/execution capability than this repository actually owns. This creates false confidence and makes cross-repository boundaries harder to audit.

**Required decision**

Either reduce the manifest to the public narrative/projection surface actually implemented, or add the missing capability implementation and evidence in the correct owning repository. Do not solve this by adding a second backend to AGI.

### F-02 — High: demo does not conform to canonical `SPEC-011`

**Canonical requirement**

`Autonomous-Giving-Specs` `SPEC-011:32-33` requires the fixed Community AI Lab scenario with 25 laptops and the ordered stages Need, Fund Intel Recommendation, Human Approval, Allocation, Purchase, Evidence, Receipt, Verification, Impact, and Donor Notification.

**Current implementation**

- `demo/scenario.ts:1-2` uses Hacker Dojo, a $250 donation, Raspberry Pi Kits, and 18 attendees.
- `components/donation-demo.tsx:7-17` begins at Donation received and does not expose the distinct Need and Fund Intel Recommendation stages.
- The public fixture is useful as an AGI/Fund-Intel/Impact Relay integration example, but it is not the canonical platform demo.

**Required decision**

Make Community AI Lab the canonical conformance demo, or remove `SPEC-011` from the AGI manifest and explicitly label Hacker Dojo as a non-canonical suite integration fixture. The first option is preferred if AGI is intended to demonstrate platform conformance.

### F-03 — Medium: synthetic donor identity leaks into the public demo model

**Evidence**

- `demo/scenario.ts:1` defines `donor.name` as `Jane`.
- `components/donation-demo.tsx:168-171` renders `Delivered to Jane`.
- `README.md:63` and `docs/ARCHITECTURE.md:65` define the public site as not exposing donor-level evidence.

The value is synthetic, so this is not a confirmed personal-data incident. It is nevertheless the wrong public contract shape and teaches future contributors that donor identity belongs in this surface.

**Required fix**

Remove the donor field from the public demo scenario and use a neutral label such as `Notification delivered` or `Donor notification delivered` without a person name.

### F-04 — Medium: cross-repository planning material is mixed into the AGI repository

`docs/superpowers/plans/2026-08-06-agi-platform-foundation.md` is primarily an operational plan for Fund-Intel migrations, Supabase bootstrap, Vercel runtime configuration, and workspace login. The document correctly says the implementation lives in Fund-Intel, but its presence in AGI makes the repository look responsible for another product’s data-plane work.

`docs/PRODUCT-ALLOCATION-MIDDLEWARE.md` and `docs/ROADMAP.md` are legitimate suite-level pointers when they preserve ownership. They should remain short boundary documents, not duplicate implementation plans.

**Required fix**

Keep only a short AGI-facing dependency record in this repository. Move or archive Fund-Intel execution detail in Fund-Intel, and link to the owning runbook with a pinned revision where possible.

### F-05 — Medium: pinned-spec discipline is inconsistent

`platform-spec/README.md:12` correctly says production behavior must not follow floating Specs `main`, but AGI still links to floating `main` in:

- `README.md:41`
- `docs/PRODUCT-ALLOCATION-MIDDLEWARE.md:5,41`
- several Fund-Intel / Portfolio Signals operational links

Floating links are acceptable for discovery-only links, not for normative contract or architecture references. Replace normative links with `v1.0.0` or explicitly mark them as non-normative current-status links.

### F-06 — Medium: operational status contradicts the foundation spec

- `README.md:54` says Phase 2 platform Auth + workspace is operator-complete and master-admin login was verified.
- `docs/superpowers/specs/2026-08-06-agi-platform-foundation-design.md:9` says operator migration/login is pending.
- The same spec’s follow-up section records residual platform migration, environment, and login-smoke work.
- `docs/PLATFORM.md` still describes platform migration as operator work.

This is likely stale cross-repository status copied forward, not code contamination. It should be resolved to one dated, evidence-backed state.

### F-07 — Low: dependency hygiene needs follow-up

The validation run passed, but `npm audit --omit=dev` reports one high-severity transitive `nanoid` advisory (`GHSA-2v37-7h3g-55p8`, affected range `<3.3.18`). This is unrelated to cross-project contamination. Track the upgrade path without using a broad unreviewed `npm audit fix`.

## Contamination assessment

| Surface | Assessment | Evidence |
| --- | --- | --- |
| AGI app/components | Clean from unrelated projects | No `abraxas`, `orchestra`, `enochian`, `safetypass`, or `openclaw` references in the tracked application tree |
| Dependencies | Clean from named unrelated projects | `hermes-parser` is a transitive package-lock dependency, not the Hermes project; no foreign direct dependency exists |
| Generated output | Clean in Git | `out/`, `.next/`, and `node_modules/` are ignored and untracked |
| Brand | Intentional | Zero State appears only as the documented builder credit in the footer and design docs |
| Suite projects | Intentional but broad | Fund-Intel / Portfolio Signals and Impact Relay are required suite boundaries and proxy targets |
| Demo data | Scope drift | Hacker Dojo fixture and synthetic donor name conflict with the pinned canonical/public boundary choices |
| Documentation | Contaminated by planning/status drift, not source code | Fund-Intel execution plans and contradictory Phase 2 status live in AGI docs |

## Recommended continuation order

1. **P0: make conformance honest.** Decide the exact AGI capability claim and update `platform-spec/conformance.yml` plus evidence links.
2. **P0: choose the canonical demo.** Prefer Community AI Lab / 25 laptops for `SPEC-011`; keep Hacker Dojo only as a clearly labeled public integration fixture if still needed. The control-plane direction and Hacker Dojo multi-project fixture are now specified in [Specs ADR-014](https://github.com/Autonomous-Giving-Incorporated/Autonomous-Giving-Specs/blob/main/adr/ADR-014-agi-control-plane.md).
3. **P0: remove donor identity from public demo data and copy.** Add a regression test that rejects donor fields from public demo fixtures.
4. **P1: reconcile status and links.** Replace floating normative Specs links, correct dated Phase 2 status, and separate AGI boundary docs from Fund-Intel runbooks.
5. **P1: add a conformance-check command.** Validate `platform-spec/conformance.yml` against the pinned release and require evidence paths for every declared artifact.
6. **P2: resolve the transitive `nanoid` advisory** through a reviewed lockfile/dependency update.

See [`CONTINUATION_PLAN.md`](CONTINUATION_PLAN.md) for the execution sequence and exit criteria.
