# Documentation

This directory is the source of truth for AGI product intent, architecture, design, delivery, and release evidence.

## Start here

| Document                                          | Use it for                                                      |
| ------------------------------------------------- | --------------------------------------------------------------- |
| [Product](PRODUCT.md)                             | Current users, value proposition, scope, and non-goals          |
| [Allocation middleware](PRODUCT-ALLOCATION-MIDDLEWARE.md) | Client ops product (MVP in Portfolio Signals; pilot next)        |
| [Architecture](ARCHITECTURE.md)                   | Runtime model, trust boundaries, components, and deployment     |
| [Custom domain](CUSTOM-DOMAIN.md)                 | autogive.app DNS (Cloudflare intended; Vercel until cutover)    |
| [Platform canon](PLATFORM.md)                       | Suite hosts, Supabase platform ref, phase map              |
| [Cloudflare](CLOUDFLARE.md)                       | Designed public host (Cloudflare + existing Supabase stack)     |
| [Vercel](VERCEL.md)                               | Fallback host until DNS cutover; keep vercel.json               |
| [Integration contracts](INTEGRATION_CONTRACTS.md) | Accepted public inputs, validation rules, and fallback behavior |
| [Three-repo integration](THREE_REPO_INTEGRATION.md) | Full cross-repository surface, checklist, and ownership       |
| [Contract governance](CONTRACT_GOVERNANCE.md)     | Phase C field ownership, vocabulary, fixtures, versioning       |
| [Suite glossary](SUITE_GLOSSARY.md)               | Shared `allocationId` and status vocabulary                     |
| [Public-data policy](PUBLIC_DATA_POLICY.md)       | PROPOSED evidence, retention, redaction, publication rules      |
| [Design system](DESIGN_SYSTEM.md)                 | AGI identity, tokens, composition, and accessibility             |

## Planning

| Document                                      | Use it for                                    |
| --------------------------------------------- | --------------------------------------------- |
| [Roadmap](ROADMAP.md)                         | Ordered product outcomes and release horizons |
| [Continuation plan](CONTINUATION_PLAN.md)     | Detailed next phases, gates, and ownership    |
| [Implementation plan](IMPLEMENTATION_PLAN.md) | Engineering sequence and definition of done   |
| [AGI vs Specs audit](AGI_SPEC_AUDIT_2026-08-15.md) | 2026-08-15 conformance, boundary, and contamination audit |

## Operations and history

| Document                                  | Use it for                                                  |
| ----------------------------------------- | ----------------------------------------------------------- |
| [Release checklist](RELEASE_CHECKLIST.md) | Pre-merge, deployment, and post-release verification        |
| [Release record](RELEASES.md)             | Immutable links to shipped commits, PRs, CI, and Pages runs |
| [Vision](VISION.md)                       | Long-term product direction and principles                  |

## Maintenance rules

- Update architecture when data flow, deployment, or trust boundaries change.
- Update integration contracts when accepted fields, authority values, or fallback behavior change.
- Update the roadmap for priority changes; keep implementation details in the continuation or implementation plan.
- Add a release record after every material production change.
- Prefer links to canonical documents over duplicated descriptions.
