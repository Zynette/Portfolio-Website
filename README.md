# Antonette Petallo | Portfolio V3

A framework-free portfolio for Antonette's enterprise IT work and independent software projects. The visual identity uses plum, parchment and rose, self-hosted Cormorant Garamond and IBM Plex Sans, and an original vector ribbon with three keyboard-operable perspectives.

## Develop and check

```sh
npm ci
npm run build
npm run check
npm test
npx playwright install chromium
npm run test:browser
npm run test:links
```

Node 24 is used in GitHub Actions. The browser tests exercise built files under a routed origin with representative headers. They test seven viewport widths, axe accessibility rules, reduced motion, keyboard navigation, disabled JavaScript and contact acceptance/failure boundaries. Stubbed provider tests do not prove email delivery. Production and inbox checks are separate.

In ChatGPT's managed environment use the existing `sites-preview` daemon with a checkout-local `.openai/hosting.json` whose static directory is `dist`. The static preview does not execute Cloudflare's Worker, so the contact service is unavailable there.

## Source map

- `index.html`, `work/*.html`, `404.html`: static crawlable content and case studies.
- `styles.css`, `script.js`: shared design system, responsive layouts, progressive navigation, ribbon perspective and private contact interaction.
- `worker/contact.mjs`: Cloudflare advanced-mode Worker, same-origin contact validation, Turnstile verification, Resend adapter and unavailable-document responses.
- `scripts/build.mjs`: allowlisted public output in `dist`, including `_worker.js` and a commit-specific `release.json`.
- `.github/workflows/quality.yml`: feature branch and pull request checks.
- `.github/workflows/production.yml`: main-branch checks, then Wrangler deployment to the existing `portfolio-website` Cloudflare Pages project and exact-commit domain verification.
- `tests`: Node privacy/security checks and Playwright browser checks.

No personal recipient address is present in frontend code. Secret values belong only in server-side hosting configuration. Runtime deployment credentials belong only in GitHub Actions secrets. Do not commit secrets or add a client-side mail recipient.

## Production setup

Follow [deployment and contact setup](docs/DEPLOYMENT.md). The existing direct-upload Cloudflare project does not need a domain migration. Its one-time credentials and private mail settings must be configured before automatic publication and contact delivery can work. The owner authorized the requested redesign's publication after checks; account access is the remaining dependency.

Core content and project links work without JavaScript. Sending a message requires JavaScript for bot protection; LinkedIn remains an accessible alternative. Missing provider configuration disables sending with a truthful message. A successful UI response means the email provider accepted the message, not confirmed inbox arrival.

Project maturity must remain evidence-based. University experience is public professional context; no university incidents, screenshots or confidential data should be added. Update the sitemap when adding a case study.

See [V3 design](docs/superpowers/specs/2026-10-28-v3-design.md), [verification status](docs/REVIEW-V3.md) and [remaining factual questions](docs/FACTUAL-REVIEW.md). Earlier audit/review files describe V2 and are retained as history, not the current publication instructions.
