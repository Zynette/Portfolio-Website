import { test as base, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import path from "node:path";
const root = path.resolve("dist");
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
  ".xml": "application/xml",
  ".txt": "text/plain",
  ".ico": "image/x-icon",
};
// In-process static delivery: no network server, external services or real submissions.
// This deliberately tests built HTML/assets in a real browser, not production hosting.
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route("http://portfolio.test/**", async (route) => {
      const url = new URL(route.request().url());
      const file = path.resolve(
        root,
        "." +
          decodeURIComponent(
            url.pathname === "/" ? "/index.html" : url.pathname,
          ),
      );
      if (!file.startsWith(root + "/"))
        return route.fulfill({ status: 403, body: "Forbidden" });
      try {
        const body = await readFile(file);
        await route.fulfill({
          status: 200,
          body,
          contentType: types[path.extname(file)] || "application/octet-stream",
          headers: {
            "X-Content-Type-Options": "nosniff",
            "Content-Security-Policy":
              "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'self'; form-action 'none'",
          },
        });
      } catch {
        await route.fulfill({
          status: 404,
          body: await readFile(path.join(root, "404.html")),
          contentType: "text/html; charset=utf-8",
        });
      }
    });
    await use(page);
  },
});
export { expect };
