import { test, expect } from "./fixture.mjs";
test("desktop navigation has no redundant mobile menu", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Menu" })).toBeHidden();
  await expect(
    page.getByRole("navigation", { name: "Main navigation" }),
  ).toBeVisible();
});
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";
const widths = [320, 375, 390, 768, 1024, 1440, 1920];
const tags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
for (const width of widths) {
  test(`home at ${width}px: layout, resources and accessibility`, async ({
    page,
  }) => {
    const errors = [],
      bad = [],
      external = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    page.on("response", (r) => {
      if (r.status() >= 400) bad.push(r.url());
    });
    page.on("request", (r) => {
      if (!r.url().startsWith("http://portfolio.test/")) external.push(r.url());
    });
    await page.setViewportSize({ width, height: width < 640 ? 844 : 1000 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(page.locator(".work-item:visible")).toHaveCount(4);
    await expect(
      page.getByRole("link", { name: "Explore my work", exact: true }),
    ).toBeVisible();
    await expect(page.locator(".hero-top")).toContainText(
      "IT ANALYST AT McMASTER",
    );
    const results = await new AxeBuilder({ page }).withTags(tags).analyze();
    expect(results.violations).toEqual([]);
    expect(errors).toEqual([]);
    expect(bad).toEqual([]);
    expect(external).toEqual([]);
    await mkdir("docs/screenshots", { recursive: true });
    await page.screenshot({
      path: `docs/screenshots/home-${width}.png`,
      fullPage: false,
    });
    if ([390, 1440].includes(width))
      await page.screenshot({
        path: `docs/screenshots/full-${width}.png`,
        fullPage: true,
      });
  });
}
test("search and category combine, announce no matches, then reset", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: /In exploration/ }).click();
  await expect(page.locator(".work-item:visible")).toHaveCount(1);
  await expect(page.locator(".work-item:visible")).toContainText("CareerOS");
  await page
    .getByRole("searchbox", { name: "Search projects" })
    .fill("weather");
  await expect(page.locator("#result-count")).toHaveText("0 projects shown.");
  await expect(
    page.getByRole("heading", { name: "No matching projects." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Reset filters" }).click();
  await expect(page.locator(".work-item:visible")).toHaveCount(4);
  await expect(page.getByRole("searchbox")).toBeFocused();
  await page.getByRole("searchbox").fill("OPEN-METEO");
  await expect(page.locator(".work-item:visible")).toHaveCount(1);
  await expect(page.locator(".work-item:visible")).toContainText(
    "Aurora Weather",
  );
  await page.getByRole("searchbox").fill("123");
  await expect(page.getByRole("searchbox")).toHaveValue("123");
});
test("signature is keyboard operable and deterministic", async ({ page }) => {
  await page.goto("/");
  const control = page.getByRole("button", { name: "02 Isolate" });
  await control.focus();
  await page.keyboard.press("Enter");
  await expect(control).toBeFocused();
  await expect(control).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#trace-panel")).toContainText(
    "Test the right assumption.",
  );
  await page.getByRole("button", { name: "03 Resolve" }).click();
  await expect(page.locator("#trace-panel")).toContainText("approved change");
  await page.getByRole("button", { name: "04 Document" }).click();
  await expect(page.locator(".trace-map")).toHaveAttribute("data-stage", "3");
  await expect(page.locator("#trace-panel")).toContainText("reusable language");
  await page.screenshot({
    path: "docs/screenshots/approach.png",
    fullPage: false,
  });
});
test("mobile menu Escape and destination focus work on a short screen", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 400 });
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Menu" });
  await menu.click();
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await menu.click();
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Work", exact: true })
    .click();
  await expect(page.locator("#work")).toBeFocused();
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
test("skip link takes keyboard users to main content", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  expect(await page.evaluate(() => location.hash)).toBe("#main");
});
for (const blocked of [false, true])
  test(`clipboard ${blocked ? "failure retains email fallback" : "success confirms copy"}`, async ({
    page,
  }) => {
    await page.addInitScript(
      ({ blocked }) => {
        Object.defineProperty(navigator, "clipboard", {
          value: {
            writeText: async (value) => {
              if (blocked) throw Error("Denied");
              window.__copied = value;
            },
          },
        });
      },
      { blocked },
    );
    await page.goto("/");
    await page.getByRole("button", { name: "Copy email" }).click();
    if (blocked) {
      await expect(page.locator("#copy-status")).toContainText(
        "Select the address above",
      );
      await expect(page.locator(".email-link")).toHaveAttribute(
        "href",
        "mailto:antonettepetallo73@gmail.com",
      );
    } else {
      await expect(page.locator("#copy-status")).toHaveText("Email copied.");
      expect(await page.evaluate(() => window.__copied)).toBe(
        "antonettepetallo73@gmail.com",
      );
    }
  });
test("reduced motion removes animation while keeping the process functional", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "04 Document" }).click();
  await expect(page.locator("#trace-panel")).toContainText(
    "Leave a clearer path.",
  );
  expect(
    await page
      .locator(".trace-active")
      .evaluate((e) => getComputedStyle(e).transitionDuration),
  ).toBe("0s");
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
});
for (const width of [320, 1440])
  for (const slug of [
    "online-technical-help",
    "aurora-weather",
    "media-library",
    "careeros",
  ])
    test(`${slug} at ${width}px: complete story and accessibility`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/work/${slug}.html`);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator(".case-section")).toHaveCount(4);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      const results = await new AxeBuilder({ page }).withTags(tags).analyze();
      expect(results.violations).toEqual([]);
      if (slug === "careeros") {
        expect(await page.locator('a[href*="github.com"]').count()).toBe(0);
        await expect(page.locator("main")).toContainText("not implemented");
      }
      if (width === 1440)
        await page.screenshot({
          path: `docs/screenshots/case-${slug}.png`,
          fullPage: true,
        });
    });
test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("work, process, navigation and email remain available", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await expect(page.locator(".work-item")).toHaveCount(4);
    await expect(page.locator(".process-fallback")).toBeVisible();
    await expect(page.getByRole("navigation")).toBeVisible();
    await expect(page.locator(".email-link")).toBeVisible();
    await expect(page.locator(".work-controls")).toBeHidden();
    await page
      .getByRole("link", { name: "Aurora Weather", exact: true })
      .click();
    await expect(page.locator("h1")).toContainText("Aurora Weather");
  });
});
test("resume and error page have accessible navigation and no overflow", async ({
  page,
}) => {
  for (const url of ["/resume.html", "/404.html"]) {
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto(url);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const results = await new AxeBuilder({ page }).withTags(tags).analyze();
    expect(results.violations).toEqual([]);
  }
});

test("nested missing URLs retain styled error page and working home action", async ({
  page,
}) => {
  const response = await page.goto("/work/missing.html");
  expect(response.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: /Let’s get you/ }),
  ).toBeVisible();
  expect(
    await page.locator("body").evaluate((e) => getComputedStyle(e).fontFamily),
  ).toContain("Plex");
  await page.getByRole("link", { name: "Return to the portfolio" }).click();
  await expect(page.locator("#hero-heading")).toBeVisible();
  expect(new URL(page.url()).pathname).toBe("/index.html");
});
test("search result count is visible to sighted visitors", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("searchbox").fill("weather");
  await expect(page.locator("#result-count")).toHaveText("1 project shown.");
  const box = await page.locator("#result-count").boundingBox();
  expect(box.width).toBeGreaterThan(20);
  expect(box.height).toBeGreaterThan(5);
});
test.describe("resume without scripts", () => {
  test.use({ javaScriptEnabled: false });
  test("PDF download remains available without a dead print button", async ({
    page,
  }) => {
    await page.goto("/resume.html");
    await expect(
      page.getByRole("button", { name: "Print / save as PDF" }),
    ).toBeHidden();
    await expect(
      page.getByRole("link", { name: "Download PDF" }),
    ).toBeVisible();
  });
});
