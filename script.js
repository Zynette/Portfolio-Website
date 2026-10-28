// Progressive enhancements only. All evidence, project stories and contact links are static HTML.
(() => {
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];

  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  const menu = $("#navigation");
  const toggle = $(".menu-toggle");
  if (menu && toggle) {
    const header = $(".site-header");
    header.classList.add("enhanced");
    toggle.hidden = false;
    const closeMenu = (restore = false) => {
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
      closeMenu();
      // On-page destinations receive focus after the mobile menu collapses.
      if (link.hash && link.pathname === location.pathname) {
        const target = document.getElementById(link.hash.slice(1));
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
        closeMenu(true);
    });
    const mobile = matchMedia("(max-width: 640px)");
    mobile.addEventListener("change", () => closeMenu());
  }

  const controls = $(".work-controls");
  const input = $("#work-search");
  const items = $$(".work-item");
  if (controls && input && items.length) {
    let category = "all";
    controls.hidden = false;
    const filter = () => {
      const term = input.value.trim().toLocaleLowerCase();
      let count = 0;
      for (const item of items) {
        const match =
          (category === "all" || item.dataset.category === category) &&
          (item.dataset.search + " " + item.textContent)
            .toLocaleLowerCase()
            .includes(term);
        item.hidden = !match;
        if (match) count++;
      }
      $("#result-count").textContent =
        `${count} ${count === 1 ? "project" : "projects"} shown.`;
      $(".empty-state").hidden = count !== 0;
      const pair = $(".work-pair");
      pair.hidden = [...pair.querySelectorAll(".work-item")].every(
        (item) => item.hidden,
      );
    };
    controls.addEventListener("click", (event) => {
      const button = event.target.closest("[data-filter]");
      if (!button) return;
      category = button.dataset.filter;
      $$("[data-filter]").forEach((item) =>
        item.setAttribute("aria-pressed", String(item === button)),
      );
      filter();
    });
    input.addEventListener("input", filter);
    $("#reset-work").addEventListener("click", () => {
      input.value = "";
      category = "all";
      $$("[data-filter]").forEach((item) =>
        item.setAttribute(
          "aria-pressed",
          String(item.dataset.filter === "all"),
        ),
      );
      filter();
      input.focus();
    });
    filter();
  }

  const steps = [
    [
      "UNDERSTAND",
      "Get the whole picture.",
      "What were you trying to do? What changed? I clarify the symptom and its impact before deciding where to look.",
    ],
    [
      "ISOLATE",
      "Test the right assumption.",
      "Signing in and having permission are different checks. I separate identity, access and application behaviour, then investigate one layer at a time.",
    ],
    [
      "RESOLVE",
      "Make the next step clear.",
      "I use an approved change or pass clear evidence to the right team. Then I ask the person to confirm they can complete the original task.",
    ],
    [
      "DOCUMENT",
      "Leave a clearer path.",
      "I record the symptom, checks and resolution in reusable language. The next person should have a better starting point.",
    ],
  ];
  const traceControls = $(".trace-controls");
  const panel = $("#trace-panel");
  if (traceControls && panel) {
    traceControls.hidden = false;
    $(".process-fallback").hidden = true;
    traceControls.addEventListener("click", (event) => {
      const button = event.target.closest("[data-step]");
      if (!button) return;
      const index = Number(button.dataset.step);
      const [label, title, description] = steps[index];
      $$("[data-step]").forEach((item) =>
        item.setAttribute("aria-pressed", String(item === button)),
      );
      $(".trace-map").dataset.stage = String(index);
      panel.querySelector(".eyebrow").textContent = `0${index + 1} / ${label}`;
      panel.querySelector("h3").textContent = title;
      panel.querySelector("p").textContent = description;
    });
  }

  const copy = $(".copy-email");
  if (copy) {
    copy.hidden = false;
    copy.addEventListener("click", async () => {
      try {
        if (!navigator.clipboard?.writeText)
          throw new Error("Clipboard unavailable");
        await navigator.clipboard.writeText("antonettepetallo73@gmail.com");
        $("#copy-status").textContent = "Email copied.";
      } catch {
        $("#copy-status").textContent =
          "Select the address above to copy it, or open it in your email app.";
      }
    });
  }
  const print = $(".print-resume");
  if (print) {
    print.hidden = false;
    print.addEventListener("click", () => window.print());
  }
})();
