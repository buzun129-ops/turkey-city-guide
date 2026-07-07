/* ══════════════════════════════════
   VOYAGE TURKEY — main.js
══════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  /* ── Loader ── */
  const loader = document.getElementById('loader');
  const fill   = document.getElementById('loader-fill');
  if (fill) requestAnimationFrame(() => { fill.style.width = '100%'; });
  window.addEventListener('load', () => {
    setTimeout(() => { if (loader) loader.classList.add('done'); }, 1400);
  });

  /* ── Custom Cursor ── */
  const cur  = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    if (cur)  { cur.style.left  = mx + 'px'; cur.style.top  = my + 'px'; }
  });
  (function loop() {
    rx += (mx - rx) * 0.11; ry += (my - ry) * 0.11;
    if (ring) { ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; }
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll('a, button, .city-card, .food-card, .landmark-img').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
  });

  /* ── Page Transition ── */
  const overlay = document.getElementById('page-overlay');
  // Animate in
  if (overlay) {
    overlay.classList.add('slide-in');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlay.classList.remove('slide-in');
        overlay.classList.add('slide-out');
        setTimeout(() => { overlay.classList.remove('slide-out'); }, 600);
      });
    });
  }
  // Intercept internal links
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('tel') || href.startsWith('http')) return;
    link.addEventListener('click', e => {
      e.preventDefault();
      if (overlay) {
        overlay.classList.remove('slide-out');
        overlay.classList.add('slide-in');
        setTimeout(() => { window.location.href = href; }, 580);
      } else {
        window.location.href = href;
      }
    });
  });

  /* ── Navbar Scroll ── */
  const nav = document.querySelector('nav');
  window.addEventListener('scroll', () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
    revealCheck();
  }, { passive: true });

  /* ── Reveal on Scroll ── */
  const revealEls = document.querySelectorAll('.reveal');
  function revealCheck() {
    revealEls.forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight - 60) el.classList.add('in');
    });
  }
  setTimeout(revealCheck, 120);

  /* ── Smooth Anchor Scroll ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  /* ── Form Submit ── */
  const submitBtn = document.getElementById('submitBtn');
  const toast     = document.getElementById('toast');
  if (submitBtn && toast) {
    submitBtn.addEventListener('click', () => {
      const inputs = submitBtn.closest('form, div').querySelectorAll('input, select, textarea');
      let ok = true;
      inputs.forEach(i => {
        if (!i.value.trim()) {
          ok = false;
          i.style.borderColor = '#c0522a';
          setTimeout(() => { i.style.borderColor = ''; }, 2500);
        }
      });
      if (ok) {
        toast.textContent = '✓ Talebiniz alındı! En kısa sürede iletişime geçeceğiz.';
        toast.style.background = '';
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 4000);
        inputs.forEach(i => { i.value = ''; });
      } else {
        toast.textContent = '⚠ Lütfen tüm alanları doldurun.';
        toast.style.background = 'var(--rust)';
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
      }
    });
  }

  /* ── Parallax hero bg on home ── */
  const heroBg = document.querySelector('.home-hero-silhouette');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      heroBg.style.transform = `translateY(${window.scrollY * 0.18}px)`;
    }, { passive: true });
  }

  /* ── Stat counter ── */
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    let started = false;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !started) {
        started = true;
        const start = performance.now();
        const dur = 1600;
        (function tick(now) {
          const p = Math.min((now - start) / dur, 1);
          const v = target * (1 - Math.pow(1 - p, 3));
          el.textContent = (Number.isInteger(target) ? Math.floor(v) : v.toFixed(1)) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        })(performance.now());
      }
    }, { threshold: 0.5 });
    obs.observe(el);
  });
});

/* ═══ HERO SLİDESHOW ═══ */
(function() {
  var slides  = document.querySelectorAll('.hero-slide');
  var dots    = document.querySelectorAll('.hero-dot');
  var label   = document.getElementById('heroLabel');
  var labels  = ['Kapadokya', 'İstanbul'];
  var current = 0;
  var timer   = null;

  if (!slides.length) return;

  function goTo(idx) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    if (label) {
      label.style.opacity = '0';
      setTimeout(function() {
        label.textContent = labels[current];
        label.style.opacity = '1';
      }, 400);
    }
  }

  function next() { goTo(current + 1); }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(next, 5000);
  }

  // Dot tıklamaları
  dots.forEach(function(dot, i) {
    dot.addEventListener('click', function() {
      goTo(i);
      startTimer();
    });
  });

  // Swipe desteği (mobil)
  var touchStartX = 0;
  var hero = document.querySelector('.home-hero');
  if (hero) {
    hero.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    hero.addEventListener('touchend', function(e) {
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) {
        dx < 0 ? next() : goTo(current - 1);
        startTimer();
      }
    }, { passive: true });
  }

  // Başlat
  startTimer();
})();
