/* ================================================
   BALNEOGID — app.js (shared)
   ================================================ */

(() => {
  'use strict';

  // ---- Header: transparent on hero, solid on scroll ----
  const header = document.querySelector('.header');
  if (header) {
    const hasHero = !!document.querySelector('.hero');

    const updateHeader = () => {
      if (!hasHero) {
        // Article pages — always solid
        header.classList.add('is-solid');
        return;
      }
      // Homepage — solid after 32px scroll
      header.classList.toggle('is-solid', window.scrollY > 32);
    };

    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader(); // run immediately on load
  }

  // ---- Scroll reveal (IntersectionObserver) ----
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -48px 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  // ---- Animated counters (hero stats) ----
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    const animateCount = (el) => {
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || (target >= 100 ? '+' : '');
      const duration = 1400;
      const start = performance.now();

      const tick = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.floor(easeOut(progress) * target);
        el.textContent = value + suffix;
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target + suffix;
      };
      requestAnimationFrame(tick);
    };

    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animateCount(e.target);
            cio.unobserve(e.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => cio.observe(el));
  }

  // ---- Hamburger / mobile nav ----
  const navToggle   = document.getElementById('navToggle');
  const mobileNav   = document.getElementById('mobileNav');
  const mobileOverlay = document.getElementById('mobileOverlay');

  if (navToggle && mobileNav) {
    const toggleMenu = (open) => {
      navToggle.classList.toggle('open', open);
      mobileNav.classList.toggle('open', open);
      mobileNav.setAttribute('aria-hidden', !open);
      navToggle.setAttribute('aria-expanded', open);
      if (mobileOverlay) mobileOverlay.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };

    navToggle.addEventListener('click', () => {
      toggleMenu(!navToggle.classList.contains('open'));
    });

    if (mobileOverlay) {
      mobileOverlay.addEventListener('click', () => toggleMenu(false));
    }

    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') toggleMenu(false);
    });
  }

  // ---- Hero particle drops ----
  const dropsContainer = document.getElementById('heroDrops');
  if (dropsContainer) {
    const count = 22;
    for (let i = 0; i < count; i++) {
      const d = document.createElement('span');
      d.className = 'hero-drop';
      const size = 3 + Math.random() * 7;
      Object.assign(d.style, {
        position:        'absolute',
        width:           size + 'px',
        height:          size + 'px',
        borderRadius:    '50%',
        background:      `rgba(255,255,255,${0.04 + Math.random() * 0.1})`,
        left:            Math.random() * 100 + '%',
        top:             Math.random() * 100 + '%',
        animation:       `drop-pulse ${4 + Math.random() * 6}s ease-in-out ${-Math.random() * 6}s infinite`,
      });
      dropsContainer.appendChild(d);
    }

    // inject keyframe if needed
    if (!document.getElementById('drop-pulse-style')) {
      const style = document.createElement('style');
      style.id = 'drop-pulse-style';
      style.textContent = `
        @keyframes drop-pulse {
          0%, 100% { transform: translateY(0) scale(1); opacity: .6; }
          50% { transform: translateY(-14px) scale(1.3); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }
  }

})();
