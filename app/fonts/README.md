# Suite fonts

Space Grotesk, Inter, and IBM Plex Mono ship as SIL OFL 1.1 woff2 files and are inlined as `data:` URIs so the static export does not need `fonts.googleapis.com` / `fonts.gstatic.com`.

`suite-fonts.css` imports four face files. Space Grotesk and IBM Plex Mono are committed whole. Inter 400 and Inter 500–700 are split under `parts/` so GitHub MCP `push_files` stays under the payload limit; `scripts/assemble-suite-fonts.mjs` concatenates those parts (sha256-checked) before `next dev` / `next build`.

CSP allows `font-src 'self' data:` for those data URIs. The raw woff2 files stay here for a later binary git-push if someone wants file URLs instead of inlined CSS.
