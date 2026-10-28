# Clarity, by design — portfolio redesign

## Intent

A credible, distinctive portfolio for Antonette Petallo: IT Analyst at McMaster University supporting Hospitality Services from February 2026; formerly IT Technical Assistant, UTS, January 2025–January 2026. Recruiters must identify her role and evidence quickly. Clients and collaborators need direct contact and honest project status.

## Direction decision

The user explicitly delegates the three-direction evaluation and final choice, requests independent implementation, and reserves approval for merge/production publishing. No intermediate design approval is necessary.

| Direction                                      | Strength                                                    | Tradeoff                                  | Decision                   |
| ---------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------- | -------------------------- |
| Signal room: dark technical atlas              | Memorable, expressive systems visual                        | Risks looking like a decorative dashboard | Reject                     |
| Field notes: human editorial journal           | Warm, personal, readable                                    | Less immediate technical character        | Retain editorial influence |
| Clarity, by design: an annotated systems study | Connects human support to engineering, fluid but restrained | Requires precise explanatory content      | Select                     |

## Visual system

Warm ivory #f3f1e9, ink #20221f, vermilion #bd3c23, muted olive #5c6257. Local IBM Plex Sans 400/500/600 under OFL plus system Georgia italic. Large asymmetric type, hairline rules, numbered annotations, intentional light/dark section changes. No stock photos, decorative canvas, theme controls or invented metrics. Typography and diagrams establish identity without a portrait.

## Visitor journey

Header: name, Work, Approach, Experience, Contact. Hero: current role, large concise statement, featured-work action, signature schematic. Selected work: three implemented public repositories and a distinctly labelled CareerOS concept study. Approach: four-step interactive trace of a fictional support problem, with all explanatory content available without JavaScript. Experience: current analyst role before assistant role, capabilities grouped by actual work. About and education: concise, cautious wording; no invented graduation/certification dates. Contact: reliable email and LinkedIn links, copy-address enhancement with visible fallback. No unverified form delivery service. Footer and print-friendly career profile.

## Signature interaction

A deterministic illustrative system trace: Understand → Isolate → Resolve → Document. Four native buttons change SVG emphasis and an explanatory panel; no live diagnostics, simulated metrics, confidential details or perpetual animation. Full four-step static narrative remains available on script failure. Reduced motion disables transitions. Keyboard focus remains on the selected button.

## Evidence and project treatment

Online Technical Help: public HTML/CSS/JS + Node implementation; provider configuration and public launch pending. Aurora Weather: public React Native/Expo source with Open-Meteo search/forecast integration; no claim of store publication or production audit. Media Library: public C# educational console application; ROT13 explicitly educational, not secure encryption. CareerOS: product planning study, private repository, no public repo link or invented UI. Kitchenly: user-described experiment only, not featured until implementation evidence is available. Private documents and financial plans must never be copied into this public repository.

Each implemented case study: problem, source-supported role, architecture, tradeoffs, status, verified repository link, honest next steps and an accurate source-derived visual. Product screenshots only where captured from real code. All claims requiring confirmation go to docs/FACTUAL-REVIEW.md, not fabricated public copy.

## Engineering

Keep buildless semantic HTML/CSS/browser JS at runtime. A tiny Node build copies an explicit public allowlist to dist; root source remains deployable on existing static hosting. All primary content and project links work without JS. Separate case study pages remove modal focus and deep-link problems. Progressive search/filter works on static project rows with visible result count and empty state. No request to third-party services on load. Use safe links, canonical URLs, sitemap, robots, OG PNG, structured data, local assets and hosting-specific CSP/header guidance.

## Verification and delivery

Node tests for crawlable pages, valid assets/anchors, metadata and no placeholders. Playwright tests for filter/search, keyboard/menu, signature, copy fallback, no-JS, reduced motion, console errors, axe A/AA checks and widths 320/375/390/768/1024/1440/1920 plus short landscape. Capture desktop/mobile screenshots. Measure browser lab performance if supported; distinguish lab from field CWV. CI runs static and browser checks. Document audit, design review scores, factual unknowns and publishing steps. Work only on feature branch, open PR if possible, never merge or deploy production.
