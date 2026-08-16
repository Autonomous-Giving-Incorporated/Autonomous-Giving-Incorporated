# AGI Platform Foundation + Workspace Login

**Date:** 2026-08-06  
**Status:** PARKED (2026-08-16 PT) — login, secrets, and director acceptance wait. Historical design; not complete. See [2026-08-16-autogive-app-finish-design.md](./2026-08-16-autogive-app-finish-design.md).  
**Owner:** Zero State / AGI suite  
**Depends on:** [2026-08-06-agi-suite-vercel-public-design.md](./2026-08-06-agi-suite-vercel-public-design.md) (public suite live)  
**Supersedes for data plane:** legacy HD staging project as home for new tenancy  

**Implementation note:** Code and docs ship on Fund-Intel `ops/platform-foundation` (runtime host allowlist, migration scripts retargeted to platform, master_admin SQL templates, Vercel runtime-config generator, documentation cutover). **Operator applies migrations** to `utdioxwiskzatwoejgiu`, invites Auth users, sets Vercel `PLATFORM_*` anon env, and completes magic-link smoke — those live steps are not claimed complete by this status alone.

---

## 1. Problem

Public suite surfaces are live under `autogive.app`, but multi-tenant **platform** work must use the canonical Supabase project. Fund-Intel migrations cover clients, memberships, master admin, workspace context, and MFA hardening. Docs and tooling default to platform **`utdioxwiskzatwoejgiu`**; legacy staging `ecxkhihlbrcwpavfoaoq` is frozen for new tenancy so operator login and client isolation do not fragment.

## 2. Goals

1. Apply Fund-Intel schema to platform Supabase **`utdioxwiskzatwoejgiu`** only.
2. Establish **scrimshawlife@gmail.com** as first **`master_admin`** (Qi Diaz / second admin later without redesign).
3. Seed **synthetic** tenants for isolation proof (including Hacker Dojo reference + second tenant).
4. Enable **magic-link** sign-in to Portfolio Signals **workspace** on production path  
   `https://autogive.app/portfolio-signals/workspace` (and/or `workspace.html` as implemented).
5. Wire **anon-only** runtime config on Vercel project `fund-intel`.
6. Keep public suite smoke green; no service role in browser or public env.

## 3. Non-goals

| Out of scope | Why |
| --- | --- |
| Real CRM / workbook import | Separate authority gates (HD-OI-020+) |
| Allocation middleware / every.org live webhooks | Phase 3+ |
| Impact Relay Cloud Run / durable API host | Separate deploy |
| Greenfield admin schema rewrite | Duplicates existing migrations |
| AGI marketing site as admin console | Admin stays Fund-Intel workspace / platform path |
| Creating Qi Diaz account in this ship | Documented follow-up only |

## 4. Product rules (locked)

From suite product canon:

- AGI sells multi-tenant Portfolio Signals + Impact Relay + agentic framework.
- **AGI admin (`master_admin`)** provisions clients; does not inherently access tenant-private fundraising data.
- **Client director** operates inside one tenant (`client_memberships`).
- `clients.id` (Portfolio Signals) = `tenant_id` (Impact Relay).
- Public `autogive.app` narrative is not the multi-tenant control plane.

## 5. Architecture

### 5.1 Topology

```text
scrimshawlife@gmail.com
        │ magic link
        ▼
Supabase Auth  ──►  profiles (master_admin)
        │
        ▼
Postgres + RLS   project: utdioxwiskzatwoejgiu
        │
        ├── clients (provisioning / active)
        ├── client_memberships
        ├── workspace context RPCs
        └── synthetic fixtures (HD + tenant B)

Browser
  https://autogive.app/portfolio-signals/workspace
        │ runtime-config.js (URL + anon key only)
        ▼
  workspace.html shell → Supabase JS client
```

### 5.2 Hosts and projects

| Resource | Value |
| --- | --- |
| Platform Supabase ref | `utdioxwiskzatwoejgiu` |
| API host | `https://utdioxwiskzatwoejgiu.supabase.co` |
| Dashboard | https://supabase.com/dashboard/project/utdioxwiskzatwoejgiu |
| Schema source | `Fund-Intel/supabase/migrations` |
| Workspace URL | `https://autogive.app/portfolio-signals/workspace` (rewrite to fund-intel project) |
| Vercel project | `fund-intel` (team `scrimshawlife-8819s-projects`) |
| Legacy staging (freeze) | `ecxkhihlbrcwpavfoaoq` |

### 5.3 Approach

**Apply existing migrations + bootstrap operator + Vercel anon runtime config.**  
Do not invent a second schema. Do not continue new tenancy on legacy staging.

## 6. Bootstrap sequence

Operator steps that require **service role** or dashboard access stay **out of git**. Implementation plan will list exact commands; this design binds the order.

1. **CLI link**  
   `supabase link --project-ref utdioxwiskzatwoejgiu` from Fund-Intel repo (with access token).

2. **Migrate**  
   Push all migrations in dependency order. Confirm remote migration list matches repo.

3. **Auth configuration (dashboard)**  
   - Enable email magic link (or keep if already on).  
   - Site URL / additional redirect URLs must include production workspace URLs under `autogive.app/portfolio-signals/`.  
   - Optional: localhost for local workspace testing.

4. **Create operator user**  
   Invite or create Auth user **scrimshawlife@gmail.com**.

5. **Promote master_admin**  
   Set profile flags / memberships per existing SQL helpers (`is_master_admin` / profiles) so `get_workspace_context()` reports master admin. Prefer audited, documented SQL/RPC — not ad-hoc silent grants.

6. **Synthetic tenants**  
   Ensure at least:
   - `org_hacker_dojo` (reference),
   - second client (e.g. existing test org from foundation tests)  
   with isolation coverage aligned to `supabase/tests` tenant foundation cases.

7. **Director membership**  
   Only if required for director-path UI smoke; master_admin alone must not imply private CRM read of all tenants.

8. **Vercel / GitHub env (anon only)**  
   - URL → platform host  
   - Anon key → platform anon  
   Prefer names `PLATFORM_SUPABASE_URL` / `PLATFORM_SUPABASE_ANON_KEY` with temporary aliases from old `STAGING_*` if needed for existing scripts.

9. **Generate runtime-config**  
   Extend fund-intel deploy (or prebuild step) to write gitignored `runtime-config.js` from env (same pattern as Pages `generate-runtime-config`).

10. **Redeploy fund-intel** production so workspace can load config.

11. **Login smoke**  
    Operator completes magic link → workspace loads → context shows master admin.

12. **Doc cutover**  
    STAGING-BOOTSTRAP / AUTHENTICATED-WORKSPACE / PLATFORM / DATA-PLACEMENT (and AGI PLATFORM.md) point at platform; legacy project marked freeze/retire. **Done** in Task 9.

## 7. Security and privacy

| Rule | Enforcement |
| --- | --- |
| No service role in browser | Config generator only emits URL + anon |
| No secrets in git | `.gitignore` already covers `runtime-config.js`, `.env*` |
| RLS authoritative | All operational queries tenant-scoped; browser selection is not authority |
| MFA | Keep schema rules; first operator path must be documented if MFA blocks bootstrap (dashboard MFA settings + `mfa_enforced` alignment) |
| Synthetic only | No real workbook load in this ship |
| Audit | Prefer existing audit RPCs for membership/admin mutations |

## 8. Testing / acceptance

| # | Check | Pass |
| --- | --- | --- |
| 1 | Migrations applied on platform | Remote list complete |
| 2 | Magic link for scrimshawlife@gmail.com | Session on workspace URL |
| 3 | Workspace context | `is_master_admin` true (or equivalent) |
| 4 | Isolation | Director fixture cannot read other tenant (SQL test or policy suite) |
| 5 | Unauthenticated workspace | Auth gate only; no private tables exposed |
| 6 | Public suite | `./scripts/smoke-public-suite.sh` still passes |
| 7 | Env hygiene | Vercel env has no service role key |

## 9. Failure modes

| Failure | Response |
| --- | --- |
| Redirect URL not allowlisted | Magic link lands wrong; fix Auth URL config |
| Migrations fail mid-way | Halt; fix forward on platform only; do not dual-write legacy |
| Runtime config missing | Workspace cannot talk to Supabase; redeploy generator |
| MFA deadlock for first admin | Temporarily align profile MFA flags per existing production-hardening guidance; document |
| Dual project confusion | PLATFORM.md remains single source; reject PRs targeting legacy for new tenants |

## 10. Follow-ups (explicitly deferred)

1. Invite **Qi Diaz** (or second email) as additional `master_admin` via `platform_administrators` insert with rationale ≥ 12 chars.  
2. Full commercial onboarding path: provision → publish config → activate client.  
3. Real import authority gates.  
4. Allocation middleware host + every.org.  
5. Retire legacy Supabase project after data confirmation.  
6. Operator residual: apply migrations on platform, Auth invite for `scrimshawlife@gmail.com`, Vercel `PLATFORM_SUPABASE_URL` / `PLATFORM_SUPABASE_ANON_KEY`, login smoke on https://autogive.app/portfolio-signals/workspace .

## 11. Implementation units (for planning)

1. Platform link + migrate + verify migration inventory.  
2. Auth URL config + create operator user + master_admin promotion.  
3. Synthetic tenant seed / policy isolation verification.  
4. Vercel/GitHub env + runtime-config generation for fund-intel.  
5. Redeploy + login smoke + public suite regression.  
6. Project-wide doc retarget (FI bootstrap docs, AGI PLATFORM.md phase status).

## 12. Success definition

Operator can sign in with magic link on production workspace URL against **platform** Supabase, is recognized as AGI master admin, synthetic multi-tenant isolation holds, public site still green, and **no** second database is used for new tenancy.
