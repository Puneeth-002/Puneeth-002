/**
 * Puneeth s gowda — Film Journal Portfolio
 * Interactive Timeline Scrubber, Contact Sheet, Modal & Accessibility Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  initTimelinePlayhead();
  initHeaderScroll();
  initMobileNav();
  initPortraitParallax();
  initScrollReveals();
  initSelectedWorkPlayhead();
  initCardVideoHover();
  initHeroScrollCue();
  initContactSheetFilters();
  initVideoModal();
  initEmailCopy();
  initContactForm();
  initBackToTop();
  initSwarmIntegration();
});

/**
 * 1. Persistent Timeline Scrubber & Live Timecode Tracker
 * Updates scrubber width and timecode as visitor scrolls through the portfolio.
 */
function initTimelinePlayhead() {
  const progressBar = document.getElementById('playheadProgress');
  const timecodeElements = document.querySelectorAll('.live-timecode');

  const updateScrubber = () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progressRatio = docHeight > 0 ? Math.min(Math.max(scrollY / docHeight, 0), 1) : 0;
    const progressPercent = (progressRatio * 100).toFixed(2);

    if (progressBar) {
      progressBar.style.width = `${progressPercent}%`;
    }

    // Convert progress ratio into a 5-minute reel simulated timecode [00:MM:SS:FF]
    // 300 total seconds (5 minutes) @ 24 fps
    const totalFrames = Math.floor(progressRatio * 300 * 24);
    const frames = String(totalFrames % 24).padStart(2, '0');
    const totalSeconds = Math.floor(totalFrames / 24);
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const tcString = `00:${minutes}:${seconds}:${frames}`;

    timecodeElements.forEach(el => {
      el.textContent = tcString;
    });
  };

  window.addEventListener('scroll', updateScrubber, { passive: true });
  window.addEventListener('resize', updateScrubber, { passive: true });
  updateScrubber();
}

/**
 * 2. Header background styling on scroll
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
 * 3. Accessible Mobile Navigation
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

  document.addEventListener('click', (e) => {
    if (!toggleBtn.contains(e.target) && !mobileNav.contains(e.target) && mobileNav.classList.contains('open')) {
      toggleMenu(false);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      toggleMenu(false);
      toggleBtn.focus();
    }
  });
}

/**
 * 4. Subtle Portrait Movement on Scroll (Slow zoom & gentle parallax, zero layout shift)
 */
function initPortraitParallax() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const portrait = document.getElementById('heroPortraitImg');
  const heroSection = document.getElementById('hero');
  if (!portrait || !heroSection) return;

  let ticking = false;

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const heroRect = heroSection.getBoundingClientRect();
        // Check if hero is within or partially visible in viewport
        if (heroRect.bottom > 0 && heroRect.top < window.innerHeight) {
          const scrollDistance = Math.max(-heroRect.top, 0);
          const maxScroll = heroSection.offsetHeight || window.innerHeight;
          const progress = Math.min(scrollDistance / maxScroll, 1);

          // Gentle slow zoom (1.000 to 1.055) and subtle vertical parallax shift (up to 14px)
          const scale = (1 + progress * 0.055).toFixed(3);
          const translateY = (progress * 14).toFixed(1);

          portrait.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
        }
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/**
 * 5. Contact Sheet Category Filtering
 */
function initContactSheetFilters() {
  const filterBtns = document.querySelectorAll('.sheet-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
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
 * 6. Accessible Video Lightbox / Modal
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

    if (modalTitle) modalTitle.textContent = data.title || 'Video Preview';
    if (modalCategory) modalCategory.textContent = data.category || 'Selected Work';
    if (modalNotes) modalNotes.textContent = data.notes || 'Pacing, sound design, and cut timing.';

    if (playerContainer) {
      if (data.url && (data.url.includes('youtube.com') || data.url.includes('youtu.be') || data.url.includes('vimeo.com'))) {
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
        // Muted by default with clear control to enable audio
        playerContainer.innerHTML = `
          <video controls playsinline style="width:100%; height:100%; object-fit:contain; background:#000;">
            <source src="${escapeHtml(data.url)}" type="video/mp4">
            Your browser does not support HTML5 video.
          </video>
        `;
      } else {
        // Film-Journal Style Preview Prompt
        playerContainer.innerHTML = `
          <div class="modal-placeholder-preview">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color: var(--accent);">
              <circle cx="12" cy="12" r="10"></circle>
              <polygon points="10 8 16 12 10 16 10 8" fill="var(--accent)"></polygon>
            </svg>
            <div style="max-width: 480px;">
              <h4 style="font-size: 1.15rem; color: #f8f7f2; margin-bottom: 0.5rem; font-weight: 700;">${escapeHtml(data.title || 'Project Preview')}</h4>
              <p style="font-size: 0.9rem; color: #bab6aa; line-height: 1.55; margin-bottom: 1.25rem;">
                This project card is ready for your footage. To display your actual video, open <code>index.html</code> and update <code>data-video-url</code> with your YouTube embed, Vimeo link, or local <code>.mp4</code> file!
              </p>
              <span class="modal-helper-tip">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                Find [${escapeHtml(data.id || 'card')}] in index.html to insert your link
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

  triggerElements.forEach(elem => {
    elem.addEventListener('click', (e) => {
      e.preventDefault();
      const card = elem.closest('.project-card') || elem.closest('.film-monitor-frame') || elem;
      const data = {
        id: card.getAttribute('data-id') || 'project',
        title: card.getAttribute('data-title') || card.querySelector('.card-project-title, h4')?.textContent?.trim(),
        category: card.getAttribute('data-category-label') || card.querySelector('.card-project-type, .frame-role-tag')?.textContent?.trim(),
        notes: card.getAttribute('data-notes') || card.querySelector('.card-project-desc')?.textContent?.trim(),
        url: card.getAttribute('data-video-url') || ''
      };
      openModal(data);
    });
  });

  closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });
}

/**
 * 7. One-Click Copy Email to Clipboard
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
        const tempInput = document.createElement('input');
        tempInput.value = emailToCopy;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }

      const originalHtml = copyBtn.innerHTML;
      copyBtn.innerHTML = `
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        COPIED!
      `;
      copyBtn.style.color = '#4ade80';

      setTimeout(() => {
        copyBtn.innerHTML = originalHtml;
        copyBtn.style.color = '';
      }, 2200);
    } catch (err) {
      console.warn('Clipboard copy error:', err);
    }
  });
}

/**
 * 8. Contact Form Validation & Friendly Confirmation
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

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
      form.reset();

      if (alertBox) {
        alertBox.className = 'form-alert success';
        alertBox.innerHTML = `
          <strong>Message received!</strong> Thanks for reaching out. Puneeth will review your project details and get back to you shortly.
        `;
        alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 550);
  });
}

/**
 * 9. Back To Top Action
 */
function initBackToTop() {
  const btn = document.getElementById('backToTopBtn');
  if (!btn) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

function escapeHtml(string) {
  if (!string) return '';
  return String(string)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * 10. Accessible Scroll Reveals with IntersectionObserver
 * Triggered once per element. Content remains visible if IntersectionObserver or JS is unavailable.
 */
function initScrollReveals() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced || !('IntersectionObserver' in window)) {
    // Unsupported or reduced motion requested: content remains fully visible by default
    return;
  }

  document.documentElement.classList.add('js-reveal-active');
  const revealItems = document.querySelectorAll('.reveal-item');

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target); // Trigger each reveal once
      }
    });
  }, {
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.08
  });

  revealItems.forEach(el => observer.observe(el));
}

/**
 * 11. Section Editing Playhead / Timeline Detail
 * Thin animated playhead that tracks progress specifically as visitor scrolls through #selected-work
 */
function initSelectedWorkPlayhead() {
  const section = document.getElementById('selected-work');
  const progressBar = document.getElementById('workTimelineProgressBar');
  const needle = document.getElementById('workPlayheadNeedle');
  const timecodeEl = document.getElementById('workPlayheadTimecode');

  if (!section || !progressBar || !needle) return;

  const updatePlayhead = () => {
    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Track scroll through the selected work section
    const startOffset = windowHeight * 0.75;
    const totalDistance = rect.height + startOffset - windowHeight * 0.25;
    const currentDistance = startOffset - rect.top;

    const progressRatio = totalDistance > 0 ? Math.min(Math.max(currentDistance / totalDistance, 0), 1) : 0;
    const progressPercent = (progressRatio * 100).toFixed(2);

    progressBar.style.width = `${progressPercent}%`;
    needle.style.left = `${progressPercent}%`;

    if (timecodeEl) {
      // 5-minute reel @ 24fps
      const totalFrames = Math.floor(progressRatio * 300 * 24);
      const frames = String(totalFrames % 24).padStart(2, '0');
      const totalSeconds = Math.floor(totalFrames / 24);
      const seconds = String(totalSeconds % 60).padStart(2, '0');
      const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
      timecodeEl.textContent = `00:${minutes}:${seconds}:${frames}`;
    }
  };

  window.addEventListener('scroll', updatePlayhead, { passive: true });
  window.addEventListener('resize', updatePlayhead, { passive: true });
  updatePlayhead();
}

/**
 * 12. Project Card Video Hover & Keyboard Focus Interactions
 * Plays muted video preview on hover / focus-within; pauses and rewinds on leave.
 * Safe on touch screens and never autoplays audio.
 */
function initCardVideoHover() {
  const cards = document.querySelectorAll('.project-card');
  const canHover = window.matchMedia('(hover: hover)').matches;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  cards.forEach(card => {
    const video = card.querySelector('video.card-hover-video');
    if (!video) return;

    // Strict audio rule: Audio MUST NOT autoplay
    video.muted = true;
    video.setAttribute('muted', '');

    // Allow touch screens to navigate and tap without hover conflicts
    if (!canHover || prefersReduced) return;

    let playPromise = null;

    const startVideo = () => {
      // Check if video has a valid source or needs attribute source
      if (!video.src && !video.querySelector('source[src]:not([src=""])')) {
        const previewUrl = card.getAttribute('data-preview-video') ||
          (card.getAttribute('data-video-url')?.endsWith('.mp4') ? card.getAttribute('data-video-url') : null);
        if (previewUrl) {
          video.src = previewUrl;
        } else {
          return;
        }
      }

      video.muted = true;
      card.classList.add('video-preview-active');
      playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Handled gracefully if browser blocks or video missing
        });
      }
    };

    const stopVideo = () => {
      card.classList.remove('video-preview-active');
      if (playPromise !== undefined) {
        playPromise.then(() => {
          video.pause();
          try { video.currentTime = 0; } catch (e) {}
        }).catch(() => {
          video.pause();
        });
      } else {
        video.pause();
        try { video.currentTime = 0; } catch (e) {}
      }
    };

    card.addEventListener('mouseenter', startVideo);
    card.addEventListener('mouseleave', stopVideo);
    card.addEventListener('focusin', startVideo);
    card.addEventListener('focusout', stopVideo);
  });
}

/**
 * 13. Hero Scroll Cue Click Handler
 */
function initHeroScrollCue() {
  const cue = document.getElementById('heroScrollCue');
  const target = document.getElementById('selected-work');
  if (!cue || !target) return;

  cue.addEventListener('click', (e) => {
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
}

/**
 * 14. Swarm Cursors Rebuild Integration
 * Triggers multiplayer cursor animation with flocking physics, guides, and synthesized audio.
 * Shortcuts: Alt+Shift+S, Esc to exit, M for sound, H to hide controls.
 */
function initSwarmIntegration() {
  const triggerSwarm = (e) => {
    if (e) e.preventDefault();
    if (window.__swarmRebuild) {
      window.__swarmRebuild.toggle();
    } else {
      console.warn('Swarm Rebuild engine is still loading...');
    }
  };

  const navBtn = document.getElementById('navSwarmBtn');
  const heroBtn = document.getElementById('heroSwarmBtn');
  const mobileBtn = document.getElementById('mobileSwarmBtn');

  if (navBtn) navBtn.addEventListener('click', triggerSwarm);
  if (heroBtn) heroBtn.addEventListener('click', triggerSwarm);
  if (mobileBtn) mobileBtn.addEventListener('click', triggerSwarm);

  // Global Alt+Shift+S shortcut listener
  window.addEventListener('keydown', (e) => {
    if (e.altKey && e.shiftKey && (e.key === 'S' || e.key === 's' || e.code === 'KeyS')) {
      e.preventDefault();
      triggerSwarm();
    }
  });
}
