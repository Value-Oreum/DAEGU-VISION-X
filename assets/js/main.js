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

  /* ---------- contact modal + form → Google Apps Script ---------- */
  const modal   = document.getElementById('contactModal');
  const openBtn = document.getElementById('contactOpen');
  const form    = document.getElementById('contactForm');
  const statusEl = document.getElementById('formStatus');
  const doneEl  = document.getElementById('formDone');
  let lastFocus = null;

  const openModal = () => {
    if (!modal) return;
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => {
      modal.classList.add('open');
      const first = modal.querySelector('input, textarea');
      if (first) first.focus();
    });
  };
  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { modal.hidden = true; }, 260);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  };

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (modal) {
    modal.querySelectorAll('[data-close]').forEach((el) => el.addEventListener('click', closeModal));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.hidden) closeModal();
    });
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (form._hp && form._hp.value) return;            // honeypot: ignore bots
      if (!form.checkValidity()) { form.reportValidity(); return; }

      const endpoint = (window.DVX_CONFIG && window.DVX_CONFIG.contactEndpoint || '').trim();
      const submitBtn = form.querySelector('.form-submit');
      submitBtn.disabled = true;
      statusEl.className = 'form-status';
      statusEl.textContent = '전송 중…';

      try {
        if (!endpoint) throw new Error('NO_ENDPOINT');
        const body = new URLSearchParams(new FormData(form));
        // no-cors: Apps Script processes the POST; response is opaque (treated as success)
        await fetch(endpoint, { method: 'POST', mode: 'no-cors', body });
        form.reset();
        form.hidden = true;
        doneEl.hidden = false;
      } catch (err) {
        statusEl.classList.add('error');
        statusEl.textContent = (err && err.message === 'NO_ENDPOINT')
          ? '문의 폼이 아직 연결되지 않았습니다. 관리자에게 문의해주세요.'
          : '전송에 실패했습니다. 잠시 후 다시 시도해주세요.';
      } finally {
        submitBtn.disabled = false;
      }
    });
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
