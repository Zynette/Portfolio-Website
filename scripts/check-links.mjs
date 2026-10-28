import { readFile, readdir, mkdir, writeFile } from "node:fs/promises";
const files = [
  "dist/index.html",
  ...(await readdir("dist/work")).map((f) => `dist/work/${f}`),
];
const links = new Set();
for (const file of files) {
  const html = await readFile(file, "utf8");
  for (const [, url] of html.matchAll(/<a\b[^>]*href="(https:[^"]+)"/g))
    links.add(url);
}
const results = [];
for (const url of links) {
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
      headers: { "User-Agent": "Portfolio-Link-Check" },
    });
    await response.body?.cancel();
    results.push({
      url,
      status: response.status,
      ok: response.ok,
      finalUrl: response.url,
    });
  } catch (error) {
    results.push({ url, ok: false, error: error.message });
  }
}
await mkdir("test-results", { recursive: true });
await writeFile(
  "test-results/external-links.json",
  JSON.stringify(results, null, 2),
);
for (const result of results)
  console.log(
    `${result.ok ? "OK" : "UNVERIFIED"} ${result.url} (${result.status || result.error})`,
  );
if (results.some((r) => !r.ok)) process.exitCode = 1;
