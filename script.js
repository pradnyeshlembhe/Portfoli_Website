document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Toggle
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });

  // Close mobile menu on link click
  const mobileLinks = mobileMenu.querySelectorAll('a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  });

  // Scroll Animations (Intersection Observer)
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in').forEach(section => {
    observer.observe(section);
  });

  // Fetch and Render Projects
  const projectsGrid = document.getElementById('projects-grid');
  const projectModal = document.getElementById('project-modal');
  const closeModalBtn = document.getElementById('close-modal');
  let projectsData = [];

  fetch('projects.json')
    .then(response => response.json())
    .then(data => {
      projectsData = data;
      renderProjects(data);
    })
    .catch(error => console.error('Error fetching projects:', error));

  function renderProjects(projects) {
    if (!projectsGrid) return;
    projectsGrid.innerHTML = '';
    projects.forEach(project => {
      const tagsHtml = project.tech.map(tech => 
        `<span class="px-2 py-1 text-xs bg-navy-light text-teal rounded-full">${tech}</span>`
      ).join('');

      const card = document.createElement('article');
      card.className = 'bg-navy-light rounded-xl overflow-hidden shadow-lg hover:shadow-teal/20 transition-all duration-300 transform hover:-translate-y-1 fade-in visible';
      
      card.innerHTML = `
        <div class="h-48 bg-navy border-b border-navy overflow-hidden">
          <img src="${project.image}" alt="${project.title}" class="w-full h-full object-cover transition-transform duration-500 hover:scale-105">
        </div>
        <div class="p-6">
          <h3 class="text-xl font-bold text-white mb-2">${project.title}</h3>
          <p class="text-gray-400 text-sm mb-4 line-clamp-2">${project.summary}</p>
          <div class="flex flex-wrap gap-2 mb-4">
            ${tagsHtml}
          </div>
          <button onclick="openModal('${project.id}')" class="text-teal hover:text-teal-light font-medium text-sm inline-flex items-center transition-colors focus:outline-none focus:ring-2 focus:ring-teal rounded">
            View Details
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>
      `;
      projectsGrid.appendChild(card);
    });
  }

  // Make openModal globally available
  window.openModal = function(projectId) {
    const project = projectsData.find(p => p.id === projectId);
    if (!project) return;

    document.getElementById('modal-title').textContent = project.title;
    document.getElementById('modal-description').textContent = project.details;
    
    const tagsHtml = project.tech.map(tech => 
      `<span class="px-2 py-1 text-xs bg-navy text-teal rounded-full border border-navy-light">${tech}</span>`
    ).join('');
    document.getElementById('modal-tech').innerHTML = tagsHtml;
    
    document.getElementById('modal-link').href = project.link;
    
    const liveLink = document.getElementById('modal-live-link');
    if (liveLink) {
      if (project.live_link) {
        liveLink.href = project.live_link;
        liveLink.classList.remove('hidden');
        liveLink.classList.add('inline-flex');
      } else {
        liveLink.classList.add('hidden');
        liveLink.classList.remove('inline-flex');
      }
    }

    projectModal.showModal();
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');
    
    // Move custom cursor into the modal so it appears in the top layer
    const cursorD = document.getElementById('cursor-dot');
    const cursorO = document.getElementById('cursor-outline');
    if (cursorD && cursorO) {
      projectModal.appendChild(cursorD);
      projectModal.appendChild(cursorO);
    }
  };

  function closeProjectModal() {
    projectModal.close();
    document.body.style.overflow = '';
    document.body.classList.remove('modal-open');
    
    // Move custom cursor back to the body
    const cursorD = document.getElementById('cursor-dot');
    const cursorO = document.getElementById('cursor-outline');
    if (cursorD && cursorO) {
      document.body.appendChild(cursorD);
      document.body.appendChild(cursorO);
    }
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeProjectModal);
  }

  const modalBackBtn = document.getElementById('modal-back-btn');
  if (modalBackBtn) {
    modalBackBtn.addEventListener('click', closeProjectModal);
  }

  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      const dialogDimensions = projectModal.getBoundingClientRect();
      if (
        e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom
      ) {
        closeProjectModal();
      }
    });
  }
});

// --- Custom Cursor Logic ---
const cursorDot = document.getElementById('cursor-dot');
const cursorOutline = document.getElementById('cursor-outline');

if (cursorDot && cursorOutline) {
  let mouseX = 0;
  let mouseY = 0;
  let outlineX = 0;
  let outlineY = 0;

  // Track mouse movement
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // The inner dot instantly follows the cursor
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  // Smooth trailing animation for the outline ring
  function animateCursor() {
    let ease = 0.15;
    outlineX += (mouseX - outlineX) * ease;
    outlineY += (mouseY - outlineY) * ease;
    
    cursorOutline.style.left = `${outlineX}px`;
    cursorOutline.style.top = `${outlineY}px`;
    
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Add click animation (mousedown/mouseup)
  window.addEventListener('mousedown', () => {
    document.body.classList.add('cursor-click');
  });
  
  window.addEventListener('mouseup', () => {
    document.body.classList.remove('cursor-click');
  });

  // Function to attach hover listeners to interactable elements
  function attachCursorHover() {
    const interactables = document.querySelectorAll('a, button, input, textarea, select');
    interactables.forEach(el => {
      // Remove previous listener if it exists to avoid duplicates
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeave);
      
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });
  }

  function handleMouseEnter() {
    document.body.classList.add('cursor-hover');
  }
  
  function handleMouseLeave() {
    document.body.classList.remove('cursor-hover');
  }

  // Initial attach
  attachCursorHover();

  // Re-attach after dynamic content loads (e.g. projects from JSON)
  const observer = new MutationObserver((mutations) => {
    attachCursorHover();
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
}
