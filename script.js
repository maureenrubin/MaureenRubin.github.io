/* ══════════════════════════════════════════════
   MAUREEN RUBIN — Portfolio  ·  script.js
══════════════════════════════════════════════ */

/* ── Navbar: scroll + dark-section detection ── */
const navbar       = document.getElementById('navbar');
const btt          = document.getElementById('btt');
const DARK_IDS     = ['projects', 'stack', 'contact'];

function updateNav() {
  const y = window.scrollY;

  navbar.classList.toggle('scrolled', y > 60);
  btt.classList.toggle('show', y > 500);

  // Switch to dark style when a dark section fills the top area
  let isDark = false;
  DARK_IDS.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.top <= 80 && r.bottom >= 80) isDark = true;
  });
  navbar.classList.toggle('dark-nav', isDark);
}

window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

/* ── Burger / Mobile menu ── */
const burger     = document.getElementById('burger');
const mobOverlay = document.getElementById('mobOverlay');
let menuOpen = false;

function toggleMenu(force) {
  menuOpen = (force !== undefined) ? force : !menuOpen;
  mobOverlay.classList.toggle('open', menuOpen);
  document.body.style.overflow = menuOpen ? 'hidden' : '';

  const [s1, s2] = burger.querySelectorAll('span');
  if (menuOpen) {
    s1.style.transform = 'rotate(45deg) translate(5px, 5px)';
    s2.style.transform = 'rotate(-45deg) translate(4px, -4px)';
  } else {
    s1.style.transform = '';
    s2.style.transform = '';
  }
}

burger.addEventListener('click', () => toggleMenu());
mobOverlay.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => toggleMenu(false))
);

/* ── Smooth scroll for anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

btt.addEventListener('click', () =>
  window.scrollTo({ top: 0, behavior: 'smooth' })
);

/* ── Scroll reveal ── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const parent = entry.target.parentElement;
    const siblings = [...parent.querySelectorAll('.reveal, .reveal-left')];
    const idx = siblings.indexOf(entry.target);

    setTimeout(() => entry.target.classList.add('in'), idx * 65);
    revealObs.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-left').forEach(el => revealObs.observe(el));

/* ── Skills bars ── */
const skillsSection = document.querySelector('.skills');
if (skillsSection) {
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      skillsSection.querySelectorAll('.sk-fill').forEach(bar => bar.classList.add('go'));
    }
  }, { threshold: 0.4 }).observe(skillsSection);
}

/* ── Stat counters ── */
function runCounters() {
  document.querySelectorAll('.snum[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 30));

    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current >= target) clearInterval(timer);
    }, 40);
  });
}

const statRow = document.querySelector('.stat-row');
if (statRow) {
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) runCounters();
  }, { threshold: 0.5 }).observe(statRow);
}

/* ── Active nav links on section enter ── */
document.querySelectorAll('section[id]').forEach(sec => {
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.nav-links a').forEach(a =>
        a.classList.toggle('active', a.getAttribute('href') === '#' + sec.id)
      );
    }
  }, { rootMargin: '-38% 0px -55% 0px' }).observe(sec);
});

/* ── Work row icon tilt on hover ── */
document.querySelectorAll('.work-row').forEach(row => {
  row.addEventListener('mousemove', e => {
    const icon = row.querySelector('.wr-icon');
    if (!icon) return;
    const rect = row.getBoundingClientRect();
    const cx   = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    icon.style.transform = `scale(1.1) rotate(${cx}deg)`;
  });
  row.addEventListener('mouseleave', () => {
    const icon = row.querySelector('.wr-icon');
    if (icon) icon.style.transform = '';
  });
});

/* ── Email copy ── */
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

/* ── Kick hero reveals above the fold ── */
window.addEventListener('load', () => {
  const heroItems = document.querySelectorAll('.hero .reveal, .hero .reveal-left');
  heroItems.forEach((el, i) => {
    setTimeout(() => el.classList.add('in'), 180 + i * 110);
  });
});