# Custom domain: autogive.app

Canonical production origin for the AGI public workbench is **https://autogive.app**.

**Designed host: Cloudflare Workers static assets** (see [CLOUDFLARE.md](CLOUDFLARE.md)). Durable data/auth stay on existing Supabase, not on this static site.  
**Fallback until DNS cutover: Vercel** (see [VERCEL.md](VERCEL.md)).  
**Mirror: GitHub Pages** at the github.io project URL. Do not add Render, Fly, or Railway.

Namecheap holds registration. Do not dual-point the apex at two web platforms.

For the repository edits to land at cutover (as opposed to the DNS/dashboard steps below), see [DNS-CUTOVER-CHECKLIST.md](DNS-CUTOVER-CHECKLIST.md).

## Target end state

| Host | Role |
| --- | --- |
| `https://autogive.app/` | Production on **Cloudflare** Worker `agi-public` |
| `https://www.autogive.app/` | Redirect to apex (Cloudflare) |
| Vercel project `autonomous-giving-incorporated` | Rollback until cutover is verified; then retire |
| github.io project URL | Fallback mirror |

Suite path URLs (`/portfolio-signals/`, `/impact-relay/`) remain **product links** on the apex. Those products still ship as separate sites; AGI proxies the paths (Vercel `vercel.json` today; Cloudflare `workers/suite-gateway.ts` after cutover). Do not merge those repos into this one.

Point the apex at **one** platform only.

---

## Cutover: Cloudflare DNS

Cloudflare custom domains require `autogive.app` as a zone on the same account that owns Worker `agi-public`. Record values, account IDs, and zone IDs are operator-owned and are not committed here.

1. Deploy and verify `https://agi-public.<subdomain>.workers.dev` (AGI `/`, suite prefixes, TLS). See [CLOUDFLARE.md](CLOUDFLARE.md).
2. Export the existing DNS zone (every A, AAAA, CNAME, MX, TXT). Preserve mail: MX plus SPF, DKIM, DMARC, and provider verification TXT records.
3. Add the zone in Cloudflare and complete the registrar nameserver change **only when ready** to leave Vercel as the web origin.
4. Attach `autogive.app` as a Worker custom domain (dashboard → `agi-public` → Domains). Cloudflare will create the DNS record that points at the Worker.
5. Redirect `www.autogive.app` to the apex.
6. Verify TLS, apex, www redirect, `/_next/` assets, canonical/Open Graph tags, `robots.txt`, and `sitemap.xml`.
7. Run `EDGE_PROXY_CHECKS=1 ./scripts/smoke-public-suite.sh` against `https://autogive.app`.
8. Confirm mail MX/TXT records are unchanged. Only then stop using Vercel as the public origin.

Do not put `autogive.app` in `wrangler.jsonc` until the zone exists; a missing zone would fail CI deploys.

### If the zone is already on Cloudflare

Dashboard → Workers & Pages → `agi-public` → **Domains** → add `autogive.app`. Cloudflare creates the record. For `www`, add a Redirect Rule to `https://autogive.app`.

### If DNS stays at Namecheap during a CNAME cutover

Only use this if the operator chooses records instead of full Cloudflare nameservers. Use the **exact** targets Cloudflare shows for the Worker custom domain (they change). Typical pattern:

| Type | Host | Value |
| --- | --- | --- |
| CNAME or flattened A/AAAA | `@` | values from the Cloudflare custom-domain UI |
| CNAME | `www` | Cloudflare-shown target, or a redirect to apex |

Do not keep Vercel `76.76.21.21` A records after cutover.

---

## Current live: Vercel DNS

Domains may already be attached on Vercel project **autonomous-giving-incorporated**. Confirm with:

```bash
vercel domains verify autogive.app --scope scrimshawlife-8819s-projects
```

**Apex (Namecheap BasicDNS / registrar-servers)** — use the records Vercel shows (example):

| Type | Host | Value |
| --- | --- | --- |
| A | `@` | `76.76.21.21` |

If verify suggests alternate A targets, prefer the live `vercel domains verify` output.

| Type | Host | Value |
| --- | --- | --- |
| CNAME | `www` | `cname.vercel-dns.com` |

Full Vercel runbook: [VERCEL.md](VERCEL.md).

---

## Optional: GitHub Pages DNS

Only if production is Pages instead of Cloudflare or Vercel.

Repo → **Settings → Pages → Custom domain**: `autogive.app`  
Enforce HTTPS after DNS verifies. Artifact may include `public/CNAME` → `out/CNAME` if that helper is re-added.

### Apex A records

| Type | Host | Value |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |

### www

| Type | Host | Value |
| --- | --- | --- |
| CNAME | `www` | `<pages-org>.github.io.` |

---

## Namecheap notes

Nameservers may be hosting DNS (`dns1.namecheaphosting.com` / `dns2.namecheaphosting.com`). Edit records there, or switch to BasicDNS / PremiumDNS first, or to Cloudflare nameservers for the intended cutover.

Keep **MX** / **TXT** (SPF) if you use email. Remove LiteSpeed / parking A records when switching production.

## Build path

Production builds use **empty** `basePath` so assets resolve at `https://autogive.app/_next/...`.

Legacy project-site path (github.io only):

```bash
GITHUB_PAGES_BASE_PATH=1 npm run build
```

## Verification checklist

1. `dig +short autogive.app A` (and AAAA / CNAME) matches the **chosen** host — Cloudflare, Vercel (`76.76.21.21`), or the four Pages IPs — not two of them.
2. Domain shows **Active** on the Cloudflare Worker (after cutover) or **Verified** in Vercel/Pages, and HTTPS works.
3. `curl -sI https://autogive.app/` → `200` from Cloudflare or Vercel (not LiteSpeed parking).
4. HTML references `/_next/` assets at the site root.
5. `/portfolio-signals/` and `/impact-relay/` still return the other products (proxy), including trailing slashes.
6. Canonical / Open Graph use `https://autogive.app`.

Propagation often takes minutes; can take up to 24–48 hours.
