document.addEventListener('DOMContentLoaded', () => {

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile menu (full-screen slide-in drawer)
  const menuToggle = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileNavClose = document.getElementById('mobile-nav-close');
  const mobileNavScrim = document.getElementById('mobile-nav-scrim');

  function closeMenu(){
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  function openMenu(){
    mobileNav.classList.add('open');
    mobileNav.setAttribute('aria-hidden', 'false');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  if (menuToggle && mobileNav){
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.contains('open');
      isOpen ? closeMenu() : openMenu();
    });

    if (mobileNavClose) mobileNavClose.addEventListener('click', closeMenu);
    if (mobileNavScrim) mobileNavScrim.addEventListener('click', closeMenu);

    mobileNav.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) closeMenu();
    });

    // Close automatically if the viewport grows back to desktop size
    window.addEventListener('resize', () => {
      if (window.innerWidth > 860 && mobileNav.classList.contains('open')) closeMenu();
    });
  }

  // Scroll-top button
  const scrollTopBtn = document.getElementById('scroll-top');
  window.addEventListener('scroll', () => {
    if (scrollTopBtn){
      scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
    }
  }, { passive: true });

  // Active nav link on scroll (scroll-spy)
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

  sections.forEach(section => spyObserver.observe(section));

  // Reveal-on-scroll
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => revealObserver.observe(el));

  // Career snapshot counters
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const statEls = document.querySelectorAll('.stat-number');

  function animateCount(el){
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const suffix = el.getAttribute('data-suffix') || '';

    if (prefersReducedMotion){
      el.textContent = target + suffix;
      return;
    }

    const duration = 1200;
    const start = performance.now();

    function tick(now){
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        animateCount(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  statEls.forEach(el => statObserver.observe(el));

});
