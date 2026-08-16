# Autonomously Giving Incorporated

[![CI](https://github.com/Autonomous-Giving-Incorporated/Autonomous-Giving-Incorporated/actions/workflows/ci.yml/badge.svg)](https://github.com/Autonomous-Giving-Incorporated/Autonomous-Giving-Incorporated/actions/workflows/ci.yml)
[![Deploy Cloudflare](https://github.com/Autonomous-Giving-Incorporated/Autonomous-Giving-Incorporated/actions/workflows/deploy-cloudflare.yml/badge.svg)](https://github.com/Autonomous-Giving-Incorporated/Autonomous-Giving-Incorporated/actions/workflows/deploy-cloudflare.yml)
[![Deploy GitHub Pages](https://github.com/Autonomous-Giving-Incorporated/Autonomous-Giving-Incorporated/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/Autonomous-Giving-Incorporated/Autonomous-Giving-Incorporated/actions/workflows/deploy-pages.yml)

Autonomously Giving Incorporated (AGI) is the corporate brand and public, evidence-first entry point for its giving platform. It explains how a funding decision can become an inspectable impact story without exposing donor records or claiming that this site moves money. Zero State is the software builder and appears only in the footer credit.

**[Visit autogive.app](https://autogive.app/)** · [GitHub Pages fallback](https://scrimshawlife-ctrl.github.io/Autonomous-Giving-Incorporated/) (historical github.io mirror)

## Product suite

| Product      | Role                                     | Live surface                                                                             |
| ------------ | ---------------------------------------- | ---------------------------------------------------------------------------------------- |
| AGI          | Explains the funding-to-evidence journey | [Public workbench](https://autogive.app/)             |
| Portfolio Signals   | Publishes decision and campaign signals  | [Decision workspace](https://autogive.app/portfolio-signals/) |
| Impact Relay | Publishes verified aggregate outcomes    | [Public evidence](https://autogive.app/impact-relay/) |

The visitor journey is **AGI → Portfolio Signals → Impact Relay**. The data narrative is **Portfolio Signals decision → AGI explanation → Impact Relay evidence**.

## Suite GitHub Project

Cross-repo delivery board for AGI, Portfolio Signals, Impact Relay, and Specs:

- [docs/GITHUB-PROJECT.md](docs/GITHUB-PROJECT.md)
- Bootstrap: [`scripts/setup-github-project.sh`](scripts/setup-github-project.sh)

## Platform specification

Pinned platform canon: **[Autonomous Giving Specs v2.0.0](https://github.com/Autonomous-Giving-Incorporated/Autonomous-Giving-Specs/releases/tag/v2.0.0)** (tag `v2.0.0`; do not track floating `main`). This is a documentation pin, not a READY or runtime-conformance claim.

**Money lock:** AGI never processes donations. Stripe is tenant/SaaS billing only. Gift tracking is third-party connectors (P0 every.org). **Host lock:** Cloudflare + existing Supabase. Render / Fly / Railway / Cloud Run are historical or optional only.

Conformance declaration: [`platform-spec/conformance.yml`](platform-spec/conformance.yml). See [`platform-spec/README.md`](platform-spec/README.md).

## Allocation middleware

Transaction-light **middleware** between donation platforms (canonical **every.org**) and human allocation: pots → allocate → proof → exception inbox → board packet. Not a finance ledger.

**Status (2026-08-15):** MVP in [Portfolio Signals `services/allocation-middleware/`](https://github.com/Autonomous-Giving-Incorporated/Portfolio-Signals/tree/main/services/allocation-middleware); unit tests + local pilot + director JWT + ephemeral public HTTPS OBSERVED; seed allocate→proof→packet OBSERVED; Worker **CODE_SHIPPED**. Live named host + every.org pointing still **PENDING** ([Portfolio-Signals #20](https://github.com/Autonomous-Giving-Incorporated/Portfolio-Signals/issues/20)). AGI stays the public explanatory workbench.

- [docs/PRODUCT-ALLOCATION-MIDDLEWARE.md](docs/PRODUCT-ALLOCATION-MIDDLEWARE.md)  
- [Full design (Specs v2.0.0)](https://github.com/Autonomous-Giving-Incorporated/Autonomous-Giving-Specs/blob/v2.0.0/docs/superpowers/specs/2026-08-03-allocation-middleware-design.md)  
- [Portfolio Signals pilot runbook](https://github.com/Autonomous-Giving-Incorporated/Portfolio-Signals/blob/main/docs/HACKER-DOJO-ALLOCATION-PILOT.md)

## Current status

AGI is a static Next.js export. The designed stack is **Cloudflare + existing Supabase**: this public site stays static on [Cloudflare Workers](docs/CLOUDFLARE.md) at [autogive.app](https://autogive.app/); durable data and auth stay on platform Supabase. [Vercel](docs/VERCEL.md) remains the live apex until DNS cutover; GitHub Pages remains a fallback mirror. Path suite:

| Path | Product |
| --- | --- |
| `/` | AGI public workbench |
| `/portfolio-signals/` | Portfolio Signals public + **workspace** login |
| `/impact-relay/` | Impact Relay public aggregates |

**Phase 2 (platform Auth + workspace), SPEC-028 runtime, Ed, and director JWT / director acceptance** are **PARKED** (2026-08-16 PT). This public site does not authenticate. Do not treat earlier operator-complete notes as current. Portfolio Signals still owns workspace login; MFA dry-run remains **PENDING** ([Portfolio-Signals #18](https://github.com/Autonomous-Giving-Incorporated/Portfolio-Signals/issues/18)). **Phase 3** allocation pilot remains in Portfolio Signals: Worker **CODE_SHIPPED**; live named host + every.org pointing + director acceptance **PENDING** ([Portfolio-Signals #20](https://github.com/Autonomous-Giving-Incorporated/Portfolio-Signals/issues/20)). Public-site Phase E brief: [docs/superpowers/specs/2026-08-16-autogive-app-finish-design.md](docs/superpowers/specs/2026-08-16-autogive-app-finish-design.md). Suite hub: [docs/PLATFORM.md](docs/PLATFORM.md) · Portfolio Signals [SUITE-ONBOARDING](https://github.com/Autonomous-Giving-Incorporated/Portfolio-Signals/blob/main/docs/SUITE-ONBOARDING.md).

During the production build AGI requests two approved public aggregate documents:

- Portfolio Signals `data/public-campaign.json`
- Impact Relay `data/public-impact.json`

The build validates both documents against the published public-campaign and public-impact shapes, accepts only the expected public authority declarations, and requires a verified aggregate outcome. Network failures, malformed data, missing evidence, disallowed authority, or data older than seven days fail closed to the deterministic local scenario. Sources older than 24 hours are labeled delayed and are not treated as current evidence.

The **AGI marketing site** does **not** collect donations, authenticate operators, persist private records, or expose donor-level evidence. Operator authentication lives on **Portfolio Signals workspace** (`/portfolio-signals/workspace`).

## Local development

### Prerequisites

- Node.js 22 or newer (`engines.node` in `package.json`)
- npm, using the committed `package-lock.json` (`npm ci`)

### Setup

```bash
git clone https://github.com/Autonomous-Giving-Incorporated/Autonomous-Giving-Incorporated.git
cd Autonomous-Giving-Incorporated
npm ci
npm run dev
```

Open `http://localhost:3000`. The site remains usable when the public sources are unavailable because the canonical scenario is bundled locally.

### Commands

| Command                             | Purpose                                      |
| ----------------------------------- | -------------------------------------------- |
| `npm run dev`                       | Start the local Next.js development server   |
| `npm run lint`                      | Run ESLint                                   |
| `npm run typecheck`                 | Type-check without emitting files            |
| `npm run build`                     | Static export to `out/` (production root path) |
| `npm run cf:build`                  | Same export, named for the Cloudflare deploy path |
| `npm run cf:preview`                | Build and serve `out/` locally with Wrangler |
| `npm run cf:deploy`                 | Build and deploy `out/` to Cloudflare Workers |
| `GITHUB_PAGES_BASE_PATH=1 npm run build` | Legacy project-site path under github.io (optional) |
| `npm run format`                    | Format supported files with Prettier         |

Deploy: [docs/CLOUDFLARE.md](docs/CLOUDFLARE.md) · Domain: [docs/CUSTOM-DOMAIN.md](docs/CUSTOM-DOMAIN.md) · Vercel fallback: [docs/VERCEL.md](docs/VERCEL.md)

Before opening a pull request, run lint, typecheck, and `npm run build`.

## Repository map

```text
app/                       App Router pages, metadata, robots, and sitemap
components/                Navigation, public signals, and deterministic demo UI
demo/scenario.ts           Canonical local scenario
integration/contracts.ts   Versioned narrative contracts
integration/fixtures.ts    Public-safe deterministic fixtures
integration/public-sources.ts
                           Build-time public-source adapter and fail-closed fallback
integration/validate-public.ts
                           Published-schema validation for both public documents
integration/freshness.ts   24 h soft / 7 d hard freshness policy
integration/diagnostics.ts Privacy-safe build-log summary
public/brand/              AGI corporate identity assets
workers/                   Cloudflare suite-path reverse proxy (not an AGI API)
wrangler.jsonc             Cloudflare Workers static assets config (`out/`)
docs/                      Product, architecture, delivery, and release records
site.ts                    Canonical production URL helpers
tokens.css                 Shared design-token source of truth
```

See [Architecture](docs/ARCHITECTURE.md) for system boundaries and [Integration contracts](docs/INTEGRATION_CONTRACTS.md) for the public-data rules.

## Trust and data boundaries

- Join records only through public allocation identifiers—never donor identity.
- Treat source documents as untrusted input and validate authority before display.
- Never fetch raw receipts, private evidence, contact data, or secret URLs.
- Never turn missing or rejected source data into inferred evidence.
- Treat `verified` as a source-system state, not one-to-one donor attribution.
- Keep the contribution demo explicitly deterministic; it is not a payment flow.

## Documentation

Start with the [documentation index](docs/README.md). Key references include:

- [Product definition](docs/PRODUCT.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Integration contracts](docs/INTEGRATION_CONTRACTS.md)
- [Design system](docs/DESIGN_SYSTEM.md)
- [Roadmap](docs/ROADMAP.md)
- [Continuation plan](docs/CONTINUATION_PLAN.md)
- [Release checklist](docs/RELEASE_CHECKLIST.md)
- [Release record](docs/RELEASES.md)

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before changing application behavior or documentation. Preserve the static, read-only MVP boundary unless a separately reviewed plan explicitly expands it.

## License

Licensed under the [Apache License 2.0](LICENSE), consistent with the Impact Relay suite surface.
