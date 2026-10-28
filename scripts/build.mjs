import { cp, mkdir, rm } from "node:fs/promises";
// Ship only public assets. The source repo, review notes and tests never enter dist.
await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });
for (const entry of [
  "index.html",
  "styles.css",
  "script.js",
  "work",
  "assets",
  "404.html",
  "favicon.svg",
  "favicon-16.png",
  "favicon-32.png",
  "favicon-512.png",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
  "_headers",
  "CNAME",
  ".nojekyll",
]) {
  await cp(entry, `dist/${entry}`, { recursive: true });
}
await cp("worker/contact.mjs", "dist/_worker.js");
console.log("Built static portfolio in dist/ (public allowlist only).");
