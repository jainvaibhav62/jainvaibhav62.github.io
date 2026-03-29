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
});
