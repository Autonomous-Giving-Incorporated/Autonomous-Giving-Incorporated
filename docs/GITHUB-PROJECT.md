# AGI suite — GitHub Project

One **Projects (v2)** board owns delivery across all suite repositories.

**Live board:** https://github.com/users/scrimshawlife-ctrl/projects/3  

## Linked repositories

| Repo | Role |
| --- | --- |
| [Autonomous-Giving-Incorporated](https://github.com/scrimshawlife-ctrl/Autonomous-Giving-Incorporated) | Public workbench + suite narrative |
| [Fund-Intel](https://github.com/scrimshawlife-ctrl/Fund-Intel) | Decision workspace + allocation middleware host |
| [Impact-Relay](https://github.com/scrimshawlife-ctrl/Impact-Relay) | Evidence / ledger / receipts |
| [Autonomous-Giving-Specs](https://github.com/scrimshawlife-ctrl/Autonomous-Giving-Specs) | Platform specs (no app code) |

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

## Allocation pilot (Fund-Intel)

| Issue | Priority | Status |
| --- | --- | --- |
| [#71](https://github.com/scrimshawlife-ctrl/Fund-Intel/issues/71) optional public host | P1 | **Done** — ephemeral HTTPS (cloudflared) OBSERVED; durable named host optional |
| [#72](https://github.com/scrimshawlife-ctrl/Fund-Intel/issues/72) Supabase director membership | P0 | **Done** — director JWT path OBSERVED |
| [#73](https://github.com/scrimshawlife-ctrl/Fund-Intel/issues/73) live every.org webhook | P0 | **Todo** — operator setup (live webhook) |
| [#74](https://github.com/scrimshawlife-ctrl/Fund-Intel/issues/74) director acceptance | P0 | **In Progress** — seed-loop allocate→proof→packet OBSERVED; live gift + browser sign-off remain |

## Tracks (current)

### Allocation middleware (active)

- MVP package in Fund-Intel `services/allocation-middleware/`  
- Local Node default; durable data/auth on existing Supabase; public HTTPS on Cloudflare (designed). Do not add Render, Fly, or Railway as remaining hosts.
- Director JWT path closed (#72); seed-loop accept In Progress (#74)  
- Remaining: [#73](https://github.com/scrimshawlife-ctrl/Fund-Intel/issues/73) every.org webhook · full [#74](https://github.com/scrimshawlife-ctrl/Fund-Intel/issues/74) browser sign-off

### Hacker Dojo campaign (HD-OI)

- HD-OI-019 hardening, import gates, evidence boundary  
- Separate from allocation middleware but same campaign tenant  

### Platform specs

- Specs v1.x pin, conformance manifests, design docs under `docs/superpowers/`  

### Public suite surfaces

- AGI public workbench on Cloudflare (static); Vercel until autogive.app DNS cutover  

### Ops — operator access / commercial onboarding

- **Hub:** Fund-Intel / Portofolio-Signals `docs/SUITE-ONBOARDING.md`  
- People path (C): Fund-Intel `docs/OPERATOR-ACCESS-ONBOARDING.md`  
- Client lifecycle (B): Fund-Intel `docs/COMMERCIAL-CLIENT-LIFECYCLE.md`  
- **Document pack:** Fund-Intel `docs/CLIENT-ONBOARDING-PACK.md` (code #104; platform apply PENDING)  
- Second tenant (D): Fund-Intel `docs/SECOND-TENANT-ONBOARDING.md`  
- Allocation pilot: Fund-Intel `docs/HACKER-DOJO-ALLOCATION-PILOT.md` · `docs/CURRENT-STATE.md`

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
- Allocation middleware work lives primarily in **Fund-Intel** issues; Specs holds design-only items.  
- Do not put secrets, donor PII, or operator tokens in issue bodies.  
