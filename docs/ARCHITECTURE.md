# Architecture

## System overview

AGI is a static Next.js App Router application. The designed suite stack is **Cloudflare + existing Supabase** only: this public site stays static on Cloudflare; durable data and auth stay on the existing platform Supabase project. GitHub Actions builds the site from `main`, retrieves approved public aggregate signals during that build, and exports static files to `out/`. Intended production uploads `out/` to Cloudflare Workers static assets. Vercel remains the live `autogive.app` apex until DNS cutover. GitHub Pages is a fallback mirror. Do not treat Render, Fly, or Railway as remaining hosts.

```mermaid
flowchart LR
  FI["Portfolio Signals public campaign JSON"] --> V["Build-time validation"]
  IR["Impact Relay public impact JSON"] --> V
  FX["Bundled deterministic fixture"] --> F["Fallback selection"]
  V -->|"approved inputs"| P["Static AGI pages"]
  V -->|"failure or rejected policy"| F
  F --> P
  P --> CF["Cloudflare Workers static assets"]
```

The deployed browser receives only static HTML, CSS, JavaScript, brand assets, and the selected public-safe projection. It does not call Portfolio Signals or Impact Relay at runtime.

## Runtime and deployment model

- **Framework:** Next.js 16 App Router with React 19 and TypeScript.
- **Output:** static export (`output: "export"`), Turbopack production build by default.
- **Designed stack:** Cloudflare (this static site and public ingress) + existing Supabase (suite auth, Postgres, RLS). This repo does not call Supabase at runtime.
- **Hosting:** **Cloudflare Workers static assets** (`agi-public`) is the intended production host at **https://autogive.app**. Vercel remains live until DNS cutover; GitHub Pages remains a github.io fallback. See [CLOUDFLARE.md](CLOUDFLARE.md).
- **Build:** Node.js 22; static export to `out/` at site root (`basePath` empty).
- **Suite paths:** `/portfolio-signals/` and `/impact-relay/` are reverse-proxied by a thin Worker (`workers/suite-gateway.ts`), matching [`vercel.json`](../vercel.json). Those products are not merged into this repo.
- **State:** local React state for the replayable demonstration; no persistence on this site.
- **External data:** two fixed HTTPS sources fetched at build time with a bundled fallback.

`site.ts` owns the canonical production origin (`https://autogive.app`). `next.config.ts` defaults to an empty base path so the custom domain serves assets from `/`. DNS and cutover: [CUSTOM-DOMAIN.md](CUSTOM-DOMAIN.md).

## Component boundaries

| Path                            | Responsibility                                                        |
| ------------------------------- | --------------------------------------------------------------------- |
| `app/page.tsx`                  | Composes the public narrative and requests validated public signals   |
| `components/public-signals.tsx` | Renders the selected live or fallback aggregate projection            |
| `components/donation-demo.tsx`  | Runs the deterministic, non-payment contribution story                |
| `components/navbar.tsx`         | Provides AGI and reciprocal suite navigation                          |
| `demo/scenario.ts`              | Defines the canonical local demonstration state                       |
| `integration/public-sources.ts` | Fetches, validates, selects, and normalizes public projections        |
| `integration/contracts.ts`      | Defines versioned narrative contracts for future governed integration |
| `integration/fixtures.ts`       | Supplies public-safe deterministic contract fixtures                  |
| `workers/suite-gateway.ts`   | Reverse-proxies suite paths on Cloudflare (same role as `vercel.json`) |

The page component is the server entry point. Interactive state stays in focused client components rather than moving the whole page to the client.

## Trust boundaries

Portfolio Signals and Impact Relay documents are external, untrusted input even though they come from repositories in the same suite. The adapter must:

1. require successful HTTP responses;
2. require Portfolio Signals authority `advisory_only`;
3. require Impact Relay authority `public_aggregate_only`;
4. select only an outcome whose evidence state is `VERIFIED`;
5. return the deterministic fixture on any fetch, parse, policy, or evidence failure.

The site never requests donor identity, contact details, payment records, raw receipts, private documents, or secret evidence URLs. `verified` means the source published an approved aggregate verification state; it does not establish one-to-one attribution to a donor.

## Failure behavior

The application is designed to remain honest and available when external data is not:

- unavailable source → deterministic fallback;
- non-2xx response → deterministic fallback;
- malformed JSON → deterministic fallback;
- unexpected authority → deterministic fallback;
- no verified outcome → deterministic fallback.

The UI labels the result as either `Live public projection` or `Deterministic fallback`. Freshness and more granular rejection states remain planned work; see [CONTINUATION_PLAN.md](CONTINUATION_PLAN.md).

## Deliberate exclusions

The current architecture has no backend, authentication, database, payment processing, CMS, donor account, runtime write operation, or notification delivery **on this public site**. Durable suite data and auth stay on **existing Supabase**. The Cloudflare Worker is suite-path reverse proxy only (the same role as Vercel rewrites), not an AGI API. Do not add OpenNext SSR, a Node server, D1/KV, a second database, or Render / Fly / Railway. Adding any of those to this site changes the threat model and requires a separately reviewed architecture plan.
