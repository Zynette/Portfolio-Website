# Repository and deployed-site audit

Reviewed 2026-10-28. Base commit: `7aeac5870ef64d6dd965cddc804e65eaeb1052b3`.

## Scope

Read all original HTML, CSS, JavaScript, project data, SVG favicon and editor settings. Extracted both PDF résumé pages and inspected raster/icon dimensions and formats. Opened the live site in Chrome and compared fetched live HTML to repository HTML. There was no package manifest, build configuration, test suite, CI or local instruction file.

## Findings and decisions

| Finding                                                     | Effect                                                   | Resolution                                                                          |
| ----------------------------------------------------------- | -------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Current role missing; conflicting UTS dates                 | Recruiters get an outdated identity                      | User-supplied current IT Analyst and exact two role date ranges lead the experience |
| Degree/diploma dates and certificates inconsistent          | Completion may be misrepresented                         | Omit completion dates and certification claims; document factual review             |
| Résumé duplicated volunteering under certificates           | Mislabelled evidence and outdated positioning            | Replace linked file with concise new PDF and matching HTML profile                  |
| Random Picsum hero                                          | A random scene implied personal work context             | Original vector system illustration                                                 |
| Placeholder `#` project links and generic stories           | Unsupported technical claims                             | Replace with three reviewed public-source projects and clearly labelled concept     |
| Unverified 35% and ticket-volume claims                     | Misleading proof of impact                               | Remove; no replacement invented metrics                                             |
| Mock ping returns random advice                             | Could be mistaken for real diagnostic results            | Remove entire helper-tools section                                                  |
| 1/2/3 global shortcuts and localStorage access              | Interferes with text entry; storage failure can abort JS | Remove theme machinery and storage dependency                                       |
| Case story view slices to six results                       | Matching work disappears                                 | One complete static list with progressive filtering                                 |
| Dynamic-only project rendering                              | No work evidence without JS                              | All project content and case pages static HTML                                      |
| Custom modal lacks focus containment, title and restoration | Poor keyboard and screen-reader navigation               | Replace with deep-linked project pages                                              |
| Reveals hide content on every exit                          | Scrolling can remove information                         | Content always visible; no reveal gating                                            |
| Perpetual canvas, typewriter, sparkles, floating controls   | Distraction, resource use, overlapping UI                | Remove; finite user-triggered SVG transitions only                                  |
| 11px mobile body copy and multiple weak light colours       | Reduced readability                                      | Mobile body copy 15–16px, deliberate hierarchy and tested contrast                  |
| Contact handled only by button click                        | Enter/browser validation unreliable                      | Replace unverified delivery integration with direct email                           |
| Form disables CAPTCHA, assumes HTTP success means delivery  | Spam risk and inaccurate success                         | No form, network submission, delivery claim or inbound storage                      |
| Unsafe HTML interpolation and weak URL validation           | Fragile rendering boundary                               | Static trusted links; JS updates textContent and visibility only                    |
| Thin metadata; no canonical, OG, sitemap or structured data | Poor discovery and link sharing                          | Full metadata, OG PNG, Person schema, sitemap and robots                            |
| No skip link or main landmark                               | Harder keyboard navigation                               | Skip link, main landmark, semantic heading hierarchy                                |
| No explicit production/source boundary                      | Repository files can be exposed by broad hosting         | Build copies public allowlist to dist; docs/tests never shipped there               |
| Live HTML differs from repository                           | A merge alone may not update the served version          | Document hosting verification; do not auto-publish                                  |

## Source evidence for selected projects

- Online Technical Help: `Zynette/HamiltonTechHelp` at `d6663a920fb695b143f003a214b927c08d4345aa`. Read README, review notes, public UI, server/validation structure. Screenshot captured from the unchanged public HTML/CSS/JS with local static asset delivery, then cropped to the first 550px and encoded as WebP. Not a deployed production screenshot. No requests submitted.
- Aurora Weather: `Zynette/aurora-weather-reactnative` at `0cc74ecf1a53895308dfad94c29b0b13f6809caa`. Read App.js, manifest/package and README. Verified actual two-endpoint flow, in-memory recents, modes, errors and first-24-hour limitation. No native build or live weather API test claimed.
- Media Library: `Zynette/Media-Management-Console-Application` at `83dcb2e6fa95c5760f4ba2c0a73554c6f17aeea1`. Read the class/interface and Program source. ROT13 explicitly described as educational. No compiled binary executed.
- CareerOS: connected project record states documentation/planning only, with no application implementation. Publish only the user-authorised high-level concept and an original conceptual diagram. No private source, links, business plans, credentials or financial information copied.
- Kitchenly: user-described experiment without verified implementation evidence. Brief about-section mention only; no technology or maturity claim.

## Retained

Existing framework-free architecture, professional identity, contact address and verified profile URLs. Git history preserved. No production deployment or main changes.
