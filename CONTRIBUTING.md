# Contributing

Thank you for improving Autonomous Giving Incorporated. This repository favors small, reviewable changes that preserve truthful evidence boundaries.

## Before you begin

1. Read [AGENTS.md](AGENTS.md) for repository-specific constraints.
2. Read the [product definition](docs/PRODUCT.md) and [architecture](docs/ARCHITECTURE.md).
3. Check the [roadmap](docs/ROADMAP.md) before expanding scope.

Do not add payments, authentication, persistent storage, donor-level data, or write integrations as incidental changes. Those capabilities require separate product, privacy, and security review.

## Development workflow

1. Branch from current `main`.
2. Install locked dependencies with `npm ci`.
3. Make the smallest coherent change.
4. Update the relevant source-of-truth document when behavior, contracts, deployment, or design changes.
5. Run the required checks.
6. Open a focused pull request that explains the change, rationale, user impact, and validation.

## Required checks

Use Node.js 22+ and the committed lockfile (`npm ci`).

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build
git diff --check
```

For interface changes, also review narrow mobile and desktop layouts, keyboard operation, focus visibility, reduced motion, and source/fallback states.

Documentation-only changes under `docs/**` (and other non-site paths) do not trigger the GitHub Pages deploy workflow. Cloudflare deploys on every push to `main` (see [CLOUDFLARE.md](CLOUDFLARE.md)). Use **Actions → Deploy GitHub Pages → Run workflow** if a docs-only merge must refresh the Pages fallback.

## Code conventions

- Keep the App Router page server-rendered unless interaction requires a client component.
- Keep scenario data deterministic and public-safe.
- Consume shared values from `tokens.css`; avoid one-off visual tokens.
- Prefer semantic HTML and visible labels over decorative UI.
- Keep source validation fail-closed and preserve the local fallback.
- Do not log source payloads or introduce secrets into the static build.

## Documentation conventions

- State current behavior in the present tense and future work in roadmap documents.
- Link to the canonical document instead of duplicating detailed policy or architecture prose.
- Include exact commands and paths when they help a contributor verify a claim.
- Avoid release-relative terms such as “recently” or “soon”; use dates, versions, or phases.
- Record production deployments in `docs/RELEASES.md`.

## Pull-request checklist

- [ ] The change stays within the documented product and data boundary.
- [ ] Public claims are supported by deterministic or approved aggregate evidence.
- [ ] Documentation and tests match the implemented behavior.
- [ ] Lint, typecheck, Pages-mode build, and diff checks pass.
- [ ] Accessibility and responsive behavior were reviewed when UI changed.
