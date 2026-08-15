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

## Next — Contract governance

- Named ownership for shared fields.
- Reviewed identifiers and status vocabulary across all three repositories.
- Approved evidence-access, retention, redaction, and publication rules.
- Versioned, representative public-safe fixtures.

## Later — Runtime read-only narrative

Runtime consumption of approved decision and verified-event records may begin only after hosting, observability, ownership, privacy, and contract decisions are approved. The deterministic fallback remains mandatory.

## Future — Authenticated products

Accounts, donor history, organization workflows, payments, and notification delivery are separate products and require their own threat model, consent model, retention policy, audit requirements, and service ownership.

## Product track — Allocation middleware

Not a replacement for the public workbench gates above; parallel product track for client operations. **MVP code ships in Fund-Intel**; this repo tracks product narrative and suite links.

| Step | State |
| --- | --- |
| 1. every.org connector + campaign pot / program slice balances | **Shipped** (Fund-Intel package; webhook + CSV) |
| 2. Allocate + exception inbox | **Shipped** |
| 3. Trail + board packet + proof SLA | **Shipped** (MVP UI) |
| 4. Hacker Dojo pilot host (seed → director login → live webhook) | **Active** (operator + acceptance) |
| 5. Additional donation-platform adapters | Later |
| 6. Funder multi-grantee portfolio | Later |

See [PRODUCT-ALLOCATION-MIDDLEWARE.md](PRODUCT-ALLOCATION-MIDDLEWARE.md) and Fund-Intel [HACKER-DOJO-ALLOCATION-PILOT.md](https://github.com/scrimshawlife-ctrl/Fund-Intel/blob/main/docs/HACKER-DOJO-ALLOCATION-PILOT.md).

See [CONTINUATION_PLAN.md](CONTINUATION_PLAN.md) for gates and ownership and [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) for engineering order.
