/* ═══════════════════════════════════════════════
   FORENSIC CASE: INTRACRANIAL HEMORRHAGE
   main.js — Interactions & Animations
═══════════════════════════════════════════════ */

// ── Evidence data ──
const evidenceData = [
  {
    exhibit: 'EXHIBIT #01',
    src: 'img/page1.jpg',
    title: 'HEMORRHAGE CLASSIFICATION MAP — ANATOMY REFERENCE',
    alt: 'Intracranial Hemorrhage Classification Anatomy'
  },
  {
    exhibit: 'EXHIBIT #02',
    src: 'img/page2.jpg',
    title: 'NON-TRAUMATIC CT HEAD HEMORRHAGE VARIANTS',
    alt: 'Non-Traumatic Brain Hemorrhage CT'
  },
  {
    exhibit: 'EXHIBIT #03',
    src: 'img/page3.jpg',
    title: 'DIFFERENTIAL COMPARISON MATRIX — ALL SUBTYPES',
    alt: 'Hemorrhage Type Comparison Table'
  },
  {
    exhibit: 'EXHIBIT #04',
    src: 'img/page4.jpg',
    title: 'ML CLASSIFICATION PIPELINE — FEATURE EXTRACTION',
    alt: 'AI Classification Pipeline'
  }
];

let currentEvidenceIndex = 0;
let isZoomed = false;

// ── SCAN LOADER → reveal hero ──
window.addEventListener('load', () => {
  const loader = document.getElementById('scanLoader');
  const heroText = document.getElementById('heroText');
  const fp = document.getElementById('fingerprintWrap');

  setTimeout(() => {
    loader.style.opacity = '0';
    loader.style.transition = 'opacity 0.4s';
    setTimeout(() => {
      loader.style.display = 'none';
      heroText.style.display = 'block';
    }, 400);
  }, 2200);
});

// ── NAVBAR scroll effect ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.style.borderBottomColor = 'rgba(192,57,43,0.5)';
    navbar.style.background = 'rgba(8,10,12,0.98)';
  } else {
    navbar.style.borderBottomColor = 'rgba(192,57,43,0.3)';
    navbar.style.background = 'rgba(8,10,12,0.92)';
  }
});

// ── INTERSECTION OBSERVER for animations ──
const observerOptions = { threshold: 0.12 };

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;

      // Staggered delay via data attribute
      const delay = parseInt(el.getAttribute('data-delay') || 0);
      setTimeout(() => {
        el.classList.add('visible');
        if (el.classList.contains('overview-card')) {
          el.style.setProperty('--d', delay);
        }
      }, delay);

      observer.unobserve(el);
    }
  });
}, observerOptions);

// Observe all animatable elements
document.querySelectorAll(
  '.overview-card, .evidence-card, .analysis-item, .conclusion-item'
).forEach((el, i) => {
  if (!el.hasAttribute('data-delay')) {
    el.setAttribute('data-delay', i * 80);
  }
  observer.observe(el);
});

// ── MODAL ──
function openModal(index) {
  currentEvidenceIndex = index;
  isZoomed = false;
  renderModal();

  const overlay = document.getElementById('modalOverlay');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function renderModal() {
  const data = evidenceData[currentEvidenceIndex];
  const img = document.getElementById('modalImg');
  const exhibit = document.getElementById('modalExhibit');
  const title = document.getElementById('modalTitle');

  // Scan transition
  img.style.opacity = '0';
  img.style.transition = 'opacity 0.3s';
  img.classList.remove('zoomed');
  isZoomed = false;

  setTimeout(() => {
    img.src = data.src;
    img.alt = data.alt;
    img.onload = () => {
      img.style.opacity = '1';
    };
    // fallback if cached
    if (img.complete) img.style.opacity = '1';
  }, 150);

  exhibit.textContent = data.exhibit;
  title.textContent = data.title;
}

function closeModal() {
  const overlay = document.getElementById('modalOverlay');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
  isZoomed = false;
  document.getElementById('modalImg').classList.remove('zoomed');
}

function nextEvidence() {
  currentEvidenceIndex = (currentEvidenceIndex + 1) % evidenceData.length;
  renderModal();
}

function prevEvidence() {
  currentEvidenceIndex = (currentEvidenceIndex - 1 + evidenceData.length) % evidenceData.length;
  renderModal();
}

// ── Modal image ZOOM on click ──
document.getElementById('modalImg').addEventListener('click', () => {
  const img = document.getElementById('modalImg');
  isZoomed = !isZoomed;
  img.classList.toggle('zoomed', isZoomed);
  img.style.cursor = isZoomed ? 'zoom-out' : 'zoom-in';
});

// ── Keyboard navigation ──
document.addEventListener('keydown', (e) => {
  const overlay = document.getElementById('modalOverlay');
  if (!overlay.classList.contains('active')) return;

  switch (e.key) {
    case 'Escape': closeModal(); break;
    case 'ArrowRight': nextEvidence(); break;
    case 'ArrowLeft': prevEvidence(); break;
  }
});

// ── RISK BARS — animate on scroll ──
const riskObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fills = entry.target.querySelectorAll('.risk-fill');
      fills.forEach(fill => {
        const w = fill.style.width;
        fill.style.width = '0';
        requestAnimationFrame(() => {
          setTimeout(() => { fill.style.width = w; }, 100);
        });
      });
      riskObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.analysis-item').forEach(el => riskObserver.observe(el));

// ── ACTIVE nav link highlight ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.style.color = 'var(--accent-hot)';
        }
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => navObserver.observe(s));

// ── Cursor crosshair on evidence images ──
document.querySelectorAll('.ev-image-wrap').forEach(wrap => {
  wrap.style.cursor = 'crosshair';
});

// ── Console easter egg ──
console.log('%c[ICH//FORENSICS] CASE FILE ACTIVE', 'color:#ff2222;font-family:monospace;font-size:14px;font-weight:bold;');
console.log('%cAll evidence has been logged under case #ICH-2024-001', 'color:#7a9aaa;font-family:monospace;font-size:11px;');
