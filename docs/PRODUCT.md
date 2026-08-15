# Product definition

## Purpose

Traditional giving commonly ends with a transaction receipt. AGI makes the next steps legible by connecting funding rationale, approved allocation, public-safe evidence, and verified aggregate outcomes in one understandable story.

## Primary audience

- donors evaluating whether a contribution produced an observable result;
- nonprofit leaders explaining how decisions and evidence connect;
- philanthropic operators reviewing the boundaries between recommendation, execution, and verification.

## Product role

AGI is the explanatory public entry point to the AGI product suite:

- **Portfolio Signals** publishes decision and campaign context;
- **AGI** explains the funding-to-evidence journey;
- **Impact Relay** publishes verified aggregate outcomes and evidence state.

The products share a visual and navigation foundation but keep separate authority and data responsibilities.

## Allocation middleware

In addition to the public workbench, the suite ships a **transaction-light allocation middleware**: connect donation platforms (canonical **every.org**), maintain campaign/program **pots**, human-approve **allocations**, automate the rest via an **exception inbox**, and produce board **packets**.

**Status:** MVP implemented in Portfolio Signals (`services/allocation-middleware/`); Hacker Dojo pilot seed ready; live webhook + hosted host operator-owned. This AGI repo remains the public narrative surface.

Full product note: [PRODUCT-ALLOCATION-MIDDLEWARE.md](PRODUCT-ALLOCATION-MIDDLEWARE.md). Design: [Specs design doc](https://github.com/Autonomous-Giving-Incorporated/Autonomous-Giving-Specs/blob/v2.0.0/docs/superpowers/specs/2026-08-03-allocation-middleware-design.md).

## Current experience

A visitor can:

1. understand the gap between a receipt and evidence of impact;
2. inspect approved public signals from Portfolio Signals and Impact Relay;
3. replay a deterministic $250 community-hardware scenario;
4. see how allocation, purchase, activity, verification, and notification relate;
5. continue to the decision or evidence product for more context.

## Product principles

- Evidence over assertion.
- Clarity over information volume.
- Deterministic behavior over simulated integration.
- Explicit authority and provenance over implied certainty.
- Accessibility and responsive behavior as release requirements.
- Public aggregate data over donor-level exposure.

## Non-goals

The current product is not a donation processor, donor portal, CRM, evidence repository, authenticated dashboard, notification service, or system of record. It does not establish causal impact or one-to-one donor attribution.

See [ROADMAP.md](ROADMAP.md) for planned outcomes and [INTEGRATION_CONTRACTS.md](INTEGRATION_CONTRACTS.md) for data boundaries.
