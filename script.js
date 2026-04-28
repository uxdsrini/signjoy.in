/* ========================================
   SIGNJOY — GSAP Animations & Interactions
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Wait for GSAP to be ready ─────────────────────────────────────────────
  function initAll() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || typeof Lenis === 'undefined' || typeof ScrollTrigger === 'undefined') {
      setTimeout(initAll, 50);
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    initSmoothScroll();
    initLoader();
  }

  initAll();

  // ─── Custom Cursor ──────────────────────────────────────────────────────────
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  if (cursor && follower && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });

    function animateFollower() {
      followerX += (mouseX - followerX) * 0.1;
      followerY += (mouseY - followerY) * 0.1;
      follower.style.left = followerX + 'px';
      follower.style.top = followerY + 'px';
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    const hoverTargets = document.querySelectorAll('a, button, .service-card, .work-item, .nav-cta');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  // ─── PAGE LOADER ────────────────────────────────────────────────────────────
  function initLoader() {
    document.body.classList.add('loading');
    const fill = document.querySelector('.loader-fill');
    const tagline = document.querySelector('.loader-tagline');
    const loaderEl = document.getElementById('loader');

    // Simulate loading progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 18 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      if (fill) fill.style.width = progress + '%';
    }, 120);

    // Reveal tagline
    if (tagline) {
      setTimeout(() => {
        gsap.fromTo(tagline, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
      }, 400);
    }

    // Exit loader
    setTimeout(() => {
      document.body.classList.remove('loading');

      gsap.to(loaderEl, {
        yPercent: -100,
        duration: 0.9,
        ease: 'power4.inOut',
        delay: 0.2,
        onComplete: () => {
          loaderEl.style.display = 'none';
          initHeroAnimations();
          initScrollAnimations();
          initCounters();
        }
      });
    }, 1800);
  }

  // ─── HERO ANIMATIONS ────────────────────────────────────────────────────────
  function initHeroAnimations() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Navbar
    tl.fromTo('#navbar',
      { yPercent: -100, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.8 }
    );

    // Badge
    tl.fromTo('.hero-badge',
      { opacity: 0, y: 16, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6 },
      '-=0.4'
    );

    // Title lines — stagger each line
    const lines = document.querySelectorAll('.hero-title .line');
    tl.to(lines, {
      y: 0,
      duration: 0.85,
      stagger: 0.12,
      ease: 'power4.out'
    }, '-=0.2');

    // Subtitle
    tl.fromTo('.hero-sub',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7 },
      '-=0.4'
    );

    // CTA buttons
    tl.fromTo('.hero-actions',
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.6 },
      '-=0.4'
    );

    // Stats
    tl.fromTo('.hero-stats',
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.6 },
      '-=0.3'
    );

    // Hero Visual (desktop)
    if (window.innerWidth > 1100) {
      tl.fromTo('.hero-visual',
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 1, ease: 'power3.out' },
        '-=0.8'
      );

      // Float hero cards
      floatElement('.card-1', { y: 12, duration: 3.5 });
      floatElement('.card-2', { y: -10, duration: 4.2, delay: 0.5 });
      floatElement('.card-3', { y: 14, duration: 3.8, delay: 1 });
    }

    // Scroll indicator
    tl.fromTo('.hero-scroll-indicator',
      { opacity: 0 },
      { opacity: 1, duration: 0.8 },
      '-=0.2'
    );

    // Parallax orbs on mouse move
    document.addEventListener('mousemove', (e) => {
      const xN = (e.clientX / window.innerWidth - 0.5);
      const yN = (e.clientY / window.innerHeight - 0.5);
      gsap.to('.orb-1', { x: xN * 30, y: yN * 20, duration: 2, ease: 'power1.out' });
      gsap.to('.orb-2', { x: -xN * 20, y: -yN * 15, duration: 2.5, ease: 'power1.out' });
    });
  }

  function floatElement(selector, opts = {}) {
    const el = document.querySelector(selector);
    if (!el) return;
    gsap.to(el, {
      y: opts.y || 10,
      duration: opts.duration || 3,
      delay: opts.delay || 0,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    });
  }

  // ─── SCROLL-BASED ANIMATIONS ────────────────────────────────────────────────
  function initScrollAnimations() {

    // ── Sticky navbar
    ScrollTrigger.create({
      start: 'top -60px',
      onEnter: () => document.getElementById('navbar').classList.add('scrolled'),
      onLeaveBack: () => document.getElementById('navbar').classList.remove('scrolled'),
    });

    // ── Section titles reveal
    const revealTitles = document.querySelectorAll('.reveal-title');
    revealTitles.forEach(el => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true
        }
      });
    });

    // ── Section tags
    gsap.utils.toArray('.section-tag').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, x: -16 },
        {
          opacity: 1, x: 0, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true }
        }
      );
    });

    // ── Section descriptions
    gsap.utils.toArray('.section-desc, .about-lead, .about-body, .cta-sub').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true }
        }
      );
    });

    // ── Service cards stagger
    const serviceCards = document.querySelectorAll('.service-card');
    if (serviceCards.length) {
      gsap.to(serviceCards, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.services-grid',
          start: 'top 80%',
          once: true
        }
      });
    }

    // ── Work items stagger
    const workItems = document.querySelectorAll('.work-item');
    if (workItems.length) {
      workItems.forEach(item => {
        const info = item.querySelector('.work-info');
        const img = item.querySelector('.work-img');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            once: true
          }
        });

        // Reveal parent item first
        tl.to(item, { opacity: 1, y: 0, duration: 0.1 });

        tl.fromTo(img, 
          { clipPath: 'inset(100% 0% 0% 0%)', y: 40 },
          { clipPath: 'inset(0% 0% 0% 0%)', y: 0, duration: 1.2, ease: 'power4.out' }
        );
        
        tl.fromTo(info,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
          '-=0.8'
        );
      });
    }

    // ── Process steps stagger
    const processSteps = document.querySelectorAll('.process-step');
    if (processSteps.length) {
      gsap.to(processSteps, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.process-steps',
          start: 'top 80%',
          once: true
        }
      });
    }

    // ── Testimonials stagger
    const testimonials = document.querySelectorAll('.testimonial-card');
    if (testimonials.length) {
      gsap.to(testimonials, {
        opacity: 1,
        y: 0,
        duration: 0.75,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.testimonials-grid',
          start: 'top 80%',
          once: true
        }
      });
    }

    // ── About values stagger
    const values = document.querySelectorAll('.value-item');
    if (values.length) {
      gsap.to(values, {
        opacity: 1,
        y: 0,
        duration: 0.65,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.about-values',
          start: 'top 83%',
          once: true
        }
      });
    }

    // ── CTA section big title
    const ctaTitle = document.querySelector('.cta-title');
    if (ctaTitle) {
      gsap.fromTo(ctaTitle,
        { opacity: 0, y: 40, scale: 0.97 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: ctaTitle, start: 'top 85%', once: true }
        }
      );
    }

    // ── Parallax on hero grid
    gsap.to('.hero-grid', {
      yPercent: 30,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });

    // ── Work items parallax
    document.querySelectorAll('.work-item').forEach(item => {
      const inner = item.querySelector('.work-placeholder');
      if (inner) {
        gsap.to(inner, {
          yPercent: 20,
          ease: 'none',
          scrollTrigger: {
            trigger: item,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });
      }
    });

    // ── Ticker parallax (subtle speed change on scroll)
    ScrollTrigger.create({
      trigger: '.ticker-section',
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const speed = 1 + self.getVelocity() / 3000;
        document.querySelector('.ticker-inner').style.animationDuration = (25 / Math.abs(speed)) + 's';
      }
    });

    // ── CTA orb parallax
    gsap.to('.cta-orb', {
      yPercent: -25,
      ease: 'none',
      scrollTrigger: {
        trigger: '.cta-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5
      }
    });

    // ── Footer fade in
    gsap.fromTo('.site-footer',
      { opacity: 0 },
      {
        opacity: 1, duration: 0.8,
        scrollTrigger: { trigger: '.site-footer', start: 'top 92%', once: true }
      }
    );
  }

  // ─── COUNTER ANIMATION ──────────────────────────────────────────────────────
  function initCounters() {
    const counters = document.querySelectorAll('.stat-num');
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);

      ScrollTrigger.create({
        trigger: counter,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.fromTo({ val: 0 }, { val: target }, {
            duration: 1.8,
            ease: 'power2.out',
            onUpdate: function () {
              counter.textContent = Math.round(this.targets()[0].val);
            }
          });
        }
      });
    });
  }

  // ─── MOBILE MENU ────────────────────────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  let menuOpen = false;

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      menuOpen = !menuOpen;
      hamburger.classList.toggle('active', menuOpen);
      mobileMenu.classList.toggle('open', menuOpen);
    });

    // Close on link click
    mobileMenu.querySelectorAll('.mob-link').forEach(link => {
      link.addEventListener('click', () => {
        menuOpen = false;
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
      });
    });
  }

  // ─── SMOOTH SCROLL ──────────────────────────────────────────────────────────
  function initSmoothScroll() {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const id = anchor.getAttribute('href');
        if (id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        const navbar = document.getElementById('navbar');
        const offset = navbar ? navbar.offsetHeight : 0;
        lenis.scrollTo(target, { offset: -offset });
      });
    });
  }

  // ─── SERVICE CARD HOVER TILT ────────────────────────────────────────────────
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const xN = (e.clientX - rect.left) / rect.width - 0.5;
      const yN = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(card, {
        rotateX: -yN * 6,
        rotateY: xN * 6,
        transformPerspective: 800,
        ease: 'power1.out',
        duration: 0.4
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'power2.out' });
    });
  });

  // ─── WORK ITEMS — Image zoom on hover ───────────────────────────────────────
  document.querySelectorAll('.work-item').forEach(item => {
    const img = item.querySelector('.work-img');
    item.addEventListener('mouseenter', () => {
      gsap.to(img, { scale: 1.04, duration: 0.6, ease: 'power2.out' });
    });
    item.addEventListener('mouseleave', () => {
      gsap.to(img, { scale: 1, duration: 0.6, ease: 'power2.out' });
    });
    
    // Magnetic Explore Badge
    const overlay = item.querySelector('.work-overlay');
    const badge = item.querySelector('.work-overlay-inner');
    if (overlay && badge) {
      overlay.addEventListener('mousemove', (e) => {
        const rect = overlay.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(badge, { x: x * 0.4, y: y * 0.4, duration: 0.6, ease: 'power2.out' });
      });
      overlay.addEventListener('mouseleave', () => {
        gsap.to(badge, { x: 0, y: 0, duration: 0.6, ease: 'power2.out' });
      });
    }
  });

  // ─── BUTTON MAGNETIC EFFECT ─────────────────────────────────────────────────
  document.querySelectorAll('.btn-primary, .nav-cta').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const xN = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const yN = (e.clientY - rect.top - rect.height / 2) / rect.height;
      gsap.to(btn, {
        x: xN * 8,
        y: yN * 6,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
    });
  });

  // ─── HERO MOCKUP float animation ────────────────────────────────────────────
  const mockup = document.querySelector('.hero-mockup');
  if (mockup && window.innerWidth > 1100) {
    gsap.to(mockup, {
      y: -16,
      duration: 4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: 0.5
    });
  }

  // ─── LOGO DOT PULSE on hover ────────────────────────────────────────────────
  const logoDot = document.querySelector('.logo-dot');
  if (logoDot) {
    document.querySelector('.nav-logo').addEventListener('mouseenter', () => {
      gsap.to(logoDot, { scale: 1.8, duration: 0.3, ease: 'back.out(2)' });
    });
    document.querySelector('.nav-logo').addEventListener('mouseleave', () => {
      gsap.to(logoDot, { scale: 1, duration: 0.4, ease: 'elastic.out(1.2, 0.5)' });
    });
  }

  // ─── RESIZE HANDLER ─────────────────────────────────────────────────────────
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);
  });

});
