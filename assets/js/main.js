/* ============================================================
   DAEGU VISION X — main.js  (no dependencies)
   ============================================================ */
(function () {
  'use strict';

  const header   = document.getElementById('siteHeader');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const links    = Array.from(navLinks.querySelectorAll('a'));

  /* ---------- header background on scroll ---------- */
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- mobile menu ---------- */
  const closeMenu = () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', '메뉴 열기');
  };
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
  });
  links.forEach((a) => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

  /* ---------- reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal, .budget-bars li');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in'));
  }

  /* ---------- active nav link via section observer ---------- */
  const sectionFor = {
    concept: 'concept', shift: 'shift', experience: 'experience',
    center: 'center', plan: 'plan'
  };
  const watched = Object.keys(sectionFor)
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const setActive = (id) => {
    links.forEach((a) => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + id);
    });
  };

  if ('IntersectionObserver' in window && watched.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    watched.forEach((s) => spy.observe(s));
  }

  /* ---------- subtle hero parallax (desktop, motion-safe) ---------- */
  const heroBg = document.querySelector('.hero-bg');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (heroBg && !reduce && window.matchMedia('(min-width: 769px)').matches) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, 700);
        heroBg.style.transform = `scale(1.06) translateY(${y * 0.12}px)`;
        ticking = false;
      });
    }, { passive: true });
  }
})();
