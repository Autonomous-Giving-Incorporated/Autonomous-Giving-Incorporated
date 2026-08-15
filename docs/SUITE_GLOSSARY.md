# Suite public-narrative glossary

Shared vocabulary for Fund-Intel / Portfolio Signals, Impact Relay, and AGI public narrative contracts. This file matches the machine-readable maps in `integration/glossary.ts`. It does **not** change live build-time projection semantics.

Related: [INTEGRATION_CONTRACTS.md](INTEGRATION_CONTRACTS.md) · [CONTRACT_GOVERNANCE.md](CONTRACT_GOVERNANCE.md) · [THREE_REPO_INTEGRATION.md](THREE_REPO_INTEGRATION.md)

Platform lifecycle terms remain those in [Autonomous Giving Specs glossary](https://github.com/scrimshawlife-ctrl/Autonomous-Giving-Specs/blob/v1.0.0/glossary/README.md) (TERM-001–020). This file only aligns the public join key and status words the three public surfaces already use.

---

## `allocationId`

| Rule | Value |
|------|--------|
| Meaning | Public allocation identifier. Specs TERM-008. Not a donor id. |
| Format | `alloc_<lowercase_snake_slug>` |
| Pattern | `^alloc_[a-z0-9_]+$` |
| Example | `alloc_community_hardware` |
| Issued by | Portfolio Signals owner, at decision publish time |
| Echoed by | Impact Relay owner on public outcomes that join to that allocation |
| Consumed by | AGI engineering; join only on this value |

A sequence suffix (`_001`) is allowed by the pattern and is optional. Existing matching fixtures use `alloc_community_hardware` without a sequence.

Until a live public document exports the join key, AGI continues to project the narrower live slice (execution state + one `VERIFIED` aggregate) and uses the deterministic fixture for the full narrative demo.

---

## Authority

| Surface | Required value |
|---------|----------------|
| Portfolio Signals `public-campaign.json` | `advisory_only` |
| Impact Relay `public-impact.json` | `public_aggregate_only` |

Unknown authority is rejected. Invented values are not accepted.

---

## Decision and allocation status

| Layer | Vocabulary | Notes |
|-------|------------|--------|
| AGI `FundingDecision.status` | `approved` | Narrative contract currently models only published approved decisions |
| Portfolio Signals allocation `status` | `proposed` \| `approved` \| `active` \| `closed` | Published campaign schema |
| Portfolio Signals `execution.state` | `blocked` \| `review` \| `authorized` \| `active` \| `sealed` | Invented states such as READY or freeze are rejected |

An allocation row may exist on the campaign document with a non-`approved` status. The narrative `FundingDecision` fixture only represents the `approved` case.

---

## Verification status

| Impact Relay `evidenceState` | AGI `verificationStatus` |
|------------------------------|--------------------------|
| `VERIFIED` | `verified` |
| `PENDING` | `pending` |
| `REJECTED` | `rejected` |

Unmapped evidence states are not coerced. The live AGI projection still requires one `VERIFIED` outcome.

`verified` / `VERIFIED` is a source-system state, not one-to-one donor attribution.

---

## Event types

| Impact Relay domain / export | AGI `ImpactEventType` |
|------------------------------|------------------------|
| `CLASS_HELD` / program occurrence | `program_held` |
| purchase approval | `purchase_approved` |
| receipt attached | `receipt_attached` |
| equipment / asset delivery | `equipment_delivered` |
| attendance verified | `attendance_verified` |
| notification delivered | `notification_delivered` |

Unmapped domain types must not be silently coerced. Extending the enum is a compatibility change and requires a contract version bump.

---

## Event identity

| Concern | AGI | Impact Relay |
|---------|-----|--------------|
| Public event id | `eventId` | `impactEventId` / `publicId` (`imp_…`) |
| Occurrence time | `occurredAt` (ISO-8601) | `eventDate` / `createdAt` |

Matching fixtures use `eventId` values `evt_001`–`evt_003` on the narrative contract and `imp_001` / `evt_workshop_001` on the public-impact document. Those are representative public-safe ids, not a live join.

---

Last updated: 2026-08-15
