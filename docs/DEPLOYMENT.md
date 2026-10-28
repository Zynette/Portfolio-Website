# Production connection and private contact setup

The real domain served the October 28 V2 on audit. Response headers identify Cloudflare, and the owner's dashboard previously showed the Pages project `portfolio-website` as direct upload without a Git connection. GitHub Pages is a separate deployment and a successful Pages action there does not prove this domain updated. The latest origin/source configuration and DNS need an authenticated Cloudflare check.

The existing direct-upload project can use GitHub Actions without migrating the domain or replacing the project. `production.yml` runs checks and browser tests before uploading the allowlisted `dist` with Wrangler. GitHub `main` becomes the deployment source. Feature branches run `quality.yml` without production credentials. There is no deployment from a pull request.

## One-time account setup

1. In Cloudflare, confirm `Workers & Pages → portfolio-website → Custom domains` contains `antonettepetallo.com`, production branch is `main`, and retain current DNS/HTTPS.
2. Create an account-scoped API token limited to Cloudflare Pages Edit for the owning account. Save it as GitHub Actions secret `CLOUDFLARE_API_TOKEN`; save the owning account ID as `CLOUDFLARE_ACCOUNT_ID`. Do not paste a token into source, chat, an issue, or public configuration. Token creation and persistent credential access require the owner's account action.
3. In Cloudflare Pages production settings, add encrypted runtime secrets `CONTACT_TO` (existing inbox), `CONTACT_FROM` (a sender verified with Resend), `RESEND_API_KEY`, and `TURNSTILE_SECRET_KEY`. Add `TURNSTILE_SITE_KEY`, which is intentionally public. Create a Turnstile widget restricted to the portfolio domain. The worker checks its hostname and `contact` action, and consumes one-time tokens before any delivery request.
4. Resend requires an account and a verified sending domain. Configure its required DNS records while preserving existing mail records. Check the selected plan before enabling, and do not purchase a plan for this project. If the owner already has a transactional provider, adapt the server rather than create unnecessary accounts.
5. For additional abuse limits, configure a Cloudflare rule for POST `/api/contact` if available on the current plan. No distributed rate limiter is claimed. Turnstile, honeypot, origin checks and bounded inputs are implemented.
6. Run the production workflow on `main`. Confirm the workflow's public-domain and 410 checks succeed. Test one explicitly labelled inquiry with the owner's chosen sender address, confirm Resend acceptance and delivery events, and confirm the message in the actual inbox. This integration is unfinished until that real delivery check passes.

## Privacy and failure behavior

Only the Worker sees recipient, sender and provider secrets. The browser fetches a public site key from `/api/contact/config`; it never receives the recipient. No visitor message is stored by this application. Cloudflare and the email provider process the request according to their policies. Responses use no-store. Provider errors do not echo internal details or secrets. Messages remain in the form after an error. The success message says provider acceptance, not inbox arrival.

If secrets are absent, config and sending return 503 and the button remains disabled with an honest notice and LinkedIn alternative. Do not advertise contact delivery as working before configuration and actual delivery verification.

The advanced-mode `_worker.js` must be deployed with Wrangler. Uploading only static HTML or using GitHub Pages will omit API and 410 behavior. It also delegates all other requests to the Pages ASSETS binding, preserving top-level `404.html` handling. Avoid a fallback rewrite of all paths to index.html.

Old résumé paths return 410 through the Worker; the files are absent from current source and dist. Existing CDN copies should be purged by URL after deployment if still served. Old Pages preview deployments and GitHub Pages need separate privacy checks, since production changes cannot remove historical deployments.

## Historical exposure

The initial commit `51edcf8` contained `Antonette_Petallo_ITSupport_Resume.pdf`. Later commits including `537d66f` published `resume.html` and `assets/Antonette-Petallo-Resume.pdf`. They remain retrievable through public Git history and prior commits even after removal from main. The personal email also appears in old source and Git author metadata, including the current main merge. Removing current frontend references does not retract clones, search caches or third-party archives. No history was rewritten. A separate owner-approved history rewrite and hosting deployment cleanup would be required to reduce that exposure, and cannot guarantee retraction.
