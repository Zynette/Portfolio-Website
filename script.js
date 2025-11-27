// --------------------------------------------------
// My Aurora JS brain: themes, sparkles, helpers galore
// --------------------------------------------------
(function () {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const bodyEl = document.body;
  const modeToggle = $('#modeToggle');
  const navToggle = $('#navToggle');
  const navMenu = $('#navMenu');
  const assistantBubble = $('#assistantBubble');
  const heartSticker = document.querySelector('.sticker.heart');

  let updateSkyMode = () => {};
  let refreshSkyPalette = () => {};
  let currentMode = bodyEl?.classList.contains('mode-light') ? 'light' : 'dark';

  const syncToggleState = (mode) => {
    if (!modeToggle) return;
    const isLight = mode === 'light';
    modeToggle.setAttribute('aria-pressed', String(isLight));
    modeToggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
  };

  const runToggleFx = (mode) => {
    if (!modeToggle) return;
    const cls = mode === 'light' ? 'mode-toggle--glow' : 'mode-toggle--twinkle';
    modeToggle.classList.remove('mode-toggle--glow', 'mode-toggle--twinkle');
    requestAnimationFrame(() => {
      modeToggle.classList.add(cls);
      setTimeout(() => modeToggle.classList.remove(cls), mode === 'light' ? 900 : 700);
    });
  };

  const setMode = (mode, opts = {}) => {
    if (!bodyEl) return;
    const normalized = mode === 'light' ? 'light' : 'dark';
    currentMode = normalized;
    bodyEl.classList.remove('mode-light', 'mode-dark');
    bodyEl.classList.add(`mode-${normalized}`);
    localStorage.setItem('ap-mode', normalized);
    syncToggleState(normalized);
    refreshSkyPalette();
    updateSkyMode(normalized);
    if (opts.animate) runToggleFx(normalized);
  };

  const storedMode = localStorage.getItem('ap-mode');
  setMode(storedMode || currentMode);

  modeToggle?.addEventListener('click', () => {
    const next = currentMode === 'light' ? 'dark' : 'light';
    setMode(next, { animate: true });
  });

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const edgeBounds = { top: 12, bottom: 12, left: 12, right: 12 };

  const positionToggle = (x, y) => {
    if (!modeToggle) return;
    modeToggle.style.top = `${y}px`;
    modeToggle.style.left = `${x}px`;
  };

  const snapToggleToEdge = (clientX, clientY) => {
    if (!modeToggle) return;
    const rect = modeToggle.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const distances = [
      { edge: 'left', value: clientX - edgeBounds.left },
      { edge: 'right', value: vw - (clientX + width) - edgeBounds.right },
      { edge: 'top', value: clientY - edgeBounds.top },
      { edge: 'bottom', value: vh - (clientY + height) - edgeBounds.bottom },
    ];

    distances.sort((a, b) => a.value - b.value);
    const nearest = distances[0]?.edge || 'left';

    let top = clamp(clientY, edgeBounds.top, vh - height - edgeBounds.bottom);
    let left = clamp(clientX, edgeBounds.left, vw - width - edgeBounds.right);

    if (nearest === 'left') left = edgeBounds.left;
    if (nearest === 'right') left = vw - width - edgeBounds.right;
    if (nearest === 'top') top = edgeBounds.top;
    if (nearest === 'bottom') top = vh - height - edgeBounds.bottom;

    positionToggle(left, top);
  };

  let isDraggingToggle = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;

  const startToggleDrag = (e) => {
    if (!modeToggle) return;
    isDraggingToggle = true;
    const rect = modeToggle.getBoundingClientRect();
    dragOffsetX = (e.touches?.[0]?.clientX || e.clientX) - rect.left;
    dragOffsetY = (e.touches?.[0]?.clientY || e.clientY) - rect.top;
    modeToggle.classList.add('mode-toggle--dragging');
  };

  const duringToggleDrag = (e) => {
    if (!isDraggingToggle || !modeToggle) return;
    e.preventDefault();
    const clientX = (e.touches?.[0]?.clientX || e.clientX) - dragOffsetX;
    const clientY = (e.touches?.[0]?.clientY || e.clientY) - dragOffsetY;
    const rect = modeToggle.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const left = clamp(clientX, edgeBounds.left, window.innerWidth - width - edgeBounds.right);
    const top = clamp(clientY, edgeBounds.top, window.innerHeight - height - edgeBounds.bottom);
    positionToggle(left, top);
  };

  const endToggleDrag = (e) => {
    if (!isDraggingToggle) return;
    isDraggingToggle = false;
    modeToggle?.classList.remove('mode-toggle--dragging');
    const clientX = (e.changedTouches?.[0]?.clientX || e.clientX) - dragOffsetX;
    const clientY = (e.changedTouches?.[0]?.clientY || e.clientY) - dragOffsetY;
    snapToggleToEdge(clientX, clientY);
  };

  modeToggle?.addEventListener('mousedown', startToggleDrag);
  modeToggle?.addEventListener('touchstart', startToggleDrag, { passive: false });
  window.addEventListener('mousemove', duringToggleDrag);
  window.addEventListener('touchmove', duringToggleDrag, { passive: false });
  window.addEventListener('mouseup', endToggleDrag);
  window.addEventListener('touchend', endToggleDrag);

  const scrollHideTargets = [
    { el: modeToggle, mq: '(max-width: 768px)' },
    { el: assistantBubble, mq: '(max-width: 768px)' },
    { el: heartSticker, mq: '(max-width: 768px)' },
  ];
  const scrollHideTimers = new WeakMap();

  const handleScrollHide = () => {
    scrollHideTargets.forEach(({ el, mq }) => {
      if (!el) return;
      if (!window.matchMedia(mq).matches) return;
      el.classList.add('is-hidden');
      const existing = scrollHideTimers.get(el);
      if (existing) clearTimeout(existing);
      const timer = setTimeout(() => el.classList.remove('is-hidden'), 650);
      scrollHideTimers.set(el, timer);
    });
  };

  const releaseScrollHidden = () => {
    scrollHideTargets.forEach(({ el, mq }) => {
      if (!el) return;
      if (window.matchMedia(mq).matches) return;
      el.classList.remove('is-hidden');
      const existing = scrollHideTimers.get(el);
      if (existing) clearTimeout(existing);
    });
  };

  window.addEventListener('scroll', handleScrollHide, { passive: true });
  window.addEventListener('resize', releaseScrollHidden);
  releaseScrollHidden();

  const setNavState = (isOpen) => {
    if (!navMenu || !navToggle) return;
    navMenu.classList.toggle('open', isOpen);
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  };
  navToggle?.addEventListener('click', () => {
    const isOpen = !navMenu.classList.contains('open');
    setNavState(isOpen);
  });
  navMenu?.addEventListener('click', (e) => {
    if (window.matchMedia('(max-width: 900px)').matches && e.target.closest('a')) {
      setNavState(false);
    }
  });
  window.addEventListener('resize', () => {
    if (!window.matchMedia('(max-width: 900px)').matches) {
      setNavState(false);
    }
  });

  // Typewriter intro so my name gently types itself out
  const typeEl = $('#typewriter');
  if (typeEl) {
    const full = typeEl.textContent.trim();
    typeEl.textContent = '';
    let i = 0;
    const tick = () => {
      if (i <= full.length) {
        typeEl.textContent = full.slice(0, i++);
        setTimeout(tick, 55);
      }
    };
    setTimeout(tick, 350);
  }

  // Hero gradient listens for pointer movement for a dreamy glow
  const hero = document.querySelector('.hero');
  hero?.addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    hero.style.setProperty('--mx', `${x}%`);
    hero.style.setProperty('--my', `${y}%`);
  });

    // Scroll reveal: IntersectionObserver makes cards float in once
  let revealObserver;

  const setupRevealObserver = () => {
    if (revealObserver) return;
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-in');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    $$('.reveal').forEach((el) => revealObserver.observe(el));
  };

  // Theme palette chips + localStorage memory
  const applyTheme = (name) => {
    document.body.classList.remove(
      'theme-aurora',
      'theme-sakura',
      'theme-isla'
    );
    document.body.classList.add(name);
    localStorage.setItem('ap-theme', name);
    refreshSkyPalette();
    updateSkyMode(currentMode);
  };
  const stored = localStorage.getItem('ap-theme');
  if (stored) applyTheme(stored);
  $$('.palette .chip').forEach(btn => btn.addEventListener('click', () => applyTheme(btn.dataset.theme)));

  // Footer year stays current
  const year = $('#year'); if (year) year.textContent = new Date().getFullYear();

  // Quick action dock (mainly the back-to-top button)
  $('#toTop')?.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));

  // Sparkle cursor layer because why not
  const sparkles = $('#sparkles');
  const makeSparkle = (x, y) => {
    const s = document.createElement('span');
    s.className = 'sp';
    s.style.left = x + 'px';
    s.style.top = y + 'px';
    sparkles.appendChild(s);
    setTimeout(() => s.remove(), 600);
  };
  window.addEventListener('pointerdown', (e) => makeSparkle(e.clientX, e.clientY));

  // Canvas sky engine: stars in dark mode, dreamy clouds in light mode
  const sky = $('#sky');
  if (sky && sky.getContext) {
    const ctx = sky.getContext('2d');
    let frame;
    let mode = currentMode;
    let palette = {};
    const stars = [];
    const clouds = [];
    const dots = [];
    const shootingStars = [];
    const SUN = { angle: 0 };
    const STAR_COUNT = 70;
    const CLOUD_COUNT = 12;
    const DOT_COUNT = 32;
    let shootingCooldown = 0;

    const readVar = (styles, name, fallback) => styles.getPropertyValue(name).trim() || fallback;
    const readPalette = () => {
      const styles = getComputedStyle(document.body);
      palette = {
        accent: readVar(styles, '--accent', '#ffffff'),
        glow2: readVar(styles, '--p2', '#ffffff'),
        glow3: readVar(styles, '--p3', '#ffffff'),
        cloudTop: readVar(styles, '--cloud-top', 'rgba(255,255,255,0.75)'),
        cloudMid: readVar(styles, '--cloud-mid', 'rgba(227,241,255,0.4)'),
        cloudBottom: readVar(styles, '--cloud-bottom', 'rgba(197,219,255,0.2)'),
      };
    };
    readPalette();

    const rand = (min, max) => Math.random() * (max - min) + min;

    const initStars = () => {
      stars.length = 0;
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * sky.width,
          y: Math.random() * sky.height,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          r: Math.random() * 1.2 + 0.6,
        });
      }
    };

    const initClouds = () => {
      clouds.length = 0;
      dots.length = 0;
      for (let i = 0; i < CLOUD_COUNT; i++) {
        clouds.push({
          x: Math.random() * (sky.width + 200) - 100,
          y: rand(30, sky.height * 0.65),
          radius: rand(80, 180),
          stretch: rand(0.6, 1.1),
          speed: rand(0.04, 0.12),
        });
      }
      for (let i = 0; i < DOT_COUNT; i++) {
        dots.push({
          x: Math.random() * sky.width,
          y: Math.random() * sky.height,
          vy: rand(0.04, 0.09),
          size: rand(0.8, 2),
        });
      }
    };

    const spawnShootingStar = () => {
      shootingCooldown = rand(280, 520);
      const startX = rand(-sky.width * 0.2, sky.width * 0.4);
      const startY = rand(0, sky.height * 0.4);
      const speed = rand(8, 13);
      const angle = rand(Math.PI * 0.1, Math.PI * 0.35);
      shootingStars.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: rand(55, 90),
        maxLife: 0,
        swell: rand(0.7, 1.1),
      });
      shootingStars[shootingStars.length - 1].maxLife = shootingStars[shootingStars.length - 1].life;
    };

    const updateShootingStars = () => {
      shootingCooldown -= 1;
      if (shootingCooldown <= 0 && shootingStars.length < 2) {
        spawnShootingStar();
      }
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        s.x += s.vx;
        s.y += s.vy;
        s.life -= 1;
        if (
          s.life <= 0 ||
          s.x > sky.width + 200 ||
          s.y > sky.height + 200
        ) {
          shootingStars.splice(i, 1);
        }
      }
    };

    const drawShootingStars = () => {
      shootingStars.forEach((s) => {
        const opacity = Math.max(s.life / s.maxLife, 0);
        const tailX = s.x - s.vx * 4;
        const tailY = s.y - s.vy * 4;
        const gradient = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
        gradient.addColorStop(0, `${palette.cloudTop || 'rgba(255,255,255,0.9)'}`);
        gradient.addColorStop(1, `${palette.glow2 || 'rgba(255,255,255,0.15)'}`);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2.5 * opacity * s.swell;
        ctx.lineCap = 'round';
        ctx.shadowBlur = 8;
        ctx.shadowColor = palette.glow3 || 'rgba(255,255,255,0.5)';
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        ctx.fillStyle = `rgba(255,255,255,${0.8 * opacity})`;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2.2 * s.swell, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    };

    const drawStars = () => {
      ctx.clearRect(0, 0, sky.width, sky.height);
      ctx.fillStyle = 'rgba(255,255,255,.75)';
      stars.forEach((s) => {
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0 || s.x > sky.width) s.vx *= -1;
        if (s.y < 0 || s.y > sky.height) s.vy *= -1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });
      updateShootingStars();
      drawShootingStars();
      frame = requestAnimationFrame(drawStars);
    };

    const drawSun = () => {
      const sunX = sky.width - 120;
      const sunY = 90;
      const grad = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 90);
      grad.addColorStop(0, 'rgba(255,255,255,0.95)');
      grad.addColorStop(0.4, palette.glow2 || 'rgba(255,227,196,0.65)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 38, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.25)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 6; i++) {
        const angle = ((Math.PI * 2) / 6) * i + SUN.angle;
        ctx.beginPath();
        ctx.moveTo(sunX + Math.cos(angle) * 32, sunY + Math.sin(angle) * 32);
        ctx.lineTo(sunX + Math.cos(angle) * 64, sunY + Math.sin(angle) * 64);
        ctx.stroke();
      }
      SUN.angle += 0.002;
    };

    const drawClouds = () => {
      ctx.clearRect(0, 0, sky.width, sky.height);
      clouds.forEach((cloud) => {
        cloud.x += cloud.speed;
        if (cloud.x - cloud.radius > sky.width) cloud.x = -cloud.radius;
        const radiusX = cloud.radius * 1.2;
        const radiusY = cloud.radius * cloud.stretch;
        const gradient = ctx.createRadialGradient(
          cloud.x,
          cloud.y,
          radiusX * 0.12,
          cloud.x,
          cloud.y,
          radiusX
        );
        gradient.addColorStop(0, palette.cloudTop);
        gradient.addColorStop(0.5, palette.cloudMid);
        gradient.addColorStop(1, palette.cloudBottom);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(cloud.x, cloud.y, radiusX, radiusY, 0, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.fillStyle = `${palette.accent}33`;
      dots.forEach((dot) => {
        dot.y += dot.vy;
        if (dot.y > sky.height + 10) dot.y = -10;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        ctx.fill();
      });
      drawSun();
      updateShootingStars();
      drawShootingStars();
      frame = requestAnimationFrame(drawClouds);
    };

    const restart = () => {
      cancelAnimationFrame(frame);
      sky.width = window.innerWidth;
      sky.height = window.innerHeight;
      shootingStars.length = 0;
      shootingCooldown = rand(120, 260);
      if (mode === 'light') {
        initClouds();
        frame = requestAnimationFrame(drawClouds);
      } else {
        initStars();
        frame = requestAnimationFrame(drawStars);
      }
    };

    restart();
    window.addEventListener('resize', restart);

    refreshSkyPalette = () => {
      readPalette();
    };
    updateSkyMode = (nextMode) => {
      const normalized = nextMode === 'light' ? 'light' : 'dark';
      if (normalized === mode) return;
      mode = normalized;
      restart();
    };
  }
    // Project rendering engine (grid + case stories + filters)
  const grid = $('#projectGrid');
  const stories = $('#projectStories');
  const allProjects = Array.isArray(window.projects) ? window.projects : [];
  const isRealLink = (url) => typeof url === 'string' && url.trim() && url.trim() !== '#';

  // Cache the DOM controls I keep poking
  const viewGridBtn = $('#viewGrid');
  const viewStoriesBtn = $('#viewStories');
  const searchInput = $('#projectSearch');
  const filterWrap = $('#projectFilters');

  // Modal bits for case study view
  const modalBackdrop = $('#caseModal');
  const modalClose = $('#caseClose');
  const caseTitle = $('#caseTitle');
  const caseMeta = $('#caseMeta');
  const caseChallenge = $('#caseChallenge');
  const caseApproach = $('#caseApproach');
  const caseOutcome = $('#caseOutcome');
  const caseLinks = $('#caseLinks');

  const projectState = {
    view: 'grid',
    term: '',
    category: 'all',
  };

  const applyFilters = () => {
    const term = projectState.term.toLowerCase();
    return allProjects.filter((p) => {
      const matchesCategory =
        projectState.category === 'all' ||
        p.category === projectState.category;

      if (!term) return matchesCategory;

      const haystack = [
        p.title,
        p.category,
        p.desc,
        ...(p.tools || []),
      ]
        .join(' ')
        .toLowerCase();

      return matchesCategory && haystack.includes(term);
    });
  };

  const openCaseStudy = (id) => {
    const proj = allProjects.find((p) => p.id === id);
    if (!proj || !modalBackdrop) return;

    caseTitle.textContent = proj.title;
    caseMeta.textContent = `${proj.category} • ${(proj.tools || []).join(' • ')}`;

    caseChallenge.textContent = proj.challenge || proj.desc || '';
    caseApproach.textContent =
      proj.approach ||
      'I approached this the same way I handle support: clarify the problem, design a small test, and iterate with feedback.';
    caseOutcome.textContent =
      proj.outcome ||
      'A clearer, more maintainable solution and a better story to tell in interviews.';

    const hasGit = isRealLink(proj.links?.github);
    const hasLive = isRealLink(proj.links?.live);
    caseLinks.innerHTML = `
      ${
        hasGit
          ? `<a class="btn outline" href="${proj.links.github}" target="_blank" rel="noopener">GitHub</a>`
          : ''
      }
      ${
        hasLive
          ? `<a class="btn outline" href="${proj.links.live}" target="_blank" rel="noopener">Live demo</a>`
          : ''
      }
      ${
        !hasGit && !hasLive
          ? `<span class="muted small-text">Status: ongoing / planned to incorporate on GitHub.</span>`
          : ''
      }
    `;

    modalBackdrop.classList.remove('hidden');
    modalBackdrop.setAttribute('aria-hidden', 'false');
  };

  const closeCaseStudy = () => {
    if (!modalBackdrop) return;
    modalBackdrop.classList.add('hidden');
    modalBackdrop.setAttribute('aria-hidden', 'true');
  };

  const renderGrid = () => {
    const data = applyFilters();
    grid.innerHTML = data
      .map((p) => {
        const hasGit = isRealLink(p.links?.github);
        const hasLive = isRealLink(p.links?.live);
        const awaiting = !hasGit && !hasLive;
        return `
        <article class="card glass project reveal" data-id="${p.id}">
          <h4 class="project-title" data-id="${p.id}">${p.title}</h4>
          <p class="muted">${p.category}</p>
          <p>${p.desc}</p>
          ${
            awaiting
              ? '<p class="project-status muted">Status: ongoing / planned to incorporate on GitHub.</p>'
              : ''
          }
          <div class="tools">
            ${(p.tools || [])
              .map((t) => `<span class="tool">${t}</span>`)
              .join('')}
          </div>
          <div class="links">
            ${
              hasGit
                ? `<a class="btn outline" href="${p.links.github}" target="_blank" rel="noopener">GitHub</a>`
                : ''
            }
            ${
              hasLive
                ? `<a class="btn outline" href="${p.links.live}" target="_blank" rel="noopener">Live</a>`
                : ''
            }
            <button class="btn small outline case-btn" type="button" data-id="${p.id}">
              Case study
            </button>
          </div>
        </article>
      `;
      })
      .join('');

    // Re-attach the reveal observer whenever I re-render cards
    if (revealObserver) {
      $$('.reveal', grid).forEach((el) => revealObserver.observe(el));
    }
  };

  const renderStories = () => {
    const data = applyFilters();
    stories.innerHTML = data
      .slice(0, 6)
      .map((p) => {
        const hasGit = isRealLink(p.links?.github);
        const hasLive = isRealLink(p.links?.live);
        const awaiting = !hasGit && !hasLive;
        return `
        <article class="story glass reveal" data-id="${p.id}">
          <h4 class="project-title" data-id="${p.id}">${p.title}</h4>
          <p class="muted">${p.category} • ${(p.tools || []).join(' • ')}</p>
          ${
            awaiting
              ? '<p class="project-status muted">Status: ongoing / planned to incorporate on GitHub.</p>'
              : ''
          }
          <p><strong>Challenge:</strong> ${
            p.challenge || p.desc || 'Clarifying the real user problem.'
          }</p>
          <p><strong>My approach:</strong> ${
            p.approach ||
            'Scoped the work to something small, testable, and easy to explain to non-technical stakeholders.'
          }</p>
          <p><strong>Outcome:</strong> ${
            p.outcome ||
            'A clearer path from problem → fix → documentation that others can reuse.'
          }</p>
          <div class="links">
            ${
              hasGit
                ? `<a class="btn outline" href="${p.links.github}" target="_blank">GitHub</a>`
                : ''
            }
            ${
              hasLive
                ? `<a class="btn outline" href="${p.links.live}" target="_blank">Live</a>`
                : ''
            }
            <button class="btn small outline case-btn" type="button" data-id="${p.id}">
              Full case study
            </button>
          </div>
        </article>
      `;
      })
      .join('');

    if (revealObserver) {
      $$('.reveal', stories).forEach((el) => revealObserver.observe(el));
    }
  };

  const setView = (mode) => {
    projectState.view = mode;
    if (mode === 'grid') {
      grid.classList.remove('hidden');
      stories.classList.add('hidden');
      viewGridBtn?.classList.add('on');
      viewStoriesBtn?.classList.remove('on');
      renderGrid();
    } else {
      grid.classList.add('hidden');
      stories.classList.remove('hidden');
      viewGridBtn?.classList.remove('on');
      viewStoriesBtn?.classList.add('on');
      renderStories();
    }
  };

  // Wiring up view toggles, search, and filters
  viewGridBtn?.addEventListener('click', () => setView('grid'));
  viewStoriesBtn?.addEventListener('click', () => setView('stories'));

  searchInput?.addEventListener('input', (e) => {
    projectState.term = e.target.value || '';
    projectState.view === 'grid' ? renderGrid() : renderStories();
  });

  filterWrap?.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-filter]');
    if (!btn) return;
    const value = btn.dataset.filter;
    projectState.category = value || 'all';

    // Flip the active filter chip styling
    $$('.filter-chips .chip').forEach((chip) =>
      chip.classList.toggle('on', chip === btn)
    );

    projectState.view === 'grid' ? renderGrid() : renderStories();
  });

  // Delegate clicks so both cards + titles open case studies
  const handleProjectClick = (e) => {
    const trigger = e.target.closest('.project-title, .case-btn');
    if (!trigger) return;
    const id = trigger.dataset.id;
    if (!id) return;
    openCaseStudy(id);
  };

  grid?.addEventListener('click', handleProjectClick);
  stories?.addEventListener('click', handleProjectClick);

  modalClose?.addEventListener('click', closeCaseStudy);
  modalBackdrop?.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeCaseStudy();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCaseStudy();
  });

  // Initial render (grid first, stories ready in the background)
  renderGrid();
  renderStories();
  setView('grid');

  // Contact form demo — no backend yet, just friendly feedback
  const form = $('#contactForm'), msg = $('#formMsg'), send = $('#sendBtn');
  const FORM_ENDPOINT = 'https://formsubmit.co/ajax/antonettepetallo73@gmail.com';
  send?.addEventListener('click', async () => {
    if (!form) return;
    const name = $('#name')?.value.trim();
    const email = $('#email')?.value.trim();
    const message = $('#message')?.value.trim();

    if (!name || !email || !message) {
      msg.textContent = 'Please fill in all fields.';
      return;
    }

    send.disabled = true;
    send.textContent = 'Sending…';
    msg.textContent = 'Sending your note…';

    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          message,
          _subject: 'New portfolio inquiry',
          _captcha: 'false',
        }),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      msg.textContent = 'Thanks! Your message is on its way to my inbox.';
      form.reset();
    } catch (error) {
      console.error(error);
      msg.textContent = 'Something went wrong. Please try again or email me directly.';
    } finally {
      send.disabled = false;
      send.textContent = 'Send';
      setTimeout(() => (msg.textContent = ''), 5000);
    }
  });

    // Support Tools: password strength helper copy
  const pwInput = $('#pwInput');
  const pwFeedback = $('#pwFeedback');

  if (pwInput && pwFeedback) {
    const evaluatePassword = (value) => {
      if (!value) return 'Waiting for you to type…';

      let score = 0;
      if (value.length >= 8) score++;
      if (value.length >= 12) score++;
      if (/[A-Z]/.test(value)) score++;
      if (/[0-9]/.test(value)) score++;
      if (/[^A-Za-z0-9]/.test(value)) score++;

      if (score <= 2)
        return 'This would feel weak in a real environment — try longer phrases and more variety.';
      if (score === 3)
        return 'Decent, but I’d still suggest a longer passphrase or an extra symbol.';
      if (score === 4)
        return 'Pretty strong! Just make sure it’s unique and not reused.';
      return 'Very strong pattern — as long as it’s unique and stored safely, I’d feel good about this.';
    };

    pwInput.addEventListener('input', (e) => {
      pwFeedback.textContent = evaluatePassword(e.target.value);
    });
  }

  // Support Tools: quick OS detector for callers who aren’t sure
  const osInfo = $('#osInfo');
  if (osInfo) {
    const ua = window.navigator.userAgent || '';
    let label = 'another OS';
    if (/Windows/i.test(ua)) label = 'Windows';
    else if (/Macintosh|Mac OS X/i.test(ua)) label = 'macOS';
    else if (/Linux/i.test(ua)) label = 'Linux';
    else if (/Android/i.test(ua)) label = 'Android';
    else if (/iPhone|iPad/i.test(ua)) label = 'iOS / iPadOS';

    osInfo.textContent = `You’re likely using ${label}.`;
  }

  // Support Tools: mock ping test with human-friendly wording
  const pingBtn = $('#pingBtn');
  const pingStatus = $('#pingStatus');

  if (pingBtn && pingStatus) {
    const pingMessages = [
      {
        label: 'Excellent',
        text: '✨ Super snappy. If something feels slow, it’s probably the app — not the network.',
      },
      {
        label: 'Good',
        text: '✅ Overall healthy. A quick refresh or sign-out/sign-in usually fixes minor issues.',
      },
      {
        label: 'Okay',
        text: '⚠️ A bit of delay. I’d check Wi-Fi strength or ask if others are seeing the same slowness.',
      },
      {
        label: 'Slow',
        text: '🐢 Noticeably slow. I’d validate with a real ping/traceroute and check with the network team.',
      },
    ];

    pingBtn.addEventListener('click', () => {
      pingStatus.textContent = 'Running a quick mock ping…';
      setTimeout(() => {
        const msg =
          pingMessages[Math.floor(Math.random() * pingMessages.length)];
        pingStatus.textContent = `${msg.label}: ${msg.text}`;
      }, 650);
    });
  }

    // Assistant bubble helps folks pick a project
  const assistantPanel = $('#assistantPanel');
  const assistantRandom = $('#assistantRandom');

  const toggleAssistantPanel = () => {
    if (!assistantPanel) return;
    const isHidden = assistantPanel.classList.contains('hidden');
    assistantPanel.classList.toggle('hidden', !isHidden);
    assistantPanel.setAttribute('aria-hidden', String(!isHidden));
  };

  assistantBubble?.addEventListener('click', toggleAssistantPanel);

  assistantPanel?.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-assist]');
    if (!btn) return;

    const category = btn.dataset.assist;
    if (!category) return;

    // Sync assistant picks with the main project filters
    projectState.category = category;
    projectState.term = '';
    if (searchInput) searchInput.value = '';

    // Keep the chips visually in sync with that choice
    if (filterWrap) {
      $$('#projectFilters .chip').forEach((chip) => {
        chip.classList.toggle('on', chip.dataset.filter === category);
      });
    }

    setView('grid');
    document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
  });

  assistantRandom?.addEventListener('click', () => {
    const current = applyFilters();
    const pool = current.length ? current : allProjects;
    if (!pool.length) return;

    const chosen = pool[Math.floor(Math.random() * pool.length)];
    setView('grid');

    // Let the grid render, then scroll + highlight the chosen card
    requestAnimationFrame(() => {
      const card = grid?.querySelector(`[data-id="${chosen.id}"]`);
      if (!card) return;
      card.classList.add('project-highlight');
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => card.classList.remove('project-highlight'), 2000);
    });

    document
      .querySelector('#projects')
      ?.scrollIntoView({ behavior: 'smooth' });
  });

  // Keyboard shortcut (1–3) for instant theme swaps
  window.addEventListener('keydown', (e)=>{
    if (e.key==='1') applyTheme('theme-aurora');
    if (e.key==='2') applyTheme('theme-sakura');
    if (e.key==='3') applyTheme('theme-isla');
  });

  // Kick off the reveal observer once everything is mounted
  setupRevealObserver();

})();
