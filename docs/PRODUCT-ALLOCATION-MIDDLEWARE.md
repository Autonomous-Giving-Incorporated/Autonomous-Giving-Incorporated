# Product: Allocation middleware

**Status:** MVP implemented (Portfolio Signals) · **local pilot smoke PASS** (platform Supabase) · production host pending  
**Date:** Design approved 2026-08-03 · Status refresh 2026-08-07  
**Canonical design:** [Autonomous-Giving-Specs design doc](https://github.com/Autonomous-Giving-Incorporated/Autonomous-Giving-Specs/blob/v2.0.0/docs/superpowers/specs/2026-08-03-allocation-middleware-design.md) (pin `v2.0.0`; do not track floating `main`)

## One-sentence pitch

AGI sits **between** donation platforms (starting with **every.org**) and human decision-makers: show **enough numbers to allocate**, keep a **use-of-funds trail**, and run day-to-day as an **exception inbox**—not as accounting software.

## Who it is for

| Persona | Care about |
| --- | --- |
| Nonprofit / program director | Allocate without re-keying gifts |
| Foundation / funder staff | Trust the trail without PDF chase |
| Board / campaign director | One packet that matches the numbers |

## What clients do not get

- Bank/Plaid/QuickBooks depth  
- Payment checkout replacement  
- Three separate products to learn  

## Client language

Campaign **pots** (from every.org fundraisers) → program **slices** (from designations) → **allocate** → **proof** → **packet**.

## Screens

Available · Allocate · Inbox · Trail · Packet · Settings (every.org + mapping)

## Suite roles

| Surface | Contribution | Status |
| --- | --- | --- |
| **AGI** | Brand + public narrative of funding-to-evidence | Public workbench shipped; middleware UX entry still via Portfolio Signals package |
| **Portfolio Signals** | Hosts MVP package: gift credit, pots, allocate, proof, packet | **MVP shipped**; local pilot against platform Auth green; public host open |
| **Impact Relay** | Long-term proof/trail discipline and public-safe projections | Role documented; deep IR ledger binding later |

Platform pin: Specs **v2.0.0** capability-first modular monolith ([SPEC-002A](https://github.com/Autonomous-Giving-Incorporated/Autonomous-Giving-Specs/blob/v2.0.0/specs/SPEC-002A-architectural-principles.md), [SPEC-020](https://github.com/Autonomous-Giving-Incorporated/Autonomous-Giving-Specs/blob/v2.0.0/specs/SPEC-020-reference-deployment-profiles.md)). Documentation pin only — not READY or runtime conformance.

**Money lock:** AGI never processes donations. Stripe is tenant/SaaS billing only. Gift tracking is third-party connectors (P0 every.org). **Host lock:** Cloudflare + existing Supabase. Render / Fly / Railway / Cloud Run are historical or optional only.

## Connector priority

1. **every.org** (canonical) — webhook, not OAuth  
2. Manual pots + CSV  
3. Givebutter, Donorbox, …  

## Implementation snapshot

| Item | State |
| --- | --- |
| Code home | [Portfolio Signals `services/allocation-middleware/`](https://github.com/Autonomous-Giving-Incorporated/Portfolio-Signals/tree/main/services/allocation-middleware) |
| Pilot tenant | `org_hacker_dojo` + seed fixtures |
| Director login | Existing platform Supabase JWT + membership (`/login.html`) |
| Durable data/auth | Existing platform Supabase (`utdioxwiskzatwoejgiu`) |
| Public host | Cloudflare (live); Vercel rollback. Not Render/Fly/Railway |
| Live every.org gifts | Operator-owned (setup wizard ready) |

Portfolio Signals docs: [ALLOCATION-MIDDLEWARE](https://github.com/Autonomous-Giving-Incorporated/Portfolio-Signals/blob/main/docs/ALLOCATION-MIDDLEWARE.md) · [pilot](https://github.com/Autonomous-Giving-Incorporated/Portfolio-Signals/blob/main/docs/HACKER-DOJO-ALLOCATION-PILOT.md) · [director login](https://github.com/Autonomous-Giving-Incorporated/Portfolio-Signals/blob/main/docs/ALLOCATION-DIRECTOR-LOGIN.md)

## Success (first client)

Gifts credit **Available** automatically; allocate in minutes; inbox is daily ops; board packet needs no spreadsheet rebuild.
