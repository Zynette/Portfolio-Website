import { test, expect } from "./fixture.mjs";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";
const widths = [320, 375, 390, 768, 1024, 1440, 1920];
const tags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
for (const width of widths)
  test(`home ${width}px: readable layout, accessible content, valid resources`, async ({
    page,
  }) => {
    const errors = [],
      bad = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("response", (r) => {
      if (r.status() >= 400 && !r.url().includes("/api/contact"))
        bad.push(r.url());
    });
    await page.setViewportSize({ width, height: width < 540 ? 844 : 1000 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(page.locator(".work-item")).toHaveCount(4);
    await expect(page.locator("#hero-heading")).toContainText("Antonette");
    await expect(
      page.getByRole("link", { name: "Explore my work" }),
    ).toBeVisible();
    const result = await new AxeBuilder({ page }).withTags(tags).analyze();
    expect(result.violations).toEqual([]);
    expect(errors).toEqual([]);
    expect(bad).toEqual([]);
    await mkdir("docs/screenshots/v3", { recursive: true });
    await page.screenshot({ path: `docs/screenshots/v3/home-${width}.png` });
    if ([390, 1440].includes(width))
      await page.screenshot({
        path: `docs/screenshots/v3/full-${width}.png`,
        fullPage: true,
      });
  });
test("signature perspective operates by keyboard and cycles deterministically", async ({
  page,
}) => {
  await page.goto("/");
  const turn = page.getByRole("button", {
    name: "Change the ribbon perspective",
  });
  await turn.focus();
  await page.keyboard.press("Enter");
  await expect(turn).toBeFocused();
  await expect(page.locator(".hero-art")).toHaveAttribute("data-view", "1");
  await expect(page.locator("#perspective-label")).toContainText(
    "A closer look",
  );
  await turn.click();
  await turn.click();
  await expect(page.locator(".hero-art")).toHaveAttribute("data-view", "0");
});
test("mobile menu closes on Escape and transfers focus to destination", async ({
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
    .getByRole("link", { name: "Selected work" })
    .click();
  await expect(page.locator("#work")).toBeFocused();
  await expect(menu).toHaveAttribute("aria-expanded", "false");
});
test("skip link and reduced motion keep content and controls available", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await page
    .getByRole("button", { name: "Change the ribbon perspective" })
    .click();
  expect(
    await page
      .locator(".ribbon")
      .evaluate((e) => getComputedStyle(e).transitionDuration),
  ).toBe("0s");
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
});
test("contact unavailable does not permit false success and keeps private recipient absent", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await expect(page.locator("#form-status")).toContainText(
    "temporarily unavailable",
  );
  await expect(
    page.getByRole("button", { name: "Send message" }),
  ).toBeDisabled();
  await page.getByLabel("Your name").fill("Test visitor");
  await expect(page.getByLabel("Your name")).toHaveValue("Test visitor");
  expect(await page.content()).not.toMatch(
    /mailto:|gmail\.com|antonettepetallo73/,
  );
  const result = await new AxeBuilder({ page }).withTags(tags).analyze();
  expect(result.violations).toEqual([]);
});
for (const accepted of [true, false])
  test(`contact provider ${accepted ? "acceptance confirms" : "failure preserves input"}`, async ({
    page,
  }) => {
    // Test boundary only: these stubs are not evidence of real email delivery.
    await page.route("**/api/contact/config", (r) =>
      r.fulfill({
        contentType: "application/json",
        body: JSON.stringify({ siteKey: "test-key" }),
      }),
    );
    await page.route("https://challenges.cloudflare.com/**", (r) =>
      r.fulfill({
        contentType: "text/javascript",
        body: `window.turnstile={render:(selector,opts)=>{window.testSecurity=opts;opts.callback('test-token');return 1},reset:()=>{}};`,
      }),
    );
    await page.route("**/api/contact", (r) =>
      r.fulfill({
        status: accepted ? 200 : 502,
        contentType: "application/json",
        body: JSON.stringify(
          accepted
            ? { accepted: true }
            : { error: "The provider did not accept the message." },
        ),
      }),
    );
    await page.goto("/");
    await page.locator("#contact").scrollIntoViewIfNeeded();
    await page.getByLabel("Your name").fill("Test visitor");
    await page
      .getByLabel("Your email", { exact: true })
      .fill("visitor@example.org");
    await page
      .getByLabel("What’s on your mind?")
      .selectOption("Project inquiry");
    await page
      .getByLabel("Your message", { exact: true })
      .fill("A safe browser integration test.");
    await expect(
      page.getByRole("button", { name: "Send message" }),
    ).toBeEnabled();
    await page.getByRole("button", { name: "Send message" }).click();
    if (accepted) {
      await expect(page.locator("#form-status")).toContainText(
        "accepted your message",
      );
      await expect(page.getByLabel("Your name")).toHaveValue("");
    } else {
      await expect(page.locator("#form-status")).toContainText(
        "did not accept",
      );
      await expect(
        page.getByLabel("Your message", { exact: true }),
      ).toHaveValue("A safe browser integration test.");
    }
  });
for (const width of [320, 1440])
  for (const slug of [
    "online-technical-help",
    "aurora-weather",
    "media-library",
    "careeros",
  ])
    test(`${slug} ${width}px: case study layout and accessibility`, async ({
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
      const result = await new AxeBuilder({ page }).withTags(tags).analyze();
      expect(result.violations).toEqual([]);
      if (slug === "careeros")
        await expect(page.locator("main")).toContainText("not implemented");
    });
test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("project evidence, navigation and contact alternative remain available", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await expect(page.getByRole("navigation")).toBeVisible();
    await expect(page.locator(".work-item")).toHaveCount(4);
    await expect(
      page.getByRole("link", { name: "Find me on LinkedIn" }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page
      .getByRole("link", { name: "Aurora Weather", exact: false })
      .first()
      .click();
    await expect(page.locator("h1")).toContainText("Aurora Weather");
  });
});
test("removed resume URLs return unavailable and nested missing pages retain navigation", async ({
  page,
}) => {
  for (const url of [
    "/resume.html",
    "/assets/Antonette-Petallo-Resume.pdf",
    "/Antonette_Petallo_ITSupport_Resume.pdf",
  ])
    expect((await page.goto(url)).status()).toBe(410);
  expect((await page.goto("/work/missing.html")).status()).toBe(404);
  await page.getByRole("link", { name: "Return to the portfolio" }).click();
  await expect(page.locator("#hero-heading")).toBeVisible();
});
