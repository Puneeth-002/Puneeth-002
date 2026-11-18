/**
 * Puneeth s gowda - Video Editor Portfolio
 * Interactive Features & Accessibility Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileNav();
  initFilterTabs();
  initVideoModal();
  initEmailCopy();
  initContactForm();
  initBackToTop();
});

/**
 * 1. Header scroll visual elevation
 */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * 2. Accessible Mobile Navigation
 */
function initMobileNav() {
  const toggleBtn = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !mobileNav) return;

  const toggleMenu = (isOpen) => {
    const expand = isOpen !== undefined ? isOpen : toggleBtn.getAttribute('aria-expanded') !== 'true';
    toggleBtn.setAttribute('aria-expanded', String(expand));
    mobileNav.setAttribute('aria-hidden', String(!expand));
    if (expand) {
      mobileNav.classList.add('open');
    } else {
      mobileNav.classList.remove('open');
    }
  };

  toggleBtn.addEventListener('click', () => toggleMenu());

  navLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!toggleBtn.contains(e.target) && !mobileNav.contains(e.target) && mobileNav.classList.contains('open')) {
      toggleMenu(false);
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      toggleMenu(false);
      toggleBtn.focus();
    }
  });
}

/**
 * 3. Showreel Category Filtering
 */
function initFilterTabs() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const videoCards = document.querySelectorAll('.video-card');

  if (!filterBtns.length || !videoCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      videoCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue || category?.includes(filterValue)) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.transition = 'opacity 0.25s ease';
            card.style.opacity = '1';
          }, 10);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/**
 * 4. Accessible Video Modal / Lightbox
 */
function initVideoModal() {
  const modal = document.getElementById('videoModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const triggerElements = document.querySelectorAll('[data-video-trigger]');
  const playerContainer = document.getElementById('modalPlayerContainer');
  const modalTitle = document.getElementById('modalVideoTitle');
  const modalCategory = document.getElementById('modalVideoCategory');
  const modalNotes = document.getElementById('modalVideoNotes');

  if (!modal || !closeBtn) return;

  let lastFocusedElement = null;

  const openModal = (data) => {
    lastFocusedElement = document.activeElement;

    // Set text details
    if (modalTitle) modalTitle.textContent = data.title || 'Video Preview';
    if (modalCategory) modalCategory.textContent = data.category || 'Portfolio Work';
    if (modalNotes) modalNotes.textContent = data.notes || 'Pacing, cut timing, and clean transitions.';

    // Populate media player
    if (playerContainer) {
      if (data.url && (data.url.includes('youtube.com') || data.url.includes('youtu.be') || data.url.includes('vimeo.com'))) {
        // Embed YouTube / Vimeo iframe
        playerContainer.innerHTML = `
          <iframe 
            src="${escapeHtml(data.url)}" 
            title="${escapeHtml(data.title)}" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
          </iframe>
        `;
      } else if (data.url && data.url.endsWith('.mp4')) {
        // Direct HTML5 Video
        playerContainer.innerHTML = `
          <video controls autoplay playsinline style="width:100%; height:100%; object-fit:contain; background:#000;">
            <source src="${escapeHtml(data.url)}" type="video/mp4">
            Your browser does not support HTML5 video.
          </video>
        `;
      } else {
        // Cinematic interactive placeholder preview with quick play guide
        playerContainer.innerHTML = `
          <div class="modal-placeholder-preview">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            <div style="max-width: 440px;">
              <h4 style="font-size: 1.15rem; color: #f5f4ef; margin-bottom: 0.4rem;">${escapeHtml(data.title || 'Video Placeholder')}</h4>
              <p style="font-size: 0.88rem; color: #c8c5bc; line-height: 1.5; margin-bottom: 1rem;">
                This is a placeholder card ready for your video. When you edit <code>index.html</code>, replace <code>data-video-url</code> with your YouTube, Vimeo, or MP4 link!
              </p>
              <span class="modal-helper-tip">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                Easy edit: find [${escapeHtml(data.id || 'card')}] in index.html
              </span>
            </div>
          </div>
        `;
      }
    }

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  };

  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (playerContainer) {
      playerContainer.innerHTML = '';
    }
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  };

  // Attach click to all trigger elements
  triggerElements.forEach(elem => {
    elem.addEventListener('click', (e) => {
      e.preventDefault();
      const card = elem.closest('.video-card') || elem.closest('.hero-preview-card') || elem;
      const data = {
        id: card.getAttribute('data-id') || 'video',
        title: card.getAttribute('data-title') || card.querySelector('.card-title, h4')?.textContent?.trim(),
        category: card.getAttribute('data-category-label') || card.querySelector('.card-badge-top-left, .preview-tag')?.textContent?.trim(),
        notes: card.getAttribute('data-notes') || card.querySelector('.card-desc')?.textContent?.trim(),
        url: card.getAttribute('data-video-url') || ''
      };
      openModal(data);
    });
  });

  closeBtn.addEventListener('click', closeModal);

  // Close on backdrop click outside modal-dialog
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close on ESC key & keyboard trap
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });
}

/**
 * 5. One-Click Email Copy to Clipboard
 */
function initEmailCopy() {
  const copyBtn = document.getElementById('copyEmailBtn');
  const emailTextElem = document.getElementById('emailText');

  if (!copyBtn || !emailTextElem) return;

  copyBtn.addEventListener('click', async () => {
    const emailToCopy = emailTextElem.textContent.trim();
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(emailToCopy);
      } else {
        // Fallback for non-secure / local context
        const tempInput = document.createElement('input');
        tempInput.value = emailToCopy;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }

      const originalHtml = copyBtn.innerHTML;
      copyBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        Copied!
      `;
      copyBtn.style.color = '#4ade80';

      setTimeout(() => {
        copyBtn.innerHTML = originalHtml;
        copyBtn.style.color = '';
      }, 2200);
    } catch (err) {
      console.warn('Clipboard copy failed:', err);
    }
  });
}

/**
 * 6. Contact Form Validation & Friendly Confirmation
 */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const alertBox = document.getElementById('formAlert');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('formName');
    const emailInput = document.getElementById('formEmail');
    const messageInput = document.getElementById('formMessage');

    if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending...';

    // Simulate sending without external backend dependency
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
      form.reset();

      if (alertBox) {
        alertBox.className = 'form-alert success';
        alertBox.innerHTML = `
          <strong>Thank you!</strong> Your message placeholder was sent. Puneeth will review it and reply soon.
        `;
        alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 600);
  });
}

/**
 * 7. Back to Top Smooth Scroll
 */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  backToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * Helper to prevent XSS in modal output
 */
function escapeHtml(string) {
  if (!string) return '';
  return String(string)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
