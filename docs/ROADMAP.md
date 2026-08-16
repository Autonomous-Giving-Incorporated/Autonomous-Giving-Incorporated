# Roadmap

Roadmap items describe product outcomes, not calendar commitments. Work advances only when the preceding evidence and governance gates are satisfied.

## Shipped — Public evidence workbench

- Responsive AGI public narrative and reciprocal suite navigation.
- Replayable deterministic contribution lifecycle.
- Approved Portfolio Signals and Impact Relay aggregate signals with fail-closed fallback.
- Canonical metadata, social preview, robots, sitemap, CI, and static hosting (Cloudflare intended; Vercel / GitHub Pages until cutover).
- Documented public-data, attribution, and product-scope boundaries.

## Shipped — Public-source reliability

- Runtime schema validation for both public documents.
- Source-freshness thresholds (24 h soft / 7 d hard) with honest delay labels.
- Explicit live, fallback, stale, malformed, and policy-rejected states.
- Deterministic source-selection tests.
- Privacy-safe build diagnostics and accessible provenance copy.

## Next — Public-site Phase E (conformance and boundary)

Design and public-site code slice 2026-08-16: [superpowers/specs/2026-08-16-autogive-app-finish-design.md](superpowers/specs/2026-08-16-autogive-app-finish-design.md). E1–E7 landed in this repository. This is **not** READY.

- Pin stays **Autonomous-Giving-Specs v2.0.0** (documentation pin, not runtime conformance).
- `implements` must shrink to the public narrative/projection this site ships (SPEC-011/012/013). SPEC-023/024/026/027/028 and CONTRACT-013 stay tracked only.
- Canonical public demo is Community AI Lab / 25 laptops / 2500 USD. Hacker Dojo is a labeled non-canonical fixture only.
- No donor identity on the public surface.
- Login / Phase 2 / SPEC-028 runtime / Ed / director JWT is **PARKED** (2026-08-16 PT). Director acceptance waits.

## Next — Contract governance

Engineering draft in this repository. C3 is **PROPOSED**, not approved. Phase D remains gated.

- Named role ownership for shared fields (current operator recorded; not a sign-off).
- Shared glossary and matching fixtures for `allocationId` and status vocabulary.
- Evidence-access, retention, redaction, and publication rules drafted and still awaiting leadership + eng sign-off.
- Representative public-safe fixtures published and validated in AGI.

## Later — Runtime read-only narrative

Runtime consumption of approved decision and verified-event records may begin only after hosting, observability, ownership, privacy, and contract decisions are approved. The deterministic fallback remains mandatory.

## Future — Authenticated products

Accounts, donor history, organization workflows, payments, and notification delivery are separate products and require their own threat model, consent model, retention policy, audit requirements, and service ownership.

## Product track — Allocation middleware

Not a replacement for the public workbench gates above; parallel product track for client operations. **MVP code ships in Portfolio Signals**; this repo tracks product narrative and suite links.

| Step | State |
| --- | --- |
| 1. every.org connector + campaign pot / program slice balances | **Shipped** (Portfolio Signals package; webhook + CSV) |
| 2. Allocate + exception inbox | **Shipped** |
| 3. Trail + board packet + proof SLA | **Shipped** (MVP UI) |
| 4. Hacker Dojo pilot host (seed → director login → live webhook) | **Active** (operator + acceptance) |
| 5. Additional donation-platform adapters | Later |
| 6. Funder multi-grantee portfolio | Later |

See [PRODUCT-ALLOCATION-MIDDLEWARE.md](PRODUCT-ALLOCATION-MIDDLEWARE.md) and Portfolio Signals [HACKER-DOJO-ALLOCATION-PILOT.md](https://github.com/Autonomous-Giving-Incorporated/Portfolio-Signals/blob/main/docs/HACKER-DOJO-ALLOCATION-PILOT.md).

See [CONTINUATION_PLAN.md](CONTINUATION_PLAN.md) for gates and ownership and [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) for engineering order.
