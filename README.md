# Antonette Petallo — Clarity, by design

A framework-free professional portfolio connecting enterprise IT experience with practical independent software. The interface uses local IBM Plex Sans fonts, an ivory/ink/vermilion palette, source-based project visuals and a four-stage support walkthrough.

## Develop and check

Node 24 is used in CI. Runtime delivery is static; no Node server or npm dependency runs in a visitor’s browser.

```sh
npm ci
npm run build
npm run check
npm test
npx playwright install chromium
npm run test:browser
npm run test:links
```

Open `index.html` in a static preview, or serve `dist/` with your normal static host. In ChatGPT's managed environment, use `sites-preview start <absolute-checkout>`; no additional server is needed. The preview configuration is local and ignored by git.

The browser suite loads the built files into Chromium through an intercepted static origin. It exercises real browser layout and interactions without an external server, tracking, live API or email delivery. It does not measure production network performance. The tests set the representative content headers and capture desktop/mobile screenshots in `docs/screenshots/`.

## Content and architecture

- `index.html`: professional positioning, selected work, process, experience and contact.
- `work/*.html`: ordinary, shareable case-study documents with source/status/tradeoffs. No custom modal.
- `styles.css`: shared tokens, layouts, print styles and responsive/reduced-motion rules.
- `script.js`: progressive menu, filters, deterministic support walkthrough and optional email copy.
- `resume.html`, `assets/Antonette-Petallo-Resume.pdf`: conservative current profile. HTML is the accessible primary alternative; the generated PDF is untagged.
- `assets/`: local fonts, original accurate SVG diagrams, actual development screenshot, social image and résumé.
- `scripts/build.mjs`: copies an explicit public allowlist to `dist/`. Documentation, source metadata, test files and npm configuration do not ship.
- `tests/`: content/target checks and Playwright/axe checks. CI runs checks on pull requests and feature branch pushes.

Primary content, navigation, project links and email work without JavaScript. No account, form submission, analytics, storage, third-party font request or runtime framework is used. Contact is a direct email link; delivery depends on the visitor’s email app, and the site never claims a message was sent.

## Update safely

Edit public copy directly in the HTML. Add or change a case study in `work/` and its entry in `index.html`; update `sitemap.xml`. Search includes rendered text plus each entry’s `data-search` keywords. The filter `data-category` is `implemented` or `concept`. Rebuild and test after edits. Keep the PDF and HTML profile in sync.

The support trace describes a fictional scenario. Do not replace it with confidential university incidents or screenshots. Use current repository evidence before changing any project’s status or adding outcome claims.

Review [the audit](docs/AUDIT.md), [factual questions](docs/FACTUAL-REVIEW.md), [design decisions](docs/superpowers/specs/2026-10-28-portfolio-design.md) and [verification report](docs/REVIEW.md).

## Publish only after owner approval

This feature branch is intended for review, not automatic production deployment. Do not merge it until the owner approves the content and design.

1. Review `docs/FACTUAL-REVIEW.md`, screenshots and the PR. Supply exact education details if you want complete credential lines.
2. Verify the current hosting arrangement. The deployed HTML and `main` differed at audit time; adding `CNAME` alone does not establish that a provider will deploy the correct files.
3. On the selected host, publish the contents of `dist/` as the site root. The root HTML/assets also support the existing static layout if the current hosting requires repository-root delivery. Prefer `dist/` to keep source-only files out of the served directory.
4. Preserve `antonettepetallo.com` and HTTPS; verify DNS and the host’s domain binding before changing anything. Do not point the production domain at an unreviewed preview.
5. `_headers` is provided for static hosts that recognise that format. GitHub Pages does **not** apply that file as response headers; configure equivalent policy at a supporting edge/host. Include a SHA-256 allowance for JSON-LD only if your chosen CSP implementation requires it; the JSON-LD is data, with no executable inline app code.
6. After deployment, verify all project URLs, résumé download, fonts/images, 404 handling, canonical URLs, OG image, CSP/response headers and direct email on a real phone.
7. Run a production mobile Lighthouse audit and collect real-user Core Web Vitals when traffic is available. No Lighthouse scores or field CWV are asserted by local tests.

There is no deployment workflow in this change. Existing repository/domain history remains intact.

## Review handoff

The complete implementation is on `feat/editorial-systems-portfolio`. A source ZIP and a Git bundle are provided with the handoff. The ZIP contains source, documentation, test configuration and reviewed screenshots, without dependencies or secrets. The bundle preserves the original Git history and the new commits:

```sh
git clone --branch feat/editorial-systems-portfolio portfolio-feature-branch.bundle portfolio-review
cd portfolio-review
npm ci
npm run build
npm test
npm run test:browser
```

Install Chromium first if needed with `npx playwright install chromium`. The owner authorised uploading this feature branch and opening a draft pull request. Production merge and publication still require separate approval. The existing production site remains unchanged.
