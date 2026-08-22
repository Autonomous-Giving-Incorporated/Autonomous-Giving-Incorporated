# DNS cutover repo checklist (autogive.app → Cloudflare)

Staged prep for the `autogive.app` apex cutover from Vercel to the Cloudflare Worker `agi-public`. The **DNS/registrar/dashboard steps are operator-owned and external** — see [CUSTOM-DOMAIN.md](CUSTOM-DOMAIN.md) and [CLOUDFLARE.md](CLOUDFLARE.md) for those. This file lists only the **repository** edits to land when the cutover happens, so they can be applied in one focused pass.

The repo is already Cloudflare-ready: `site.ts` canonical origin is `https://autogive.app`, and `next.config.ts` uses an empty (root) `basePath` for production builds. No canonical-URL or base-path change is required.

## Not needed for this cutover

- `public/CNAME` — GitHub-Pages-only (custom domain for the github.io mirror). The Cloudflare apex does not use it. Only relevant if production were Pages (see the "Optional: GitHub Pages DNS" section of [CUSTOM-DOMAIN.md](CUSTOM-DOMAIN.md)).
- `GITHUB_PAGES_BASE_PATH` — only sets the legacy `/Autonomous-Giving-Incorporated` project-site path for the Pages mirror. Cloudflare/Vercel production already build at root. Leave it as-is.

## Apply at cutover (after the Worker is deployed and the workers.dev smoke checklist in CLOUDFLARE.md passes)

1. **Attach the apex.** Either add it in the dashboard (Workers & Pages → `agi-public` → Domains → `autogive.app`), or uncomment the `routes` block in [`wrangler.jsonc`](../wrangler.jsonc) to manage it as code. Do this only once the `autogive.app` zone is on the same Cloudflare account — an unresolvable custom domain fails `wrangler deploy` in CI.
2. **`www` redirect.** Add a Cloudflare Redirect Rule `www.autogive.app` → `https://autogive.app` (dashboard). Do not add `www` as a second custom domain.
3. **Flip the host-status prose** from "Cloudflare intended / Vercel live until cutover" to "Cloudflare is live production / Vercel retained as rollback." Occurrences:
   - `AGENTS.md` (Designed suite stack line)
   - `README.md` (Current status paragraph)
   - `docs/ARCHITECTURE.md` (overview + Hosting bullet)
   - `docs/CLOUDFLARE.md` (intro + relationship table)
   - `docs/CONTINUATION_PLAN.md` (Current baseline)
   - `docs/CUSTOM-DOMAIN.md` (host list + "Current live" section)
   - `docs/VERCEL.md` (title + intro + relationship table)
   - `docs/PLATFORM.md` (Designed stack + path table + production path)
   - `docs/ROADMAP.md` (Shipped hosting bullet)
   - `docs/IMPLEMENTATION_PLAN.md` (hosting bullet)
   - `docs/README.md` (Custom domain + Vercel index rows)
   - Incidental mentions to sweep for consistency: `docs/GITHUB-PROJECT.md`, `docs/PRODUCT-ALLOCATION-MIDDLEWARE.md`, `docs/THREE_REPO_INTEGRATION.md`.
4. **Record the release** in [RELEASES.md](RELEASES.md): merge commit, the successful Cloudflare deploy run, and `curl -sI https://autogive.app/` confirming a Cloudflare (not Vercel/LiteSpeed) response.

## Do NOT do at cutover (later, after observation)

- Removing [`vercel.json`](../vercel.json) or the Vercel Git production hook. [VERCEL.md](VERCEL.md) and [CLOUDFLARE.md](CLOUDFLARE.md) keep Vercel as rollback until the Cloudflare apex is verified stable. Retire it in a separate follow-up.

## Verify after cutover

- `EDGE_PROXY_CHECKS=1 BASE_URL=https://autogive.app ./scripts/smoke-public-suite.sh`
- Apex TLS, `www` → apex redirect, `/_next/` assets at root, `/portfolio-signals/` and `/impact-relay/` proxy paths, canonical/Open Graph, `robots.txt`, `sitemap.xml`.
