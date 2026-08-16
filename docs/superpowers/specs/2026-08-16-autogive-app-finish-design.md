# Autogive.app public-site finish design

**Date:** 2026-08-16  
**Status:** Design locked for implementation. Not a READY claim. Not Phase C approval. Not Phase D authorization.  
**Owner:** AGI public workbench (this repository)  
**Execution brief for:** [CONTINUATION_PLAN.md](../../CONTINUATION_PLAN.md) Phase E (E1–E7)  
**Pinned platform canon:** [Autonomous-Giving-Specs v2.0.0](https://github.com/Autonomous-Giving-Incorporated/Autonomous-Giving-Specs/releases/tag/v2.0.0) (tag `v2.0.0`; published tag target `c089739` is a release pointer, not a runtime freeze receipt)  
**Product boundary:** `AGENTS.md` v0.1 — no backend, authentication, database, payments, monorepo, or unnecessary packages on this public site.

An implementer can execute E1–E7 from this document without director login, secrets, or new product decisions. Do not reopen the locked decisions. Do not ask for director acceptance.

---

## 1. Purpose

Finish the **public-site design and remaining Phase E work** so this repository’s declared responsibility matches the static Next.js export it actually ships:

- honest conformance (no overclaimed canonical contracts/events);
- the canonical `SPEC-011` Community AI Lab / 25-laptop demo;
- no donor identity on the public surface;
- normative Specs links pinned to **v2.0.0**;
- login / Phase 2 / `SPEC-028` runtime unmistakably **PARKED**;
- a conformance-check command that fails on unsupported claims;
- a reviewed `nanoid` lockfile bump.

This is the public narrative/projection workbench. It is not the control plane, not a donation processor, and not a second database.

## 2. Parked list (do not implement)

The following are **PARKED** as of **2026-08-16 PT** (operator direction: Danny). Director is not available. All login, secrets, and director acceptance **wait**. Treat any earlier “operator-complete” or “ready for integration” sentence as superseded.

| Parked item | What that means in this repo |
| --- | --- |
| Login / credentials / secrets | Do not add Auth, JWT verification, cookies, env secrets, or a working sign-in form. `app/login/page.tsx` stays a parked shell. |
| Phase 2 platform Auth + workspace completion | Do not mark Phase 2 complete. Workspace login lives in Portfolio Signals and is **not** this site’s done criteria. |
| `SPEC-028` runtime | Do not add an AGI edge auth worker, capability handoff, or production control-plane session. `integration/control-plane.ts` stays a typed fixture parser. |
| Ed / director JWT / director acceptance | Do not complete Portfolio Signals director JWT live-host or acceptance work from this repo. Keep a dependency pointer only. |
| Public-data policy C3 approval | [PUBLIC_DATA_POLICY.md](../../PUBLIC_DATA_POLICY.md) stays **PROPOSED**. Do not write “approved”. |
| Phase D runtime read-only host | Still gated on Phase B **and** Phase C complete. Phase C is not complete. |
| READY / freeze SHA / live workers.dev URLs | Do not invent them. The v2.0.0 pin is a documentation pin only. |
| Payments, Stripe, every.org, donation checkout | Money lock: AGI never processes donations. Stripe is tenant/SaaS billing only (unused here). Gift tracking is third-party connectors in Portfolio Signals. |

If a task appears to need any parked item, stop and keep the public-site slice inside E1–E7.

## 3. Locked decisions (do not reopen)

1. **Honest conformance.** Shrink `implements` to the public narrative/projection this repo actually ships. `SPEC-023`, `SPEC-024`, `SPEC-026`, `SPEC-027`, `SPEC-028`, and `CONTRACT-013` stay **tracked only** (not implemented here).
2. **Canonical demo is Community AI Lab / 25 laptops** with the required `SPEC-011` lifecycle order and **2500 USD**. Hacker Dojo $250 / 18-attendee is a **labeled non-canonical integration fixture** only if kept.
3. **No donor identity** on the public surface. Remove `Jane` / `donor.name`. Neutral notification copy. Regression test required.
4. **Normative Specs links pin to v2.0.0.** Floating `main` links must be labeled **non-normative**. Do not revert to v1.0.0. The 2026-08-15 audit’s v1.0.0 pin is historical evidence, not current direction.
5. **Login / Phase 2 / SPEC-028 runtime / Ed / director JWT is PARKED**, not complete. Docs and UI copy must agree.
6. **A conformance-check command is in-scope** for the code slice. Specify inputs and fail conditions here. A stub may exist; it must not fake a pass against overclaimed IDs.
7. **`nanoid` high advisory** is a reviewed lockfile bump only (`>= 3.3.18`). No broad `npm audit fix`.

## 4. Verified current state (2026-08-16)

Do not treat this section as a claim that Phase E is done. It is the starting tree an implementer will see after this design PR (or on `main` if only docs landed).

| Surface | Evidence | Implication |
| --- | --- | --- |
| Host | `next.config.ts` `output: "export"`; `docs/ARCHITECTURE.md`; `docs/CLOUDFLARE.md` | Static export. Cloudflare intended; Vercel live until DNS cutover; Pages is a mirror. |
| Pin | `platform-spec/conformance.yml` `version: 2.0.0`; `platform-spec/README.md`; `README.md` | Pin is already v2.0.0. Audit text that says v1.0.0 is stale. |
| Overclaim | `conformance.yml` `implements.specs` includes SPEC-001–008, 011–013, **and** 023/024/026/027/028; `contracts`/`events` lists canonical IDs | Notes already say tracked ≠ implemented, but `implements` still overclaims. E1 must shrink the machine-readable list. |
| Demo | `demo/scenario.ts` Hacker Dojo / $250 / 18 attendees; `components/donation-demo.tsx` starts at “Donation received” | Not the canonical SPEC-011 fixture. E2 replaces the public demo. |
| Donor identity | Design PR removed `donor` / `Jane` / “Delivered to Jane”; `integration/demo-privacy.test.ts` guards the public demo surface | E2 must keep this clean when Community AI Lab replaces Hacker Dojo. |
| Login copy | Design PR set README / PLATFORM / foundation / login / admin to **PARKED** | E5 implementer sweep for leftover “operator-complete” / “ready for integration”. |
| Local contracts | Design PR set `CONTRACT_VERSIONING.platformSpecPin` to `"2.0.0"` | E4 still needs a full Specs-`main` link scan. |
| Tests | `package.json` `node --experimental-strip-types --test integration/*.test.ts workers/*.test.ts` | New tests go under `integration/`. `demo-privacy.test.ts` already exists. |
| CI | `.github/workflows/ci.yml` lint, typecheck, test, build | Honest stub: `npm run conformance-check` exits 1 on current overclaim. **Not** in CI until E1. |
| `nanoid` | `package-lock.json` resolves `nanoid@3.3.17` | Advisory `GHSA-2v37-7h3g-55p8` is `<3.3.18`. E7 bumps the lockfile. |
| C3 | `PUBLIC_DATA_POLICY.md` **PROPOSED**; `PUBLIC_DATA_POLICY_STATUS = "PROPOSED"` | Leave it. |
| Control-plane types | `integration/control-plane.ts` + `app/login` + `app/admin` | Shell + fixture parsers only. Not SPEC-028 runtime. |

Canonical SPEC-011 values (from Specs tag `v2.0.0` `demo/community-ai-lab/scenario.json` and `specs/SPEC-011-demo-specification.md`):

| Field | Required value |
| --- | --- |
| Organization / need | Community AI Lab / 25 laptops for a neighborhood AI learning lab |
| Amount / currency | **2500** / `USD` (not 250, not 25000) |
| `allocationId` | `c6c2e191-3000-4000-8000-000000000001` |
| `agiProcessedDonation` | `false` |
| `stripeDonation` | `false` |
| `contactableDonor` | `false` |
| `impactNoticeIssued` | `false` |
| Notification | Timeline / in-app projection — **not** ImpactNotice, **not** a named donor |

Required narrative order (information design): Need → Fund Intel Recommendation → Human Approval → Allocation → Purchase/execution → Evidence → Receipt → Verification → Impact → Notification.

Required event order if the demo exposes events: `SignalDetected` → `OpportunityCreated` → `RecommendationGenerated` → `ApprovalGranted` → `AllocationCreated` → `ExecutionStarted` → `EvidenceAttached` → `ReceiptGenerated` → `VerificationCompleted` → `NotificationSent`. Human approval **before** allocation. Notification **after** verification. Receipt amount equals 2500.

## 5. Target architecture (unchanged topology)

```text
Browser
  └── static export (out/)
        ├── /                 public narrative + SPEC-011 demo + build-time signals
        ├── /login            PARKED shell (no credentials)
        ├── /admin            PARKED labeled shell + Hacker Dojo fixture (non-canonical)
        └── /legal/*          existing legal pages

Build time
  └── public-campaign.json + public-impact.json → validate → live or deterministic fallback

Cloudflare Worker (existing)
  └── reverse-proxy /portfolio-signals/* and /impact-relay/*   (not an AGI API)
```

No new host, no Node server, no OpenNext, no D1, no second database.

## 6. File-level expected changes (E1–E7)

Implement in this order. Each task is independently reviewable. Do not expand scope.

### E1 — Honest `implements` (P0)

**Files**

- Modify: `platform-spec/conformance.yml`
- Modify: `platform-spec/README.md` (table must match the YAML, not the old “tracked set in implements” wording)
- Modify: `docs/ARCHITECTURE.md` only if a sentence still implies this repo produces canonical `CONTRACT-*` / `EVENT-*`

**Target YAML (copy this; do not invent IDs)**

```yaml
platform_spec:
  repository: Autonomous-Giving-Incorporated/Autonomous-Giving-Specs
  version: 2.0.0

service:
  id: autonomous-giving
  role: governance
  name: Autonomous Giving Incorporated

implements:
  specs:
    - SPEC-011
    - SPEC-012
    - SPEC-013
  contracts:
    produces: []
    consumes: []
  events:
    produces: []
    consumes: []

evidence:
  integration_tests: docs/THREE_REPO_INTEGRATION.md
  demo: demo/scenario.ts
  demo_ui: components/donation-demo.tsx
  demo_test: integration/demo-scenario.test.ts
  conformance_check: scripts/conformance-check.mjs
  notes: >
    Documentation pin to Autonomous Giving Specs v2.0.0 (tag v2.0.0).
    This manifest is not a READY or runtime-conformance claim.
    implements lists only the public narrative/projection this static
    export ships: SPEC-011 demo, SPEC-012 pin, SPEC-013 declaration.
    This site does not produce or consume canonical CONTRACT-* or EVENT-*
    at runtime. Local integration/contracts.ts are AGI narrative contracts
    (date-string schemaVersion), not CONTRACT-003/005.
    Money lock: this public site never processes donations; Stripe is
    tenant/SaaS billing only and unused here; gift tracking is third-party
    connectors (P0 every.org) in Portfolio Signals.
    Host lock: Cloudflare + existing Supabase.
    SPEC-023/024/026/027/028 and CONTRACT-013 are tracked only.
  tracked:
    - SPEC-023
    - SPEC-024
    - SPEC-026
    - SPEC-027
    - SPEC-028
    - CONTRACT-013
```

**Why this set**

| ID | Why it may stay in `implements` | Evidence the check will require |
| --- | --- | --- |
| SPEC-011 | Public deterministic demo this site ships after E2 | `demo/scenario.ts`, `components/donation-demo.tsx`, `integration/demo-scenario.test.ts` |
| SPEC-012 | This repo pins a SemVer platform release | `platform-spec/conformance.yml` `version: 2.0.0`, `platform-spec/README.md` |
| SPEC-013 | This repo declares a manifest and a check | `platform-spec/conformance.yml`, `scripts/conformance-check.mjs` |

**Remove from `implements` (do not delete from `evidence.tracked`)**

- `SPEC-001`, `SPEC-002`, `SPEC-004`, `SPEC-005`, `SPEC-006`, `SPEC-007`, `SPEC-008` — documented alignment / suite principles, not shipped runtime here. Mention them in `platform-spec/README.md` as **alignment notes**, not `implements`.
- `SPEC-023`, `SPEC-024`, `SPEC-026`, `SPEC-027`, `SPEC-028` — tracked only.
- All `implements.contracts.*` and `implements.events.*` canonical IDs.

**Fail if** the README still says “the implements list is the tracked set”. Tracked ≠ implements.

### E2 — Canonical Community AI Lab demo (P0)

**Files**

- Modify: `demo/scenario.ts` — replace Hacker Dojo public scenario with Community AI Lab.
- Modify: `components/donation-demo.tsx` — steps, ledger, button, notification copy.
- Modify: `app/page.tsx` — hero instrument (`$250`, “Raspberry Pi kits”, “18 students”) must match 2500 / 25 laptops / Community AI Lab. Do not leave a second contradictory public story on the homepage.
- Modify: `docs/PRODUCT.md` current-experience bullet that still says “$250 community-hardware scenario”.
- Create: `integration/demo-scenario.test.ts`
- Keep (labeled): `integration/fixtures/hacker-dojo-tenant.json` as the **non-canonical** control-plane / routing fixture. Update `app/admin/page.tsx` and `integration/control-plane.test.ts` comments/copy so a reader cannot mistake it for SPEC-011.

**`demo/scenario.ts` shape (required)**

```ts
export type DemoScenario = {
  id: "community-ai-lab";
  organization: { name: "Community AI Lab"; location: string };
  need: { summary: string; quantity: 25; item: "laptops" };
  donation: { amount: 2500; currency: "USD" };
  allocation: {
    name: string;
    allocationId: "c6c2e191-3000-4000-8000-000000000001";
  };
  purchase: { item: string; vendor: string; amount: 2500 };
  program: { name: string };
  impact: { attendees: 25; status: "verified" };
  notification: {
    title: string;
    message: string;
    status: "delivered";
  };
  money: {
    giftTracked: true;
    agiProcessedDonation: false;
    stripeDonation: false;
    contactableDonor: false;
    impactNoticeIssued: false;
  };
};

export const CANONICAL_DEMO_STAGES = [
  "Need",
  "Fund Intel Recommendation",
  "Human Approval",
  "Allocation",
  "Purchase",
  "Evidence",
  "Receipt",
  "Verification",
  "Impact",
  "Notification",
] as const;
```

Rules:

- **No `donor` object. No person name.**
- `need.summary` must include “25 laptops” (or equivalent exact quantity + item).
- Button label may say `Replay $2,500 demo` (or `Replay demo`). It must **not** say `Donate $250`.
- Ledger notification title: `Notification delivered` (or `Donor notification delivered`). Never `Delivered to <name>`.
- Intro copy must keep “not a live payment or one-to-one attribution”.
- Optional money-boundary line in the demo intro: “Gift tracked, not processed by AGI.” Do not mention a live every.org URL. The Specs `donationLink` is documentary (`https://example.com/tenant-fundraiser`) — do not present it as a live pointing.

**Hacker Dojo fixture (if kept)**

- File stays at `integration/fixtures/hacker-dojo-tenant.json`.
- Visible label required wherever it is shown: `Non-canonical integration fixture (not SPEC-011)`.
- Do not use $250 / 18 attendees / Raspberry Pi as the homepage or `#demo` story.

### E3 — Donor identity removal (P0)

**Files**

- `demo/scenario.ts` — no `donor` field (covered by E2; if E3 lands first, delete `donor` from the current Hacker Dojo object and type).
- `components/donation-demo.tsx` — replace `Delivered to Jane` with `Notification delivered`.
- Create or extend: `integration/demo-privacy.test.ts` (name may be folded into `demo-scenario.test.ts` if E2+E3 ship together).

**Regression test (required)**

The test must fail if any of these reappear in the public demo surface (`demo/scenario.ts`, `components/donation-demo.tsx`, `app/page.tsx` hero/demo copy):

- keys `donor`, `donor.name`, `donorName`, `donor_id`, `donorId`, `donorEmail`;
- the string `Jane` as a person name;
- the pattern `Delivered to `.

Reuse the walk-the-object pattern already in `integration/contracts.test.ts` (“contains no donor-level keys”). Also `readFileSync` the three source files and assert the forbidden strings are absent.

Existing contract-fixture donor-key tests stay. They do not replace this demo-surface test.

### E4 — v2.0.0 normative pin (P1)

**Files**

- Modify: `integration/contracts.ts` — `CONTRACT_VERSIONING.platformSpecPin` from `"1.0.0"` to `"2.0.0"`.
- Modify: `integration/contracts.test.ts` — assert `"2.0.0"`.
- Modify: `docs/CONTINUATION_PLAN.md` — any remaining “pin v1.0.0” / E4 “pinned `v1.0.0`” language (this design PR should already have corrected Phase E).
- Modify: `docs/AGI_SPEC_AUDIT_2026-08-15.md` — add a one-paragraph **supersession note** at the top: audit remains the 2026-08-15 evidence record; current pin is v2.0.0; do not execute the audit’s “replace with v1.0.0” instruction. Do not rewrite the historical findings as if they were always v2.0.0.
- Scan and fix normative Specs links:

| Rule | Action |
| --- | --- |
| Normative contract, spec, glossary, or architecture citation | `.../blob/v2.0.0/...` or the release page `.../releases/tag/v2.0.0` |
| Discovery / current-status / ADR-on-main that is not in the v2.0.0 tree | Keep the `main` URL **only** if the sentence says **non-normative** (current-status / in-progress). |

Known `main` Specs links to label or retarget (verify with `rg` at implementation time):

- `docs/CONTINUATION_PLAN.md` ADR-014 and `architecture/secure-cross-repo-harness.md` (these are current-status engineering pointers — label **non-normative** unless they exist on tag `v2.0.0`).
- `docs/AGI_SPEC_AUDIT_2026-08-15.md` same ADR-014 `main` link.

Do **not** retarget Portfolio Signals / Impact Relay **product** `main` docs (pilot runbooks, CURRENT-STATE). Those are other repos’ current-status links, not Specs canon. Leave them. Do not freeze SHAs you did not observe.

### E5 — Parked login / Phase 2 status (P1)

**Files (must agree after the edit)**

- `README.md` — Current status paragraph. Replace “Phase 2 … operator-complete” with **PARKED** (2026-08-16). Keep Portfolio Signals pointers for workspace and #18 / #20 as **their** status, not this site’s completion.
- `docs/PLATFORM.md` — Phase map row for Phase 2 → **PARKED**. Foundation-design sentence that says “Implemented and operator-verified” → **PARKED**; residual login/secrets/director acceptance wait.
- `docs/superpowers/specs/2026-08-06-agi-platform-foundation-design.md` — status line: parked / not complete. Do not delete the historical design.
- `docs/ROADMAP.md` and `docs/IMPLEMENTATION_PLAN.md` — already updated by this design PR; keep them aligned if you touch status again.
- `app/admin/page.tsx` — remove “Authentication boundary ready for integration”. Use parked / not-enabled copy.
- `app/login/page.tsx` — keep “not enabled”; add **PARKED** so it cannot be read as “next slice is imminent in this PR”.
- `docs/THREE_REPO_INTEGRATION.md` / `docs/GITHUB-PROJECT.md` — only if a sentence claims AGI login is complete. Do not rewrite Portfolio Signals execution plans.

**Required shared sentence (use this or a strict paraphrase)**

> Login, Phase 2 workspace completion, SPEC-028 runtime, and director JWT / director acceptance are **PARKED** (2026-08-16 PT). This public site does not authenticate. Do not treat earlier operator-complete notes as current.

**Do not** add a dated “login verified” evidence record. The locked decision is parked, not complete.

### E6 — Conformance-check command (P1)

**Files**

- Create: `scripts/conformance-check.mjs` (Node, no new dependency; parse the small YAML with a tiny local parser or `JSON` after a checked-in snapshot — **do not** add `js-yaml` unless already present; it is not).
- Modify: `package.json` — `"conformance-check": "node scripts/conformance-check.mjs"`
- Modify: `.github/workflows/ci.yml` — add `npm run conformance-check` after `npm test` **only when** E1 has shrunk `implements`. If the script is added before E1, it **must exit non-zero** on the current overclaim (do not wire a green CI step that ignores overclaims).
- Optional evidence: `platform-spec/ids-v2.0.0.json` — a committed allowlist of SPEC / CONTRACT / EVENT IDs that exist on tag `v2.0.0`, copied from the Specs repo file list. Do not fetch `main` at CI time for the normative catalog.

**Inputs**

1. `platform-spec/conformance.yml`
2. Pinned ID catalog for Specs **v2.0.0** (committed allowlist or fetched `refs/tags/v2.0.0` only)
3. Evidence paths listed under `evidence` that end in `.md`, `.ts`, `.tsx`, `.mjs`, `.yml`
4. Optional link scan roots: `README.md`, `docs/**/*.md`, `platform-spec/**`

**Fail conditions (exit 1)**

| Code | Condition |
| --- | --- |
| `PIN` | `platform_spec.version !== "2.0.0"` |
| `SCHEMA` | Missing required keys `platform_spec`, `service`, `implements` |
| `UNKNOWN_ID` | An `implements` SPEC/CONTRACT/EVENT ID is not in the v2.0.0 catalog |
| `TRACKED_IN_IMPLEMENTS` | Any of `SPEC-023`, `SPEC-024`, `SPEC-026`, `SPEC-027`, `SPEC-028`, `CONTRACT-013` appears under `implements` |
| `OVERCLAIM_CONTRACTS` | `implements.contracts.produces` or `consumes` is non-empty |
| `OVERCLAIM_EVENTS` | `implements.events.produces` or `consumes` is non-empty |
| `MISSING_EVIDENCE` | A declared evidence path is not a readable file |
| `MISSING_SPEC011_EVIDENCE` | `SPEC-011` is in `implements.specs` but demo evidence files are missing |
| `FLOATING_NORMATIVE` | A Specs URL contains `/blob/main/` or `/tree/main/` in a file that does not also contain `non-normative` on the same line or the immediately following line |
| `READY_CLAIM` | Manifest `notes` or `platform-spec/README.md` contain an unnegated `READY` or `freeze SHA` claim (the existing phrases “not a READY claim” / “not a runtime freeze receipt” are allowed) |

**Pass** means: pin is 2.0.0, implements is the honest set, tracked IDs are only under `evidence.tracked`, evidence files exist, no floating normative Specs links. It does **not** mean READY.

**Stub rule:** a stub that only prints “not implemented” and exits 0 is forbidden. A stub that exits 1 because `implements` still overclaims is allowed until E1 lands.

### E7 — `nanoid` lockfile bump (P2)

**Files**

- Modify: `package-lock.json` only (and `package.json` only if a direct dependency appears — today `nanoid` is transitive).

**Procedure**

```bash
npm install nanoid@3.3.18 --package-lock-only --ignore-scripts
# if the installer requires a no-op direct dep to force the transitive bump, prefer
# npm update nanoid --package-lock-only
npm audit --omit=dev
```

Accept only a reviewed diff that changes `nanoid` to `>=3.3.18`. Do not run `npm audit fix`. Do not reintroduce `overrides` for postcss/sharp.

**Exit:** `npm audit --omit=dev` has no high-severity finding, or a one-line approved exception in `platform-spec/README.md` (do not invent an exception if the bump works).

## 7. Test and CI plan

Run from repo root on Node 22, after `npm ci`:

```bash
npm run lint
npm run typecheck
npm test
npm run build
git diff --check
```

After E6 is honest:

```bash
npm run conformance-check
```

| Test file | What it must prove |
| --- | --- |
| `integration/demo-scenario.test.ts` | Scenario is Community AI Lab; amount 2500; 25 laptops; `CANONICAL_DEMO_STAGES` exact order; `agiProcessedDonation === false`; no `donor` key; Hacker Dojo is not the public scenario. |
| `integration/demo-privacy.test.ts` (or same file) | Source scan of demo + homepage copy: no `Jane`, no `Delivered to `, no donor identity keys. |
| `integration/contracts.test.ts` | `platformSpecPin === "2.0.0"`; C3 still `PROPOSED`; existing donor-key fixture tests still pass. |
| `integration/control-plane.test.ts` | Hacker Dojo fixture still valid **and** labeled non-canonical in the test title or assertion message. |
| Existing Phase B tests | Unchanged behavior. |

CI (`.github/workflows/ci.yml`) after E1+E6:

```yaml
- run: npm run lint
- run: npm run typecheck
- run: npm test
- run: npm run conformance-check
- run: npm run build
```

Do not add a deploy-time login smoke. Do not call Supabase.

## 8. Definition of done

### This design PR

- This file exists and is internally consistent with Phase E.
- Phase E, ROADMAP, and IMPLEMENTATION_PLAN say: pin **v2.0.0**, login **PARKED**, conformance must be **honest**, C3 **PROPOSED**, not READY.
- An implementer can execute E1–E7 without director access.
- If demo/login copy was touched: lint, typecheck, tests, and `next build` (static export) pass.

### Later code slice (E1–E7)

Phase E is complete when **all** of the following are true:

1. `conformance.yml` `implements` matches the target YAML in E1.
2. Public demo is Community AI Lab / 25 laptops / 2500 USD with the required stage order.
3. No donor identity on the public demo surface; privacy regression test is green.
4. Normative Specs links are v2.0.0; remaining `main` Specs links are labeled non-normative; `platformSpecPin` is `2.0.0`.
5. README, PLATFORM, foundation status, login, and admin copy all say login / Phase 2 / SPEC-028 are **PARKED**.
6. `npm run conformance-check` is in CI and fails on the E6 conditions.
7. `npm audit --omit=dev` has no high `nanoid` finding (or a documented exception).
8. Lint, typecheck, tests, and export build pass.
9. Docs still say C3 is PROPOSED. No READY. No invented Worker URLs. No Phase D.

## 9. Explicit non-goals

- Backend, authentication, database, payments, secrets, or Phase D runtime.
- Approving C3 or claiming PUBLIC_DATA_POLICY is approved.
- Claiming READY, runtime conformance, or a freeze SHA.
- Inventing live `workers.dev` URLs.
- Merging Portfolio Signals or Impact Relay application code into this repo.
- Completing director JWT, Ed, MFA dry-run, every.org pointing, or workspace magic-link.
- Reverting the platform pin to v1.0.0.
- Putting `SPEC-023/024/026/027/028` or `CONTRACT-013` back into `implements`.
- Making Hacker Dojo the SPEC-011 demo.
- Adding npm `overrides` for postcss/sharp.
- Adding OpenNext, a Node server, D1, a second database, Render, Fly, or Railway.
- Expanding `AGENTS.md` past the v0.1 no-backend public-site boundary.

## 10. Implementer checklist (no director)

1. Read this file and `AGENTS.md`.
2. E3 if donor identity is still present (or confirm the privacy test already covers it).
3. E2 Community AI Lab demo + tests.
4. E1 shrink `implements` + README table.
5. E4 pin constant + link audit.
6. E5 parked-status sweep (`rg -n "operator-complete|ready for integration|v1\\.0\\.0" README.md docs app`).
7. E6 conformance-check + CI hook (must fail on overclaim; must pass on the honest YAML).
8. E7 nanoid lockfile bump.
9. `npm run lint && npm run typecheck && npm test && npm run conformance-check && npm run build`.
10. Stop. Do not start Phase D or login.

## 11. Mapping to the 2026-08-15 audit

| Audit ID | This design |
| --- | --- |
| F-01 overclaim | E1 + E6 |
| F-02 non-canonical demo | E2 (Community AI Lab locked) |
| F-03 Jane / donor.name | E3 |
| F-04 Fund-Intel plans in AGI | E5: keep pointers only; do not execute FI runbooks |
| F-05 floating / v1.0.0 pin | E4: pin **v2.0.0** (audit’s v1.0.0 instruction is superseded) |
| F-06 Phase 2 contradiction | E5: **PARKED**, not a new completion record |
| F-07 nanoid | E7 |
