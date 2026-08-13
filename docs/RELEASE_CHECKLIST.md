# Public release checklist

Use this checklist for every material production release. Copy the completed evidence into `RELEASES.md`; do not mark the canonical checklist itself complete.

## Scope and data safety

- [ ] The change remains within the approved static, read-only product scope or links an approved expansion plan.
- [ ] No donor-level data, private evidence, credentials, internal addresses, or environment values enter the static output.
- [ ] Public claims identify their provenance and do not imply payments, causal impact, or one-to-one attribution.
- [ ] Source failures and rejected authority values remain fail-closed.

## Local verification

- [ ] Run `npm ci` from the committed lockfile.
- [ ] Run `npm run lint`.
- [ ] Run `npm run typecheck`.
- [ ] Run `npm run build` (root path for autogive.app).
- [ ] Run `git diff --check`.
- [ ] Confirm the export uses root-relative assets (`/_next/...`).

## Product and accessibility review

- [ ] Review the homepage at narrow mobile and desktop widths without horizontal overflow.
- [ ] Complete and reset the deterministic scenario by keyboard.
- [ ] Confirm focus visibility, heading order, landmarks, contrast, and status labels.
- [ ] Enable reduced motion and verify that the experience remains usable.
- [ ] Review both live-public-projection and deterministic-fallback states.
- [ ] Verify AGI, Portfolio Signals, and Impact Relay navigation destinations.

## Pull request and deployment

- [ ] The pull request explains what changed, why, user impact, and validation.
- [ ] Required GitHub checks pass against the final head commit.
- [ ] The reviewed commit is merged to `main`.
- [ ] The Cloudflare deploy workflow completes successfully when `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` are configured (see [CLOUDFLARE.md](CLOUDFLARE.md)).
- [ ] The GitHub Pages fallback workflow completes successfully (until Pages is retired).
- [ ] The production URL, mark, favicon, Open Graph image, robots, and sitemap resolve.
- [ ] A release record includes owner, date, merge commit, PR, CI run, Pages run, and production verification.
