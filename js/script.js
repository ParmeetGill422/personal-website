/* ============================================================
   PARMEET GILL — Personal Website
   Interactive particles BG · Custom cursor · Theme toggle · AOS
   ============================================================ */

/* ── THEME TOGGLE ─────────────────────────────────────────────── */
(function () {
  const html   = document.documentElement;
  const btn    = document.getElementById('themeToggle');
  const stored = localStorage.getItem('theme');

  if (stored) html.setAttribute('data-theme', stored);

  btn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    initParticles(); // re-init particles with correct colours
  });
})();

/* ── CUSTOM CURSOR ────────────────────────────────────────────── */
(function () {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');

  let mouseX = -100, mouseY = -100;
  let ringX  = -100, ringY  = -100;
  let rafID;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    rafID = requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover effect on interactive elements
  const hoverTargets = 'a, button, .stat-card, .project-card, .contact-card, .skill-group, .cert-item, .edu-card, .social-icon';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // Click shrink
  document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));
})();

/* ── NAVBAR SCROLL ────────────────────────────────────────────── */
(function () {
  const nav = document.getElementById('navbar');
  let lastY = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 60) {
      nav.style.boxShadow = 'var(--shadow)';
    } else {
      nav.style.boxShadow = 'none';
    }
    lastY = y;
  }, { passive: true });
})();

/* ── MOBILE MENU ──────────────────────────────────────────────── */
(function () {
  const btn    = document.getElementById('navHamburger');
  const menu   = document.getElementById('mobileMenu');
  const close  = document.getElementById('mobileClose');
  const links  = document.querySelectorAll('.mobile-link');

  const open  = () => menu.classList.add('open');
  const shut  = () => menu.classList.remove('open');

  btn.addEventListener('click', open);
  close.addEventListener('click', shut);
  links.forEach(l => l.addEventListener('click', shut));
})();

/* ── SCROLL-ANIMATE (AOS-like) ────────────────────────────────── */
(function () {
  const targets = document.querySelectorAll(
    '[data-aos], .timeline-item, .project-card, .skill-group, .edu-card, .cert-item'
  );

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(t => observer.observe(t));
})();

/* ── INTERACTIVE PARTICLE BACKGROUND ─────────────────────────── */
function initParticles() {
  const canvas = document.getElementById('bgCanvas');
  const ctx    = canvas.getContext('2d');

  // Colour scheme per theme
  function getColors() {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
      particle: dark ? 'rgba(201,168,76,' : 'rgba(139,105,20,',
      line:     dark ? 'rgba(201,168,76,' : 'rgba(139,105,20,',
    };
  }

  // Resize
  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); buildParticles(); }, { passive: true });

  // Mouse position
  const mouse = { x: -1000, y: -1000 };
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  window.addEventListener('mouseleave', () => { mouse.x = -1000; mouse.y = -1000; }, { passive: true });

  // Particle class
  class Particle {
    constructor() { this.reset(true); }

    reset(random) {
      this.x  = random ? Math.random() * canvas.width  : (Math.random() > 0.5 ? 0 : canvas.width);
      this.y  = random ? Math.random() * canvas.height : (Math.random() > 0.5 ? 0 : canvas.height);
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.r  = Math.random() * 2.2 + 0.8;
      this.alpha = Math.random() * 0.6 + 0.2;
    }

    update() {
      // Mouse repulsion
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const force = (120 - dist) / 120;
        this.vx += (dx / dist) * force * 0.5;
        this.vy += (dy / dist) * force * 0.5;
      }

      // Speed cap
      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (speed > 2.5) { this.vx = (this.vx / speed) * 2.5; this.vy = (this.vy / speed) * 2.5; }

      // Damping
      this.vx *= 0.992;
      this.vy *= 0.992;

      this.x += this.vx;
      this.y += this.vy;

      // Wrap around edges
      if (this.x < -10) this.x = canvas.width  + 10;
      if (this.x > canvas.width  + 10) this.x = -10;
      if (this.y < -10) this.y = canvas.height + 10;
      if (this.y > canvas.height + 10) this.y = -10;
    }

    draw(colors) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = colors.particle + this.alpha + ')';
      ctx.fill();
    }
  }

  let particles = [];
  const MAX_DIST = 130;

  function buildParticles() {
    const count = Math.floor((canvas.width * canvas.height) / 9000);
    particles = Array.from({ length: Math.min(count, 120) }, () => new Particle());
  }
  buildParticles();

  // Animation loop
  let animID;
  function animate() {
    animID = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const colors = getColors();

    // Draw lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX_DIST) {
          const alpha = (1 - d / MAX_DIST) * 0.35;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = colors.line + alpha + ')';
          ctx.lineWidth   = 0.7;
          ctx.stroke();
        }
      }
    }

    // Draw & update particles
    particles.forEach(p => { p.update(); p.draw(colors); });
  }

  if (window._particleAnimID) cancelAnimationFrame(window._particleAnimID);
  animate();
  window._particleAnimID = animID;
}

initParticles();

/* ── EMAIL DROPDOWN ──────────────────────────────────────────── */
(function () {
  const btn      = document.getElementById('emailBtn');
  const dropdown = document.getElementById('emailDropdown');
  if (!btn || !dropdown) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = dropdown.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(isOpen));
  });

  // Close when clicking outside
  document.addEventListener('click', () => {
    dropdown.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  });

  // Prevent closing when clicking inside the dropdown
  dropdown.addEventListener('click', (e) => e.stopPropagation());
})();

/* ── SMOOTH ACTIVE NAV LINK ──────────────────────────────────── */
(function () {
  const sections = document.querySelectorAll('main section[id]');
  const links    = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });

  sections.forEach(s => observer.observe(s));
})();


/* ── ACTIVE LINK STYLE ───────────────────────────────────────── */
const style = document.createElement('style');
style.textContent = `.nav-links a.active { color: var(--gold); }
.nav-links a.active::after { width: 100%; }`;
document.head.appendChild(style);

/* ── LAPTOP INTRO SCROLL ANIMATION ──────────────────────────── */
(function () {
  const wrapper  = document.getElementById('laptopIntroWrapper');
  const sticky   = wrapper ? wrapper.querySelector('.laptop-intro-sticky') : null;
  const lid      = document.getElementById('lcLid');
  const computer = document.getElementById('laptopComputer');
  const prompt   = document.getElementById('laptopScrollPrompt');
  const navbar   = document.getElementById('navbar');

  if (!wrapper || !lid) return;

  // Mark JS-controlled element so no CSS transitions fight scroll
  computer.classList.add('zoom-active');

  // Hide navbar on load (laptop scene is first)
  navbar.classList.add('laptop-hidden');

  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function easeInOut(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }

  function onScroll() {
    const wrapperH  = wrapper.offsetHeight;
    const viewH     = window.innerHeight;
    const maxScroll = wrapperH - viewH;
    const raw       = clamp(window.scrollY / maxScroll, 0, 1);

    // ── Phase 1: Lid opens (0 → 0.45) ────────────────────────
    const p1       = easeInOut(clamp(raw / 0.45, 0, 1));
    const lidAngle = lerp(90, 0, p1); // 90° closed (flat back) → 0° fully open (upright)
    lid.style.transform = `rotateX(${lidAngle}deg)`;

    // ── Phase 2: Zoom into screen (0.45 → 0.75) ──────────────
    const p2    = easeInOut(clamp((raw - 0.45) / 0.30, 0, 1));
    const isMobile = window.innerWidth < 768;
    const maxScale  = isMobile ? 3.5 : 6;
    const scale     = lerp(1, maxScale, p2);
    const shiftY    = lerp(0, -60, p2);
    computer.style.transform = `rotateX(25deg) scale(${scale}) translateY(${shiftY}px)`;

    // ── Phase 3: Fade out scene (0.75 → 1.0) ─────────────────
    const p3 = easeInOut(clamp((raw - 0.75) / 0.25, 0, 1));
    sticky.style.opacity = String(lerp(1, 0, p3));

    // Scroll prompt fades once lid starts moving
    if (raw > 0.05) {
      prompt.classList.add('hidden');
    } else {
      prompt.classList.remove('hidden');
    }

    // Navbar: show only after scene is nearly done
    if (raw >= 0.95) {
      navbar.classList.remove('laptop-hidden');
    } else {
      navbar.classList.add('laptop-hidden');
    }

    // Release GPU layers once scene is fully complete
    if (raw >= 1) {
      lid.style.willChange      = 'auto';
      computer.style.willChange = 'auto';
    } else {
      lid.style.willChange      = 'transform';
      computer.style.willChange = 'transform';
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll(); // initialise on load
})();
