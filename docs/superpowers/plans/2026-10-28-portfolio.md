# Portfolio implementation plan

> Execute inline, using executing-plans and test-driven-development. User delegates implementation decisions and requests continuous execution.

**Goal:** Replace the outdated portfolio with an original, accurate and accessible editorial experience.
**Architecture:** Static HTML/CSS/JS; Node allowlist build; separate case study pages; progressive interactions.
**Tech stack:** HTML, CSS, JavaScript, Node tests, Playwright, axe, Prettier.
**Spec:** docs/superpowers/specs/2026-10-28-portfolio-design.md

## Global constraints

- No merge, main push or production deployment.
- No fabricated credentials, outcomes or project maturity.
- Primary content readable without JS; reduced-motion fallback.
- Widths 320/375/390/768/1024/1440/1920, no overflow.
- No runtime framework, third-party browser requests or tracking.

## Review focus

1. Filter and query combinations with no matches: announce zero and offer reset.
2. Storage/clipboard denied: direct email remains visible and usable.
3. Script failure: navigation, case study content and contact remain reachable.
4. Short landscape/mobile navigation: controls reachable, Escape restores focus.
5. Private projects: public content never links or copies private implementation/plans.

### Task 1: Audit, content and build boundaries

Files: docs/AUDIT.md, docs/FACTUAL-REVIEW.md, tests/site.test.mjs, scripts/build.mjs.
Produces: dist public files, three source-verified implemented stories plus concept story.

- [x] Write static acceptance tests, run against current site and verify failures.
- [x] Write audit/evidence notes and public asset allowlist.
- [x] Build and pass static tests after task 2 supplies pages.

### Task 2: Visual system and accessible interactions

Files: index.html, styles.css, script.js, work/_.html, assets/_, resume.html.
Consumes: evidence notes. Produces: static pages, filter controls, menu, four-stage signature.

- [x] Write Playwright behavior tests and verify current site fails expectations.
- [x] Implement complete editorial responsive layout and case studies.
- [x] Add original accurate diagrams, real screenshot where feasible, SEO and resume replacement.
- [x] Pass static tests and browser behavior tests.

### Task 3: Verification, review and handoff

Files: tests/browser.spec.mjs, playwright.config.mjs, .github/workflows/quality.yml, docs/REVIEW.md, README.md.
Consumes: built site. Produces: reproducible checks, screenshots and feature branch PR.

- [x] Run responsive/keyboard/no-JS/reduced-motion/axe checks; inspect screenshots.
- [x] Address observed failures, measure available lab metrics, verify links.
- [x] Review from creative/recruiter/engineer/visitor perspectives, record realistic ratings.
- [x] Complete independent branch review, resolve significant findings and rerun affected suite.
- [x] Prepare reviewed feature branch for the owner-authorised GitHub upload and draft PR. Production merge and publication remain unapproved.
