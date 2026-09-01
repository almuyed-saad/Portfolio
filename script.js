// =====================
// NAVBAR
// =====================

const navbar     = document.getElementById('navbar');
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const navLinks   = document.querySelectorAll('.nav-link');
const mobileLinks = document.querySelectorAll('.mobile-link');

function closeMobileMenu(restoreFocus = false) {
  mobileMenu.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  mobileMenu.setAttribute('aria-hidden', 'true');
  if (restoreFocus) hamburger.focus();
}

const currentYear = document.getElementById('currentYear');
if (currentYear) currentYear.textContent = new Date().getFullYear();

// Scroll: add .scrolled class after 20px
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  updateActiveLink();
});

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
  mobileMenu.setAttribute('aria-hidden', String(!isOpen));
});
// Close mobile menu when a link is clicked
mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    closeMobileMenu();
  });
});
// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) closeMobileMenu();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
    closeMobileMenu(true);
  }
});

// Active link highlight based on scroll position
function updateActiveLink() {
  const sections = ['about', 'projects', 'automation', 'skills', 'contact'];
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
  'automation workflows.',


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

const PROJECTS_PER_PAGE = 6;
let allProjects = [];
let currentFilter = 'all';
let visibleCount = PROJECTS_PER_PAGE;

async function loadProjects() {
  try {
    const res  = await fetch('data/projects.json');
    const data = await res.json();
    allProjects = data;
    const projectCount = document.getElementById('activeProjectsCount');
    const liveProjectCount = document.getElementById('liveProjectsCount');
    const caseStudyCount = document.getElementById('caseStudiesCount');
    if (projectCount) projectCount.textContent = allProjects.length;
    if (liveProjectCount) {
      liveProjectCount.textContent = allProjects.filter(project => project.status === 'Live').length;
    }
    if (caseStudyCount) {
      caseStudyCount.textContent = allProjects.filter(project => project.caseStudy).length;
    }
    renderProjects();
    initFilter();
  } catch (err) {
    console.error('Could not load projects:', err);
  }
}

function getFilteredProjects() {
  if (currentFilter === 'all') return allProjects;
  if (currentFilter === 'featured') return allProjects.filter(p => p.featured);
  return allProjects.filter(p => p.status === currentFilter);
}

function createProjectCard(p, index = 0) {
  const sourceLink = p.source === 'private'
    ? `<span class="project-link project-link-disabled" aria-label="Private source code">Private Source</span>`
    : `<a href="${p.github}" target="_blank" rel="noopener" class="project-link">GitHub</a>`;

  return `
    <article class="project-card${p.featured ? ' project-card-featured' : ''}" data-status="${p.status}" data-featured="${Boolean(p.featured)}" style="--card-index: ${index}">
      <div class="project-cover-wrap">
        <img
          src="${p.image}"
          alt="${p.title} screenshot"
          class="project-cover"
          loading="lazy"
          width="1200"
          height="675"
          decoding="async"
          onerror="this.hidden=true; this.parentElement.classList.add('project-cover-fallback')"
        />
      </div>
      <div class="project-body">
        <div class="project-card-meta">
          <span class="project-status ${p.status === 'Live' ? 'live' : 'in-progress'}">
            <span class="status-dot"></span>
            ${p.status}
          </span>
          ${p.featured ? '<span class="project-featured">Featured</span>' : ''}
        </div>
        <p class="project-category">${p.category || 'Project'}</p>
        <h3 class="project-title">${p.title}</h3>
        <p class="project-desc">${p.description}</p>
        <div class="project-tags">
          ${p.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}
        </div>
        <div class="project-links">
          ${sourceLink}
          ${p.caseStudy ? `
          <button type="button" class="project-link case-study-btn" data-project-id="${p.id}" aria-label="Open case study for ${p.title}">
            Case Study
          </button>` : ''}
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
    </article>
  `;
}

function renderProjects() {
  const grid = document.getElementById('projectsGrid');
  const filtered = getFilteredProjects();
  const toShow = filtered.slice(0, visibleCount);

  grid.innerHTML = toShow.map((p, index) => createProjectCard(p, index)).join('');
  initCaseStudyButtons();

  // Update load more button
  updateLoadMoreBtn(filtered.length);
}

function initCaseStudyButtons() {
  document.querySelectorAll('.case-study-btn').forEach(button => {
    button.addEventListener('click', () => {
      const project = allProjects.find(item => String(item.id) === button.dataset.projectId);
      if (project?.caseStudy) openCaseStudy(project);
    });
  });
}

function openCaseStudy(project) {
  let dialog = document.getElementById('caseStudyDialog');
  if (!dialog) {
    dialog = document.createElement('dialog');
    dialog.id = 'caseStudyDialog';
    dialog.className = 'case-study-dialog';
    dialog.setAttribute('aria-labelledby', 'caseStudyTitle');
    dialog.innerHTML = `
      <div class="case-study-panel">
        <button type="button" class="case-study-close" aria-label="Close case study">×</button>
        <p class="section-label">Project case study</p>
        <h2 id="caseStudyTitle" class="case-study-title"></h2>
        <p class="case-study-category"></p>
        <div class="case-study-grid">
          <section><h3>Problem</h3><p data-case-study="problem"></p></section>
          <section><h3>My role</h3><p data-case-study="role"></p></section>
          <section><h3>Result</h3><p data-case-study="result"></p></section>
          <section><h3>Highlights</h3><ul data-case-study="highlights"></ul></section>
        </div>
        <div class="case-study-actions"></div>
      </div>
    `;
    document.body.appendChild(dialog);
    dialog.querySelector('.case-study-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target === dialog) dialog.close();
    });
  }

  const study = project.caseStudy;
  dialog.querySelector('#caseStudyTitle').textContent = project.title;
  dialog.querySelector('.case-study-category').textContent = project.category || 'Project';
  dialog.querySelector('[data-case-study="problem"]').textContent = study.problem;
  dialog.querySelector('[data-case-study="role"]').textContent = study.role;
  dialog.querySelector('[data-case-study="result"]').textContent = study.result;
  dialog.querySelector('[data-case-study="highlights"]').innerHTML = study.highlights.map(item => `<li>${item}</li>`).join('');
  dialog.querySelector('.case-study-actions').innerHTML = `${project.live ? `<a href="${project.live}" target="_blank" rel="noopener" class="btn-primary">Open live demo</a>` : ''}${project.github && project.source !== 'private' ? `<a href="${project.github}" target="_blank" rel="noopener" class="btn-secondary">View source</a>` : ''}`;
  dialog.showModal();
}

function updateLoadMoreBtn(totalFiltered) {
  let btn = document.getElementById('loadMoreBtn');

  if (!btn) {
    btn = document.createElement('div');
    btn.id = 'loadMoreBtn';
    btn.innerHTML = `
      <button class="load-more-btn">
        Load More
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
    `;
    document.getElementById('projectsGrid').after(btn);

    btn.querySelector('button').addEventListener('click', () => {
      visibleCount += PROJECTS_PER_PAGE;
      renderProjects();
    });
  }

  // Show or hide based on remaining projects
  if (visibleCount >= totalFiltered) {
    btn.style.display = 'none';
  } else {
    btn.style.display = 'flex';
  }
}

function initEmailCopy() {
  const button = document.querySelector('.copy-email-btn');
  const status = document.getElementById('copyEmailStatus');
  if (!button || !status) return;

  button.addEventListener('click', async () => {
    const email = button.dataset.email;
    try {
      await navigator.clipboard.writeText(email);
      status.textContent = 'Email copied';
    } catch {
      status.textContent = email;
    }
    window.setTimeout(() => { status.textContent = ''; }, 2200);
  });
}

function initFilter() {
  const btns = document.querySelectorAll('.filter-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      currentFilter = btn.dataset.filter;
      visibleCount = PROJECTS_PER_PAGE; // reset count on filter change
      renderProjects();
    });
  });
}

loadProjects();
initEmailCopy();

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

// =====================
// AUTOMATION & WORKFLOWS
// =====================

async function loadAutomations() {
  try {
    const res = await fetch('data/automations.json');
    const data = await res.json();
    renderAutomations(data);
  } catch (err) {
    console.error('Could not load automations:', err);
  }
}

function createAutomationCard(a, i) {
  const primaryImage = a.images[0];
  const imageCount = a.images.length;
  return `
    <article class="automation-card">
      <div class="automation-card-image">
        <img src="${primaryImage}" alt="${a.title} workflow screenshot" class="automation-card-image-primary" loading="lazy" onerror="this.hidden=true; this.parentElement.classList.add('image-fallback')"/>
        <div class="automation-card-image-shine" aria-hidden="true"></div>
        <span class="automation-image-count">${imageCount} ${imageCount === 1 ? 'view' : 'views'}</span>
      </div>
      <div class="automation-card-body">
        <p class="automation-card-kicker">n8n workflow ${String(i + 1).padStart(2, '0')}</p>
        <h3 class="automation-card-title">${a.title}</h3>
        <p class="automation-card-description">${a.description}</p>
        <div class="automation-card-tags">${a.tags.map(t => `<span class="automation-tag">${t}</span>`).join('')}</div>
        <button class="automation-toggle" type="button" data-i="${i}" aria-expanded="false" aria-controls="case-${i}">
          <span class="automation-toggle-label">Read case study</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <p class="automation-case" id="case-${i}">${a.case_study}</p>
        <div class="automation-card-links">
          <a href="${a.github}" target="_blank" rel="noopener" class="automation-link automation-link-primary">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/></svg>
            View on GitHub
          </a>
        </div>
      </div>
    </article>
  `;
}

function renderAutomations(list) {
  const grid = document.getElementById('automationGrid');
  grid.innerHTML = list.map((a, i) => createAutomationCard(a, i)).join('');

  document.querySelectorAll('.automation-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = btn.dataset.i;
      const caseEl = document.getElementById(`case-${i}`);
      const isOpen = caseEl.classList.toggle('open');
      btn.classList.toggle('open', isOpen);
      btn.setAttribute('aria-expanded', String(isOpen));
      btn.querySelector('.automation-toggle-label').textContent = isOpen ? 'Hide case study' : 'Read case study';
    });
  });
}

loadAutomations();