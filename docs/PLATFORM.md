# AGI suite platform canon

Single source of truth for **where** the suite lives so work does not fragment across hosts, projects, or databases.

**Designed stack:** Cloudflare (public static site and ingress) + existing Supabase (durable data and auth). This public AGI site stays static. Vercel is fallback until `autogive.app` DNS cutover. Do not add Render, Fly, Railway, or a second database.

## Product (locked)

- **AGI** sells multi-tenant Portfolio Signals + Impact Relay + agentic framework.
- **AGI admin** provisions clients; each client has isolated login and data.
- **autogive.app** public site is brand + evidence narrative — not the admin console.

See [superpowers/specs/2026-08-06-agi-suite-vercel-public-design.md](./superpowers/specs/2026-08-06-agi-suite-vercel-public-design.md).

## Hosting (public surfaces)

| Surface | Path on apex | Host | Repo |
| --- | --- | --- | --- |
| AGI workbench | `/` | Cloudflare Worker `agi-public` (intended); Vercel `autonomous-giving-incorporated` until DNS cutover | Autonomous-Giving-Incorporated |
| Portfolio Signals public | `/portfolio-signals/` | Proxied to `fund-intel` → https://fund-intel-ten.vercel.app | [Portfolio-Signals](https://github.com/Autonomous-Giving-Incorporated/Portfolio-Signals) |
| Portfolio Signals workspace | `/portfolio-signals/workspace` | same `fund-intel` project | [Portfolio-Signals](https://github.com/Autonomous-Giving-Incorporated/Portfolio-Signals) |
| Impact Relay public | `/impact-relay/` | Proxied to `impact-relay` → https://impact-relay.vercel.app | Impact-Relay |

**Apex domain:** `https://autogive.app` (www also attached).  
**AGI production path:** [CLOUDFLARE.md](CLOUDFLARE.md) (intended) · [VERCEL.md](VERCEL.md) (live until cutover).  
**Workspace production URL:** https://autogive.app/portfolio-signals/workspace

GitHub Pages remains optional fallback only. Do not merge Portfolio Signals or Impact Relay into this repository.

## Supabase (data plane)

| Role | Project ref | Host |
| --- | --- | --- |
| **Platform (canonical)** | `utdioxwiskzatwoejgiu` | `https://utdioxwiskzatwoejgiu.supabase.co` |
| **Dashboard** | — | https://supabase.com/dashboard/project/utdioxwiskzatwoejgiu |
| **Legacy HD staging (freeze)** | `ecxkhihlbrcwpavfoaoq` | `https://ecxkhihlbrcwpavfoaoq.supabase.co` |

**Rules:**

1. New tenancy, AGI admin, and multi-client work use **platform** only (`utdioxwiskzatwoejgiu`).
2. Do not create a third Supabase project without updating this file first.
3. Browser may use **anon** key only; never commit service-role keys.
4. Schema source of truth: [Portfolio-Signals](https://github.com/Autonomous-Giving-Incorporated/Portfolio-Signals) `supabase/migrations`. **Operator applies migrations** to platform when linking (`supabase link --project-ref utdioxwiskzatwoejgiu`).
5. Legacy `ecxkhihlbrcwpavfoaoq` is frozen for new tenancy.

## Platform administration

| Item | Value |
| --- | --- |
| Primary `master_admin` | `scrimshawlife@gmail.com` |
| Second `master_admin` | `qi@enkeyai.com` (Qi Diaz) — granted 2026-08-08; MFA enroll still required |
| Operator SQL | [Portfolio-Signals](https://github.com/Autonomous-Giving-Incorporated/Portfolio-Signals) `scripts/platform/` (bootstrap + isolation) |

Operator onboarding hub ([Portfolio-Signals](https://github.com/Autonomous-Giving-Incorporated/Portfolio-Signals)): `docs/SUITE-ONBOARDING.md` (C→B→doc pack→D→pilot; done without login vs needs every.org/admin). People path: `docs/OPERATOR-ACCESS-ONBOARDING.md`. Document pack: `docs/CLIENT-ONBOARDING-PACK.md` (platform schema + Edge OBSERVED 2026-08-08; MFA workspace dry-run still PENDING — [Portfolio-Signals #18](https://github.com/Autonomous-Giving-Incorporated/Portfolio-Signals/issues/18)).

## Shared identifiers

- Portfolio Signals `clients.id` = Impact Relay `tenant_id`.
- Reference regression tenant: Hacker Dojo (`org_hacker_dojo`) — fixture, not global default.

## Smoke

From AGI repo after public deploys:

```bash
./scripts/smoke-public-suite.sh
```

## Phase map

| Phase | Deliverable | Status |
| --- | --- | --- |
| Public (now) | Path-prefixed static FI/IR under autogive.app + smoke | Live |
| Phase 2 | Platform Supabase + AGI admin + tenant director login | **Operator-complete** — migrations on `utdioxwiskzatwoejgiu`, Vercel `PLATFORM_*` anon, master_admin + HD director, workspace magic-link login verified |
| Phase 3 | Allocation middleware pilot + IR live cohort + every.org | **In progress** — unit tests + local Node pilot + director JWT + ephemeral public HTTPS OBSERVED; seed allocate→proof→packet OBSERVED; Worker allocation API + every.org webhook **CODE_SHIPPED**; live named host + every.org pointing + director acceptance still **PENDING** ([Portfolio-Signals #20](https://github.com/Autonomous-Giving-Incorporated/Portfolio-Signals/issues/20)) |
| Phase 3+ | Agentic ops, dual-control at scale | Planned |

## Phase 2 design

[Platform foundation + workspace login](./superpowers/specs/2026-08-06-agi-platform-foundation-design.md) — **Implemented and operator-verified** (workspace login on production). Residual hygiene: rotate chat-shared secrets; optional custom SMTP for email OTP volume.

[Portfolio-Signals](https://github.com/Autonomous-Giving-Incorporated/Portfolio-Signals) operator docs (retargeted to platform):

- Bootstrap: Portfolio-Signals `docs/STAGING-BOOTSTRAP.md`
- Workspace: Portfolio-Signals `docs/AUTHENTICATED-WORKSPACE.md`
- Alignment: Portfolio-Signals `docs/PLATFORM.md` · suite current-state: Portfolio-Signals `docs/CURRENT-STATE.md` (recorded 2026-08-15)
