# AGI agent guidance

Preserve v0.1 scope. No backend, authentication, database, payments, monorepo, or unnecessary packages. Keep the demo deterministic and local. Maintain semantic color roles. Prefer simple components. Run lint, typecheck, and build before completion, and update docs with architecture changes.

Designed suite stack: **Cloudflare** (public static / edge) + **existing Supabase** (durable data and auth). This public site stays a **Next.js 16** App Router static `output: "export"`. Cloudflare Workers serves the live `autogive.app` apex; Vercel is retained as rollback (retire later per `docs/DNS-CUTOVER-CHECKLIST.md`); GitHub Pages is a mirror only. Prefer Turbopack defaults (`next dev` / `next build`). Do not reintroduce npm `overrides` for postcss/sharp unless a future Next release re-vendors vulnerable versions. Do not add a Node server, OpenNext SSR, D1, a second database, or Render / Fly / Railway.

Phase E public-site finish: [docs/superpowers/specs/2026-08-16-autogive-app-finish-design.md](docs/superpowers/specs/2026-08-16-autogive-app-finish-design.md). Platform pin is Specs **v2.0.0** (docs pin, not READY). Login / SPEC-028 runtime is **PARKED**. Do not add auth, secrets, or Phase D.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory) before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

This repo is a single, self-contained static **Next.js 16** site — no backend, database, auth, or Docker to run locally. Node 22 is required (`engines.node: 22.x`) and is preinstalled. Dependencies are refreshed automatically by the environment update script (`npm ci`); you do not need to install them manually.

Services and commands (all defined in `package.json`; see the README "Commands" table for the full list):

- Dev server: `npm run dev` (Next.js + Turbopack on `http://localhost:3000`). This is the primary way to run the app. Prefer running it in a long-lived terminal.
- Verification gates (mirror CI in `.github/workflows/ci.yml`): `npm run lint`, `npm run typecheck`, `npm test`, `npm run conformance-check`, `npm run build`.

Non-obvious notes:

- `npm run build` (static export to `out/`) intentionally **fails closed** to the bundled deterministic local scenario when the remote public aggregate sources are unavailable/stale. A build log line like `agi.public_signals source=policy_rejected reason=...` is expected in this offline environment and does **not** indicate a broken build — the build still exits 0.
- The homepage "Replay $2,500 demo" proof-timeline is the core interactive demo; it is fully deterministic and local (no network/payment), so it works offline and is the easiest end-to-end smoke test.
- `npm start` is intentionally a no-op that errors out (static export only); do not use it to run the app.
- `npm run cf:preview` / `cf:deploy` use Wrangler for Cloudflare; these are deploy paths, not needed for local development.
