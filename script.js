/* ════════════════════════════════════════════════════════
   AKANEYA — script2.js
   Includes:
   - Side menu toggle
   - Navbar scroll effect
   - GSAP ScrollTrigger: image zoom on scroll
   - GSAP ScrollTrigger: Apple-style word-by-word text reveal
   - Section fade-in reveal
════════════════════════════════════════════════════════ */

'use strict';

/* ── Side menu toggle ── */
function toggleMenu() {
  const menu    = document.getElementById('sideMenu');
  const overlay = document.getElementById('overlay');
  const isOpen  = menu.classList.toggle('open');
  overlay.classList.toggle('active', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const menu = document.getElementById('sideMenu');
    if (menu.classList.contains('open')) toggleMenu();
  }
});

/* ── Navbar scroll effect ── */
window.addEventListener('scroll', () => {
  document.getElementById('navbar')
    .classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ── Ensure video loops ── */
document.addEventListener('DOMContentLoaded', () => {
  const video = document.querySelector('.hero-visual video');
  if (video) {
    video.loop   = true;
    video.muted  = true;
    video.volume = 0;
    video.play().catch(() => {});
  }

  /* ════════════════════════════════════════════════════
     GSAP + ScrollTrigger animations
  ════════════════════════════════════════════════════ */
  gsap.registerPlugin(ScrollTrigger);

  /* ──────────────────────────────────────────────────
     1. IMAGE ZOOM on scroll — #h1 and #h2
        Images gently scale up as they scroll through
        the viewport — smooth, scrub-tied parallax zoom.
  ────────────────────────────────────────────────── */
  ['#h1', '#h2'].forEach((selector, i) => {
    const wrapper = document.querySelector(selector);
    if (!wrapper) return;

    /* Fade + drift in on first entry */
    gsap.fromTo(wrapper,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power2.out',
        delay: i * 0.2,
        scrollTrigger: {
          trigger: wrapper,
          start: 'top 88%',
          toggleActions: 'play none none none',
        }
      }
    );

    /* Continuous zoom tied to scroll position */
    gsap.fromTo(wrapper,
      { scale: 1.0, transformOrigin: 'center center' },
      {
        scale: 1.1,
        ease: 'none',
        scrollTrigger: {
          trigger: wrapper,
          start: 'top bottom',
          end:   'bottom top',
          scrub: 1.8,   /* Higher = smoother lag behind scroll */
        }
      }
    );
  });

  /* ──────────────────────────────────────────────────
     2. APPLE-STYLE TEXT REVEAL
        Words fade in one-by-one as you scroll —
        like Apple's product pages.
  ────────────────────────────────────────────────── */
  function splitWords(el) {
    const raw   = el.innerText;
    const words = raw.split(' ');
    el.innerHTML = words
      .map(w => `<span class="gsap-word" style="display:inline-block; will-change:opacity,transform;">${w}</span>`)
      .join(' ');
    return el.querySelectorAll('.gsap-word');
  }

  document.querySelectorAll('#history p, #chef p').forEach((para) => {
    const words = splitWords(para);

    gsap.fromTo(words,
      {
        opacity: 0.06,
        y: 16,
        filter: 'blur(3px)',
      },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        ease: 'power2.out',
        stagger: {
          each: 0.03,
          from: 'start',
        },
        scrollTrigger: {
          trigger: para,
          start: 'top 82%',
          end:   'center 40%',
          toggleActions: 'play none none reverse',
        }
      }
    );
  });

  /* ──────────────────────────────────────────────────
     3. SECTION LABEL — kanji slides up, subtitle expands letter-spacing
  ────────────────────────────────────────────────── */
  document.querySelectorAll('.section-label').forEach((label) => {
    const kanji    = label.querySelector('.kanji-small');
    const subtitle = label.querySelector('.section-title');

    if (kanji) {
      gsap.fromTo(kanji,
        { opacity: 0, y: 30, skewY: 4 },
        {
          opacity: 1, y: 0, skewY: 0,
          duration: 1.0,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: label,
            start: 'top 86%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    }

    if (subtitle) {
      gsap.fromTo(subtitle,
        { opacity: 0, y: 16, letterSpacing: '0.65em' },
        {
          opacity: 0.7, y: 0, letterSpacing: '0.38em',
          duration: 1.2,
          ease: 'power3.out',
          delay: 0.22,
          scrollTrigger: {
            trigger: label,
            start: 'top 86%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    }
  });

  /* ──────────────────────────────────────────────────
     4. RESTAURANT CARDS — stagger slide up
  ────────────────────────────────────────────────── */
  const cards = document.querySelectorAll('.restaurant-card');
  if (cards.length) {
    gsap.fromTo(cards,
      { opacity: 0, y: 70 },
      {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: '.restaurant-grid',
          start: 'top 78%',
          toggleActions: 'play none none reverse',
        }
      }
    );
  }

  /* ──────────────────────────────────────────────────
     5. RESERVE — text slides from left, buttons from right
  ────────────────────────────────────────────────── */
  const reserveText = document.querySelector('#reserve > p');
  const reserveBtns = document.querySelector('.reserve-actions');

  if (reserveText) {
    gsap.fromTo(reserveText,
      { opacity: 0, x: -60 },
      {
        opacity: 1, x: 0,
        duration: 1.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#reserve',
          start: 'top 76%',
          toggleActions: 'play none none reverse',
        }
      }
    );
  }

  if (reserveBtns) {
    gsap.fromTo(reserveBtns,
      { opacity: 0, x: 60 },
      {
        opacity: 1, x: 0,
        duration: 1.1,
        ease: 'power3.out',
        delay: 0.2,
        scrollTrigger: {
          trigger: '#reserve',
          start: 'top 76%',
          toggleActions: 'play none none reverse',
        }
      }
    );
  }

  /* ──────────────────────────────────────────────────
     6. CHEF IMAGE — parallax zoom like #h1/#h2
  ────────────────────────────────────────────────── */
  const chefImg = document.querySelector('.chef-img');
  if (chefImg) {
    gsap.fromTo(chefImg,
      { scale: 1.0 },
      {
        scale: 1.09,
        ease: 'none',
        scrollTrigger: {
          trigger: '#chef',
          start: 'top bottom',
          end:   'bottom top',
          scrub: 2.0,
        }
      }
    );
  }

  /* ──────────────────────────────────────────────────
     7. RESTAURANTS HEADER — divider lines grow outward
  ────────────────────────────────────────────────── */
  const dividers = document.querySelectorAll('.divider-line');
  dividers.forEach((d, i) => {
    gsap.fromTo(d,
      { scaleX: 0, transformOrigin: i === 0 ? 'right center' : 'left center' },
      {
        scaleX: 1,
        duration: 1.0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.restaurants-header',
          start: 'top 82%',
          toggleActions: 'play none none reverse',
        }
      }
    );
  });

  const restaurantsHeading = document.querySelector('.restaurants-header h2');
  if (restaurantsHeading) {
    gsap.fromTo(restaurantsHeading,
      { opacity: 0, y: 20 },
      {
        opacity: 0.8, y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.restaurants-header',
          start: 'top 82%',
          toggleActions: 'play none none reverse',
        }
      }
    );
  }

});