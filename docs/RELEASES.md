# Release record

Material production changes are recorded newest first. Each entry links the reviewed change and its deployment evidence.

## 2026-08-22 — autogive.app apex live on Cloudflare

- **Change:** DNS cutover complete — the `autogive.app` apex is served by Cloudflare Worker `agi-public` (Cloudflare Workers static assets), replacing Vercel as the live origin. Nameservers are on Cloudflare (`ryleigh`/`ruben.ns.cloudflare.com`); `www` 301-redirects to the apex. Repo docs reconciled to "Cloudflare live / Vercel rollback."
- **Verification:** `EDGE_PROXY_CHECKS=1 BASE_URL=https://autogive.app ./scripts/smoke-public-suite.sh` → `SMOKE PASSED` (apex, `robots.txt`, `sitemap.xml`, `/portfolio-signals/`, `/impact-relay/`, public JSON, authority checks, security headers, `POST` → 405). `curl -sI https://autogive.app/` → `200`, `server: cloudflare`, no `x-vercel-*` headers.
- **Rollback:** Vercel project and `vercel.json` retained as rollback; retire as a later follow-up once the Cloudflare apex is confirmed stable.

## 2026-08-19 — Public-source retarget, SPEC-011 fallback, and CSP

- **Merge commit:** [`256cda8`](https://github.com/Autonomous-Giving-Incorporated/Autonomous-Giving-Incorporated/commit/256cda8ada24b23eeed1b9b174039af51e90892c)
- **Pull request:** [#13](https://github.com/Autonomous-Giving-Incorporated/Autonomous-Giving-Incorporated/pull/13)
- **CI:** [successful run](https://github.com/Autonomous-Giving-Incorporated/Autonomous-Giving-Incorporated/actions/runs/32219016398)
- **Cloudflare deployment:** [successful run](https://github.com/Autonomous-Giving-Incorporated/Autonomous-Giving-Incorporated/actions/runs/32219061669)
- **Production:** [autogive.app](https://autogive.app/)
- **Note:** GitHub Pages mirror deploy failed (Pages not enabled on the org repo). Automatic Pages deploy has since been retired to manual-only; Cloudflare is the automatic production deploy. Live projection stays **fail-closed** (`source=policy_rejected`). Not READY.

### Shipped

- Retargeted public-source URLs to the org raw GitHub documents (Portfolio Signals / Impact Relay).
- Community AI Lab / 25 laptops / 2500 USD SPEC-011 signals fallback.
- Content Security Policy on the Worker, Vercel, and Pages `_headers`.
- Self-hosted Space Grotesk, Inter, and IBM Plex Mono via `next/font` (no Google Fonts at runtime).
- Gated the GitHub Pages deploy on a successful CI run; removed unused `framer-motion`.

### Verification

- Lint, typecheck, 86 tests, conformance check, and the static export passed.
- `main` CI and the Cloudflare Workers deploy completed successfully after merge.

## 2026-08-16 — Phase E public-site finish

- **Merge commit:** [`a3633ef`](https://github.com/Autonomous-Giving-Incorporated/Autonomous-Giving-Incorporated/commit/a3633ef6fde797a3844acf3db118325050aa2572)
- **Note:** Documentation pin to Specs **v2.0.0**. Login / SPEC-028 runtime **PARKED**. Not READY.

### Shipped

- Honest `implements` (SPEC-011/012/013 only).
- Canonical Community AI Lab / 25 laptops / 2500 USD demo.
- Donor-identity regression tests; `nanoid` lockfile bump.

## 2026-08-04 — Next.js 16.3 framework upgrade

- **Merge commit:** [`8f56546`](https://github.com/scrimshawlife-ctrl/Autonomous-Giving-Incorporated/commit/8f5654658b1089b2bdf751eea87cc23c72ee069d)
- **Pull request:** [#38](https://github.com/scrimshawlife-ctrl/Autonomous-Giving-Incorporated/pull/38)
- **CI:** [successful run](https://github.com/scrimshawlife-ctrl/Autonomous-Giving-Incorporated/actions/runs/30927150224)
- **Pages deployment:** [successful run](https://github.com/scrimshawlife-ctrl/Autonomous-Giving-Incorporated/actions/runs/30927150062)
- **Production:** [scrimshawlife-ctrl.github.io/Autonomous-Giving-Incorporated](https://scrimshawlife-ctrl.github.io/Autonomous-Giving-Incorporated/)

### Shipped

- Upgraded static workbench from Next.js 15.5 to **16.3** (Turbopack default build).
- Migrated ESLint to v9 flat config (`eslint.config.mjs`).
- Dropped temporary postcss/sharp npm overrides; Next 16.3 vendors patched releases.
- Refreshed React 19.2 types and agent docs pointer.

### Verification

- Lint, typecheck, 18 integration tests, and Pages-mode static export passed.
- `main` CI and GitHub Pages deploy completed successfully after merge.
- Live Pages returned HTTP 200 with repository base-path assets.

## 2026-08-02 — Zero State harmonization and launch hardening

- **Merge commit:** [`80271a2`](https://github.com/scrimshawlife-ctrl/Autonomous-Giving-Incorporated/commit/80271a215c4efda4f5aaf89d9818618e2c12a96d)
- **Pull request:** [#7](https://github.com/scrimshawlife-ctrl/Autonomous-Giving-Incorporated/pull/7)
- **CI:** [successful run](https://github.com/scrimshawlife-ctrl/Autonomous-Giving-Incorporated/actions/runs/30773289218)
- **Pages deployment:** [successful run](https://github.com/scrimshawlife-ctrl/Autonomous-Giving-Incorporated/actions/runs/30773289223)
- **Production:** [scrimshawlife-ctrl.github.io/Autonomous-Giving-Incorporated](https://scrimshawlife-ctrl.github.io/Autonomous-Giving-Incorporated/)

### Shipped

- Applied the Zero State mark, palette, typography, masthead, footer, and suite navigation.
- Centralized the GitHub Pages origin and repository base path.
- Corrected canonical, Open Graph, Twitter, robots, sitemap, favicon, and social-preview output.
- Preserved the static build-time public-source seam and deterministic fallback.

### Verification

- Lint, typecheck, production build, and Pages-mode build passed.
- Generated output referenced the repository-prefixed Zero State asset.
- CI and Pages build/deploy completed successfully on `main`.
- The production page returned the Zero State identity and reciprocal Portfolio Signals/Impact Relay navigation.

## 2026-08-02 — Evidence Workbench

- **Merge commit:** [`fdbe59e`](https://github.com/scrimshawlife-ctrl/Autonomous-Giving-Incorporated/commit/fdbe59e0d4a969fc9a58805bfdc7d6ced4b66d84)
- **Pull request:** [#6](https://github.com/scrimshawlife-ctrl/Autonomous-Giving-Incorporated/pull/6)
- **CI:** [successful run](https://github.com/scrimshawlife-ctrl/Autonomous-Giving-Incorporated/actions/runs/30770655489)
- **Pages deployment:** [successful run](https://github.com/scrimshawlife-ctrl/Autonomous-Giving-Incorporated/actions/runs/30770655507)

### Shipped

- Introduced the responsive evidence workbench and replayable lifecycle.
- Added approved public aggregate signals from Portfolio Signals and Impact Relay.
- Added deterministic fallback behavior and public-data boundaries.

### Verification

- Pull-request verification, post-merge CI, and Pages deployment passed.
- Browser review covered 320–1440 px without horizontal overflow or console errors.
