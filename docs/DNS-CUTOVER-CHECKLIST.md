# DNS cutover repo checklist (autogive.app → Cloudflare)

**Status: cutover COMPLETE and verified 2026-08-22.** `autogive.app` is served by Cloudflare Worker `agi-public` (Cloudflare Workers static assets). Nameservers are on Cloudflare (`ryleigh`/`ruben.ns.cloudflare.com`), the apex custom domain is attached (dashboard-managed), and `www` 301-redirects to the apex. Production smoke passes (see "Verify" below). Vercel is retained as rollback only.

This file documents the repository reconciliation that accompanied the cutover, and the one remaining follow-up (retire Vercel). The DNS/registrar/dashboard steps are operator-owned and external — see [CUSTOM-DOMAIN.md](CUSTOM-DOMAIN.md) and [CLOUDFLARE.md](CLOUDFLARE.md).

The repo was already Cloudflare-ready: `site.ts` canonical origin is `https://autogive.app`, and `next.config.ts` uses an empty (root) `basePath` for production builds. No canonical-URL or base-path change was required.

## Not needed for this cutover

- `public/CNAME` — GitHub-Pages-only (custom domain for the github.io mirror). The Cloudflare apex does not use it. Only relevant if production were Pages (see the "Optional: GitHub Pages DNS" section of [CUSTOM-DOMAIN.md](CUSTOM-DOMAIN.md)).
- `GITHUB_PAGES_BASE_PATH` — only sets the legacy `/Autonomous-Giving-Incorporated` project-site path for the Pages mirror. Cloudflare/Vercel production already build at root. Leave it as-is.

## Done at cutover (2026-08-22)

1. **Apex attached** — `autogive.app` is a custom domain on Worker `agi-public` (dashboard-managed). The `routes` block in [`wrangler.jsonc`](../wrangler.jsonc) is intentionally left commented to avoid a conflicting IaC declaration against the live, dashboard-managed domain.
2. **`www` redirect** — `www.autogive.app` 301-redirects to `https://autogive.app` (Cloudflare Redirect Rule).
3. **Host-status prose flipped** — `AGENTS.md`, `README.md`, and the living host docs (`ARCHITECTURE`, `CLOUDFLARE`, `CONTINUATION_PLAN`, `CUSTOM-DOMAIN`, `VERCEL`, `PLATFORM`, `ROADMAP`, `IMPLEMENTATION_PLAN`, `docs/README`, `GITHUB-PROJECT`, `PRODUCT-ALLOCATION-MIDDLEWARE`, `THREE_REPO_INTEGRATION`) now read "Cloudflare live / Vercel rollback." The dated design spec `docs/superpowers/specs/2026-08-16-*.md` is left as a historical record; detailed runbook bodies in `CUSTOM-DOMAIN.md`/`VERCEL.md` are kept as rollback reference. Straggler check: `grep -rn -i "until.*cutover\|live apex" --include=*.md .`
4. **Release recorded** — see the 2026-08-22 entry in [RELEASES.md](RELEASES.md).

## Remaining follow-up (later, after an observation window)

- Retire [`vercel.json`](../vercel.json) and the Vercel Git production hook once the Cloudflare apex is confirmed stable. Kept for now as rollback per [VERCEL.md](VERCEL.md) / [CLOUDFLARE.md](CLOUDFLARE.md).

## Verification (re-runnable)

- `EDGE_PROXY_CHECKS=1 BASE_URL=https://autogive.app ./scripts/smoke-public-suite.sh` → `SMOKE PASSED` on 2026-08-22.
- Apex TLS, `www` → apex redirect, `/_next/` assets at root, `/portfolio-signals/` and `/impact-relay/` proxy paths, canonical/Open Graph, `robots.txt`, `sitemap.xml`. `curl -sI https://autogive.app/` returns `200` with `server: cloudflare` and no `x-vercel-*` headers.
