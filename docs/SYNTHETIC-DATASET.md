# AutoGive Synthetic Dataset v1

Labeled **SYNTHETIC_ONLY** Civic Forge pack for this public workbench.
It is not the SPEC-011 Community AI Lab demo, not the Hacker Dojo
reference tenant, not Every.org, and not `OBSERVED`.

```yaml
dataset: autogive-synthetic-dataset
version: 1.0.0
seed: 20260821
classification: SYNTHETIC_ONLY
tenant_id: org_synthetic_civic_forge
campaign_id: cmp_synthetic_builder_fund_2026
```

AGI never processes donations. This pack is a join-key and schema fixture
only. Live build-time fetches stay on Portfolio Signals / Impact Relay
`data/public-*.json`. Fail-closed fallback stays Community AI Lab.

## Where it lives

| Path | Surface |
|---|---|
| `integration/fixtures/civic-forge-tenant.json` | Tenant identity (`client_id == tenant_id`) |
| `integration/fixtures/civic-forge-public-campaign.json` | Matches PS public-campaign shape |
| `integration/fixtures/civic-forge-public-impact.json` | Matches IR public-impact shape |
| `integration/fixtures/civic-forge-narrative.json` | Hardware `FundingDecision` + mapped events |
| `integration/civic-forge.ts` | Constants |

NATIVE gifts live in [Portfolio Signals PR 47](https://github.com/Autonomous-Giving-Incorporated/Portfolio-Signals/pull/47).
BRIDGE ledger and outcomes live in [Impact Relay PR 12](https://github.com/Autonomous-Giving-Incorporated/Impact-Relay/pull/12).

## Stable allocation IDs

```text
alloc_community_hardware
alloc_access_scholarships
alloc_facility_resilience
alloc_community_programs
```

`alloc_community_programs` is `proposed` only. Do not treat it as an approved
narrative decision.

## Commands

```bash
npm test -- integration/civic-forge-synthetic-v1.test.ts
```

Do not point `FUND_INTEL_PUBLIC_URL` or `IMPACT_RELAY_PUBLIC_URL` at these files.
