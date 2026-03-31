// ── Custom Cursor ──
document.addEventListener("DOMContentLoaded", () => {
  const cursor = document.getElementById("cursor");
  if (!cursor) return;

  document.addEventListener("mousemove", (e) => {
    cursor.style.top = e.clientY + "px";
    cursor.style.left = e.clientX + "px";
  });

  document.querySelectorAll("a, button").forEach(el => {
    el.addEventListener("mouseenter", () => cursor.classList.add("active"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("active"));
  });
});

(function grain() {
  const c = document.getElementById('grain');
  if (!c) return;
  const ctx = c.getContext('2d');
  let w, h;

  function resize() {
    w = c.width  = window.innerWidth;
    h = c.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function draw() {
    const img = ctx.createImageData(w, h);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const v = (Math.random() * 255) | 0;
      d[i] = d[i+1] = d[i+2] = v;
      d[i+3] = 18;
    }
    ctx.putImageData(img, 0, 0);
    requestAnimationFrame(draw);
  }
  draw();
})();


const navbar = document.getElementById('navbar');
const btt     = document.getElementById('btt');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 60);
  btt.classList.toggle('show', y > 500);
}, { passive: true });


const burger     = document.getElementById('burger');
const mobOverlay = document.getElementById('mobOverlay');
let open = false;

function toggleMenu(force) {
  open = force !== undefined ? force : !open;
  mobOverlay.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
  const [s1, s2] = burger.querySelectorAll('span');
  if (open) {
    s1.style.transform = 'rotate(45deg) translate(5px, 5px)';
    s2.style.transform = 'rotate(-45deg) translate(4px, -4px)';
  } else {
    s1.style.transform = s2.style.transform = '';
  }
}

burger.addEventListener('click', () => toggleMenu());
mobOverlay.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ── Scroll reveal ──────────────────────────
const ro = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    // small stagger among siblings
    const parent = entry.target.parentElement;
    const siblings = [...parent.querySelectorAll('.reveal')];
    const idx = siblings.indexOf(entry.target);
    setTimeout(() => entry.target.classList.add('in'), idx * 70);
    ro.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

const skillsEl = document.querySelector('.skills');
if (skillsEl) {
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      skillsEl.querySelectorAll('.sk-fill').forEach(b => b.classList.add('go'));
    }
  }, { threshold: 0.4 }).observe(skillsEl);
}

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
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) runCounters();
  }, { threshold: 0.5 }).observe(statsEl);
}

const navAs = document.querySelectorAll('.nav-links a');
new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navAs.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { rootMargin: '-38% 0px -55% 0px' })
.observe(...(Array.from(document.querySelectorAll('section[id]'))));

document.querySelectorAll('section[id]').forEach(s => {
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting)
      navAs.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + s.id));
  }, { rootMargin: '-38% 0px -55% 0px' }).observe(s);
});

const emailCopy = document.getElementById('emailCopy');
const emailText = document.getElementById('emailText');
if (emailCopy) {
  emailCopy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('maureenrubin21@gmail.com');
      emailText.textContent = '✓ Copied!';
      emailCopy.style.borderColor = 'var(--green)';
      setTimeout(() => {
        emailText.textContent = 'maureenrubin21@gmail.com';
        emailCopy.style.borderColor = '';
      }, 2000);
    } catch {
      window.location.href = 'mailto:maureenrubin21@gmail.com';
    }
  });
}

document.querySelectorAll('.work-row').forEach(row => {
  row.addEventListener('mousemove', e => {
    const icon = row.querySelector('.wr-icon');
    if (!icon) return;
    const r = row.getBoundingClientRect();
    const cx = ((e.clientX - r.left) / r.width - 0.5) * 8;
    icon.style.transform = `scale(1.1) rotate(${cx}deg)`;
  });
  row.addEventListener('mouseleave', () => {
    const icon = row.querySelector('.wr-icon');
    if (icon) icon.style.transform = '';
  });
});

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  const name = document.querySelector('.name-rubin');
  if (name) name.style.textShadow = `0 0 ${60 + y * 0.05}px rgba(232,255,71,${0.3 - y * 0.0003})`;
}, { passive: true });

window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  // Kick hero reveals manually (they're above fold)
  document.querySelectorAll('.hero .reveal').forEach((el, i) => {
    setTimeout(() => el.classList.add('in'), 150 + i * 100);
  });
});