# AGI agent guidance

Preserve v0.1 scope. No backend, authentication, database, payments, monorepo, or unnecessary packages. Keep the demo deterministic and local. Maintain semantic color roles. Prefer simple components. Run lint, typecheck, and build before completion, and update docs with architecture changes.

Designed suite stack: **Cloudflare** (public static / edge) + **existing Supabase** (durable data and auth). This public site stays a **Next.js 16** App Router static `output: "export"`. Vercel is fallback until `autogive.app` DNS cutover; GitHub Pages is a mirror only. Prefer Turbopack defaults (`next dev` / `next build`). Do not reintroduce npm `overrides` for postcss/sharp unless a future Next release re-vendors vulnerable versions. Do not add a Node server, OpenNext SSR, D1, a second database, or Render / Fly / Railway.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory) before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->
