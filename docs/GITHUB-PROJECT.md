# AGI suite — GitHub Project

One **Projects (v2)** board owns delivery across all suite repositories.

**Live board:** https://github.com/users/scrimshawlife-ctrl/projects/3  

## Linked repositories

| Repo | Role |
| --- | --- |
| [Autonomous-Giving-Incorporated](https://github.com/Autonomous-Giving-Incorporated/Autonomous-Giving-Incorporated) | Public workbench + suite narrative |
| [Portfolio-Signals](https://github.com/Autonomous-Giving-Incorporated/Portfolio-Signals) | Decision workspace + allocation middleware host (formerly Fund-Intel) |
| [Impact-Relay](https://github.com/Autonomous-Giving-Incorporated/Impact-Relay) | Evidence / ledger / receipts |
| [Autonomous-Giving-Specs](https://github.com/Autonomous-Giving-Incorporated/Autonomous-Giving-Specs) | Platform specs (no app code); pin **v2.0.0** |

## Board fields (configured)

| Field | Options |
| --- | --- |
| **Status** | Todo · In Progress · Done |
| **Track** | Allocation middleware · HD-OI pilot · Platform specs · Public workbench · Ops · Cross-repo |
| **Priority** | P0 · P1 · P2 |
| **Suite Repo** | AGI · Fund-Intel · Impact-Relay · Specs · Cross-repo |
| **Repository** | Built-in (source repo of the issue/PR) |

## Status columns

Use the board **Status** field (Todo → In Progress → Done). Filter by **Track** or **Suite Repo** for swimlanes.

## Allocation pilot (Portfolio-Signals)

| Issue | Priority | Status |
| --- | --- | --- |
| [#71](https://github.com/scrimshawlife-ctrl/Fund-Intel/issues/71) optional public host | P1 | **Done** — ephemeral HTTPS (cloudflared) OBSERVED; durable named host still PENDING |
| [#72](https://github.com/scrimshawlife-ctrl/Fund-Intel/issues/72) Supabase director membership | P0 | **Done** — director JWT path OBSERVED |
| [#20](https://github.com/Autonomous-Giving-Incorporated/Portfolio-Signals/issues/20) durable host + every.org pointing + director acceptance | P0 | **Todo** — Worker CODE_SHIPPED; live named host PENDING |

## Tracks (current)

### Allocation middleware (active)

- MVP package in [Portfolio-Signals](https://github.com/Autonomous-Giving-Incorporated/Portfolio-Signals) `services/allocation-middleware/`  
- Local Node default; durable data/auth on existing Supabase; public HTTPS on Cloudflare (designed). Do not add Render, Fly, or Railway as remaining hosts.
- Director JWT path OBSERVED (#72); seed-loop allocate→proof→packet OBSERVED  
- Remaining: [#20](https://github.com/Autonomous-Giving-Incorporated/Portfolio-Signals/issues/20) durable host + every.org pointing + director acceptance

### Hacker Dojo campaign (HD-OI)

- HD-OI-019 hardening, import gates, evidence boundary  
- Separate from allocation middleware but same campaign tenant  

### Platform specs

- Specs v2.0.0 pin, conformance manifests, design docs under `docs/superpowers/`  

### Public suite surfaces

- AGI public workbench on Cloudflare (static); Vercel until autogive.app DNS cutover  

### Ops — operator access / commercial onboarding

- **Hub:** [Portfolio-Signals](https://github.com/Autonomous-Giving-Incorporated/Portfolio-Signals) `docs/SUITE-ONBOARDING.md`  
- People path (C): Portfolio-Signals `docs/OPERATOR-ACCESS-ONBOARDING.md`  
- Client lifecycle (B): Portfolio-Signals `docs/COMMERCIAL-CLIENT-LIFECYCLE.md`  
- **Document pack:** Portfolio-Signals `docs/CLIENT-ONBOARDING-PACK.md` (platform schema + Edge OBSERVED 2026-08-08; MFA dry-run still PENDING — [#18](https://github.com/Autonomous-Giving-Incorporated/Portfolio-Signals/issues/18))  
- Second tenant (D): Portfolio-Signals `docs/SECOND-TENANT-ONBOARDING.md`  
- Allocation pilot: Portfolio-Signals `docs/HACKER-DOJO-ALLOCATION-PILOT.md` · `docs/CURRENT-STATE.md` (recorded 2026-08-15)

## Bootstrap

```bash
# once: grant project scopes
gh auth refresh -h github.com -s read:project,project

# create/link project + seed items
./scripts/setup-github-project.sh
```

Script location: [`scripts/setup-github-project.sh`](../scripts/setup-github-project.sh).

## Conventions

- Prefer **issues** as the project item (not only PRs).  
- Cross-repo work: issue in AGI or Specs with checklist linking the other repos.  
- Allocation middleware work lives primarily in **Portfolio-Signals** issues; Specs holds design-only items.  
- Do not put secrets, donor PII, or operator tokens in issue bodies.  
