# Portfolio review and verification

## Scope and design

Completely replaced the old interface while retaining plain HTML/CSS/JavaScript at runtime. The visual concept connects careful support work to software thinking through an annotated system diagram and a user-controlled support trace. The site uses static case-study pages rather than custom dialogs, direct email rather than unverified submissions, and a conservative current résumé.

The three implemented projects have public repository evidence. CareerOS is a product design study. Kitchenly is a brief, explicitly exploratory mention. No launch, usage, security certification, client testimonial or performance metric has been invented.

## Actual checks, 2026-10-28

- `npm run build`: static public allowlist generated successfully.
- `npm run check`: JavaScript syntax and Prettier checks pass at the implementation checkpoint.
- `npm test`: 9 content/build/asset/navigation tests pass.
- `npm run test:browser`: 28 Chromium tests pass at the implementation checkpoint.
- Home checked at 320, 375, 390, 768, 1024, 1440 and 1920 pixels. Case studies checked at 320 and 1440. Short mobile menu screen: 390 × 400.
- axe-core reports no WCAG A/AA violations in the tested homepage, four case-study, résumé and error-page states. This does not replace manual assistive-technology testing or establish certification.
- Tests cover combined category/search, no-match reset, keyboard process controls, mobile menu Escape/destination focus, skip link, copy success and blocked-clipboard fallback, script-disabled content, reduced motion, missing resources, console errors and absence of third-party page requests.
- Desktop/mobile screenshots captured and visually inspected. Fixed redundant desktop menu. Search now includes visible project copy as well as keywords, so punctuation such as “Open-Meteo” works.
- PDF résumé: one page, text extracted and page rendered for visual inspection. No duplicate certificate section. PDF is not tagged; accessible HTML profile is provided.

## Test environment and limits

Automated browser tests use Chromium with intercepted delivery of the exact `dist/` files at a test origin. This is a real rendering/interaction test with an artificial static transport. It does not exercise DNS, TLS, CDN behaviour, production caching, real inbox delivery or external APIs. The actual managed preview was additionally opened and inspected in Chrome. Its URL is internal QA, not a production deployment.

Contact is email-only. There is no contact-form validation/success/failure flow or modal to test because both were removed deliberately. No test sends messages. Clipboard success is controlled in tests; the blocked-permission case proves the visible fallback.

No production Lighthouse score, field LCP/CLS/INP, native mobile-device test, Safari/Firefox test or comprehensive screen-reader audit is claimed. The static core is about 84 KB uncompressed across HTML/CSS/JS before content revisions; fonts and images are local and bounded. Those sizes are design choices, not browser performance measurements.

## Critical design review

Subjective editorial scores, not external awards or automated metrics:

| Perspective         | Score  | Rationale and remaining constraint                                                                                                                                                                                                           |
| ------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Creative director   | 87/100 | Cohesive typography, annotations, restrained colour and a recognisable systems metaphor. Original vector treatment and genuine source capture. The signature interaction is intentionally modest; it is not a high-budget motion production. |
| Technical recruiter | 88/100 | Current title/employer visible immediately; role progression and project status are easy to scan. Specific code tradeoffs provide better evidence than claims. Exact graduation details and fuller newer project proof remain missing.       |
| Frontend engineer   | 90/100 | Static-first, local assets, progressive enhancements, semantic structure, deterministic interaction, CI and actual tests. Hosting/header behaviour and cross-browser/assistive-tech verification remain release checks.                      |
| Regular visitor     | 89/100 | Clear actions, readable phone typography, no floating clutter or forced animation, direct project URLs and contact. No portrait or fully interactive project demos; diagram text is supplemented by readable body copy.                      |

## Review before publication

See `FACTUAL-REVIEW.md`. In particular, exact credentials and project contribution/status wording need owner review. Merge and production publication are explicitly reserved for the owner. The current deployed site has not been changed by this work.

## Independent branch review and final fixes

A separate read-only reviewer inspected the implementation, tests and screenshots and independently reran the static checks. No critical issue was found. Two important findings were corrected: nested 404 pages now load assets and navigate with root-relative URLs, and the source diagrams now show the actual sequence/class relationships. New regression tests failed before the 404 fix and then passed.

Polish findings were also resolved: visible filter result count, consistent “studies” education wording, progressive print control, and removal of reviewer-facing credential caveats from the public résumé. Tests for visible count and script-disabled print behaviour failed before those fixes and then passed. No significant review finding remains deferred.

External link check: all four GitHub profile/repository URLs returned HTTP 200. LinkedIn returned HTTP 999 to the automated checker; its reachability remains unverified, and its existing profile URL is retained. `npm audit --audit-level=high` reported zero vulnerabilities for the installed dependency graph.

The owner explicitly authorised uploading the reviewed feature branch to the public GitHub repository and opening a draft pull request. The connected GitHub app handles the upload because the terminal has no GitHub credentials. Merge, DNS changes and production deployment remain outside this authorisation. The local source ZIP and Git bundle also preserve the reviewed implementation.

### Release checks outside this environment

Production DNS/TLS/headers, actual email-app handling and delivery, live weather/provider reliability, native-device compatibility, Safari/Firefox, comprehensive assistive-technology use and field performance remain unverified. These boundaries remain appropriate: this change does not operate the third-party projects or publish production. Exact credentials and project roles/status remain owner-review items as listed in `FACTUAL-REVIEW.md`.
