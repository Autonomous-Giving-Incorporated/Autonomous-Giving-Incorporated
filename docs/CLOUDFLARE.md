# Cloudflare Workers / Pages deployment

Designed suite stack: **Cloudflare + existing Supabase**. This public workbench is **static** on Cloudflare Workers static assets (canonical origin **https://autogive.app**). Durable data and auth stay on the existing platform Supabase project; this site does not authenticate, persist, or query it. Do not add Render, Fly, Railway, D1, KV, OpenNext SSR, or a Node server.

The app remains a **static Next.js export** (`output: "export"` → `out/`). The Worker entrypoint (`workers/index.ts`) delegates to `workers/suite-gateway.ts`: public suite proxies mirror [`vercel.json`](../vercel.json); the separately documented IR API transport forwards only the explicit FI paths below. Product repos are not merged.

**Cloudflare serves the live `autogive.app` apex.** Vercel is retained as rollback; leave `vercel.json` in place until the Cloudflare apex is verified stable, then retire it as a follow-up.

## Project settings

| Setting | Value |
| --- | --- |
| Worker name | `agi-public` |
| Config | [`wrangler.jsonc`](../wrangler.jsonc) |
| Assets directory | `out/` (Next static export) |
| HTML handling | `auto-trailing-slash` |
| Missing pages | `404-page` (`out/404.html` from Next) |
| Suite paths | Worker-first proxy (see below) |
| Node | 22 (see `.node-version` / `engines`) |

## npm scripts

```bash
npm run cf:build     # next build → out/
npm run cf:preview   # build, then wrangler dev (local assets + suite proxy)
npm run cf:deploy    # build, then wrangler deploy
```

`npm run build` is the same static export and remains the CI check.

Local deploy (after `npx wrangler login`, or with env vars):

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npx wrangler deploy
```

`wrangler deploy` uploads `out/` plus the suite-gateway Worker. A live deploy is not required to review this change; CI validates the export without Cloudflare credentials.

## GitHub Actions secrets

Workflow: [`.github/workflows/deploy-cloudflare.yml`](../.github/workflows/deploy-cloudflare.yml) runs after the `CI` workflow succeeds for a push to `main`. It checks out the successful CI run's exact head SHA; it is not manually dispatchable.

Configure these **repository secrets** (GitHub → Settings → Secrets and variables → Actions). Do not commit values.

| Secret | Purpose |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | API token with permission to deploy Worker `agi-public` (Workers Scripts Edit, plus Account read as required by Wrangler) |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID from the dashboard (Workers & Pages overview, or `wrangler whoami`) |

Create the token in Cloudflare → **My Profile → API Tokens**. A typical least-privilege token uses the **Edit Cloudflare Workers** template scoped to this account.

Until both secrets are set, the Cloudflare deploy workflow will fail authentication. Existing CI (lint / typecheck / test / build) and the GitHub Pages fallback workflow do not need these secrets.

Do not also enable a competing Cloudflare dashboard Git integration that would double-deploy production.

## Suite path routing

AGI static files live in `out/`. Portfolio Signals and Impact Relay stay in their own repos. The Worker proxies:

| Incoming path | Upstream (until those products move) |
| --- | --- |
| `/portfolio-signals/` and nested paths | `https://fund-intel-ten.vercel.app/` |
| `/impact-relay/` and nested paths | `https://impact-relay.vercel.app/` |
| `/workspace`, `/workspace/`, `/workspace.html` | 301 → `/portfolio-signals/workspace.html` (query string kept) |
| `/fund-intel/*` | 301 → `/portfolio-signals/*` |

Trailing-slash and extensionless Portfolio Signals pages (`/portfolio-signals/`, `/portfolio-signals/workspace`) map the same way as `vercel.json`. Nested public files such as `/portfolio-signals/data/public-campaign.json` pass through.

Proxied suite HTML does **not** inherit the Next.js marketing Content-Security-Policy. If the upstream omits a CSP, the Worker applies a suite policy that allows the existing Portfolio Signals `supabase-js` module on `cdn.jsdelivr.net` and `connect-src` to the platform Supabase project. Marketing pages keep the stricter self-only CSP.

This is routing only. It does not add AGI auth, donations, or a database. Suite auth and durable data remain on existing Supabase.

## Authenticated IR API routing (held pending review and operator configuration)

This edge-only exception is separate from the read-only public proxy. FI's
`workspace/ir-provisioning.js` calls root-relative URLs, not the Vercel HTML host:

| Route | Methods | FI target path |
| --- | --- | --- |
| `/api/ir/provisioning/org_<id>` | GET, POST | unchanged |
| `/api/ir/workspaces/org_<id>` | GET, POST | unchanged |

Identity must match `org_[a-z0-9_]{1,124}` exactly (128 characters maximum).
There are no aliases under `/portfolio-signals`, `/impact-relay`, or `/fund-intel`.
Unknown `/api` paths return JSON 404 without contacting assets or Vercel.
`wrangler.jsonc` runs `/api` and `/api/*` Worker-first, including when an asset
would otherwise match. API methods other than GET/POST (including OPTIONS and
HEAD) return 405. Any query, even a bare `?`, is rejected. POST streams are capped
at 1024 **bytes**, independent of Content-Length, with a 10-second read deadline;
compressed bodies are rejected. Bytes are not decoded/re-encoded at the gateway.
FI owns JSON/operation UUID validation. Its POST wire body is
`{"operation_id":"<existing operation UUID>"}`. Upstream fetch has a 30-second
header deadline and is never retried. After a failed POST, use GET to check status
before retrying; a gateway timeout is not proof that FI did not commit.

### Deployment bindings (non-secret, fail closed by default)

Set **both** GitHub repository Actions variables, after verifying the actual
FI deployment, to the **same exact** approved origin:

- `FI_WORKER_ORIGIN`: `https://portfolio-signals.<verified-account-subdomain>.workers.dev`
- `FI_WORKER_ALLOWED_ORIGIN`: the independently reviewed identical origin pin

The angle-bracket value is a **shape, not a deployed hostname**. Do not copy it
literally. FI's recorded account audit says `portfolio-signals` was absent;
`agi-public.zer0state-noema.workers.dev` is the suite gateway, not the FI API.
No current FI deployment is established by this PR. Obtain the actual hostname
from the operator's FI deployment receipt; do not infer deployment from naming.
Only a lowercase HTTPS `portfolio-signals.<account>.workers.dev` origin is accepted:
no slash suffix, port, credentials, path, query, fragment, wildcard, custom domain,
Vercel host, or gateway self-target. A custom domain or alternate Worker name
requires a separately reviewed routing change, not weakening the origin pin.
These are deployment-controlled trust settings, never request headers or public
runtime-config inputs. The deployment workflow passes both through quoted env
variables to Wrangler; missing/empty/mismatched values safely disable the API
with JSON 503, while static routes continue working. No external bindings are
set by this PR. For an operator-authorized local deploy, supply the same two
`--var "NAME:value"` flags to `wrangler deploy`; plain `cf:deploy` does not supply
them and must not be used to enable IR routing.

FI itself needs its reviewed IR Worker/migrations and existing platform bindings:
`PLATFORM_SUPABASE_URL=https://utdioxwiskzatwoejgiu.supabase.co` and
`PLATFORM_SUPABASE_ANON_KEY` (existing public anon key, or FI's documented
`SUPABASE_URL`/`SUPABASE_ANON_KEY` fallback). **Never add a service-role key to this
gateway.** FI forwards the human token to Auth and user-authenticated RPCs;
active-profile/platform-admin/AAL2 and tenant checks remain FI/Supabase authority.

### Credential / CORS boundary

The gateway checks bearer syntax/size only; it does not authenticate users or
issue tokens. Authorization is preserved byte-for-byte as received in the Fetch
Headers API, only to the configured/pinned FI Worker. Only Authorization,
Content-Type, Accept, and Origin are copied (plus forced Cache-Control no-store).
Cookies, apikey, spoofed forwarding headers and conditional caching headers are
not sent. Public/static upstreams still never receive Authorization or cookies.
Same-origin browser Origin is preserved, not rewritten to FI's host; requests
without Origin are supported for non-browser clients. Foreign/null Origin is
rejected; no new CORS grants or OPTIONS success is introduced (FI currently has
no cross-origin IR API contract). FI response CORS headers, if present, remain
unchanged. All API responses are no-store, Set-Cookie/Location are stripped,
and every upstream 3xx is rejected rather than followed or exposed as a redirect.
Network exceptions return sanitized JSON 503. This does not add auth, persistence,
financial execution, or readiness claims to the public Next static export.

### Local acceptance, no credentials or deployed writes

```bash
npm ci
npm test
npm run lint
npm run typecheck
npm run conformance-check
npm run build
npm run test:worker
```

`test:worker` uses Wrangler **dry-run** and its existing transitive Miniflare/workerd
runtime with an outbound fixture and an asset service fixture. It verifies real
Worker request handling without contacting FI, Cloudflare APIs, or Supabase.
This is edge transport evidence, **not** live JWT/MFA, FI execution, database
readback, deployment, or operational readiness evidence. The node routing matrix
covers exact identity/body boundaries, method/query/origin denial, trusted origin
pinning, unchanged tokens, static regressions and upstream redirect/error handling.

## Custom domain: autogive.app

Attach the domain **after** a successful Worker deploy, and only when ready to leave Vercel as the DNS target.

1. Deploy `agi-public` and confirm `https://agi-public.<your-subdomain>.workers.dev` serves the AGI export (`/` 200, `/_next/` assets, legal pages).
2. Confirm suite paths on that workers.dev host: `/portfolio-signals/`, `/impact-relay/`, and the public JSON files used by `scripts/smoke-public-suite.sh`.
3. Add `autogive.app` as a **Custom Domain** on Worker `agi-public`:
   - Dashboard → Workers & Pages → `agi-public` → **Domains** → **Add** → Custom Domain, or
   - After the zone is on Cloudflare, you may add a `routes` entry with `"custom_domain": true` in `wrangler.jsonc`. That entry is omitted here so deploys succeed before the zone exists.
4. Configure `www.autogive.app` to redirect to the apex (Cloudflare Redirect Rule, or a second custom domain plus redirect).
5. Change DNS only when the Worker hostname is verified. See [CUSTOM-DOMAIN.md](CUSTOM-DOMAIN.md).

Cloudflare custom domains require `autogive.app` to be a zone on the same Cloudflare account. If the domain still uses Namecheap hosting DNS pointed at Vercel, keep Vercel as production until nameservers (or web records) move.

## Relationship to Vercel, GitHub Pages, and Supabase

| Surface | Role |
| --- | --- |
| Cloudflare Worker `agi-public` + `autogive.app` | **Designed** public production after DNS cutover |
| Existing platform Supabase | **Designed** durable data and auth (not this static site) |
| Vercel | **Rollback** host after cutover; keep [`vercel.json`](../vercel.json) until verified stable |
| `*.github.io/Autonomous-Giving-Incorporated/` | Fallback mirror. Pages deploy waits for a successful `CI` run on `main`, matching Cloudflare. |

Render, Fly, and Railway are not remaining hosts for this suite.

DNS for `autogive.app` can target **one** web origin at a time. Do not dual-point the apex at Vercel and Cloudflare.

## Cutover checklist

1. `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` are set on the GitHub repo.
2. A successful `CI` run for a push to `main` deploys `agi-public` (or use `npm run cf:deploy` locally with normal Cloudflare authentication).
3. workers.dev (or preview URL) smoke: `/`, `/robots.txt`, `/sitemap.xml`, `/legal/`, `/portfolio-signals/`, `/impact-relay/`.
4. `EDGE_PROXY_CHECKS=1 BASE_URL=https://agi-public.<subdomain>.workers.dev ./scripts/smoke-public-suite.sh` (includes proxy security-header and POST-rejection checks).
5. Export existing DNS (including MX / SPF / DKIM / DMARC) before changing nameservers or A/CNAME records.
6. Add the Cloudflare zone, attach `autogive.app`, keep mail records intact.
7. Point the apex at Cloudflare; verify TLS, www → apex, and `curl -sI https://autogive.app/` is Cloudflare (not LiteSpeed parking, not Vercel).
8. Re-run `EDGE_PROXY_CHECKS=1 ./scripts/smoke-public-suite.sh` against `https://autogive.app`.
9. Observe, then retire the Vercel Git production hook and (later) `vercel.json`.

## Security / trust boundary (unchanged)

- Build-time fetch of public Portfolio Signals / Impact Relay aggregates only
- Fail closed to the deterministic local scenario
- No donor PII, no payments, no server writes on this site
- Content-Security-Policy on Worker, Vercel, and Pages; suite fonts self-hosted via `next/font`
