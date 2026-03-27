// Mobile menu toggle
const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');

menuBtn.addEventListener('click', () => {
    nav.classList.toggle('open');
    menuBtn.querySelector('i').classList.toggle('fa-bars');
    menuBtn.querySelector('i').classList.toggle('fa-times');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !menuBtn.contains(e.target)) {
        nav.classList.remove('open');
        menuBtn.querySelector('i').classList.add('fa-bars');
        menuBtn.querySelector('i').classList.remove('fa-times');
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);

        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            // Close mobile menu after navigation
            nav.classList.remove('open');
            menuBtn.querySelector('i').classList.add('fa-bars');
            menuBtn.querySelector('i').classList.remove('fa-times');
        }
    });
});

// Navbar active link highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section, [id]');
    const navLinks = document.querySelectorAll('nav a');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id') || '';
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Profile image hover animation
const profileImage = document.querySelector('.profile-image');
if (profileImage) {
    profileImage.addEventListener('mouseenter', () => {
        profileImage.style.transform = 'scale(1.05) rotate(2deg)';
    });

    profileImage.addEventListener('mouseleave', () => {
        profileImage.style.transform = 'scale(1) rotate(0deg)';
    });
}

// Project cards hover effects
document.querySelectorAll('.project-card').forEach(card => {
    const image = card.querySelector('.project-image');
    const overlay = card.querySelector('.project-overlay');

    card.addEventListener('mouseenter', () => {
        image.style.transform = 'scale(1.05)';
        overlay.style.opacity = '1';
        overlay.style.transform = 'translateY(0)';
    });

    card.addEventListener('mouseleave', () => {
        image.style.transform = 'scale(1)';
        overlay.style.opacity = '0';
        overlay.style.transform = 'translateY(-10px)';
    });
});

// Certificate cards hover effects
document.querySelectorAll('.certificate-card').forEach(card => {
    const badge = card.querySelector('.certificate-badge');

    card.addEventListener('mouseenter', () => {
        badge.style.transform = 'rotateY(360deg) scale(1.1)';
    });

    card.addEventListener('mouseleave', () => {
        badge.style.transform = 'rotateY(0deg) scale(1)';
    });
});

// Tech stack hover animations
document.querySelectorAll('.tech-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateY(-4px) scale(1.02)';
    });

    item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateY(0) scale(1)';
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe cards for animation
document.querySelectorAll('.enhanced-card, .project-card, .certificate-card').forEach(el => {
    observer.observe(el);
});

// Status dot pulse animation control
const statusDot = document.querySelector('.status-dot');
if (statusDot) {
    statusDot.style.animationPlayState = 'running';
}

// Copy email to clipboard
document.querySelector('.contact-email a')?.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = 'maureenrubin21@gmail.com';

    try {
        await navigator.clipboard.writeText(email);
        const link = e.target;
        const originalText = link.textContent;
        link.textContent = 'Copied!';
        link.style.color = '#4ade80';

        setTimeout(() => {
            link.textContent = originalText;
            link.style.color = '';
        }, 2000);
    } catch (err) {
        console.error('Failed to copy email:', err);
    }
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.profile-hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    // Add staggered animation to cards
    const cards = document.querySelectorAll('.enhanced-card, .project-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
});

// Back to top button (optional enhancement)
function createBackToTop() {
    const btn = document.createElement('button');
    btn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    background: var(--accent);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    font-size: 18px;
    box-shadow: 0 4px 12px rgba(200, 28, 222, 0.4);
  `;

    document.body.appendChild(btn);

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            btn.style.opacity = '1';
            btn.style.visibility = 'visible';
        } else {
            btn.style.opacity = '0';
            btn.style.visibility = 'hidden';
        }
    });
}

createBackToTop();

// Performance: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

window.addEventListener('scroll', throttle(() => {
    // Scroll-based animations here
}, 16));