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

  gsap.registerPlugin(ScrollTrigger);

  /* ── Performance: use GPU-composited properties only ── */
  gsap.config({ force3D: true });

  /* ── Batch ScrollTrigger refreshes ── */
  ScrollTrigger.config({ limitCallbacks: true });

  /* ──────────────────────────────────────────────────
     1. IMAGE ZOOM — #h1 and #h2
  ────────────────────────────────────────────────── */
  ['#h1', '#h2'].forEach((selector, i) => {
    const wrapper = document.querySelector(selector);
    if (!wrapper) return;

    /* Pre-promote to its own layer */
    wrapper.style.willChange = 'transform, opacity';

    gsap.fromTo(wrapper,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: 'power2.out',
        delay: i * 0.15,
        force3D: true,
        scrollTrigger: {
          trigger: wrapper,
          start: 'top 88%',
          toggleActions: 'play none none none',
        }
      }
    );

    gsap.fromTo(wrapper,
      { scale: 1.0 },
      {
        scale: 1.08,
        ease: 'none',
        force3D: true,
        scrollTrigger: {
          trigger: wrapper,
          start: 'top bottom',
          end:   'bottom top',
          scrub: 2.5,
          invalidateOnRefresh: true,
        }
      }
    );
  });

  /* ──────────────────────────────────────────────────
     2. APPLE-STYLE TEXT REVEAL
        REMOVED blur() — replaced with y + opacity only.
        blur() triggers layout/paint on every frame = main lag source.
  ────────────────────────────────────────────────── */
  function splitWords(el) {
    const raw   = el.innerText;
    const words = raw.split(' ');
    el.innerHTML = words
      .map(w => `<span class="gsap-word" style="display:inline-block;will-change:opacity,transform;">${w}</span>`)
      .join(' ');
    return el.querySelectorAll('.gsap-word');
  }

  document.querySelectorAll('#history p, #chef p').forEach((para) => {
    const words = splitWords(para);

    gsap.fromTo(words,
      { opacity: 0.05, y: 14 },       /* ← no blur here */
      {
        opacity: 1,
        y: 0,
        ease: 'power2.out',
        force3D: true,
        stagger: { each: 0.025, from: 'start' },
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
     3. SECTION LABEL
  ────────────────────────────────────────────────── */
  document.querySelectorAll('.section-label').forEach((label) => {
    const kanji    = label.querySelector('.kanji-small');
    const subtitle = label.querySelector('.section-title');

    if (kanji) {
      gsap.fromTo(kanji,
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0,
          duration: 0.9,
          ease: 'power3.out',
          force3D: true,
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
        { opacity: 0, y: 14 },
        {
          opacity: 0.7, y: 0,
          duration: 1.0,
          ease: 'power3.out',
          delay: 0.2,
          force3D: true,
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
     4. RESTAURANT CARDS
  ────────────────────────────────────────────────── */
  const cards = document.querySelectorAll('.restaurant-card');
  if (cards.length) {
    gsap.fromTo(cards,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.12,
        force3D: true,
        scrollTrigger: {
          trigger: '.restaurant-grid',
          start: 'top 78%',
          toggleActions: 'play none none reverse',
        }
      }
    );
  }

  /* ──────────────────────────────────────────────────
     5. RESERVE
  ────────────────────────────────────────────────── */
  const reserveText = document.querySelector('#reserve > p');
  const reserveBtns = document.querySelector('.reserve-actions');

  if (reserveText) {
    gsap.fromTo(reserveText,
      { opacity: 0, x: -50 },
      {
        opacity: 1, x: 0,
        duration: 1.0,
        ease: 'power3.out',
        force3D: true,
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
      { opacity: 0, x: 50 },
      {
        opacity: 1, x: 0,
        duration: 1.0,
        ease: 'power3.out',
        delay: 0.18,
        force3D: true,
        scrollTrigger: {
          trigger: '#reserve',
          start: 'top 76%',
          toggleActions: 'play none none reverse',
        }
      }
    );
  }

  /* ──────────────────────────────────────────────────
     6. CHEF IMAGE — parallax zoom
  ────────────────────────────────────────────────── */
  const chefImg = document.querySelector('.chef-img');
  if (chefImg) {
    chefImg.style.willChange = 'transform';
    gsap.fromTo(chefImg,
      { scale: 1.0 },
      {
        scale: 1.09,
        ease: 'none',
        force3D: true,
        scrollTrigger: {
          trigger: '#chef',
          start: 'top bottom',
          end:   'bottom top',
          scrub: 2.0,
          invalidateOnRefresh: true,
        }
      }
    );
  }

  /* ──────────────────────────────────────────────────
     7. RESTAURANTS HEADER dividers
  ────────────────────────────────────────────────── */
  const dividers = document.querySelectorAll('.divider-line');
  dividers.forEach((d, i) => {
    gsap.fromTo(d,
      { scaleX: 0, transformOrigin: i === 0 ? 'right center' : 'left center' },
      {
        scaleX: 1,
        duration: 1.0,
        ease: 'power2.out',
        force3D: true,
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
      { opacity: 0, y: 18 },
      {
        opacity: 0.8, y: 0,
        duration: 0.9,
        ease: 'power3.out',
        force3D: true,
        scrollTrigger: {
          trigger: '.restaurants-header',
          start: 'top 82%',
          toggleActions: 'play none none reverse',
        }
      }
    );
  }

  /* ── Clean up will-change after animations complete ── */
  ScrollTrigger.addEventListener('refresh', () => {
    document.querySelectorAll('[style*="will-change"]').forEach(el => {
      setTimeout(() => { el.style.willChange = 'auto'; }, 2000);
    });
  });
});
