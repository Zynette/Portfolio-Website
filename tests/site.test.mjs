import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, access, readdir } from "node:fs/promises";
import path from "node:path";
const root = path.resolve("dist");
const pages = [
  "index.html",
  "work/online-technical-help.html",
  "work/aurora-weather.html",
  "work/media-library.html",
  "work/careeros.html",
  "404.html",
];
for (const page of pages)
  test(`${page}: crawlable metadata and real local links`, async () => {
    const html = await readFile(path.join(root, page), "utf8");
    assert.match(html, /<html lang="en">/);
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
    assert.match(html, /name="description"/);
    assert.match(html, /rel="canonical"/);
    assert.match(html, /property="og:image"/);
    for (const [, target] of html.matchAll(
      /(?:href|src)="([^"?]+)(?:\?[^"]*)?"/g,
    )) {
      if (/^(https?:|mailto:|data:)/.test(target)) continue;
      assert.notEqual(target, "#");
      if (target === "/api/contact") continue;
      const [file, anchor] = target.split("#");
      const resolved = file
        ? file.startsWith("/")
          ? path.resolve(root, "." + file)
          : path.resolve(path.dirname(path.join(root, page)), file)
        : path.join(root, page);
      assert.ok(resolved.startsWith(root + "/"));
      await access(resolved);
      if (anchor)
        assert.match(
          await readFile(resolved, "utf8"),
          new RegExp(`id="${anchor}"`),
        );
    }
  });
test("current role and honest project status remain accessible without scripts", async () => {
  const html = await readFile(path.join(root, "index.html"), "utf8");
  for (const text of [
    "IT Analyst",
    "February 2026",
    "January 2025",
    "CareerOS",
    "design study",
    "Kitchenly",
  ])
    assert.ok(html.includes(text));
  assert.equal((html.match(/class="work-item/g) || []).length, 4);
  assert.doesNotMatch(
    html,
    /35%|Expected Dec 2025|<canvas|Math.random|mailto:|gmail\.com|[—–]/,
  );
});
test("all current public frontend files exclude recipient email and resume links", async () => {
  async function scan(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const f = path.join(dir, entry.name);
      if (entry.isDirectory()) await scan(f);
      else if (
        /\.(?:html|css|js|svg|json|xml|txt)$/.test(f) &&
        entry.name !== "_worker.js"
      ) {
        const s = await readFile(f, "utf8");
        assert.doesNotMatch(
          s,
          /antonettepetallo73|gmail\.com|mailto:|href=["'][^"']*resume/i,
          f,
        );
      }
    }
  }
  await scan(root);
});
test("build excludes all resumes, repository files and review documents", async () => {
  for (const f of [
    "resume.html",
    "assets/Antonette-Petallo-Resume.pdf",
    "Antonette_Petallo_ITSupport_Resume.pdf",
    ".git/config",
    "docs/FACTUAL-REVIEW.md",
    "package.json",
  ])
    await assert.rejects(access(path.join(root, f)));
  await access(path.join(root, "_worker.js"));
});
