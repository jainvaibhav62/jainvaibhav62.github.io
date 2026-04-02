'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // =========================================================================
  // 1. Navigation — scroll class, mobile toggle, active link highlighting
  // =========================================================================
  function initNavigation() {
    const nav = document.querySelector('.nav');
    const hamburger = document.querySelector('.nav__hamburger');
    const navLinks = document.querySelector('.nav__links');
    const navLinkItems = document.querySelectorAll('.nav__link');

    // Add .nav--scrolled when scrolled past 50px
    if (nav) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
          nav.classList.add('nav--scrolled');
        } else {
          nav.classList.remove('nav--scrolled');
        }
      }, { passive: true });
    }

    // Mobile hamburger toggle
    if (hamburger && navLinks) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
      });
    }

    // Close mobile menu when a nav link is clicked
    navLinkItems.forEach((link) => {
      link.addEventListener('click', () => {
        if (hamburger && navLinks) {
          hamburger.classList.remove('active');
          navLinks.classList.remove('active');
        }
      });
    });

    // Scroll-spy: highlight active nav link based on visible section
    initScrollSpy(navLinkItems);
  }

  // =========================================================================
  // 8. Navbar scroll-spy (Intersection Observer on sections)
  // =========================================================================
  function initScrollSpy(navLinkItems) {
    const sections = document.querySelectorAll('section[id]');
    if (sections.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.3,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('id');
          navLinkItems.forEach((link) => {
            link.classList.remove('nav__link--active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('nav__link--active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach((section) => observer.observe(section));
  }

  // =========================================================================
  // 2. Scroll Animations (Intersection Observer on .fade-in elements)
  // =========================================================================
  function initScrollAnimations() {
    if (prefersReducedMotion) {
      // If reduced motion, make everything visible immediately
      document.querySelectorAll('.fade-in').forEach((el) => {
        el.classList.add('fade-in--visible');
      });
      return;
    }

    const fadeElements = document.querySelectorAll('.fade-in');
    if (fadeElements.length === 0) return;

    // Apply stagger delays to children of .fade-in-stagger elements
    document.querySelectorAll('.fade-in-stagger').forEach((parent) => {
      Array.from(parent.children).forEach((child, index) => {
        child.style.setProperty('--stagger-delay', `${index * 100}ms`);
        child.style.transitionDelay = `var(--stagger-delay)`;
      });
    });

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in--visible');
          obs.unobserve(entry.target); // Only trigger once
        }
      });
    }, {
      root: null,
      rootMargin: '0px',
      threshold: 0.15,
    });

    fadeElements.forEach((el) => observer.observe(el));
  }

  // =========================================================================
  // 3. Typed Text Effect
  // =========================================================================
  function initTypedText() {
    const el = document.querySelector('.typed-text');
    if (!el) return;

    // Skip animation if reduced motion is preferred
    if (prefersReducedMotion) {
      try {
        const texts = JSON.parse(el.getAttribute('data-texts') || '[]');
        if (texts.length > 0) {
          el.textContent = texts[0];
        }
      } catch (e) { /* fail silently */ }
      return;
    }

    let texts;
    try {
      texts = JSON.parse(el.getAttribute('data-texts') || '[]');
    } catch (e) {
      return; // Invalid JSON, fail silently
    }

    if (texts.length === 0) return;

    const TYPE_SPEED = 50;    // ms per character when typing
    const DELETE_SPEED = 30;  // ms per character when deleting
    const PAUSE_DURATION = 2000; // ms to pause after typing a full string

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function tick() {
      const currentText = texts[textIndex];

      if (!isDeleting) {
        // Typing forward
        charIndex++;
        el.textContent = currentText.substring(0, charIndex);

        if (charIndex === currentText.length) {
          // Finished typing — pause then start deleting
          isDeleting = true;
          setTimeout(tick, PAUSE_DURATION);
          return;
        }
        setTimeout(tick, TYPE_SPEED);
      } else {
        // Deleting backward
        charIndex--;
        el.textContent = currentText.substring(0, charIndex);

        if (charIndex === 0) {
          // Finished deleting — move to next string
          isDeleting = false;
          textIndex = (textIndex + 1) % texts.length;
          setTimeout(tick, TYPE_SPEED);
          return;
        }
        setTimeout(tick, DELETE_SPEED);
      }
    }

    tick();
  }

  // =========================================================================
  // 4. Scroll-to-Top Button
  // =========================================================================
  function initScrollToTop() {
    const btn = document.querySelector('.scroll-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        btn.classList.add('scroll-top--visible');
      } else {
        btn.classList.remove('scroll-top--visible');
      }
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // =========================================================================
  // 5. Project Card Tilt Effect
  // =========================================================================
  function initProjectTilt() {
    if (prefersReducedMotion) return;

    const cards = document.querySelectorAll('.project-card');
    if (cards.length === 0) return;

    const MAX_ROTATION = 5; // degrees

    cards.forEach((card) => {
      let rafId = null;

      card.addEventListener('mousemove', (e) => {
        if (rafId) return; // Throttle with rAF

        rafId = requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          // Normalize mouse position relative to card center (-1 to 1)
          const normalizedX = (e.clientX - centerX) / (rect.width / 2);
          const normalizedY = (e.clientY - centerY) / (rect.height / 2);

          // rotateY controlled by horizontal position, rotateX by vertical (inverted)
          const rotateY = normalizedX * MAX_ROTATION;
          const rotateX = -normalizedY * MAX_ROTATION;

          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
          rafId = null;
        });
      });

      card.addEventListener('mouseleave', () => {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      });
    });
  }

  // =========================================================================
  // 6. Skill Tags Animation
  // =========================================================================
  function initSkillTagsAnimation() {
    if (prefersReducedMotion) return;

    const categories = document.querySelectorAll('.skill-category');
    if (categories.length === 0) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const tags = entry.target.querySelectorAll('.skill-tag');
          tags.forEach((tag, index) => {
            tag.style.transitionDelay = `${index * 50}ms`;
          });
          obs.unobserve(entry.target); // Only trigger once
        }
      });
    }, {
      root: null,
      rootMargin: '0px',
      threshold: 0.15,
    });

    categories.forEach((cat) => observer.observe(cat));
  }

  // =========================================================================
  // 7. Counter Animation (for about stats)
  // =========================================================================
  function initCounterAnimation() {
    if (prefersReducedMotion) {
      // Show final numbers immediately
      document.querySelectorAll('.stat__number[data-count]').forEach((el) => {
        el.textContent = el.getAttribute('data-count');
      });
      return;
    }

    const counters = document.querySelectorAll('.stat__number[data-count]');
    if (counters.length === 0) return;

    const DURATION = 2000; // 2 seconds

    function animateCounter(el) {
      const target = parseInt(el.getAttribute('data-count'), 10);
      if (isNaN(target)) return;

      const start = performance.now();

      function step(timestamp) {
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / DURATION, 1);

        // Ease-out quad for a natural deceleration
        const eased = 1 - (1 - progress) * (1 - progress);
        const current = Math.floor(eased * target);

        el.textContent = current;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target; // Ensure exact final value
        }
      }

      requestAnimationFrame(step);
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target); // Only trigger once
        }
      });
    }, {
      root: null,
      rootMargin: '0px',
      threshold: 0.3,
    });

    counters.forEach((counter) => observer.observe(counter));
  }

  // =========================================================================
  // 9. Recommendations infinite scroll — duplicate cards for seamless loop
  // =========================================================================
  function initRecommendationsSlider() {
    const slider = document.querySelector('.recommendations-slider');
    if (!slider) return;

    const buttons = document.querySelectorAll('.recommendations-nav__btn');
    if (buttons.length === 0) return;

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const card = slider.querySelector('.recommendation-card');
        if (!card) return;

        // Scroll by one card width + gap
        const style = getComputedStyle(slider);
        const gap = parseInt(style.gap, 10) || 24;
        const scrollAmount = card.offsetWidth + gap;
        const dir = parseInt(btn.getAttribute('data-dir'), 10);

        slider.scrollBy({ left: dir * scrollAmount, behavior: 'smooth' });
      });
    });
  }

  // =========================================================================
  // 10. Apply 3D animation classes dynamically
  // =========================================================================
  function init3DAnimations() {
    if (prefersReducedMotion) return;

    // Skill categories — alternate tilt directions
    document.querySelectorAll('.skill-category').forEach((el, i) => {
      el.classList.remove('fade-in');
      el.classList.add(i % 2 === 0 ? 'tilt-in-left' : 'tilt-in-right');
      el.classList.add('fade-in'); // re-add so observer picks it up
    });

    // Project cards — 3D zoom rotate
    document.querySelectorAll('.project-card').forEach((el) => {
      el.classList.remove('fade-in');
      el.classList.add('fade-in-3d');
      el.classList.add('fade-in'); // observer class
    });

    // Timeline items — alternate tilt
    document.querySelectorAll('.timeline__item').forEach((el, i) => {
      el.classList.remove('fade-in');
      el.classList.add(i % 2 === 0 ? 'tilt-in-left' : 'tilt-in-right');
      el.classList.add('fade-in');
    });

    // Cert badges — zoom rotate
    document.querySelectorAll('.cert-badge').forEach((el) => {
      el.classList.remove('fade-in');
      el.classList.add('zoom-rotate-in');
      el.classList.add('fade-in');
    });
  }

  // =========================================================================
  // 10. Visitor Dashboard
  // =========================================================================
  function initVisitorDash() {
    const dash = document.getElementById('visitorDash');
    const toggle = document.getElementById('visitorDashToggle');
    if (!dash || !toggle) return;

    const NS = 'vaibhavjain-portfolio';
    const totalEl = document.getElementById('dashTotalVisits');
    const uniqueEl = document.getElementById('dashUniqueUsers');
    const avgTimeEl = document.getElementById('dashAvgTime');

    // Toggle panel
    toggle.addEventListener('click', () => dash.classList.toggle('visitor-dash--open'));
    document.addEventListener('click', (e) => {
      if (!dash.contains(e.target)) dash.classList.remove('visitor-dash--open');
    });

    // Animate a number counting up
    function animateValue(el, end, duration) {
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(end * eased).toLocaleString();
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    // --- 1. Total Visits ---
    fetch(`https://api.counterapi.dev/v1/${NS}/page-visits/up`)
      .then((r) => r.json())
      .then((d) => { if (d && d.count != null) animateValue(totalEl, d.count, 1200); })
      .catch(() => {
        let c = parseInt(localStorage.getItem('vj_visits') || '0', 10) + 1;
        localStorage.setItem('vj_visits', c);
        animateValue(totalEl, c, 1200);
      });

    // --- 2. Unique Visitors (IP-based) ---
    // Get visitor IP, hash it, use as a per-IP counter key.
    // If the per-IP counter returns 1 → new user → also increment the unique-total counter.
    async function trackUnique() {
      try {
        const ipRes = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipRes.json();
        const ip = ipData.ip;

        // Simple hash of IP for the counter key
        let hash = 0;
        for (let i = 0; i < ip.length; i++) {
          hash = ((hash << 5) - hash) + ip.charCodeAt(i);
          hash |= 0;
        }
        const ipKey = 'ip-' + Math.abs(hash).toString(36);

        // Increment per-IP counter
        const perIpRes = await fetch(`https://api.counterapi.dev/v1/${NS}/${ipKey}/up`);
        const perIpData = await perIpRes.json();

        // First visit from this IP → increment unique total
        if (perIpData && perIpData.count === 1) {
          const uniqueRes = await fetch(`https://api.counterapi.dev/v1/${NS}/unique-visitors/up`);
          const uniqueData = await uniqueRes.json();
          if (uniqueData && uniqueData.count != null) animateValue(uniqueEl, uniqueData.count, 1200);
        } else {
          // Returning visitor — just read the current unique count
          const uniqueRes = await fetch(`https://api.counterapi.dev/v1/${NS}/unique-visitors/up`);
          const uniqueData = await uniqueRes.json();
          // Undo the extra increment for returning visitors by reading count-1
          if (uniqueData && uniqueData.count != null) {
            // Show count minus 1 since this wasn't a real new unique
            animateValue(uniqueEl, uniqueData.count - 1, 1200);
          }
        }
      } catch {
        // Fallback: localStorage-based unique tracking
        const isNew = !localStorage.getItem('vj_unique');
        if (isNew) localStorage.setItem('vj_unique', '1');
        let uc = parseInt(localStorage.getItem('vj_unique_count') || '0', 10);
        if (isNew) { uc++; localStorage.setItem('vj_unique_count', uc); }
        animateValue(uniqueEl, uc, 1200);
      }
    }
    trackUnique();

    // --- 3. Avg Time on Site ---
    // Track session durations in localStorage, compute running average.
    const sessionStart = Date.now();
    const STORAGE_KEY = 'vj_session_times';

    function getStoredSessions() {
      try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
      catch { return []; }
    }

    function formatTime(secs) {
      if (secs < 60) return secs + 's';
      const m = Math.floor(secs / 60);
      const s = secs % 60;
      return m + 'm ' + (s > 0 ? s + 's' : '');
    }

    // Show existing average on load
    const pastSessions = getStoredSessions();
    if (pastSessions.length > 0) {
      const avg = Math.round(pastSessions.reduce((a, b) => a + b, 0) / pastSessions.length);
      avgTimeEl.textContent = formatTime(avg);
    } else {
      avgTimeEl.textContent = '0s';
    }

    // Update average every 5s with current session included
    setInterval(() => {
      const currentDuration = Math.floor((Date.now() - sessionStart) / 1000);
      const sessions = getStoredSessions();
      const allSessions = [...sessions, currentDuration];
      const avg = Math.round(allSessions.reduce((a, b) => a + b, 0) / allSessions.length);
      avgTimeEl.textContent = formatTime(avg);
    }, 5000);

    // Save session duration when user leaves
    function saveSession() {
      const duration = Math.floor((Date.now() - sessionStart) / 1000);
      if (duration < 2) return; // Ignore very short visits
      const sessions = getStoredSessions();
      sessions.push(duration);
      // Keep last 50 sessions to avoid bloating localStorage
      if (sessions.length > 50) sessions.splice(0, sessions.length - 50);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    }

    window.addEventListener('beforeunload', saveSession);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') saveSession();
    });
  }

  // =========================================================================
  // Initialize all features
  // =========================================================================
  init3DAnimations(); // Must run BEFORE scroll animations
  initNavigation();
  initScrollAnimations();
  initTypedText();
  initScrollToTop();
  initProjectTilt();
  initSkillTagsAnimation();
  initCounterAnimation();
  initRecommendationsSlider();
  initVisitorDash();
});
