# Integration contracts

AGI has two distinct contract layers: an implemented build-time public projection and versioned narrative contracts for future governed integration. Neither layer authorizes writes, payments, or access to private evidence.

The complete cross-repository checklist lives in [THREE_REPO_INTEGRATION.md](THREE_REPO_INTEGRATION.md).

## Implemented public projection

`integration/public-sources.ts` retrieves these fixed sources during the static build:

| Source | Required authority | Data used by AGI |
| ------ | ------------------ | ---------------- |
| Portfolio Signals `data/public-campaign.json` | `advisory_only` | update timestamp, execution state, optional `allocationId` |
| Impact Relay `data/public-impact.json` | `public_aggregate_only` | update timestamp and one `VERIFIED` aggregate outcome |

The adapter validates each document against the published Fund-Intel / Portfolio Signals public-campaign shape and the published Impact Relay public-impact shape, then normalizes accepted data into `PublicSignals`. Unknown authority is never accepted. Unknown additive fields are ignored. The deterministic fixture is the only fallback content.

### Freshness (Phase B)

Clock assumption: the build-time reference instant is `Date.now()` (injectable as `nowMs` in tests). Date-only `updatedAt` values (`YYYY-MM-DD`) are treated as UTC midnight so age does not depend on the builder timezone.

| Threshold | Duration | Behavior |
| --------- | -------- | -------- |
| Soft | 24 hours | Remote data may still be projected. Adapter state is `stale`. The UI labels the delay and does not treat the record as current evidence. |
| Hard | 7 days | Fail closed. Remote data is not projected. Adapter state is `fallback` with reason `hard_stale`. |

Unparseable timestamps fail closed (they cannot be assessed honestly). The UI never presents delayed, malformed, or rejected records as fresh verified evidence.

### Explicit source states

| State | When | Content shown |
| ----- | ---- | ------------- |
| `live` | Both documents pass schema, authority, verification, and the soft freshness window | Remote projection |
| `stale` | Both documents are otherwise accepted, and at least one is older than 24 hours but not older than 7 days | Remote projection, labeled delayed |
| `fallback` | Network failure, non-2xx, or hard-stale | Deterministic fixture |
| `malformed` | JSON parse failure or published-schema mismatch | Deterministic fixture |
| `policy_rejected` | Unknown authority, privacy constants not fail-closed, or no `VERIFIED` outcome | Deterministic fixture |

### Schema validation

`integration/validate-public.ts` fail-closes unless:

- Portfolio Signals declares `authority: "advisory_only"` and the published campaign, registry, execution, gates, and privacy blocks are present and typed;
- execution state is one of the published values (`blocked`, `review`, `authorized`, `active`, `sealed`) — invented states such as READY or freeze are rejected;
- privacy constants remain fail-closed (`piiAllowed` and related flags are `false`);
- Impact Relay declares `authority: "public_aggregate_only"` and includes privacy, summary, and outcomes;
- at least one outcome has `evidenceState: "VERIFIED"` and the published required outcome fields.

Join, when present, is only by `allocationId`. Donor identity is never a join key. `verified` / `VERIFIED` is a source-system state, not donor attribution.

### Privacy-safe build diagnostics

The static page logs one line during `next build` via `formatDiagnosticLine`:

```text
agi.public_signals source=live fund_freshness=fresh fund_age_ms=… impact_freshness=fresh impact_age_ms=…
```

CI and build logs report **source, age, state, and reason only**. They must not include payloads, donor data, organization or program names, evidence hashes, or secret URLs.

## Versioned narrative contracts

`integration/contracts.ts` defines:

- `FundingDecision`: a public allocation identifier, fund, approved rationale, status, and publication time;
- `ImpactEvent`: the same allocation identifier, event identity and type, occurrence time, verification status, and optional public-safe evidence reference;
- `PublicImpactNarrative`: a decision plus its ordered impact events.

The contract version is an explicit date string (`2026-08-02`). Deterministic examples live in `integration/fixtures.ts` and `integration/fixtures/community-hardware-narrative.json`. These contracts describe the intended governed narrative seam; the current public-source adapter does not deserialize remote data directly into them. Phase D runtime reads are not started.

Shared vocabulary: [SUITE_GLOSSARY.md](SUITE_GLOSSARY.md). Field owners, versioning, and Phase C status: [CONTRACT_GOVERNANCE.md](CONTRACT_GOVERNANCE.md).

### C1 — Field owners

Role seats are those already named in [CONTINUATION_PLAN.md](CONTINUATION_PLAN.md). The sole observed GitHub operator currently filling these seats is **Danny** (`scrimshawlife-ctrl`). Recording that login is not leadership approval, READY, or a freeze SHA.

#### FundingDecision

| Field | Role owner | Notes |
|-------|------------|--------|
| `schemaVersion` | AGI engineering | Date-string contract steward |
| `allocationId` | Portfolio Signals owner | Issued at decision publish time; join key |
| `fundName` | Portfolio Signals owner | Human-readable fund label |
| `rationale` | Portfolio Signals owner | Public-safe approved decision text |
| `status` | Portfolio Signals owner | Narrative contract currently models `"approved"` |
| `publishedAt` | Portfolio Signals owner | ISO-8601 publication time |

#### ImpactEvent

| Field | Role owner | Notes |
|-------|------------|--------|
| `schemaVersion` | AGI engineering | Same version as the decision |
| `allocationId` | Portfolio Signals owner | Join key; Impact Relay owner echoes the same value |
| `eventId` | Impact Relay owner | Stable public event identity |
| `type` | Impact Relay owner | Mapped suite event taxonomy |
| `occurredAt` | Impact Relay owner | ISO-8601 occurrence time |
| `verificationStatus` | Impact Relay owner | Normalized from `evidenceState` |
| `evidenceReference` | Impact Relay owner | Public-safe pointer only |

Machine-readable copies live in `FUNDING_DECISION_FIELD_OWNERS` and `IMPACT_EVENT_FIELD_OWNERS`.

## Public-data rules

The following remain the implemented fail-closed rules. The consolidated evidence-access, retention, redaction, and public-publication draft is [PUBLIC_DATA_POLICY.md](PUBLIC_DATA_POLICY.md) and is **PROPOSED**. It is not approved.

- Join only by `allocationId`, never donor identity.
- Accept only documented public authority values.
- Evidence references identify approved public records; they are not raw documents, personal data, or secret URLs.
- Treat `verified` as a source-system state, not individual donor attribution.
- Do not infer evidence from unknown, delayed, malformed, or rejected records.
- Keep the deterministic fixture available for development and failure handling.

## Change management

Narrative contracts use a **date-string** `schemaVersion` (`INTEGRATION_CONTRACT_VERSION`). This is distinct from platform-spec SemVer in [SPEC-012](https://github.com/Autonomous-Giving-Incorporated/Autonomous-Giving-Specs/blob/v2.0.0/specs/SPEC-012-versioning.md) (this repo pins `2.0.0`) and from public-document `version` strings (`1.0.0` on campaign/impact JSON).

A contract change must include:

1. a version change when compatibility is affected (field remove/rename, enum narrowing, authority change, or join-key rule change);
2. updated deterministic fixtures;
3. source ownership for every new field;
4. public-data, retention, and redaction review against the [PROPOSED policy](PUBLIC_DATA_POLICY.md);
5. validation and fallback tests;
6. corresponding updates in Portfolio Signals and Impact Relay when the shared vocabulary changes.

Additive optional fields may keep the same date-string version if consumers treat unknown fields as ignorable. AGI fail-closed behavior must remain intact across version bumps. This Phase C draft does not bump `2026-08-02` because it does not change live product semantics.

Runtime APIs, authentication, credentials, and write operations remain outside this contract. See [ARCHITECTURE.md](ARCHITECTURE.md), [CONTINUATION_PLAN.md](CONTINUATION_PLAN.md), and [THREE_REPO_INTEGRATION.md](THREE_REPO_INTEGRATION.md).
