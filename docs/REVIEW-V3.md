# Portfolio V3 verification and handoff

Updated October 28, 2026. Feature branch: `feat/feminine-editorial-v3`. Pull request: https://github.com/Zynette/Portfolio-Website/pull/2

## Implemented

Plum, rose and parchment editorial identity; oversized self-hosted serif typography; original ribbon sculpture with keyboard-operated perspectives; alternating project layouts; current McMaster experience; rewritten concise copy; shared case-study styles; matching monogram and social image. No loading gate, autoplay, external fonts, framework runtime or content reveal barrier.

Public profile HTML/PDF files and email controls are removed from current source and dist. Privacy tests inspect every public frontend text asset. Old document paths have Worker 410 responses. The worker is server-executed deployment code, with no recipient address in it; secret values remain account configuration.

Contact includes name, email, inquiry type, message, native accessible labels, browser and server validation, payload limits, same-origin enforcement, honeypot and one-time Turnstile token verification with hostname/action checks. It sends through Resend with the recipient secret, uses plain text to avoid HTML injection, preserves input on error and confirms only provider acceptance. No distributed rate limiter is claimed; optional account WAF setup is documented.

## Actual evidence

- 17 Node tests pass locally, covering built content/targets, privacy exclusions, validation, origin, malformed/oversized requests, bot-verification binding, provider acceptance and failures, server-only configuration, static fallback and document removal.
- Formatting and JavaScript syntax checks pass locally.
- GitHub CI at commit `71ccf7935f606626b40a4f3fd6c50dde08018af0` passed all 23 Chromium tests after a contrast fix. Tests cover 320, 375, 390, 768, 1024, 1440 and 1920px; zero axe violations in tested states; no tested overflow or missing assets; keyboard/reduced-motion/no-JavaScript flows and contact boundary behavior. Later copy and test coverage additions require the latest CI run before merge.
- Managed desktop browser preview and CI-generated mobile screenshot inspected visually. The local browser suite could not launch because its Chromium binary is missing; CI provides browser evidence.
- Independent review found two material issues: security token renewal overwrote submission feedback, and deployment verification accepted any V3 marker. Both were corrected: feedback persists and production compares the exact commit in `release.json`.

## Unfinished account-dependent work

Cloudflare is signed out in the connected browser. Production account configuration, DNS target and domain binding need authenticated verification. GitHub Actions secrets and Cloudflare runtime secrets are not yet configured or confirmed. Resend sender verification and actual Turnstile widget setup require the owner's account. No real email test or inbox arrival has been verified. No production V3 deployment or CDN purge is claimed.

The real domain served the previous October 28 V2 at audit. Its current source still exposes the old contact and profile until the new release reaches Cloudflare. GitHub history and old hosting previews can retain previous profile files and email author metadata. No destructive history rewrite or old deployment deletion was performed. See DEPLOYMENT.md for the audit and exact setup.

## Design assessment

The opening is a substantial change from the previous rigid ivory/vermilion layout, with a stronger personal name, sculptural art and a deliberately composed mobile version. The most significant remaining visual limitation is project evidence: native coursework and early product concepts do not have verified product screenshots. Their diagrams stay clearly labelled, rather than suggesting nonexistent live interfaces. No numerical design rating, Lighthouse score, screen-reader certification, real-user performance result or fully working production contact claim is made.
