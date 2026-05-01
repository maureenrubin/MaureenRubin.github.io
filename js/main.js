
/* ── Signal CSS that JS is active ── */
document.body.classList.add('js-loaded');

const html      = document.documentElement;
const themeBtn  = document.getElementById('themeBtn');
const themeIcon = document.getElementById('themeIcon');

function setTheme(t) {
  html.setAttribute('data-theme', t);
  localStorage.setItem('theme', t);
  themeIcon.className = t === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
}

const savedTheme = localStorage.getItem('theme') || 'dark';
setTheme(savedTheme);

themeBtn.addEventListener('click', () => {
  setTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

/* ═══════════════════════════════════════
   CURSOR GLOW (desktop)
═══════════════════════════════════════ */
const cursorGlow = document.getElementById('cursor-glow');
let cursorVisible = false;

document.addEventListener('mousemove', e => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top  = e.clientY + 'px';
  if (!cursorVisible) { cursorGlow.style.opacity = '1'; cursorVisible = true; }
});
document.addEventListener('mouseleave', () => {
  cursorGlow.style.opacity = '0';
  cursorVisible = false;
});

/* ═══════════════════════════════════════
   NAVBAR
═══════════════════════════════════════ */
const navbar = document.getElementById('navbar');
const btt    = document.getElementById('btt');

function updateNav() {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 60);
  btt.classList.toggle('show', y > 500);
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

/* ═══════════════════════════════════════
   BURGER / MOBILE MENU
═══════════════════════════════════════ */
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

/* ═══════════════════════════════════════
   SMOOTH SCROLL
═══════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ═══════════════════════════════════════
   TYPED EFFECT
═══════════════════════════════════════ */
const phrases = [
  'const dev = "Maureen Rubin";',
  'using CleanArchitecture;',
  'new DotNetDeveloper();',
  'git commit -m "Initial portfolio"',
  'Console.WriteLine("Hello, Hire Me!");',
];
let pIdx = 0, cIdx = 0, deleting = false;
const typedEl = document.getElementById('typedText');

function typeStep() {
  const phrase = phrases[pIdx];
  if (!deleting) {
    cIdx++;
    typedEl.textContent = phrase.slice(0, cIdx);
    if (cIdx === phrase.length) {
      deleting = true;
      setTimeout(typeStep, 1800);
      return;
    }
  } else {
    cIdx--;
    typedEl.textContent = phrase.slice(0, cIdx);
    if (cIdx === 0) {
      deleting = false;
      pIdx = (pIdx + 1) % phrases.length;
      setTimeout(typeStep, 400);
      return;
    }
  }
  setTimeout(typeStep, deleting ? 38 : 60);
}
setTimeout(typeStep, 900);

/* ═══════════════════════════════════════
   REVEAL SYSTEM — GITHUB PAGES SAFE
═══════════════════════════════════════ */
function showEl(el, delay) {
  if (!delay || delay <= 0) { el.classList.add('in'); }
  else { setTimeout(() => el.classList.add('in'), delay); }
}

function isInVP(el) {
  const r = el.getBoundingClientRect();
  return r.top < window.innerHeight && r.bottom > 0;
}

const allReveal     = Array.from(document.querySelectorAll('.reveal, .reveal-left'));
const heroReveal    = allReveal.filter(el => el.closest('#hero'));
const nonHeroReveal = allReveal.filter(el => !el.closest('#hero'));

// Immediately show anything already on screen
nonHeroReveal.forEach((el, i) => { if (isInVP(el)) showEl(el, i * 50); });

const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const parent   = entry.target.parentElement;
    const siblings = Array.from(parent.querySelectorAll('.reveal, .reveal-left'));
    const idx      = Math.max(0, siblings.indexOf(entry.target));
    showEl(entry.target, Math.min(idx * 70, 280));
    revealObs.unobserve(entry.target);
  });
}, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

nonHeroReveal.forEach(el => { if (!el.classList.contains('in')) revealObs.observe(el); });

// Hard fallback — no black sections ever
setTimeout(() => {
  allReveal.forEach(el => { if (!el.classList.contains('in')) el.classList.add('in'); });
}, 900);

// Hero entrance on load
window.addEventListener('load', () => {
  heroReveal.forEach((el, i) => {
    setTimeout(() => el.classList.add('in'), 200 + i * 110);
  });
  nonHeroReveal.forEach(el => {
    if (!el.classList.contains('in') && isInVP(el)) el.classList.add('in');
  });
});

/* ═══════════════════════════════════════
   SKILL BARS
═══════════════════════════════════════ */
const skillsEl = document.querySelector('.skills');
if (skillsEl) {
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) skillsEl.querySelectorAll('.sk-fill').forEach(b => b.classList.add('go'));
  }, { threshold: 0.3 }).observe(skillsEl);
}

/* ═══════════════════════════════════════
   COUNTER ANIMATION
═══════════════════════════════════════ */
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

/* ═══════════════════════════════════════
   ACTIVE NAV LINKS
═══════════════════════════════════════ */
document.querySelectorAll('section[id]').forEach(s => {
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) {
      document.querySelectorAll('.nav-links a').forEach(a =>
        a.classList.toggle('active', a.getAttribute('href') === '#' + s.id)
      );
    }
  }, { rootMargin: '-38% 0px -55% 0px' }).observe(s);
});

/* ═══════════════════════════════════════
   EMAIL COPY
═══════════════════════════════════════ */
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

/* ═══════════════════════════════════════
   WORK ROW HOVER TILT
═══════════════════════════════════════ */
document.querySelectorAll('.work-row').forEach(row => {
  row.addEventListener('mousemove', e => {
    const icon = row.querySelector('.wr-icon');
    if (!icon) return;
    const r  = row.getBoundingClientRect();
    const cx = ((e.clientX - r.left) / r.width - 0.5) * 14;
    icon.style.transform = `scale(1.1) rotate(${cx}deg)`;
  });
  row.addEventListener('mouseleave', () => {
    const icon = row.querySelector('.wr-icon');
    if (icon) icon.style.transform = '';
  });
});