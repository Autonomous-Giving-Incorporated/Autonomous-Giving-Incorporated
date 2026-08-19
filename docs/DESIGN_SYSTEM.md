# AGI corporate design system

AGI is the corporate master brand and explanatory entry point to the product suite. It introduces the allocation-to-evidence journey and links directly to Portfolio Signals and Impact Relay without collapsing their distinct jobs. Zero State is credited only as the software builder in the footer.

## Shared brand foundation

- Paper `#f7f8fa`; raised surface `#ffffff`; cool gray `#e6e9ec`.
- Ink `#0e1116`; graphite `#1f232b`; rule derived from the cool-gray scale.
- AGI gold `#e6b23c` for attention and focus; AGI green `#2e7d6b` and mint `#a5cbb8` for verified state and suite links.
- Space Grotesk for display type, Inter for body and interface copy, and IBM Plex Mono for metadata. Those faces are self-hosted at build time with `next/font` (no Google Fonts CDN at runtime).
- Two- and four-pixel corners, thin rules, and no decorative elevation.

All implementation values originate in [`tokens.css`](../tokens.css). Components consume named variables rather than one-off colors.

## Identity hierarchy

The masthead always reads in this order:

1. Autonomously Giving Incorporated mark and wordmark
2. Product name or current corporate surface
3. Current page or workflow context

Portfolio Signals and Impact Relay appear as reciprocal suite links. Tenant or campaign identity may add context but never replace AGI or product identity. Canonical public links use `autogive.app`; footer governance links are Tokens, Logo use, and Legal, alongside “Software by Zero State.”

## Composition

AGI retains its public workbench structure: restrained paper surfaces, a graphite proof section, sequential lifecycle content, and evidence-led rows. The page avoids floating navigation, decorative cards, gradients, and motion-only affordances.

## Status and interaction

- `verified` uses deep teal and an explicit label.
- `waiting` uses signal yellow with carbon text.
- `blocked` or `danger` uses the shared danger token and an explicit label.
- Focus is visible, status never relies on color alone, and reduced-motion preferences suppress nonessential transitions.

The responsive contract is no horizontal scrolling from 320–1920 px, reachable suite navigation, and single-column evidence layouts below tablet widths.

## Copy contract

The public experience must distinguish demonstration data, public aggregate signals, and unavailable evidence. Never imply live payments, one-to-one donor attribution, or donor-level evidence when those capabilities do not exist.
