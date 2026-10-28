const headers = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};
const json = (data, status = 200) => Response.json(data, { status, headers });
const unavailable = () =>
  json(
    { error: "Contact is temporarily unavailable. Please try again later." },
    503,
  );
async function contact(request, env) {
  const origin = new URL(request.url).origin;
  if (request.headers.get("Origin") !== origin)
    return json({ error: "Please send your message from this website." }, 403);
  if (
    !env.CONTACT_TO ||
    !env.CONTACT_FROM ||
    !env.RESEND_API_KEY ||
    !env.TURNSTILE_SECRET_KEY
  )
    return unavailable();
  const type = request.headers.get("Content-Type") || "";
  if (
    !type.startsWith("application/json") &&
    !type.startsWith("application/x-www-form-urlencoded")
  )
    return json({ error: "Unsupported request format." }, 415);
  if (Number(request.headers.get("Content-Length")) > 12000)
    return json({ error: "Your message is too long." }, 413);
  let data;
  try {
    const reader = request.body?.getReader();
    if (!reader) return json({ error: "Please complete the form." }, 400);
    const chunks = [];
    let length = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.length;
      if (length > 12000) {
        await reader.cancel();
        return json({ error: "Your message is too long." }, 413);
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.length;
    }
    const text = new TextDecoder().decode(bytes);
    data = type.startsWith("application/json")
      ? JSON.parse(text)
      : Object.fromEntries(new URLSearchParams(text));
  } catch {
    return json({ error: "Please check your message and try again." }, 400);
  }
  if (!data || typeof data !== "object")
    return json({ error: "Please complete the form." }, 400);
  const clean = (key, max) =>
    typeof data[key] === "string" && data[key].trim().length <= max
      ? data[key].trim()
      : "";
  const name = clean("name", 100),
    email = clean("email", 254),
    subject = clean("subject", 100),
    message = clean("message", 4000),
    token = clean("token", 2048) || clean("cf-turnstile-response", 2048);
  if (
    !name ||
    /[\r\n]/.test(name) ||
    !email ||
    !/^\S+@[^\s@]+\.[^\s@]+$/.test(email) ||
    /[\r\n]/.test(email) ||
    !subject ||
    /[\r\n]/.test(subject) ||
    message.length < 10 ||
    data.website ||
    !token
  )
    return json(
      {
        error:
          "Please check all fields and complete the security check. Messages need at least 10 characters.",
      },
      400,
    );
  try {
    const verification = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: new URLSearchParams({
          secret: env.TURNSTILE_SECRET_KEY,
          response: token,
        }),
        signal: AbortSignal.timeout(10000),
      },
    );
    if (!verification.ok)
      return json(
        { error: "The security check is unavailable. Please try again." },
        502,
      );
    const verified = await verification.json();
    if (
      !verified.success ||
      verified.hostname !== new URL(request.url).hostname ||
      verified.action !== "contact"
    )
      return json(
        { error: "Please complete a new security check and try again." },
        400,
      );
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM,
        to: [env.CONTACT_TO],
        reply_to: email,
        subject: `Portfolio inquiry: ${subject}`,
        text: `From: ${name}\nReply address: ${email}\n\n${message}`,
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok)
      return json(
        {
          error:
            "Your message could not be accepted. Your text is still here. Please try again later.",
        },
        502,
      );
    const result = await response.json();
    if (typeof result.id !== "string" || !result.id)
      return json(
        { error: "Delivery could not be confirmed. Please try again later." },
        502,
      );
    return json({
      accepted: true,
      message:
        "Thank you. The email service accepted your message for delivery.",
    });
  } catch {
    return json(
      {
        error: "The connection could not be confirmed. Please try again later.",
      },
      502,
    );
  }
}
export default {
  async fetch(request, env) {
    let path;
    try {
      path = decodeURIComponent(new URL(request.url).pathname);
    } catch {
      return new Response("Not found", { status: 404 });
    }
    if (
      /^\/resume(?:\.html)?\/?$/i.test(path) ||
      /(?:^|\/)(?:Antonette[-_]Petallo[-_].*Resume\.pdf)$/i.test(path)
    )
      return new Response("This document is no longer publicly available.", {
        status: 410,
        headers: {
          "Cache-Control": "no-store",
          "X-Robots-Tag": "noindex",
          "Content-Type": "text/plain; charset=utf-8",
        },
      });
    if (path === "/api/contact/config")
      return request.method === "GET" &&
        env.TURNSTILE_SITE_KEY &&
        env.CONTACT_TO &&
        env.CONTACT_FROM &&
        env.RESEND_API_KEY &&
        env.TURNSTILE_SECRET_KEY
        ? json({ siteKey: env.TURNSTILE_SITE_KEY })
        : unavailable();
    if (path === "/api/contact") {
      if (request.method !== "POST")
        return json({ error: "Use the contact form." }, 405);
      return contact(request, env);
    }
    if (path.startsWith("/api/")) return json({ error: "Not found" }, 404);
    return env.ASSETS.fetch(request);
  },
};
