/* =============================================
   EVAN PORTFOLIO — MAIN JAVASCRIPT
   Multi-Role Technology Portfolio 2026
   ============================================= */

/* ----- DARK / LIGHT MODE ----- */
const themeToggles = document.querySelectorAll('.theme-toggle');
const root = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'light';
root.setAttribute('data-theme', savedTheme);

themeToggles.forEach(btn => {
  btn.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
});

/* ----- NAVBAR SCROLL EFFECT ----- */
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* ----- HAMBURGER MENU ----- */
const hamburger = document.getElementById('hamburger');
const navMobile = document.getElementById('navMobile');

if (hamburger && navMobile) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMobile.classList.toggle('open');
  });

  navMobile.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navMobile.classList.remove('open');
    });
  });
}

/* ----- ACTIVE NAV LINK ----- */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link[data-section]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.dataset.section === entry.target.id) {
            link.classList.add('active');
          }
        });
      }
    });
  },
  { threshold: 0.3 }
);

sections.forEach(section => sectionObserver.observe(section));

/* ----- TYPING EFFECT ----- */
if (typeof Typed !== 'undefined') {
  new Typed('.typedText', {
    strings: [
      'UI/UX Designer',
      'Product Designer',
      'Web Developer',
      'Front-End Developer',
      'AI Developer',
      'Prompt Engineer',
      'IT Risk Analyst',
      'IT Governance',
      'IT Support Specialist',
      'Technology Professional'
    ],
    loop: true,
    typeSpeed: 70,
    backSpeed: 40,
    backDelay: 1800,
    smartBackspace: true,
  });
}

/* ----- SCROLL REVEAL ----- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.08, rootMargin: '0px 0px -50px 0px' }
);

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

/* ----- STATS COUNTER ANIMATION ----- */
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 1800;
  const step = 16;
  const increment = target / (duration / step);
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    const display = Number.isInteger(target) ? Math.floor(current) : current.toFixed(2);
    el.textContent = prefix + display + suffix;
  }, step);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('.stat-num[data-target]').forEach(el => {
  counterObserver.observe(el);
});

/* ----- SMOOTH SCROLL ----- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH = parseInt(getComputedStyle(root).getPropertyValue('--nav-h')) || 76;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ----- CLOSE MOBILE NAV ON OUTSIDE CLICK ----- */
document.addEventListener('click', (e) => {
  if (navMobile && hamburger && navbar) {
    if (!navbar.contains(e.target) && !navMobile.contains(e.target)) {
      hamburger.classList.remove('open');
      navMobile.classList.remove('open');
    }
  }
});

/* ----- ABOUT PHOTO SCROLL FOLLOW (only within #about section) ----- */
(function () {
  const aboutSection  = document.getElementById('about');
  const aboutInner    = aboutSection  ? aboutSection.querySelector('.about-inner')     : null;
  const imageWrap     = aboutInner    ? aboutInner.querySelector('.about-image-wrap')  : null;
  const navbar        = document.getElementById('navbar');

  if (!aboutSection || !aboutInner || !imageWrap) return;

  function getNavH() {
    return navbar ? navbar.offsetHeight : 80;
  }

  function update() {
    const navH      = getNavH();
    const OFFSET    = navH + 24;          // jarak dari atas viewport ke posisi sticky
    const MARGIN    = 24;                 // jarak aman dari batas bawah section

    const innerRect = aboutInner.getBoundingClientRect();
    const imgH      = imageWrap.offsetHeight;

    // Seberapa jauh kita sudah scroll masuk ke dalam about-inner
    // 0 = tepat di atas inner, positif = sudah scroll masuk
    const scrolledPast = OFFSET - innerRect.top;

    // Batas maksimum: foto tidak boleh melewati batas bawah about-inner
    const maxTranslate = innerRect.height - imgH - MARGIN;

    let translateY = 0;

    if (scrolledPast <= 0) {
      // Belum masuk / tepat di atas: foto di posisi awal
      translateY = 0;
    } else if (scrolledPast >= maxTranslate && maxTranslate > 0) {
      // Sudah mencapai batas bawah: foto berhenti (tidak overlap ke section lain)
      translateY = maxTranslate;
    } else {
      // Dalam rentang about section: ikut scroll 1:1
      translateY = scrolledPast;
    }

    imageWrap.style.transform = `translateY(${translateY}px)`;
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update, { passive: true });
  // Run on load setelah font/image loaded agar offsetHeight akurat
  if (document.readyState === 'complete') {
    update();
  } else {
    window.addEventListener('load', update);
  }
})();

/* ----- PROJECT FILTER ----- */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.filterable-card');

if (filterBtns.length > 0) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        const tags = card.dataset.tags || '';
        if (filter === 'all' || tags.includes(filter)) {
          card.style.display = '';
          card.style.opacity = '0';
          card.style.transform = 'translateY(16px)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}
