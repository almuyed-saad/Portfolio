// =====================
// NAVBAR
// =====================

const navbar     = document.getElementById('navbar');
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const navLinks   = document.querySelectorAll('.nav-link');
const mobileLinks = document.querySelectorAll('.mobile-link');

// Scroll: add .scrolled class after 20px
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  updateActiveLink();
});

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});
// Close mobile menu when a link is clicked
mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  });
});
// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  }
});

// Active link highlight based on scroll position
function updateActiveLink() {
  const sections = ['about', 'projects', 'skills', 'contact'];
  const scrollY  = window.scrollY + window.innerHeight / 3;

  sections.forEach(id => {
    const section = document.getElementById(id);
    if (!section) return;

    const top    = section.offsetTop;
    const bottom = top + section.offsetHeight;

    navLinks.forEach(link => {
      if (link.getAttribute('href') === `#${id}`) {
        link.classList.toggle('active', scrollY >= top && scrollY < bottom);
      }
    });
  });
}

// =====================
// HERO — TYPING ANIMATION
// =====================

const roles = [
  'AI systems.',
  'math engines.',
  'web apps.',
  'AI Automations.',


];

const roleDynamic = document.getElementById('roleDynamic');
let roleIndex = 0;
let charIndex  = 0;
let isDeleting = false;

function typeRole() {
  const current = roles[roleIndex];

  if (isDeleting) {
    roleDynamic.textContent = current.slice(0, charIndex - 1);
    charIndex--;
  } else {
    roleDynamic.textContent = current.slice(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 60 : 100;

  if (!isDeleting && charIndex === current.length) {
    delay = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex  = (roleIndex + 1) % roles.length;
    delay = 400;
  }

  setTimeout(typeRole, delay);
}

typeRole();

// =====================
// PROJECTS
// =====================

async function loadProjects() {
  try {
    const res  = await fetch('data/projects.json');
    const data = await res.json();
    renderProjects(data);
    initFilter(data);
  } catch (err) {
    console.error('Could not load projects:', err);
  }
}

function renderProjects(projects) {
  const grid = document.getElementById('projectsGrid');
  grid.innerHTML = projects.map(p => `
    <div class="project-card" data-status="${p.status}">
      <div class="project-cover-wrap">
        <img
          src="${p.image}"
          alt="${p.title} screenshot"
          class="project-cover"
          loading="lazy"
          onerror="this.parentElement.style.display='none'"
        />
      </div>
      <div class="project-body">
        <span class="project-status ${p.status === 'Live' ? 'live' : 'in-progress'}">
          <span class="status-dot"></span>
          ${p.status}
        </span>
        <h3 class="project-title">${p.title}</h3>
        <p class="project-desc">${p.description}</p>
        <div class="project-tags">
          ${p.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}
        </div>
        <div class="project-links">
          <a href="${p.github}" target="_blank" rel="noopener" class="project-link">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/>
            </svg>
            GitHub
          </a>
          ${p.live ? `
          <a href="${p.live}" target="_blank" rel="noopener" class="project-link live-link">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            Live Demo
          </a>` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

function initFilter(data) {
  const btns = document.querySelectorAll('.filter-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      document.querySelectorAll('.project-card').forEach(card => {
        const match = filter === 'all' || card.dataset.status === filter;
        card.classList.toggle('hidden', !match);
      });
    });
  });
}

loadProjects();

// =====================
// SKILLS — SCROLL ENTRANCE
// =====================

const skillCards = document.querySelectorAll('.skill-card');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

skillCards.forEach(card => skillObserver.observe(card));

// =====================
// CONTACT — SCROLL ANIMATIONS
// =====================

const contactObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    // Heading words staggered
    entry.target.querySelectorAll('.ch-word').forEach((word, i) => {
      setTimeout(() => word.classList.add('revealed'), i * 100);
    });

    // Sub, terminal, cards
    entry.target.querySelector('.contact-sub')?.classList.add('revealed');
    entry.target.querySelector('.contact-terminal')?.classList.add('revealed');
    entry.target.querySelectorAll('.social-card').forEach(c => c.classList.add('revealed'));

    contactObserver.unobserve(entry.target);
  });
}, { threshold: 0.15 });

const contactSection = document.getElementById('contact');
if (contactSection) contactObserver.observe(contactSection);