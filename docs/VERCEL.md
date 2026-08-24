# Vercel deployment (rollback after cutover)

**Designed production host is Cloudflare Workers static assets**, with durable suite data/auth on existing Supabase. See [CLOUDFLARE.md](CLOUDFLARE.md) and [PLATFORM.md](PLATFORM.md).

Vercel is retained as the **rollback** public host after the `autogive.app` apex cut over to Cloudflare. Keep [`vercel.json`](../vercel.json) and the Vercel project until the Cloudflare apex is verified stable, then retire them as a follow-up. Render, Fly, and Railway are not remaining hosts.

The app is a **static Next.js export** (`output: "export"` → `out/`). No serverless functions, no runtime secrets, no auth on this site.

## Project settings

| Setting | Value |
| --- | --- |
| Framework | **Other** / none (static export — not the Next.js serverless preset) |
| Install | `npm ci` |
| Build | `npm run build` (`next build` with `output: "export"`) |
| Output directory | `out` |
| Node | 22 (see `.node-version` / `engines`) |
| Root directory | `.` (repo root) |

> Do not set the Vercel framework preset to **Next.js** while using `output: "export"`. That preset expects a server build and fails looking for `routes-manifest.json` under `out/`.

Config in repo: [`vercel.json`](../vercel.json) (suite path rewrites, `/workspace` → `/portfolio-signals/workspace.html` redirects, security headers). The Cloudflare Worker mirrors those routes; keep both until the rollback is retired. The catch-all marketing CSP stays self-only. `/portfolio-signals/:path*` and `/impact-relay/:path*` set the suite CSP so rollback workspace HTML can load `supabase-js` and call the platform Supabase project.

## Link & deploy (CLI)

```bash
# once per machine (team scope)
vercel link --yes --scope scrimshawlife-8819s-projects --project autonomous-giving-incorporated

# preview
vercel --yes --scope scrimshawlife-8819s-projects

# production
vercel --prod --yes --scope scrimshawlife-8819s-projects
```

Git integration: import the AGI repo in the Vercel dashboard so `main` → production and PRs → previews, until Cloudflare owns the apex.

## Custom domain: autogive.app

DNS now targets Cloudflare. This Vercel domain config is retained only for rollback; see [CUSTOM-DOMAIN.md](CUSTOM-DOMAIN.md) and [CLOUDFLARE.md](CLOUDFLARE.md).

### In Vercel (current live host)

1. Project → **Settings → Domains**
2. Add `autogive.app` and `www.autogive.app`
3. Prefer **Redirect www → apex** (or the reverse — pick one canonical)

### DNS at Namecheap (current)

Nameservers may be Namecheap **hosting** DNS. Edit records in that panel (or switch the domain to BasicDNS first).

**Option A — apex A record (common)**

| Type | Host | Value |
| --- | --- | --- |
| A | `@` | `76.76.21.21` (or the A targets from `vercel domains verify`) |
| CNAME | `www` | `cname.vercel-dns.com` |

Live production URL (until custom domain verifies):  
https://autonomous-giving-incorporated.vercel.app

**Option B — Vercel nameservers**

In the Domains UI, use the nameservers Vercel shows for the domain (full DNS on Vercel). Keep/recreate **MX** / **TXT** for email if needed.

Remove LiteSpeed / parking A records that still point at Namecheap hosting.

### Do not dual-point the apex

DNS for `autogive.app` can target **one** of Cloudflare, Vercel, or GitHub Pages, not two at once. After cutover, Cloudflare is production; keep this Vercel project as a rollback until the Cloudflare checklist passes.

## Local verification before ship

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build
ls out/index.html
```

## Relationship to Cloudflare and GitHub Pages

| Surface | Role |
| --- | --- |
| Cloudflare Worker `agi-public` + `autogive.app` | Live production |
| Vercel | Rollback host after cutover |
| github.io project site | Fallback mirror (workflow still deploys) |

Legacy project-site path (github.io only):

```bash
GITHUB_PAGES_BASE_PATH=1 npm run build
```

Vercel and Cloudflare production builds must keep **empty** `basePath` (default).

## Security / trust boundary (unchanged)

- Build-time fetch of public Portfolio Signals / Impact Relay aggregates only
- Fail closed to deterministic local scenario
- No donor PII, no payments, no server writes
