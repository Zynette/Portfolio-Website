import { test } from "node:test";
import assert from "node:assert/strict";
const worker = async () => (await import("../worker/contact.mjs")).default;
const payload = {
  name: "Test visitor",
  email: "visitor@example.org",
  subject: "Project inquiry",
  message: "A safe integration test message.",
  website: "",
  token: "test-token",
};
const req = (data = payload, origin = "https://antonettepetallo.com") =>
  new Request("https://antonettepetallo.com/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: origin },
    body: JSON.stringify(data),
  });
const env = {
  CONTACT_TO: "private@example.org",
  CONTACT_FROM: "sender@example.org",
  RESEND_API_KEY: "server-test",
  TURNSTILE_SECRET_KEY: "server-test",
};
test("contact fails closed when secrets are missing", async () =>
  assert.equal((await (await worker()).fetch(req(), {})).status, 503));
test("cross-origin contact rejected", async () =>
  assert.equal(
    (
      await (
        await worker()
      ).fetch(req(payload, "https://elsewhere.example"), env)
    ).status,
    403,
  ));
test("validation and honeypot reject before provider requests", async () => {
  for (const data of [
    { ...payload, email: "bad" },
    { ...payload, name: "a\r\nb" },
    { ...payload, message: "x" },
    { ...payload, website: "spam" },
  ])
    assert.equal((await (await worker()).fetch(req(data), env)).status, 400);
});
test("removed resume variants return 410 without asset fallback", async () => {
  for (const path of [
    "/resume",
    "/resume.html",
    "/resume/",
    "/assets/Antonette-Petallo-Resume.pdf",
    "/Antonette_Petallo_ITSupport_Resume.pdf",
    "/%72esume.html",
  ])
    assert.equal(
      (
        await (
          await worker()
        ).fetch(new Request("https://antonettepetallo.com" + path), {})
      ).status,
      410,
    );
});
test("only provider acceptance produces success; failures stay errors", async () => {
  const original = globalThis.fetch;
  try {
    for (const result of ["bot-fail", "provider-fail", "no-id", "accepted"]) {
      globalThis.fetch = async (url, options) => {
        if (String(url).includes("siteverify"))
          return Response.json({
            success: result !== "bot-fail",
            hostname: "antonettepetallo.com",
            action: "contact",
          });
        const body = JSON.parse(options.body);
        assert.equal(body.to[0], env.CONTACT_TO);
        assert.equal(body.reply_to, payload.email);
        assert.ok(!options.body.includes("<script>"));
        return Response.json(
          result === "accepted" ? { id: "provider-id" } : { error: "failed" },
          { status: result === "provider-fail" ? 500 : 200 },
        );
      };
      const response = await (await worker()).fetch(req(), env);
      assert.equal(
        response.status,
        result === "accepted" ? 200 : result === "bot-fail" ? 400 : 502,
      );
      if (result === "accepted")
        assert.equal((await response.json()).accepted, true);
    }
  } finally {
    globalThis.fetch = original;
  }
});
