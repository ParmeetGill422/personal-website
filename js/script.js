/* ============================================================
   PARMEET GILL — Personal Website (Redesign v2 + Cinematic)
   Skills: frontend-design · ui-ux-pro-max · animated-website
   ============================================================ */

'use strict';

/* ── 1. THEME TOGGLE ──────────────────────────────────────────── */
(function () {
  const html   = document.documentElement;
  const btn    = document.getElementById('themeToggle');
  const stored = localStorage.getItem('theme');

  if (stored) html.setAttribute('data-theme', stored);

  btn && btn.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    initParticles();
  });
})();

/* ── 2. CINEMATIC TERMINAL INTRO ──────────────────────────────── */
(function () {
  const intro      = document.getElementById('cinematic-intro');
  const linesEl    = document.getElementById('terminalLines');
  const cursorEl   = document.getElementById('terminalCursor');
  const enterBtn   = document.getElementById('introEnterBtn');
  const skipBtn    = document.getElementById('introSkip');
  if (!intro) return;

  // Prevent body scroll during intro
  document.body.style.overflow = 'hidden';

  // Terminal lines definition
  const LINES = [
    { text: '> INITIALIZING SECURE CONNECTION...',      cls: 'dim',   charDelay: 25, pauseAfter: 180 },
    { text: '> IDENTITY: PARMEET_GILL',                 cls: 'gold',  charDelay: 28, pauseAfter: 120 },
    { text: '> ROLE: IT_SUPPORT / CYBERSECURITY_OPS',   cls: '',      charDelay: 20, pauseAfter: 160 },
    { text: '> CLEARANCE: ',                            cls: '',      charDelay: 25, pauseAfter: 0,   progress: true },
    { text: '> STATUS: ACCESS GRANTED',                 cls: 'green', charDelay: 30, pauseAfter: 400 },
  ];

  // Helper: type a string into an element char by char
  function typeInto(el, text, delay) {
    return new Promise(resolve => {
      let i = 0;
      function next() {
        if (i < text.length) {
          el.textContent += text[i++];
          setTimeout(next, delay + (Math.random() * 12 - 6));
        } else {
          resolve();
        }
      }
      next();
    });
  }

  // Helper: animate a progress bar inline
  function typeProgress(lineEl) {
    return new Promise(resolve => {
      const bar = lineEl.querySelector('.t-progress-fill');
      const pct = lineEl.querySelector('.t-pct');
      if (!bar || !pct) { resolve(); return; }

      const BLOCKS = 20;
      const CHAR   = '█';
      let   filled = 0;

      const iv = setInterval(() => {
        filled++;
        bar.textContent = CHAR.repeat(filled) + '░'.repeat(BLOCKS - filled);
        pct.textContent = Math.round((filled / BLOCKS) * 100) + '%';
        if (filled >= BLOCKS) {
          clearInterval(iv);
          setTimeout(resolve, 120);
        }
      }, 55);
    });
  }

  // Main sequence
  async function runSequence() {
    await new Promise(r => setTimeout(r, 250));

    for (const line of LINES) {
      const div = document.createElement('div');
      div.className = 't-line' + (line.cls ? ' ' + line.cls : '');
      linesEl.appendChild(div);

      if (line.progress) {
        // Special progress-bar line
        div.textContent = line.text;
        const barSpan = document.createElement('span');
        barSpan.className = 't-progress-fill';
        barSpan.textContent = '░'.repeat(20);
        div.appendChild(barSpan);
        div.appendChild(document.createTextNode(' '));
        const pctSpan = document.createElement('span');
        pctSpan.className = 't-pct';
        pctSpan.textContent = '0%';
        div.appendChild(pctSpan);
        await typeProgress(div);
      } else {
        await typeInto(div, line.text, line.charDelay);
      }

      // Move cursor below last line
      linesEl.appendChild(cursorEl);
      if (line.pauseAfter > 0) await new Promise(r => setTimeout(r, line.pauseAfter));
    }

    // Brief pause then reveal name
    await new Promise(r => setTimeout(r, 350));
    revealName();
  }

  function revealName() {
    // Trigger full-screen glitch on the whole intro overlay
    intro.classList.add('screen-glitch');
    setTimeout(() => {
      intro.classList.remove('screen-glitch');
      // Show the ENTER SITE button after glitch settles
      setTimeout(() => enterBtn.classList.add('show'), 120);
    }, 780);
  }

  function exitIntro() {
    // Blur dissolves + overlay fades out
    intro.classList.add('exit');
    setTimeout(() => {
      intro.style.display = 'none';
      document.body.style.overflow = '';
      // Unlock all page animations
      document.body.classList.add('site-ready');
      // Start hero tagline typewriter slightly after chars begin
      setTimeout(startHeroTypewriter, 600);
    }, 900);
  }

  enterBtn && enterBtn.addEventListener('click', exitIntro);
  skipBtn  && skipBtn.addEventListener('click', exitIntro);
  document.addEventListener('keydown', function onKey(e) {
    if (intro.style.display === 'none') return;
    document.removeEventListener('keydown', onKey);
    exitIntro();
  });

  runSequence();
})();

/* ── 3. HERO LETTER-SPLIT ANIMATION ──────────────────────────── */
(function () {
  const el = document.querySelector('.hero-name[data-split]');
  if (!el) return;

  const children  = Array.from(el.childNodes);
  let   charIndex = 0;
  el.innerHTML    = '';

  children.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      let i = 0;
      while (i < text.length) {
        if (text[i] === ' ') {
          el.appendChild(document.createTextNode('\u00A0'));
          i++;
        } else {
          let word = '';
          while (i < text.length && text[i] !== ' ') word += text[i++];

          const wordSpan = document.createElement('span');
          wordSpan.className = 'word';

          word.split('').forEach(ch => {
            const s = document.createElement('span');
            s.className = 'char';
            s.textContent = ch;
            s.style.animationDelay = (0.2 + charIndex * 0.042) + 's';
            charIndex++;
            wordSpan.appendChild(s);
          });

          el.appendChild(wordSpan);
        }
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const clone = document.createElement(node.tagName.toLowerCase());
      if (node.className) clone.className = node.className;

      const wordSpan = document.createElement('span');
      wordSpan.className = 'word';

      node.textContent.split('').forEach(ch => {
        const s = document.createElement('span');
        s.className = 'char';
        s.textContent = ch;
        s.style.animationDelay = (0.3 + charIndex * 0.045) + 's';
        charIndex++;
        wordSpan.appendChild(s);
      });

      clone.appendChild(wordSpan);
      el.appendChild(clone);
    }
  });
})();

/* ── 4. HERO TAGLINE TYPEWRITER ───────────────────────────────── */
function startHeroTypewriter() {
  const el = document.querySelector('.hero-tagline');
  if (!el) return;

  const fullText = el.textContent.trim();
  el.textContent = '';

  const cursor = document.createElement('span');
  cursor.className = 'hero-tagline-cursor';
  el.appendChild(cursor);

  let i = 0;
  function type() {
    if (i < fullText.length) {
      el.insertBefore(document.createTextNode(fullText[i++]), cursor);
      setTimeout(type, 28 + Math.random() * 14);
    } else {
      // Remove cursor after typing finishes
      setTimeout(() => cursor.remove(), 1800);
    }
  }

  setTimeout(type, 400);
}

/* ── 5. CUSTOM CURSOR + TRAIL ─────────────────────────────────── */
(function () {
  const dot       = document.getElementById('cursorDot');
  const ring      = document.getElementById('cursorRing');
  const trailWrap = document.getElementById('cursorTrail');
  if (!dot || !ring) return;

  let mouseX = -100, mouseY = -100;
  let ringX  = -100, ringY  = -100;
  let lastTrailX = -100, lastTrailY = -100;
  let trailThrottle = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';

    // Trail dots
    const now = Date.now();
    if (now - trailThrottle > 55 && trailWrap) {
      const dx = mouseX - lastTrailX;
      const dy = mouseY - lastTrailY;
      if (Math.sqrt(dx*dx + dy*dy) > 8) {
        const t = document.createElement('div');
        t.className = 'trail-dot';
        t.style.left = mouseX + 'px';
        t.style.top  = mouseY + 'px';
        t.style.width  = (3 + Math.random() * 3) + 'px';
        t.style.height = t.style.width;
        t.style.opacity = 0.35;
        trailWrap.appendChild(t);
        setTimeout(() => t.remove(), 600);
        lastTrailX = mouseX;
        lastTrailY = mouseY;
        trailThrottle = now;
      }
    }
  });

  (function animateRing() {
    ringX += (mouseX - ringX) * 0.1;
    ringY += (mouseY - ringY) * 0.1;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  })();

  const hoverSel = 'a, button, .stat-card, .project-card, .skill-group, .cert-item, .edu-card, .social-icon, .ch-dot, .pill';
  document.querySelectorAll(hoverSel).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));
})();

/* ── 6. SCROLL PROGRESS BAR ───────────────────────────────────── */
(function () {
  const bar = document.getElementById('scroll-progress-bar');
  if (!bar) return;

  function update() {
    const total   = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (total > 0 ? (window.scrollY / total) * 100 : 0) + '%';
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ── 7. SMART NAVBAR ──────────────────────────────────────────── */
(function () {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  let lastY = 0, ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        nav.style.boxShadow = y > 60 ? 'var(--shadow)' : 'none';
        if (y > 120) {
          nav.classList.toggle('nav-hidden', y > lastY);
        } else {
          nav.classList.remove('nav-hidden');
        }
        lastY = y;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

/* ── 8. MOBILE MENU ───────────────────────────────────────────── */
(function () {
  const btn   = document.getElementById('navHamburger');
  const menu  = document.getElementById('mobileMenu');
  const close = document.getElementById('mobileClose');
  const links = document.querySelectorAll('.mobile-link');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => menu.classList.add('open'));
  close && close.addEventListener('click', () => menu.classList.remove('open'));
  links.forEach(l => l.addEventListener('click', () => menu.classList.remove('open')));
})();

/* ── 9. SCROLL-ANIMATE + STAGGER DELAYS ──────────────────────── */
(function () {
  // Section title glitch-reveal
  const titleObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); titleObs.unobserve(e.target); } });
  }, { threshold: 0.2 });
  document.querySelectorAll('.reveal-title').forEach(el => titleObs.observe(el));

  // AOS + stagger
  const staggerMap = {
    '.timeline-item': 120,
    '.project-card':  110,
    '.skill-group':    80,
    '.edu-card':      100,
    '.cert-item':      60,
  };

  const allTargets = new Set();

  Object.entries(staggerMap).forEach(([selector, ms]) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      const siblings = Array.from(el.parentElement?.querySelectorAll(selector) || [el]);
      const idx = siblings.indexOf(el);
      if (ms > 0 && idx > 0) el.style.transitionDelay = (ms * idx) + 'ms';
      allTargets.add(el);
    });
  });

  // Add data-aos elements
  document.querySelectorAll('[data-aos]').forEach(el => allTargets.add(el));

  const aosObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); aosObs.unobserve(e.target); } });
  }, { threshold: 0.1 });

  allTargets.forEach(el => aosObs.observe(el));
})();

/* ── 10. STAT COUNTER ANIMATION ───────────────────────────────── */
(function () {
  const cards = document.querySelectorAll('.stat-card[data-count]');
  if (!cards.length) return;

  function animateCard(card) {
    const target = parseInt(card.dataset.count, 10);
    const suffix = card.dataset.suffix || '';
    const numEl  = card.querySelector('.stat-num');
    if (!numEl) return;

    const duration = 1500;
    const start    = performance.now();

    function step(now) {
      const t     = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      numEl.textContent = Math.round(eased * target) + suffix;
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { animateCard(e.target); obs.unobserve(e.target); } });
  }, { threshold: 0.4 });

  cards.forEach(c => obs.observe(c));
})();

/* ── 11. HERO PARALLAX ────────────────────────────────────────── */
(function () {
  const hero = document.getElementById('heroContent');
  if (!hero) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        hero.style.transform = `translateY(${window.scrollY * 0.18}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

/* ── 12. 3D TILT CARDS ────────────────────────────────────────── */
(function () {
  function addTilt(selector, maxTilt) {
    document.querySelectorAll(selector).forEach(card => {
      // Add shine element
      const shine = document.createElement('div');
      shine.className = 'tilt-shine';
      card.appendChild(shine);

      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x    = (e.clientX - rect.left) / rect.width  - 0.5;  // -0.5 to 0.5
        const y    = (e.clientY - rect.top)  / rect.height - 0.5;

        card.style.transition = 'transform 0.08s ease';
        card.style.transform  = `perspective(900px) rotateY(${x * maxTilt}deg) rotateX(${-y * maxTilt * 0.8}deg) translateZ(8px)`;

        // Move shine to match mouse
        const shinePctX = ((e.clientX - rect.left) / rect.width)  * 100;
        const shinePctY = ((e.clientY - rect.top)  / rect.height) * 100;
        shine.style.background = `radial-gradient(circle at ${shinePctX}% ${shinePctY}%, rgba(255,255,255,0.09) 0%, transparent 65%)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.55s cubic-bezier(0.16,1,0.3,1)';
        card.style.transform  = 'perspective(900px) rotateY(0deg) rotateX(0deg) translateZ(0)';
        setTimeout(() => { card.style.transition = ''; }, 550);
      });
    });
  }

  addTilt('.project-card',  14);
  addTilt('.timeline-card',  8);
  addTilt('.stat-card',     10);
})();

/* ── 13. MAGNETIC SOCIAL ICONS ────────────────────────────────── */
(function () {
  document.querySelectorAll('.social-icon').forEach(icon => {
    icon.addEventListener('mousemove', e => {
      const rect   = icon.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) * 0.35;
      const dy     = (e.clientY - cy) * 0.35;
      icon.style.transform = `translate(${dx}px, ${dy}px) scale(1.12)`;
    });

    icon.addEventListener('mouseleave', () => {
      icon.style.transform = '';
    });
  });
})();

/* ── 14. CHAPTER NAV DOTS ─────────────────────────────────────── */
(function () {
  const dots     = document.querySelectorAll('.ch-dot');
  const sections = document.querySelectorAll('#hero, main section[id]');
  if (!dots.length || !sections.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        dots.forEach(d => d.classList.toggle('active', d.getAttribute('href') === '#' + e.target.id));
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });

  sections.forEach(s => obs.observe(s));
})();

/* ── 15. ACTIVE NAV LINK ──────────────────────────────────────── */
(function () {
  const sections = document.querySelectorAll('main section[id]');
  const links    = document.querySelectorAll('.nav-links a');
  if (!sections.length || !links.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const a = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
        if (a) a.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });

  sections.forEach(s => obs.observe(s));
})();

/* ── 16. EMAIL DROPDOWN ───────────────────────────────────────── */
(function () {
  const btn  = document.getElementById('emailBtn');
  const drop = document.getElementById('emailDropdown');
  if (!btn || !drop) return;

  btn.addEventListener('click', e => {
    e.stopPropagation();
    const open = drop.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
  });

  document.addEventListener('click', () => {
    drop.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  });

  drop.addEventListener('click', e => e.stopPropagation());
})();

/* ── 17. INTERACTIVE PARTICLE BACKGROUND ─────────────────────── */
function initParticles() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function getColors() {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
      particle: dark ? 'rgba(201,168,76,' : 'rgba(139,105,20,',
      cyber:    dark ? 'rgba(0,212,255,'  : 'rgba(0,150,180,',
      line:     dark ? 'rgba(201,168,76,' : 'rgba(139,105,20,',
    };
  }

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); buildParticles(); }, { passive: true });

  const mouse = { x: -1000, y: -1000 };
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });

  class Particle {
    constructor() { this.reset(true); }
    reset(rand) {
      this.x       = rand ? Math.random() * canvas.width  : (Math.random() > 0.5 ? 0 : canvas.width);
      this.y       = rand ? Math.random() * canvas.height : (Math.random() > 0.5 ? 0 : canvas.height);
      this.vx      = (Math.random() - 0.5) * 0.45;
      this.vy      = (Math.random() - 0.5) * 0.45;
      this.r       = Math.random() * 1.8 + 0.5;
      this.alpha   = Math.random() * 0.5 + 0.15;
      this.isCyber = Math.random() < 0.12;
    }
    update() {
      const dx = this.x - mouse.x, dy = this.y - mouse.y;
      const d  = Math.sqrt(dx*dx + dy*dy);
      if (d < 110) {
        const f = (110 - d) / 110;
        this.vx += (dx/d) * f * 0.4;
        this.vy += (dy/d) * f * 0.4;
      }
      const spd = Math.sqrt(this.vx*this.vx + this.vy*this.vy);
      if (spd > 2.2) { this.vx = (this.vx/spd)*2.2; this.vy = (this.vy/spd)*2.2; }
      this.vx *= 0.993; this.vy *= 0.993;
      this.x  += this.vx; this.y += this.vy;
      if (this.x < -10) this.x = canvas.width + 10;
      if (this.x > canvas.width + 10) this.x = -10;
      if (this.y < -10) this.y = canvas.height + 10;
      if (this.y > canvas.height + 10) this.y = -10;
    }
    draw(c) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = (this.isCyber ? c.cyber : c.particle) + this.alpha + ')';
      ctx.fill();
    }
  }

  let particles = [];
  const MAX_DIST = 125;

  function buildParticles() {
    const count = Math.floor((canvas.width * canvas.height) / 10000);
    particles = Array.from({ length: Math.min(count, 110) }, () => new Particle());
  }
  buildParticles();

  if (window._pAnim) cancelAnimationFrame(window._pAnim);

  function animate() {
    window._pAnim = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const c = getColors();

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < MAX_DIST) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = c.line + ((1 - d/MAX_DIST) * 0.3) + ')';
          ctx.lineWidth   = 0.6;
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => { p.update(); p.draw(c); });
  }
  animate();
}

initParticles();
