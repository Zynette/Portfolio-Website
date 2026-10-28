(() => {
  document.documentElement.classList.add("js");
  const $ = (s) => document.querySelector(s);
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());
  const toggle = $(".menu-toggle"),
    menu = $("#navigation");
  if (toggle && menu) {
    toggle.hidden = false;
    const close = (restore = false) => {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      if (restore) toggle.focus();
    };
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      menu.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });
    menu.addEventListener("click", (event) => {
      const link = event.target.closest("a");
      if (!link) return;
      close();
      if (link.hash && link.pathname === location.pathname) {
        const target = $(link.hash);
        if (target) {
          target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
        }
      }
    });
    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        toggle.getAttribute("aria-expanded") === "true"
      )
        close(true);
    });
    matchMedia("(max-width:540px)").addEventListener("change", () => close());
  }
  const turn = $(".perspective-button"),
    art = $(".hero-art");
  if (turn && art) {
    turn.hidden = false;
    let view = 0;
    const views = [
      "01 / The whole picture",
      "02 / A closer look",
      "03 / Another possibility",
    ];
    turn.addEventListener("click", () => {
      view = (view + 1) % 3;
      art.dataset.view = String(view);
      $("#perspective-label").textContent = views[view];
    });
  }
  const form = $("#contact-form");
  if (!form) return;
  const button = form.querySelector('[type="submit"]'),
    status = $("#form-status");
  let widget = null,
    token = "",
    submitting = false,
    started = false;
  const say = (message, state = "") => {
    status.textContent = message;
    status.dataset.state = state;
  };
  const resetSecurity = () => {
    token = "";
    button.disabled = true;
    if (widget !== null && window.turnstile) window.turnstile.reset(widget);
  };
  const start = async () => {
    if (started) return;
    started = true;
    try {
      const response = await fetch("/api/contact/config", {
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw Error("unavailable");
      const config = await response.json();
      if (!config.siteKey) throw Error("unavailable");
      const script = document.createElement("script");
      script.src =
        "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.onload = () => {
        if (!window.turnstile) {
          say("Security check unavailable. Please try again later.", "error");
          return;
        }
        widget = window.turnstile.render("#security-check", {
          sitekey: config.siteKey,
          action: "contact",
          theme: "light",
          size: "flexible",
          callback: (value) => {
            token = value;
            button.disabled = submitting;
            say("Ready when you are.");
          },
          "expired-callback": () => {
            token = "";
            button.disabled = true;
            say("Please complete a new security check.");
          },
          "error-callback": () => {
            token = "";
            button.disabled = true;
            say("Security check unavailable. Please try again later.", "error");
          },
        });
      };
      script.onerror = () =>
        say("Security check unavailable. Please try again later.", "error");
      document.head.append(script);
      say("Please complete the security check.");
    } catch {
      say(
        "Contact is temporarily unavailable. You can also reach me on LinkedIn.",
        "error",
      );
    }
  };
  // Load third-party spam protection only when the visitor reaches the form.
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          start();
        }
      },
      { rootMargin: "150px" },
    );
    observer.observe(form);
  } else start();
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (submitting) return;
    if (!token) {
      say("Please complete the security check.", "error");
      return;
    }
    if (!form.reportValidity()) return;
    submitting = true;
    button.disabled = true;
    say("Sending your message…");
    const data = Object.fromEntries(new FormData(form));
    data.token = token;
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(25000),
      });
      const result = await response.json();
      if (!response.ok || result.accepted !== true)
        throw Error(
          result.error ||
            "Delivery could not be confirmed. Please try again later.",
        );
      form.reset();
      say(
        "Thank you. The email service accepted your message for delivery.",
        "success",
      );
    } catch (error) {
      say(
        error.name === "TimeoutError"
          ? "The connection timed out. Delivery is unconfirmed. Please try again later."
          : error.message ||
              "The message could not be confirmed. Please try again later.",
        "error",
      );
    } finally {
      submitting = false;
      resetSecurity();
    }
  });
})();
