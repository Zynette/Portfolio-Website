import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import path from "node:path";
const root = path.resolve("dist");
const pages = [
  "index.html",
  "resume.html",
  "work/online-technical-help.html",
  "work/aurora-weather.html",
  "work/media-library.html",
  "work/careeros.html",
  "404.html",
];
for (const page of pages) {
  test(`${page}: crawlable content, metadata and valid local targets`, async () => {
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
      assert.notEqual(target, "#", "placeholder link");
      const [file, anchor] = target.split("#");
      const resolved = file
        ? file.startsWith("/")
          ? path.resolve(root, "." + file)
          : path.resolve(path.dirname(path.join(root, page)), file)
        : path.join(root, page);
      assert.ok(
        resolved.startsWith(root + "/") || resolved === root,
        "target escapes public directory",
      );
      await access(resolved);
      if (anchor)
        assert.match(
          await readFile(resolved, "utf8"),
          new RegExp(`id="${anchor}"`),
        );
    }
    for (const [, attrs] of html.matchAll(/<a\s([^>]*target="_blank"[^>]*)>/g))
      assert.match(attrs, /rel="[^"]*noopener/);
  });
}
test("home exposes current role and honest project maturity without JavaScript", async () => {
  const html = await readFile(path.join(root, "index.html"), "utf8");
  assert.match(html, /IT Analyst/);
  assert.match(html, /February 2026/);
  assert.match(html, /January 2025/);
  assert.equal((html.match(/class="work-item/g) || []).length, 4);
  assert.match(html, /Product design study/);
  assert.match(html, /mailto:antonettepetallo73@gmail.com/);
  assert.doesNotMatch(
    html,
    /picsum|35%|20\+|formsubmit|Math.random|<canvas|Expected Dec 2025/i,
  );
});
test("build excludes repository metadata, review documents and outdated resume", async () => {
  for (const f of [
    ".git/config",
    "docs/FACTUAL-REVIEW.md",
    "package.json",
    "Antonette_Petallo_ITSupport_Resume.pdf",
  ]) {
    await assert.rejects(access(path.join(root, f)));
  }
});
