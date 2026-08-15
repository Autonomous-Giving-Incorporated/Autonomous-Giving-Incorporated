# Public-data policy (PROPOSED)

**Status: PROPOSED.** This draft consolidates rules already stated in this repository. It is **not** approved. It does not invent new legal claims, leadership sign-off, READY, or a freeze SHA.

Required before this document can leave PROPOSED: explicit leadership sign-off and engineering sign-off from the Portfolio Signals owner, Impact Relay owner, and AGI engineering. The current human filling those engineering roles is recorded in [INTEGRATION_CONTRACTS.md](INTEGRATION_CONTRACTS.md); that record is not sign-off.

Referenced from [INTEGRATION_CONTRACTS.md](INTEGRATION_CONTRACTS.md). Related: [ARCHITECTURE.md](ARCHITECTURE.md) · [VISION.md](VISION.md) · [THREE_REPO_INTEGRATION.md](THREE_REPO_INTEGRATION.md) · public [privacy notice](../app/legal/privacy/page.tsx).

---

## Scope

This draft applies to **public** suite surfaces and public git artifacts:

- AGI static workbench and its build-time public projection
- Portfolio Signals `data/public-campaign.json`
- Impact Relay `data/public-impact.json`
- Shared narrative contracts and fixtures in this repository

It does **not** authorize authenticated workspace access, payments, donor history, private evidence repositories, or Phase D runtime reads.

---

## Evidence access

Restated from existing public-data and architecture rules:

1. Join only by `allocationId`. Never by donor identity, contact data, or payment identifiers.
2. Accept only documented public authority values (`advisory_only`, `public_aggregate_only`).
3. Evidence references identify approved public records. They are not raw documents, personal data, or secret URLs.
4. `verified` / `VERIFIED` is a source-system state, not individual donor attribution.
5. Do not infer evidence from unknown, delayed, malformed, rejected, or missing records.
6. The live AGI adapter fail-closes to the deterministic fixture when a public document is unavailable, unparseable, hard-stale, or policy-rejected.
7. Build diagnostics report source, age, state, and reason only. They must not include payloads, donor data, organization or program names, evidence hashes, or secret URLs.

This public site does not request donor identity, contact details, payment records, raw receipts, private documents, or secret evidence URLs.

---

## Retention

Restated from the public privacy notice and product boundary:

- The AGI marketing site does not collect donations, persist private records, or store donor-level evidence.
- Public aggregate JSON is whatever the source systems publish. AGI does not keep a private copy of rejected or unpublished evidence.
- Authenticated account, audit, and tenant operational retention — where those products exist — remains the responsibility of those systems and their operators. Clients apply their own retention and legal-hold policies to campaign records and private documents.
- This draft does not add a new retention clock, legal-hold procedure, or cross-border transfer claim.

---

## Redaction

Restated from fail-closed and privacy-constant rules:

- Public exports must remain free of PII, contact data, individual gift amounts, attendance-level personal data, private notes, consent/suppression state, and private campaign documents.
- Privacy constants on public documents must stay fail-closed (`piiAllowed` and related flags `false`). A document that flips those flags is policy-rejected.
- If a source redacts or retracts a public row, AGI must not invent replacement evidence. Missing or rejected records fail closed.
- Underlying private records are owned by Portfolio Signals (decision / CRM workspace) and Impact Relay (ledger / evidence). Public projections inherit only what those systems publish.

---

## Public publication

Restated from vision and product principles:

- Human approval remains mandatory for consequential financial and publication decisions.
- Public pages and public source repositories must not contain raw member lists, personal emails/phones/addresses, donation histories tied to individuals, or operator identity on Impact Relay public aggregates.
- Representative fixtures used for contract review must be public-safe and must validate against the published contracts. They are not live donor data.
- Publication of a new public field, authority value, or join key is a contract change and follows [change management](INTEGRATION_CONTRACTS.md#change-management).

---

## What this draft does not claim

- It does not mark Phase C complete.
- It does not approve Phase D runtime reads.
- It does not replace the public privacy notice or create a new legal basis.
- It does not assert that matching fixtures exist yet in Fund-Intel / Portfolio Signals. Impact Relay Phase C fixtures are already published under `fixtures/agi_phase_c/` ([PR 5](https://github.com/Autonomous-Giving-Incorporated/Impact-Relay/pull/5), `cfc611a0b12aca080b043959de4de5c5340628a4`).

---

Last updated: 2026-08-15  
Status: **PROPOSED**
