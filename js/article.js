/* ================================================
   BALNEOGID — article.js
   ================================================ */

(() => {
  'use strict';

  // ---- Reading progress bar ----
  const bar = document.getElementById('progress-bar');
  if (bar) {
    const updateBar = () => {
      const scrolled  = window.scrollY;
      const total     = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = Math.min((scrolled / total) * 100, 100) + '%';
    };
    window.addEventListener('scroll', updateBar, { passive: true });
    updateBar();
  }

  // ---- Active TOC section highlighting ----
  const tocLinks  = Array.from(document.querySelectorAll('.toc__list a'));
  const headings  = Array.from(document.querySelectorAll('.article__body h2[id], .article__body h3[id]'));

  if (tocLinks.length && headings.length) {
    const setActive = (id) => {
      tocLinks.forEach((a) => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + id);
      });
    };

    const hio = new IntersectionObserver(
      (entries) => {
        // find the topmost visible heading
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length) setActive(visible[0].target.id);
      },
      {
        rootMargin: `-${parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h') || '68')}px 0px -55% 0px`,
        threshold: 0,
      }
    );
    headings.forEach((h) => hio.observe(h));
  }

  // ---- Smooth scroll for TOC links ----
  tocLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href.startsWith('#')) return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (!target) return;
      const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h') || '68');
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ---- FAQ accordion icon rotate ----
  // Icon rotation is handled via CSS [open] selector in article.css
  // We just ensure the icon text toggles between + and −
  document.querySelectorAll('.faq-item').forEach((item) => {
    const icon = item.querySelector('.faq-icon');
    if (!icon) return;
    const toggle = () => { icon.textContent = item.open ? '−' : '+'; };
    item.addEventListener('toggle', toggle);
    toggle(); // set initial state
  });

  // ---- Image lazy load fallback ----
  document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
    img.addEventListener('error', () => {
      // replace broken images with a gradient placeholder
      img.style.background = 'linear-gradient(135deg, #D4EFF4, #C8E4C0)';
      img.removeAttribute('src');
    });
  });

})();
