# Product: Allocation middleware

**Status:** MVP implemented (Fund-Intel) · **local pilot smoke PASS** (platform Supabase) · production host pending  
**Date:** Design approved 2026-08-03 · Status refresh 2026-08-07  
**Canonical design:** [Autonomous-Giving-Specs design doc](https://github.com/scrimshawlife-ctrl/Autonomous-Giving-Specs/blob/main/docs/superpowers/specs/2026-08-03-allocation-middleware-design.md)

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
| **AGI** | Brand + public narrative of funding-to-evidence | Public workbench shipped; middleware UX entry still via Fund-Intel package |
| **Portfolio Signals** | Hosts MVP package: gift credit, pots, allocate, proof, packet | **MVP shipped**; local pilot against platform Auth green; public host open |
| **Impact Relay** | Long-term proof/trail discipline and public-safe projections | Role documented; deep IR ledger binding later |

Platform pin: Specs **v1.x** capability-first modular monolith ([SPEC-002A](https://github.com/scrimshawlife-ctrl/Autonomous-Giving-Specs/blob/main/specs/SPEC-002A-architectural-principles.md), [SPEC-020](https://github.com/scrimshawlife-ctrl/Autonomous-Giving-Specs/blob/main/specs/SPEC-020-reference-deployment-profiles.md)).

## Connector priority

1. **every.org** (canonical) — webhook, not OAuth  
2. Manual pots + CSV  
3. Givebutter, Donorbox, …  

## Implementation snapshot

| Item | State |
| --- | --- |
| Code home | [Fund-Intel `services/allocation-middleware/`](https://github.com/scrimshawlife-ctrl/Fund-Intel/tree/main/services/allocation-middleware) |
| Pilot tenant | `org_hacker_dojo` + seed fixtures |
| Director login | Existing platform Supabase JWT + membership (`/login.html`) |
| Durable data/auth | Existing platform Supabase (`utdioxwiskzatwoejgiu`) |
| Public host | Cloudflare (designed); Vercel until autogive.app DNS cutover. Not Render/Fly/Railway |
| Live every.org gifts | Operator-owned (setup wizard ready) |

Fund-Intel docs: [ALLOCATION-MIDDLEWARE](https://github.com/scrimshawlife-ctrl/Fund-Intel/blob/main/docs/ALLOCATION-MIDDLEWARE.md) · [pilot](https://github.com/scrimshawlife-ctrl/Fund-Intel/blob/main/docs/HACKER-DOJO-ALLOCATION-PILOT.md) · [director login](https://github.com/scrimshawlife-ctrl/Fund-Intel/blob/main/docs/ALLOCATION-DIRECTOR-LOGIN.md)

## Success (first client)

Gifts credit **Available** automatically; allocate in minutes; inbox is daily ops; board packet needs no spreadsheet rebuild.
