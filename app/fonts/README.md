# Suite fonts

Space Grotesk, Inter, and IBM Plex Mono ship as SIL OFL 1.1 woff2 files and are inlined in `suite-fonts.css` so the static export does not need `fonts.googleapis.com` / `fonts.gstatic.com`.

CSP allows `font-src 'self' data:` for those data URIs. The raw woff2 files stay here for a later binary git-push if someone wants file URLs instead of inlined CSS.
