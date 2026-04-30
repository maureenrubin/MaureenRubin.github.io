/* ═══════════════════════════════════════
   main.js — Maureen Rubin Portfolio
   BULLETPROOF REVEAL FOR GITHUB PAGES:
   - .js-loaded added to body first so CSS
     only hides elements when JS is running
   - Without JS: everything is always visible
   - Hard 800ms fallback shows all remaining
     hidden elements — no black sections ever
═══════════════════════════════════════ */

/* ── Step 1: Signal CSS that JS is active ── */
document.body.classList.add('js-loaded');

/* ── Scroll / Navbar ── */
const navbar = document.getElementById('navbar');
const btt    = document.getElementById('btt');
const DARK_SECTIONS = ['projects', 'stack', 'contact'];

function updateNav() {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 60);
  btt.classList.toggle('show', y > 500);

  let isDark = false;
  DARK_SECTIONS.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.top <= 80 && r.bottom >= 80) isDark = true;
  });
  navbar.classList.toggle('dark-nav', isDark);
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

/* ── Burger ── */
const burger     = document.getElementById('burger');
const mobOverlay = document.getElementById('mobOverlay');
let menuOpen = false;

function toggleMenu(force) {
  menuOpen = force !== undefined ? force : !menuOpen;
  mobOverlay.classList.toggle('open', menuOpen);
  document.body.style.overflow = menuOpen ? 'hidden' : '';
  const [s1, s2] = burger.querySelectorAll('span');
  if (menuOpen) {
    s1.style.transform = 'rotate(45deg) translate(5px,5px)';
    s2.style.transform = 'rotate(-45deg) translate(4px,-4px)';
  } else {
    s1.style.transform = s2.style.transform = '';
  }
}
burger.addEventListener('click', () => toggleMenu());
mobOverlay.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => toggleMenu(false))
);

/* ── Smooth scroll ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ══════════════════════════════════════════
   REVEAL SYSTEM — GITHUB PAGES SAFE
══════════════════════════════════════════ */

function showEl(el, delay) {
  if (!delay || delay <= 0) {
    el.classList.add('in');
  } else {
    setTimeout(() => el.classList.add('in'), delay);
  }
}

function isInViewport(el) {
  const r = el.getBoundingClientRect();
  return r.top < window.innerHeight && r.bottom > 0;
}

const allRevealEls     = Array.from(document.querySelectorAll('.reveal, .reveal-left'));
const heroRevealEls    = allRevealEls.filter(el => el.closest('#hero'));
const nonHeroRevealEls = allRevealEls.filter(el => !el.closest('#hero'));

// Immediately reveal anything already on screen
nonHeroRevealEls.forEach((el, i) => {
  if (isInViewport(el)) showEl(el, i * 50);
});

// Observer for the rest
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const parent   = entry.target.parentElement;
    const siblings = Array.from(parent.querySelectorAll('.reveal, .reveal-left'));
    const idx      = Math.max(0, siblings.indexOf(entry.target));
    showEl(entry.target, Math.min(idx * 70, 280));
    revealObserver.unobserve(entry.target);
  });
}, {
  threshold: 0.05,
  rootMargin: '0px 0px -20px 0px'
});

nonHeroRevealEls.forEach(el => {
  if (!el.classList.contains('in')) revealObserver.observe(el);
});

/* ── HARD FALLBACK (800ms) ─────────────────
   Force show everything not yet revealed.
   This is the final safety net against
   black sections on GitHub Pages.
─────────────────────────────────────────── */
setTimeout(() => {
  allRevealEls.forEach(el => {
    if (!el.classList.contains('in')) el.classList.add('in');
  });
}, 800);

/* ── Hero entrance on load ── */
window.addEventListener('load', () => {
  heroRevealEls.forEach((el, i) => {
    setTimeout(() => el.classList.add('in'), 180 + i * 110);
  });
  nonHeroRevealEls.forEach(el => {
    if (!el.classList.contains('in') && isInViewport(el)) {
      el.classList.add('in');
    }
  });
});

/* ══════════════════════════════════════════
   SKILLS BAR ANIMATION
══════════════════════════════════════════ */
const skillsEl = document.querySelector('.skills');
if (skillsEl) {
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) {
      skillsEl.querySelectorAll('.sk-fill').forEach(b => b.classList.add('go'));
    }
  }, { threshold: 0.3 }).observe(skillsEl);
}

/* ══════════════════════════════════════════
   COUNTER ANIMATION
══════════════════════════════════════════ */
function runCounters() {
  document.querySelectorAll('.snum[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    let cur = 0;
    const step = Math.max(1, Math.ceil(target / 30));
    const timer = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = cur;
      if (cur >= target) clearInterval(timer);
    }, 40);
  });
}

const statsEl = document.querySelector('.stat-row');
if (statsEl) {
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) runCounters();
  }, { threshold: 0.4 }).observe(statsEl);
}

/* ══════════════════════════════════════════
   ACTIVE NAV LINKS
══════════════════════════════════════════ */
document.querySelectorAll('section[id]').forEach(s => {
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) {
      document.querySelectorAll('.nav-links a').forEach(a =>
        a.classList.toggle('active', a.getAttribute('href') === '#' + s.id)
      );
    }
  }, { rootMargin: '-38% 0px -55% 0px' }).observe(s);
});

/* ══════════════════════════════════════════
   EMAIL COPY
══════════════════════════════════════════ */
const emailCopy = document.getElementById('emailCopy');
const emailText = document.getElementById('emailText');
if (emailCopy) {
  emailCopy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('maureenrubin21@gmail.com');
      emailText.textContent = '✓ Copied!';
      emailCopy.style.borderColor = '#4ade80';
      setTimeout(() => {
        emailText.textContent = 'maureenrubin21@gmail.com';
        emailCopy.style.borderColor = '';
      }, 2200);
    } catch {
      window.location.href = 'mailto:maureenrubin21@gmail.com';
    }
  });
}

/* ══════════════════════════════════════════
   WORK ROW TILT
══════════════════════════════════════════ */
document.querySelectorAll('.work-row').forEach(row => {
  row.addEventListener('mousemove', e => {
    const icon = row.querySelector('.wr-icon');
    if (!icon) return;
    const r  = row.getBoundingClientRect();
    const cx = ((e.clientX - r.left) / r.width - 0.5) * 10;
    icon.style.transform = `scale(1.1) rotate(${cx}deg)`;
  });
  row.addEventListener('mouseleave', () => {
    const icon = row.querySelector('.wr-icon');
    if (icon) icon.style.transform = '';
  });
});