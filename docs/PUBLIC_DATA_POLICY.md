# Public-data policy (PROPOSED)

**Status: PROPOSED.** This is a decision packet, not an approval. It consolidates rules already enforced in this repository and restated in Portfolio Signals and Impact Relay. It does **not** invent new legal claims, leadership sign-off, READY, a freeze SHA, or Phase D.

C3 leaves PROPOSED only when the [operator sign-off](#operator-sign-off-unsigned) table is filled by the named humans. An agent must not write “approved”, flip `PUBLIC_DATA_POLICY_STATUS`, or treat a chat instruction as the four required seats.

Required seats: leadership + Portfolio Signals owner + Impact Relay owner + AGI engineering. The current human filling those engineering seats is recorded in [CONTRACT_GOVERNANCE.md](CONTRACT_GOVERNANCE.md); that record is not sign-off.

Referenced from [INTEGRATION_CONTRACTS.md](INTEGRATION_CONTRACTS.md). Related: [ARCHITECTURE.md](ARCHITECTURE.md) · [VISION.md](VISION.md) · [THREE_REPO_INTEGRATION.md](THREE_REPO_INTEGRATION.md) · public [privacy notice](../app/legal/privacy/page.tsx) · Impact Relay [C3 restatement](https://github.com/Autonomous-Giving-Incorporated/Impact-Relay/blob/main/docs/CONTRACT-GOVERNANCE.md) · Portfolio Signals [written deferral](https://github.com/Autonomous-Giving-Incorporated/Portfolio-Signals/blob/main/docs/C3-PUBLIC-DATA-POLICY-DEFERRAL-2026-08-22.md).

---

## What approving this document would mean

Approving C3 accepts the rules already implemented by the AGI public-source adapter. It does **not** change live product behavior, light up a `VERIFIED` cohort, or authorize Phase D.

| Decision | Recommended answer | Already enforced |
|----------|--------------------|------------------|
| Join key for public narrative | `allocationId` only | `validate-public.ts`, glossary |
| Campaign authority | `advisory_only` | `validatePublicCampaign` |
| Impact authority | `public_aggregate_only` | `validatePublicImpact` |
| Live projection requires | Fresh `updatedAt` (not hard-stale) **and** at least one Impact Relay `evidenceState: "VERIFIED"` outcome | `public-sources.ts` |
| Missing, delayed past 7 days, malformed, or policy-rejected documents | Fail closed to the bundled Community AI Lab fixture | Phase B adapter |
| Privacy constants | All listed flags stay `false`; a flip is `policy_rejected` | campaign + impact privacy validators |
| `VERIFIED` / `verified` meaning | Source-system state, not donor attribution | contracts + IR C2 |
| Build diagnostics | Source, age, state, reason only | `diagnostics.ts` |
| New public field, authority, or join key | Contract change under [change management](INTEGRATION_CONTRACTS.md#change-management) | C5 |
| Phase D / auth / payments on this site | Still out of scope | `AGENTS.md`, Phase E parked list |

If a recommended answer is wrong, reject or defer C3 and say which row changes. Do not approve a vague restatement.

---

## Scope

This draft applies to **public** suite surfaces and public git artifacts:

- AGI static workbench (`autogive.app`) and its build-time public projection
- Portfolio Signals `data/public-campaign.json`
- Impact Relay `data/public-impact.json`
- Shared narrative contracts and public-safe fixtures in the three public-integration repositories

It does **not** authorize authenticated workspace access, payments, donor history, private evidence repositories, SPEC-028 runtime on this site, or Phase D runtime reads.

**Out of this surface:** Autonomous-Giving-Specs (canon pin only) and Auto-Goods-Inc (separate venture). They are not public-document publishers for this adapter.

---

## Evidence access

1. Join only by `allocationId` (`^alloc_[a-z0-9_]+$`). Never by donor identity, contact data, payment identifiers, or operator identity.
2. Accept only documented public authority values (`advisory_only` on the campaign document, `public_aggregate_only` on the impact document).
3. Evidence references identify approved public records. They are not raw documents, personal data, or secret URLs.
4. `verified` / `VERIFIED` is a source-system state: a human program verifier approved that the activity occurred and is sufficiently evidenced. It is not individual donor attribution, not `OBSERVED` raised-claim provenance, and not a live-cohort declaration by itself.
5. Do not infer evidence from unknown, delayed, malformed, rejected, or missing records. Do not invent `VERIFIED` outcomes or bump `updatedAt` without real source evidence.
6. The live AGI adapter fail-closes to the deterministic Community AI Lab fixture when a public document is unavailable, unparseable, hard-stale, or policy-rejected. That is the intended steady state when live shells are empty or blocked.
7. Build diagnostics report source, age, state, and reason only. They must not include payloads, donor data, organization or program names, evidence hashes, or secret URLs.

This public site does not request donor identity, contact details, payment records, raw receipts, private documents, or secret evidence URLs.

Publishers:

- Portfolio Signals operators publish the campaign advisory document.
- Impact Relay operators publish the impact aggregate and decide when a `VERIFIED` outcome is public.
- AGI engineering consumes both at build time and must not rewrite source evidence.

---

## Retention

Restated from the public privacy notice and product boundary:

- The AGI marketing site does not collect donations, persist private records, or store donor-level evidence.
- Public aggregate JSON is whatever the source systems publish. AGI does not keep a private copy of rejected or unpublished evidence. A failed live fetch is discarded; only the bundled fixture is shown.
- Hosting providers may retain standard web logs and security telemetry as described in the [privacy notice](../app/legal/privacy/page.tsx). That is not a public-evidence store.
- Authenticated account, audit, and tenant operational retention — where those products exist — remains the responsibility of Portfolio Signals, Impact Relay, Supabase operators, and the client organization. Clients apply their own retention and legal-hold policies to campaign records and private documents.
- This draft does not add a new retention clock, legal-hold procedure, or cross-border transfer claim.

---

## Redaction

- Public exports must remain free of PII, contact data, individual gift amounts, attendance-level personal data, private notes, consent/suppression state, and private campaign documents.
- Campaign privacy constants must stay fail-closed: `classification: "public_aggregate_only"` and `piiAllowed`, `rawRegistryAllowed`, `donorHistoryAllowed`, `privateNotesAllowed` all `false`.
- Impact privacy constants must stay fail-closed: `classification: "public_aggregate_only"` and `piiAllowed`, `donorNamesAllowed`, `individualDonorAttributionAllowed`, `operatorIdentityAllowed` all `false`.
- A document that flips those flags is `policy_rejected`.
- If a source redacts or retracts a public row, AGI must not invent replacement evidence. Missing or rejected records fail closed.
- Underlying private records are owned by Portfolio Signals (decision / CRM workspace) and Impact Relay (ledger / evidence). Public projections inherit only what those systems publish.

---

## Public publication

- Human approval remains mandatory for consequential financial and publication decisions. Checking in a live `VERIFIED` outcome or an unblocked campaign shell is a publication act by the source owner, not an AGI build step.
- Public pages and public source repositories must not contain raw member lists, personal emails/phones/addresses, donation histories tied to individuals, or operator identity on Impact Relay public aggregates.
- Representative fixtures used for contract review must be public-safe, labeled `SYNTHETIC_ONLY` or fixture-sourced, and must validate against the published contracts. They are not live donor data and must not be relabeled `live` or `OBSERVED`.
- Publication of a new public field, authority value, or join key is a contract change and follows [change management](INTEGRATION_CONTRACTS.md#change-management).
- Lighting up the live AGI projection requires both source documents to be fresh (inside the 7-day hard window) and Impact Relay to publish at least one `evidenceState: "VERIFIED"` outcome. Soft-stale documents (older than 24 hours, younger than 7 days) may still project, labeled delayed.

---

## What this draft does not claim

- It does not mark Phase C complete.
- It does not approve Phase D runtime reads.
- It does not replace the public privacy notice or create a new legal basis.
- It does not claim a live `VERIFIED` cohort exists. Observed 2026-08-22 state: both public documents were `updatedAt: 2026-08-08` (hard-stale) with a blocked Portfolio Signals shell and empty Impact Relay `outcomes`.
- C4 public-safe fixtures **do** exist in all three repositories: AGI `integration/` fixtures, Impact Relay `fixtures/agi_phase_c/` ([PR 5](https://github.com/Autonomous-Giving-Incorporated/Impact-Relay/pull/5)), Portfolio Signals copies ([PR 34](https://github.com/Autonomous-Giving-Incorporated/Portfolio-Signals/pull/34)), plus Civic Forge synthetic packs. Those fixtures stay synthetic.

---

## Open questions left to operators (not this draft)

These stay out of C3. Answering them is not required to approve the public-surface rules above.

- Authenticated workspace retention clocks and legal-hold runbooks (Portfolio Signals / Impact Relay / tenant).
- Live issuer / live Supabase tenant-isolation evidence (harness infra).
- When source owners will publish a real fresh `VERIFIED` aggregate.
- Any new legal basis, DPA, or cross-border transfer language.

---

## Operator sign-off (unsigned)

Fill every row. Use `approve`, `reject`, or `defer`. An empty cell means the gate stays **PROPOSED**.

| Seat | Human | Date (UTC) | Decision | Signature (GitHub login + short phrase) |
|------|-------|------------|----------|-----------------------------------------|
| Leadership | | | | |
| Portfolio Signals owner | | | | |
| Impact Relay owner | | | | |
| AGI engineering | | | | |

Until all four seats record `approve` with a date and signature:

- `PUBLIC_DATA_POLICY_STATUS` in `integration/contracts.ts` stays `"PROPOSED"`
- Phase C is not complete
- Phase D stays gated
- Live public shells stay gated; AGI continues to fail closed when sources are empty, stale, or rejected
- The cross-repo harness `pinned-sources` job fails closed if this status is flipped without a coordinated harness update

How to record approval: edit this table in a follow-up commit on this repository, then set `PUBLIC_DATA_POLICY_STATUS` to a non-`PROPOSED` value in the same change. A PR comment or chat message is not enough unless it is copied into this table by the named human.

---

Last updated: 2026-08-22  
Status: **PROPOSED**
