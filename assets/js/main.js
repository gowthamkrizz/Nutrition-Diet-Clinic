/**
 * STACKLY NUTRITION & WELLNESS - MASTER JAVASCRIPT
 * Pure Vanilla JS Interactions, Sliders, Modals & Animations
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ===================================================================
     1. STICKY HEADER & SCROLL EFFECTS (Desktop & Mobile - 60fps rAF)
  =================================================================== */
  const siteHeader = document.querySelector('.site-header');
  const heroNavbar = document.querySelector('.hero-navbar-inner');
  const heroNavWrapper = document.querySelector('.hero-navbar-wrapper');

  let siteHeaderHeight = siteHeader ? siteHeader.offsetHeight : 0;
  let heroNavbarHeight = heroNavbar ? heroNavbar.offsetHeight : 0;
  let siteHeaderPlaceholder = null;
  let isHeroFixed = false;
  let isHeaderSticky = false;
  let scrollTicking = false;

  const measureHeaderHeights = () => {
    if (siteHeader && !isHeaderSticky) {
      siteHeaderHeight = siteHeader.offsetHeight;
    }
    if (heroNavbar && !isHeroFixed) {
      heroNavbarHeight = heroNavbar.offsetHeight;
    }
  };

  const updateScrollHeaders = () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const isMobile = window.innerWidth <= 768;

    // Hysteresis thresholds to avoid layout jitter / rapid toggling
    const enterThreshold = isMobile ? 220 : 70;
    const exitThreshold = isMobile ? 120 : 30;

    // Inner pages sticky header
    if (siteHeader) {
      if (!isHeaderSticky && scrollY > enterThreshold) {
        if (!siteHeaderPlaceholder) {
          siteHeaderPlaceholder = document.createElement('div');
          siteHeaderPlaceholder.className = 'site-header-placeholder';
          siteHeader.parentNode.insertBefore(siteHeaderPlaceholder, siteHeader.nextSibling);
        }
        siteHeaderPlaceholder.style.height = siteHeaderHeight + 'px';
        siteHeaderPlaceholder.style.display = 'block';
        siteHeader.classList.add('is-sticky');
        isHeaderSticky = true;
      } else if (isHeaderSticky && scrollY < exitThreshold) {
        siteHeader.classList.remove('is-sticky');
        if (siteHeaderPlaceholder) {
          siteHeaderPlaceholder.style.display = 'none';
        }
        isHeaderSticky = false;
      }
    }

    // Hero section floating header (index.html)
    if (heroNavbar && heroNavWrapper) {
      if (!isHeroFixed && scrollY > enterThreshold) {
        heroNavWrapper.style.minHeight = heroNavbarHeight + 'px';
        heroNavbar.classList.add('is-fixed');
        isHeroFixed = true;
      } else if (isHeroFixed && scrollY < exitThreshold) {
        heroNavbar.classList.remove('is-fixed');
        heroNavWrapper.style.minHeight = '';
        isHeroFixed = false;
      }
    }

    scrollTicking = false;
  };

  const onScrollThrottled = () => {
    if (!scrollTicking) {
      scrollTicking = true;
      requestAnimationFrame(updateScrollHeaders);
    }
  };

  if (siteHeader || (heroNavbar && heroNavWrapper)) {
    measureHeaderHeights();
    window.addEventListener('scroll', onScrollThrottled, { passive: true });
    window.addEventListener('resize', () => {
      measureHeaderHeights();
      if (siteHeaderPlaceholder && isHeaderSticky) {
        siteHeaderPlaceholder.style.height = siteHeaderHeight + 'px';
      }
      if (heroNavWrapper && isHeroFixed) {
        heroNavWrapper.style.minHeight = heroNavbarHeight + 'px';
      }
    }, { passive: true });
    updateScrollHeaders();
  }

  /* ===================================================================
     2. OFFCANVAS PUSH PANEL
  =================================================================== */
  const offcanvasTriggers = document.querySelectorAll('.js-offcanvas-trigger');
  const offcanvasPanel = document.querySelector('.offcanvas-panel');
  const offcanvasOverlay = document.querySelector('.offcanvas-overlay');
  const offcanvasClose = document.querySelector('.offcanvas-close');

  function openOffcanvas() {
    if (offcanvasPanel && offcanvasOverlay) {
      offcanvasPanel.classList.add('is-active');
      offcanvasOverlay.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeOffcanvas() {
    if (offcanvasPanel && offcanvasOverlay) {
      offcanvasPanel.classList.remove('is-active');
      offcanvasOverlay.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  }

  offcanvasTriggers.forEach(btn => btn.addEventListener('click', openOffcanvas));
  if (offcanvasClose) offcanvasClose.addEventListener('click', closeOffcanvas);
  if (offcanvasOverlay) offcanvasOverlay.addEventListener('click', closeOffcanvas);

  /* ===================================================================
     3. SEARCH POPUP MODAL
  =================================================================== */
  const searchTriggers = document.querySelectorAll('.js-search-trigger');
  const searchModal = document.querySelector('.search-modal');
  const searchOverlay = document.querySelector('.search-overlay');
  const searchClose = document.querySelector('.search-close');
  const searchInput = document.querySelector('.search-input-wrap input');
  const searchTags = document.querySelectorAll('.search-tag');

  function openSearch() {
    if (searchModal && searchOverlay) {
      searchModal.classList.add('is-active');
      searchOverlay.classList.add('is-active');
      document.body.style.overflow = 'hidden';
      setTimeout(() => { if (searchInput) searchInput.focus(); }, 150);
    }
  }

  function closeSearch() {
    if (searchModal && searchOverlay) {
      searchModal.classList.remove('is-active');
      searchOverlay.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  }

  searchTriggers.forEach(btn => btn.addEventListener('click', openSearch));
  if (searchClose) searchClose.addEventListener('click', closeSearch);
  if (searchOverlay) searchOverlay.addEventListener('click', closeSearch);

  if (searchTags.length > 0 && searchInput) {
    searchTags.forEach(tag => {
      tag.addEventListener('click', () => {
        searchInput.value = tag.textContent.trim();
        executeSearch();
      });
    });
  }

  const searchSubmitBtn = document.querySelector('.search-input-wrap button');
  function executeSearch() {
    if (!searchInput) return;
    const query = searchInput.value.trim();
    if (query) {
      window.location.href = `services.html?search=${encodeURIComponent(query)}`;
    } else {
      window.location.href = 'services.html';
    }
  }
  if (searchSubmitBtn) searchSubmitBtn.addEventListener('click', executeSearch);
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        executeSearch();
      }
    });
  }

  /* ===================================================================
     4. VIDEO POPUP MODAL
  =================================================================== */
  const videoTriggers = document.querySelectorAll('.js-video-trigger');
  const videoModal = document.querySelector('.video-modal');
  const videoOverlay = document.querySelector('.video-overlay');
  const videoClose = document.querySelector('.video-modal-close');
  const videoIframe = document.querySelector('.video-modal-inner iframe');

  function openVideo(e) {
    e.preventDefault();
    const videoUrl = this.getAttribute('data-video-url') || 'https://www.youtube.com/embed/ScMzIvxBSi4?autoplay=1';
    if (videoIframe) videoIframe.src = videoUrl;
    if (videoModal && videoOverlay) {
      videoModal.classList.add('is-active');
      videoOverlay.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeVideo() {
    if (videoIframe) videoIframe.src = '';
    if (videoModal && videoOverlay) {
      videoModal.classList.remove('is-active');
      videoOverlay.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  }

  videoTriggers.forEach(btn => btn.addEventListener('click', openVideo));
  if (videoClose) videoClose.addEventListener('click', closeVideo);
  if (videoOverlay) videoOverlay.addEventListener('click', closeVideo);

  /* ===================================================================
     5. FULLSCREEN MOBILE NAVIGATION DRAWER & BACKGROUND SCROLL LOCK
  =================================================================== */
  const mobileToggles = document.querySelectorAll('.mobile-toggle, .js-mobile-toggle, .mobile-menu-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const mobileCloseBtns = document.querySelectorAll('.mobile-drawer-close, .js-mobile-close');
  const mobileOverlay = document.querySelector('.mobile-drawer-overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-drawer .mobile-nav-item a, .mobile-drawer .mobile-drawer-footer a');

  if (mobileDrawer) {
    let isMenuOpen = false;

    // Prevent background scrolling while allowing full scrolling inside mobileDrawer
    const handleTouchMove = (e) => {
      if (!mobileDrawer.contains(e.target)) {
        e.preventDefault();
      }
    };

    const openMobileMenu = () => {
      if (isMenuOpen) return;
      isMenuOpen = true;
      
      mobileDrawer.classList.add('is-active');
      if (mobileOverlay) mobileOverlay.classList.add('is-active');
      mobileToggles.forEach(btn => btn.classList.add('is-active'));
      
      document.body.classList.add('mobile-nav-open');
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
    };

    const closeMobileMenu = () => {
      if (!isMenuOpen) return;
      isMenuOpen = false;
      
      mobileDrawer.classList.remove('is-active');
      if (mobileOverlay) mobileOverlay.classList.remove('is-active');
      mobileToggles.forEach(btn => btn.classList.remove('is-active'));
      
      document.body.classList.remove('mobile-nav-open');
      document.removeEventListener('touchmove', handleTouchMove);
    };

    mobileToggles.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isMenuOpen) {
          closeMobileMenu();
        } else {
          openMobileMenu();
        }
      });
    });

    mobileCloseBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeMobileMenu();
      });
    });

    if (mobileOverlay) {
      mobileOverlay.addEventListener('click', (e) => {
        e.preventDefault();
        closeMobileMenu();
      });
    }

    // Close smoothly when navigating via links
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        closeMobileMenu();
      }
    });

    // Auto-close on resize to desktop (> 992px)
    window.addEventListener('resize', () => {
      if (window.innerWidth > 992 && isMenuOpen) {
        closeMobileMenu();
      }
    }, { passive: true });
  }

  // Mobile Dropdown toggles
  const mobileDropdownTriggers = document.querySelectorAll('.mobile-nav-item.has-dropdown > a');
  mobileDropdownTriggers.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const parent = link.parentElement;
      parent.classList.toggle('is-open');
    });
  });

  /* ===================================================================
     6. FAQ ACCORDION
  =================================================================== */
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const currentItem = header.parentElement;
      const currentContent = currentItem.querySelector('.accordion-content');
      const isOpen = currentItem.classList.contains('is-open');

      // Close all in this list
      const parentList = currentItem.closest('.accordion-list');
      if (parentList) {
        parentList.querySelectorAll('.accordion-item').forEach(item => {
          item.classList.remove('is-open');
          const content = item.querySelector('.accordion-content');
          if (content) content.style.maxHeight = null;
        });
      }

      if (!isOpen) {
        currentItem.classList.add('is-open');
        currentContent.style.maxHeight = currentContent.scrollHeight + 40 + 'px';
      }
    });
  });

  // Open first accordion by default if present
  const firstAccordion = document.querySelector('.accordion-item');
  if (firstAccordion) {
    firstAccordion.classList.add('is-open');
    const firstContent = firstAccordion.querySelector('.accordion-content');
    if (firstContent) firstContent.style.maxHeight = firstContent.scrollHeight + 40 + 'px';
  }

  /* ===================================================================
     7. TESTIMONIALS SLIDER (Patient Voices) - FULLY ANIMATED & INTERACTIVE
  =================================================================== */
  const testimonialSlides = document.querySelectorAll('.testimonial-slide');

  if (testimonialSlides.length > 0) {
    let currentSlide = 0;
    let autoRotateTimer = null;
    const ROTATION_INTERVAL = 6500; // 6.5s per slide

    function updateProgressAnim() {
      const bars = document.querySelectorAll('.testimonial-progress-bar');
      bars.forEach(bar => {
        bar.style.animation = 'none';
        void bar.offsetWidth; // trigger reflow
        bar.style.animation = `testiProgressFill ${ROTATION_INTERVAL}ms linear`;
      });
    }

    function showSlide(index, direction = 'right') {
      testimonialSlides.forEach((slide, i) => {
        slide.classList.remove('active', 'slide-from-left', 'slide-from-right');
        if (i === index) {
          const animClass = direction === 'left' ? 'slide-from-left' : 'slide-from-right';
          slide.classList.add('active', animClass);
        }
      });

      // Update counters across all slides
      const allCounters = document.querySelectorAll('.js-testi-counter');
      const slideNum = (index + 1).toString().padStart(2, '0');
      const totalNum = testimonialSlides.length.toString().padStart(2, '0');
      allCounters.forEach(c => {
        c.innerText = `${slideNum} / ${totalNum}`;
      });

      // Update dots across all slides
      const allDots = document.querySelectorAll('.js-testi-dot');
      allDots.forEach(dot => {
        const dotIndex = parseInt(dot.getAttribute('data-slide'), 10);
        if (dotIndex === index) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });

      currentSlide = index;
      updateProgressAnim();
    }

    function nextSlide() {
      const nextIdx = (currentSlide + 1) % testimonialSlides.length;
      showSlide(nextIdx, 'right');
      resetAutoTimer();
    }

    function prevSlide() {
      const prevIdx = (currentSlide - 1 + testimonialSlides.length) % testimonialSlides.length;
      showSlide(prevIdx, 'left');
      resetAutoTimer();
    }

    function goToSlide(idx) {
      if (idx === currentSlide) return;
      const direction = idx > currentSlide ? 'right' : 'left';
      showSlide(idx, direction);
      resetAutoTimer();
    }

    function startAutoTimer() {
      stopAutoTimer();
      autoRotateTimer = setInterval(() => {
        nextSlide();
      }, ROTATION_INTERVAL);
    }

    function stopAutoTimer() {
      if (autoRotateTimer) {
        clearInterval(autoRotateTimer);
        autoRotateTimer = null;
      }
    }

    function resetAutoTimer() {
      stopAutoTimer();
      startAutoTimer();
    }

    // Delegated event listener for all slides and controls
    document.addEventListener('click', (e) => {
      const prevBtn = e.target.closest('.js-testi-prev');
      const nextBtn = e.target.closest('.js-testi-next');
      const dotBtn = e.target.closest('.js-testi-dot');

      if (prevBtn) {
        e.preventDefault();
        prevSlide();
      } else if (nextBtn) {
        e.preventDefault();
        nextSlide();
      } else if (dotBtn) {
        e.preventDefault();
        const targetIndex = parseInt(dotBtn.getAttribute('data-slide'), 10);
        if (!isNaN(targetIndex)) {
          goToSlide(targetIndex);
        }
      }
    });

    // Pause on hover
    const testimonialsWrap = document.querySelector('.testimonials-wrap');
    if (testimonialsWrap) {
      testimonialsWrap.addEventListener('mouseenter', () => {
        stopAutoTimer();
        const bars = document.querySelectorAll('.testimonial-progress-bar');
        bars.forEach(b => b.style.animationPlayState = 'paused');
      });
      testimonialsWrap.addEventListener('mouseleave', () => {
        startAutoTimer();
        const bars = document.querySelectorAll('.testimonial-progress-bar');
        bars.forEach(b => b.style.animationPlayState = 'running');
      });
    }

    // Initialize slide 0 and start auto-rotation
    showSlide(0, 'right');
    startAutoTimer();
  }


  /* ===================================================================
     8. PORTFOLIO FILTER TABS
  =================================================================== */
  const filterBtns = document.querySelectorAll('.portfolio-tab-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'block';
          card.style.animation = 'fadeIn 400ms ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ===================================================================
     9. ANIMATED FUNFACT COUNTERS
  =================================================================== */
  const counterElements = document.querySelectorAll('.js-counter');
  let counterStarted = false;

  function runCounters() {
    counterElements.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const suffix = counter.getAttribute('data-suffix') || '';
      let count = 0;
      const speed = 2500 / target;

      const updateCount = () => {
        const increment = Math.ceil(target / 50);
        count += increment;
        if (count < target) {
          counter.innerText = count + suffix;
          setTimeout(updateCount, 30);
        } else {
          counter.innerText = target + suffix;
        }
      };
      updateCount();
    });
  }

  if (counterElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !counterStarted) {
          counterStarted = true;
          runCounters();
        }
      });
    }, { threshold: 0.3 });

    counterElements.forEach(el => observer.observe(el));
  }

  /* ===================================================================
     10. BMI & CALORIE CALCULATOR (pages.html)
  =================================================================== */
  const bmiForm = document.getElementById('bmiCalcForm');
  if (bmiForm) {
    bmiForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const weight = parseFloat(document.getElementById('bmiWeight').value);
      const height = parseFloat(document.getElementById('bmiHeight').value); // in cm
      const age = parseInt(document.getElementById('bmiAge').value);
      const activity = parseFloat(document.getElementById('bmiActivity').value);

      if (weight > 0 && height > 0) {
        const heightM = height / 100;
        const bmi = (weight / (heightM * heightM)).toFixed(1);

        let status = 'Normal Weight';
        let statusColor = '#f9d67b';

        if (bmi < 18.5) {
          status = 'Underweight';
          statusColor = '#8ed1fc';
        } else if (bmi >= 25 && bmi < 29.9) {
          status = 'Overweight';
          statusColor = '#ffb347';
        } else if (bmi >= 30) {
          status = 'Obese';
          statusColor = '#ff6b6b';
        }

        // BMR estimate
        const bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        const dailyCalories = Math.round(bmr * activity);

        document.getElementById('bmiScore').innerText = bmi;
        const statusEl = document.getElementById('bmiStatus');
        statusEl.innerText = status;
        statusEl.style.color = statusColor;
        document.getElementById('calorieScore').innerText = dailyCalories + ' kcal/day';
      }
    });
  }

  /* ===================================================================
     11. UNIVERSAL FORM VALIDATION UTILITIES & NOVALIDATE INITIALIZATION
  =================================================================== */
  // Disable native HTML5 browser validation popups across all forms
  document.querySelectorAll('form').forEach(form => {
    form.setAttribute('novalidate', 'true');
  });

  const emailRegexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function getOrCreateFieldError(inputEl) {
    if (!inputEl) return null;
    const container = inputEl.closest('.form-group') || inputEl.closest('.auth-input-wrap') || inputEl.parentElement;
    if (!container) return null;
    let errorEl = container.querySelector('.js-form-error');
    if (!errorEl) {
      errorEl = document.createElement('div');
      errorEl.className = 'js-form-error';
      errorEl.setAttribute('role', 'alert');
      container.appendChild(errorEl);
    }
    return errorEl;
  }

  function setFieldError(inputEl, message) {
    if (!inputEl) return;
    inputEl.classList.add('is-invalid');
    inputEl.classList.remove('is-valid');
    const errorEl = getOrCreateFieldError(inputEl);
    if (errorEl) {
      errorEl.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
        <span>${message}</span>
      `;
      errorEl.style.display = 'flex';
    }
  }

  function clearFieldError(inputEl) {
    if (!inputEl) return;
    inputEl.classList.remove('is-invalid');
    const container = inputEl.closest('.form-group') || inputEl.closest('.auth-input-wrap') || inputEl.parentElement;
    if (container) {
      const errorEl = container.querySelector('.js-form-error');
      if (errorEl) {
        errorEl.remove();
      }
    }
  }

  /* ===================================================================
     11B. CONTACT & APPOINTMENT FORM (contact.html & project.html)
  =================================================================== */
  const contactForm = document.getElementById('contactAppointmentForm');
  const bookingSuccessNotice = document.getElementById('bookingSuccessNotice');

  if (contactForm) {
    contactForm.setAttribute('novalidate', 'true');
    const nameInput = document.getElementById('clientName');
    const emailInput = document.getElementById('clientEmail');
    const phoneInput = document.getElementById('clientPhone');
    const domainSelect = document.getElementById('consultationType');

    // Live real-time error clearing as user fixes inputs
    if (nameInput) {
      nameInput.addEventListener('input', () => {
        if (nameInput.value.trim().length >= 2) clearFieldError(nameInput);
      });
    }
    if (emailInput) {
      emailInput.addEventListener('input', () => {
        if (emailRegexPattern.test(emailInput.value.trim())) clearFieldError(emailInput);
      });
    }
    if (phoneInput) {
      phoneInput.addEventListener('input', () => {
        const digits = phoneInput.value.replace(/\D/g, '');
        if (digits.length >= 7) clearFieldError(phoneInput);
      });
    }
    if (domainSelect) {
      domainSelect.addEventListener('change', () => {
        if (domainSelect.value.trim() !== '') clearFieldError(domainSelect);
      });
    }

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      let firstInvalidEl = null;

      // Validate Full Name (min 2 characters)
      if (!nameInput || nameInput.value.trim().length < 2) {
        setFieldError(nameInput, 'Please enter your full name (minimum 2 characters).');
        if (!firstInvalidEl) firstInvalidEl = nameInput;
        isValid = false;
      } else {
        clearFieldError(nameInput);
      }

      // Validate Email (valid email format)
      if (!emailInput || !emailRegexPattern.test(emailInput.value.trim())) {
        setFieldError(emailInput, 'Please enter a valid email address (e.g. name@domain.com).');
        if (!firstInvalidEl) firstInvalidEl = emailInput;
        isValid = false;
      } else {
        clearFieldError(emailInput);
      }

      // Validate Phone (at least 7 digits)
      const phoneDigits = phoneInput ? phoneInput.value.replace(/\D/g, '') : '';
      if (!phoneInput || phoneDigits.length < 7) {
        setFieldError(phoneInput, 'Please enter a valid phone number (at least 7 digits).');
        if (!firstInvalidEl) firstInvalidEl = phoneInput;
        isValid = false;
      } else {
        clearFieldError(phoneInput);
      }

      // Validate Consultation Domain
      if (!domainSelect || !domainSelect.value.trim()) {
        setFieldError(domainSelect, 'Please select a clinical consultation domain.');
        if (!firstInvalidEl) firstInvalidEl = domainSelect;
        isValid = false;
      } else {
        clearFieldError(domainSelect);
      }

      if (!isValid) {
        if (firstInvalidEl) {
          firstInvalidEl.focus();
          firstInvalidEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      // Submission Success Animation
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnHTML = submitBtn ? submitBtn.innerHTML : '';

      if (submitBtn) {
        submitBtn.innerHTML = `
          <span class="theme-btn">Confirming Slot...</span>
        `;
        submitBtn.disabled = true;
      }

      const clientName = nameInput ? nameInput.value.trim() : 'Valued Patient';
      const clientPhone = phoneInput ? phoneInput.value.trim() : '+91 90909 09090';
      const domainText = domainSelect && domainSelect.selectedIndex > 0 ? domainSelect.options[domainSelect.selectedIndex].text : 'Clinical Nutrition Consultation';

      setTimeout(() => {
        window.location.href = '404.html';
      }, 400);
    });
  }

  /* ===================================================================
     12. NEWSLETTER SUBSCRIPTION FORMS (Custom JS Validation)
  =================================================================== */
  const newsletterForms = document.querySelectorAll('.newsletter-form');
  newsletterForms.forEach(form => {
    form.setAttribute('novalidate', 'true');
    const input = form.querySelector('input');
    const wrapper = form.closest('.newsletter-form-wrapper') || form.parentElement;

    if (input) {
      input.addEventListener('input', () => {
        if (emailRegexPattern.test(input.value.trim())) {
          input.classList.remove('is-invalid');
          if (wrapper) {
            const err = wrapper.querySelector('.js-form-error');
            if (err) err.remove();
          }
        }
      });
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailVal = input ? input.value.trim() : '';

      // Clear any prior success message
      if (wrapper) {
        const oldSuccess = wrapper.querySelector('.newsletter-success-msg');
        if (oldSuccess) oldSuccess.remove();
      }

      // Check if email was not entered
      if (!input || !emailVal) {
        if (input) {
          input.classList.add('is-invalid');
          input.focus();
        }
        if (wrapper) {
          let errEl = wrapper.querySelector('.js-form-error');
          if (!errEl) {
            errEl = document.createElement('div');
            errEl.className = 'js-form-error';
            errEl.setAttribute('role', 'alert');
            form.insertAdjacentElement('afterend', errEl);
          }
          errEl.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
            <span>Please enter your email address to subscribe.</span>
          `;
        }
        return;
      }

      // Check if email format is invalid
      if (!emailRegexPattern.test(emailVal)) {
        if (input) {
          input.classList.add('is-invalid');
          input.focus();
        }
        if (wrapper) {
          let errEl = wrapper.querySelector('.js-form-error');
          if (!errEl) {
            errEl = document.createElement('div');
            errEl.className = 'js-form-error';
            errEl.setAttribute('role', 'alert');
            form.insertAdjacentElement('afterend', errEl);
          }
          errEl.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
            <span>Please enter a valid email address (e.g. name@domain.com).</span>
          `;
        }
        return;
      }

      // Valid email entered -> redirect to 404 page
      if (input) {
        input.classList.remove('is-invalid');
      }
      if (wrapper) {
        const err = wrapper.querySelector('.js-form-error');
        if (err) err.remove();
      }
      window.location.href = '404.html';
    });
  });

  /* ===================================================================
     13. SERVICE BLOCK STYLE 5 (HOVER & ACTIVE CARD INTERACTION)
  =================================================================== */
  const serviceStyle5Cards = document.querySelectorAll('.service-block-style5');
  if (serviceStyle5Cards.length > 0) {
    serviceStyle5Cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        serviceStyle5Cards.forEach(c => c.classList.remove('is-active'));
        card.classList.add('is-active');
      });
    });
  }

  /* ===================================================================
     14. UNIVERSAL SCROLL REVEAL ANIMATION ENGINE
  =================================================================== */
  const revealElements = document.querySelectorAll('.reveal-fade, .reveal-slide-left, .reveal-slide-right, .reveal-stagger');
  
  if (revealElements.length > 0) {
    const isMobileDevice = window.innerWidth <= 768;
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isMobileDevice || prefersReducedMotion) {
      // On mobile or reduced-motion, render immediately to eliminate scroll stutter and pop-in lag
      revealElements.forEach(el => el.classList.add('is-revealed'));
    } else {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      }, {
        root: null,
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      });

      revealElements.forEach(el => revealObserver.observe(el));
    }
  }

  /* ===================================================================
     15. WORKING PROCESS ROADMAP INTERACTION
  =================================================================== */
  const processCards = document.querySelectorAll('.process-card');
  const processTrackBeam = document.querySelector('.process-track-beam');

  if (processCards.length > 0) {
    processCards.forEach((card, index) => {
      card.addEventListener('mouseenter', () => {
        processCards.forEach(c => c.classList.remove('is-active-step'));
        card.classList.add('is-active-step');

        if (processTrackBeam) {
          const stepPercentages = ['15%', '40%', '65%', '90%'];
          processTrackBeam.style.left = stepPercentages[index] || '50%';
        }
      });
    });
  }

  /* ===================================================================
     16. INTERACTIVE CASE STUDY MODAL & CLINICAL DATA
  =================================================================== */
  const caseStudyData = {
    1: {
      title: 'Chronic Fatigue & Vitality Restoration',
      patientName: 'Sarah Jenkins, 38',
      patientMeta: 'Senior Consultant • 12-Week Protocol',
      avatar: 'assets/images/avatar-1.webp',
      metric1: { num: '+45%', lbl: 'Vitality Score' },
      metric2: { num: '-26 mg/dL', lbl: 'Fasting Glucose' },
      metric3: { num: '96%', lbl: 'Adherence Rate' },
      baseline: 'Patient presented with chronic 2 PM energy crashes, intense sugar cravings, and elevated fasting blood sugar (114 mg/dL). Standard restrictive diets previously failed due to extreme morning fatigue and metabolic burnout.',
      strategy: 'Our clinical nutritionists engineered an anti-inflammatory Mediterranean protocol featuring 30g protein-anchored breakfast frameworks, targeted magnesium glycinate, and low-glycemic complex carbohydrates to normalize cortisol and daytime glucose stability.',
      quote: '"Stackly changed my life completely. I no longer rely on 4 cups of coffee just to survive the afternoon, and my blood glucose returned entirely to optimal ranges."'
    },
    2: {
      title: 'Sustainable 18kg Fat Loss Without Hunger',
      patientName: 'Marcus Vance, 45',
      patientMeta: 'Tech Executive • 16-Week Protocol',
      avatar: 'assets/images/avatar-2.webp',
      metric1: { num: '-18kg', lbl: 'Fat Loss Sustained' },
      metric2: { num: '5.3%', lbl: 'HbA1c (from 6.4%)' },
      metric3: { num: '-6.2 in', lbl: 'Waistline Reduction' },
      baseline: 'Patient struggled with a persistent 5-year weight plateau, pre-diabetic biomarker readings (HbA1c 6.4%), and visceral abdominal adiposity exacerbated by high-stress work and business dining.',
      strategy: 'Formulated a customized carb-cycling and insulin-sensitizing meal architecture. Provided 15-minute quick-prep batch cooking guides and restaurant-dining survival protocols without eliminating social dinners.',
      quote: '"I never felt deprived or starving once. I dropped 18 kilograms of pure fat while maintaining all my muscle, and my physician was genuinely stunned by my lab panels."'
    },
    3: {
      title: 'Gut Microbiome & Digestion Restoration',
      patientName: 'Dr. Amanda Rios, 34',
      patientMeta: 'Pediatrician • 10-Week Protocol',
      avatar: 'assets/images/avatar-3.webp',
      metric1: { num: '100%', lbl: 'Bloating Relief' },
      metric2: { num: '+58%', lbl: 'Microbiome Diversity' },
      metric3: { num: '-78%', lbl: 'hs-CRP Inflammation' },
      baseline: 'Patient experienced severe daily postprandial bloating, systemic inflammation, chronic acid reflux, and broad food sensitivities triggered by microbiome dysbiosis after antibiotic therapy.',
      strategy: 'Applied a 3-tier clinical protocol: targeted low-FODMAP elimination, mucosal barrier repair utilizing L-glutamine and zinc carnosine, followed by a phased reintroduction of diverse prebiotic polyphenols.',
      quote: '"As a medical doctor myself, I was deeply impressed by the biochemical rigor and evidence-based approach. My digestion is completely quiet, calm, and pain-free."'
    },
    4: {
      title: 'Cardiovascular & Blood Pressure Normalization',
      patientName: 'James Thornton, 52',
      patientMeta: 'VP of Operations • 14-Week Protocol',
      avatar: 'assets/images/avatar-4.webp',
      metric1: { num: '118/76', lbl: 'Blood Pressure' },
      metric2: { num: '-34%', lbl: 'ApoB & Triglycerides' },
      metric3: { num: '100%', lbl: 'Zero Statins Needed' },
      baseline: 'Patient was on the verge of stage-2 hypertension diagnosis (148/92 mmHg) with elevated ApoB and familial hyperlipidemia. High-stress executive workload and frequent client dinners caused heavy reliance on sodium-dense convenience foods.',
      strategy: 'Implemented a high-potassium, nitric-oxide stimulating whole food regimen rich in beetroot betalains, wild omega-3s, and soluble beta-glucans. Streamlined executive lunch frameworks allowed him to eat out while maintaining strict sodium-to-potassium ratios.',
      quote: '"My cardiologist was astonished. Within 14 weeks my blood pressure normalized completely to 118/76, my energy throughout 12-hour workdays surged, and I never had to go on blood pressure medications."'
    },
    5: {
      title: 'Postpartum Thyroid & Hormone Metabolic Reset',
      patientName: 'Rachel Patel, 32',
      patientMeta: 'Architect & Mother • 16-Week Protocol',
      avatar: 'assets/images/team-1.webp',
      metric1: { num: '-15.4kg', lbl: 'Body Fat Reduction' },
      metric2: { num: '1.9 mIU/L', lbl: 'TSH Level (from 4.8)' },
      metric3: { num: '+70%', lbl: 'Morning Vitality' },
      baseline: 'Patient suffered from postpartum thyroiditis and stubborn metabolic slowdown (TSH 4.8 mIU/L). Aggressive low-calorie dieting by previous trainers caused hair thinning, extreme cold intolerance, brain fog, and severe weight plateau.',
      strategy: 'Restored cellular energy by ending caloric starvation and replacing it with an endocrine-supportive nutrient protocol: selenium, iodine-dense kelp, zinc bisglycinate, and timed complex carbs around morning circadian peaks to reactivate sluggish thyroid conversion.',
      quote: '"Stackly looked at my actual hormone labs rather than telling me to eat less. In 16 weeks I lost 15.4kg naturally, my hair and skin glowing, and I have more energy than before having my baby!"'
    },
    6: {
      title: 'Pre-Diabetes & Glycemic Insensitivity Reversal',
      patientName: 'Michael Scott, 49',
      patientMeta: 'Civil Engineer • 12-Week Protocol',
      avatar: 'assets/images/team-2.webp',
      metric1: { num: '5.2%', lbl: 'HbA1c (from 6.9%)' },
      metric2: { num: '-43 mg/dL', lbl: 'Fasting Glucose Drop' },
      metric3: { num: '0', lbl: 'Medications Required' },
      baseline: 'Patient received routine bloodwork showing HbA1c at 6.9% (diabetic threshold) and fasting glucose of 132 mg/dL. He was advised to start Metformin immediately but sought nutritional reversal first.',
      strategy: 'Utilized Continuous Glucose Monitoring (CGM) sensor feedback paired with chrono-nutrition: sequencing fiber and protein before carbohydrates, substituting refined grains with high-amylose starches, and establishing a 10-minute post-meal gentle walk routine.',
      quote: '"Within 12 weeks, my HbA1c plummeted from 6.9% to 5.2% without taking a single pharmaceutical drug. My doctor said it is one of the most remarkable lab turnarounds he has ever documented."'
    }
  };

  const caseModal = document.getElementById('caseStudyModal');
  const caseOverlay = document.querySelector('.case-modal-overlay');
  const caseCloseBtn = document.querySelector('.case-modal-close');

  function openCaseModal(caseId) {
    const data = caseStudyData[caseId];
    if (!data || !caseModal || !caseOverlay) return;

    document.getElementById('modalCaseTitle').innerText = data.title;
    document.getElementById('modalPatientName').innerText = data.patientName;
    document.getElementById('modalPatientMeta').innerText = data.patientMeta;
    document.getElementById('modalPatientAvatar').src = data.avatar;

    document.getElementById('modalMetric1').innerText = data.metric1.num;
    document.getElementById('modalLabel1').innerText = data.metric1.lbl;
    document.getElementById('modalMetric2').innerText = data.metric2.num;
    document.getElementById('modalLabel2').innerText = data.metric2.lbl;
    document.getElementById('modalMetric3').innerText = data.metric3.num;
    document.getElementById('modalLabel3').innerText = data.metric3.lbl;

    document.getElementById('modalBaselineDesc').innerText = data.baseline;
    document.getElementById('modalStrategyDesc').innerText = data.strategy;
    document.getElementById('modalQuote').innerText = data.quote;

    caseOverlay.classList.add('is-active');
    caseModal.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeCaseModal() {
    if (caseModal && caseOverlay) {
      caseOverlay.classList.remove('is-active');
      caseModal.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  }

  // Delegated click handler for all case study buttons
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.js-open-case');
    if (btn) {
      if (btn.getAttribute('href') === '404.html') return;
      e.preventDefault();
      const caseId = btn.getAttribute('data-case') || '1';
      openCaseModal(caseId);
    }
  });

  if (caseCloseBtn) caseCloseBtn.addEventListener('click', closeCaseModal);
  if (caseOverlay) caseOverlay.addEventListener('click', closeCaseModal);

  /* ===================================================================
     17. INTERACTIVE PRICING FREQUENCY TOGGLE (Monthly / Annual)
  =================================================================== */
  const billingToggle = document.getElementById('pricingBillingToggle');
  const labelMonthly = document.getElementById('labelMonthly');
  const labelAnnual = document.getElementById('labelAnnual');
  const pricingVals = document.querySelectorAll('.js-pricing-val');

  function setBillingFrequency(isAnnual) {
    if (!billingToggle) return;

    if (isAnnual) {
      billingToggle.classList.add('is-annual');
      if (labelAnnual) labelAnnual.classList.add('is-active');
      if (labelMonthly) labelMonthly.classList.remove('is-active');
    } else {
      billingToggle.classList.remove('is-annual');
      if (labelMonthly) labelMonthly.classList.add('is-active');
      if (labelAnnual) labelAnnual.classList.remove('is-active');
    }

    pricingVals.forEach(valEl => {
      valEl.style.transform = 'scale(0.85)';
      valEl.style.opacity = '0.4';
      
      setTimeout(() => {
        const targetVal = isAnnual 
          ? valEl.getAttribute('data-annual') 
          : valEl.getAttribute('data-monthly');
        valEl.innerText = targetVal;
        valEl.style.transform = 'scale(1)';
        valEl.style.opacity = '1';
      }, 180);
    });
  }

  if (billingToggle) {
    billingToggle.addEventListener('click', () => {
      const isCurrentlyAnnual = billingToggle.classList.contains('is-annual');
      setBillingFrequency(!isCurrentlyAnnual);
    });

    if (labelMonthly) {
      labelMonthly.addEventListener('click', () => setBillingFrequency(false));
    }
    if (labelAnnual) {
      labelAnnual.addEventListener('click', () => setBillingFrequency(true));
    }
  }

  /* ===================================================================
     19. UNIVERSAL CATEGORY FILTER ENGINE (Projects, Services, Blog)
  =================================================================== */
  const filterTabGroups = document.querySelectorAll('.filter-tabs-wrapper');
  filterTabGroups.forEach(group => {
    const tabs = group.querySelectorAll('.filter-tab-btn');
    const targetSelector = group.getAttribute('data-target-cards') || '.filterable-card';
    const cards = document.querySelectorAll(targetSelector);

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active', 'is-active'));
        tab.classList.add('active', 'is-active');

        const filterValue = tab.getAttribute('data-filter') || 'all';

        cards.forEach(card => {
          const cardCategory = card.getAttribute('data-category') || '';
          if (filterValue === 'all' || cardCategory === filterValue || cardCategory.includes(filterValue)) {
            card.style.display = '';
            card.style.opacity = '0';
            card.style.transform = 'translateY(15px)';
            setTimeout(() => {
              card.style.transition = 'all 0.4s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 30);
          } else {
            card.style.transition = 'all 0.3s ease';
            card.style.opacity = '0';
            card.style.transform = 'translateY(15px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  });

  /* ===================================================================
     20. INTERACTIVE HEALTH & BMI CALCULATOR ENGINE
  =================================================================== */
  const heightSlider = document.getElementById('calcHeight');
  const weightSlider = document.getElementById('calcWeight');
  const heightValDisplay = document.getElementById('calcHeightVal');
  const weightValDisplay = document.getElementById('calcWeightVal');
  const bmiNumDisplay = document.getElementById('calcBmiNum');
  const bmiStatusDisplay = document.getElementById('calcBmiStatus');
  const caloriesDisplay = document.getElementById('calcCaloriesNum');

  function updateHealthCalculator() {
    if (!heightSlider || !weightSlider || !bmiNumDisplay) return;

    const heightCm = parseFloat(heightSlider.value);
    const weightKg = parseFloat(weightSlider.value);

    if (heightValDisplay) heightValDisplay.textContent = heightCm + ' cm';
    if (weightValDisplay) weightValDisplay.textContent = weightKg + ' kg';

    const heightM = heightCm / 100;
    const bmi = (weightKg / (heightM * heightM)).toFixed(1);
    bmiNumDisplay.textContent = bmi;

    // Daily recommended calorie baseline formula (Harris-Benedict estimate)
    const baseCalories = Math.round(10 * weightKg + 6.25 * heightCm - 5 * 30 + 5);
    if (caloriesDisplay) caloriesDisplay.textContent = (baseCalories * 1.35).toFixed(0);

    if (bmiStatusDisplay) {
      if (bmi < 18.5) {
        bmiStatusDisplay.textContent = 'Underweight • Calorie Surplus Recommended';
        bmiStatusDisplay.className = 'calc-result-status';
        bmiStatusDisplay.style.background = 'rgba(59, 130, 246, 0.25)';
        bmiStatusDisplay.style.color = '#60a5fa';
      } else if (bmi <= 24.9) {
        bmiStatusDisplay.textContent = 'Optimal BMI Range • Metabolic Homeostasis';
        bmiStatusDisplay.className = 'calc-result-status';
        bmiStatusDisplay.style.background = 'rgba(16, 185, 129, 0.25)';
        bmiStatusDisplay.style.color = '#34d399';
      } else if (bmi <= 29.9) {
        bmiStatusDisplay.textContent = 'Overweight • Metabolic Cleanse Protocol';
        bmiStatusDisplay.className = 'calc-result-status';
        bmiStatusDisplay.style.background = 'rgba(245, 190, 71, 0.25)';
        bmiStatusDisplay.style.color = '#fbbf24';
      } else {
        bmiStatusDisplay.textContent = 'Elevated Risk • Clinical Consultation Needed';
        bmiStatusDisplay.className = 'calc-result-status';
        bmiStatusDisplay.style.background = 'rgba(239, 68, 68, 0.25)';
        bmiStatusDisplay.style.color = '#f87171';
      }
    }
  }

  if (heightSlider && weightSlider) {
    heightSlider.addEventListener('input', updateHealthCalculator);
    weightSlider.addEventListener('input', updateHealthCalculator);
    updateHealthCalculator();
  }

  /* ===================================================================
     21. LIVE BLOG SEARCH & FILTER
  =================================================================== */
  const blogSearchInput = document.getElementById('blogSearchInput');
  const blogCards = document.querySelectorAll('.blog-card-v2, .blog-card');

  if (blogSearchInput && blogCards.length > 0) {
    blogSearchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      blogCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(query)) {
          card.style.display = '';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  /* ===================================================================
     22. SOCIAL MEDIA ICON REDIRECTION TO 404 PAGE
  =================================================================== */
  document.addEventListener('click', (e) => {
    const socialLink = e.target.closest('.footer-social-btn, .team-social-btn, .footer-social-links a, a[aria-label="Facebook"], a[aria-label="Twitter"], a[aria-label="Instagram"], a[aria-label="LinkedIn"]');
    if (socialLink) {
      e.preventDefault();
      window.location.href = '404.html';
    }
  });

  /* ===================================================================
     23. 404 ERROR PAGE INTERACTIVE SEARCH
  =================================================================== */
  const errorSearchForm = document.getElementById('errorSearchForm');
  if (errorSearchForm) {
    errorSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('errorSearchInput');
      const query = input ? input.value.trim() : '';
      if (query) {
        window.location.href = `services.html?search=${encodeURIComponent(query)}`;
      } else {
        window.location.href = 'services.html';
      }
    });
  }

  /* ===================================================================
     24. CLINICAL SHOP, CART DRAWER, CHECKOUT & ARTICLE READER SYSTEMS
  =================================================================== */
  // Product Catalog Definition
  const productsCatalog = {
    'synbiotic': {
      id: 'synbiotic',
      title: 'Clinical Multi-Strain Synbiotic (60B CFU)',
      price: 48.00,
      category: 'gut',
      categoryName: 'Gut Microbiome',
      badge: 'Best Seller',
      rating: '5.0',
      reviews: 142,
      image: 'assets/images/service-1.webp',
      desc: 'Dual-layer gastro-resistant prebiotic + 14-strain clinically-studied probiotic designed to restore microbial diversity and eliminate digestive distress.',
      specs: {
        'CFU Count': '60 Billion Organisms',
        'Target Delivery': 'Delayed-Release Acid Resistant Capsules',
        'Strains': '14 Researched Probiotic Strains',
        'Certifications': 'Non-GMO, Dairy-Free, Third-Party Lab Tested'
      }
    },
    'omega3': {
      id: 'omega3',
      title: 'Wild Arctic Ultra Omega-3 (2,400mg)',
      price: 54.00,
      category: 'metabolic',
      categoryName: 'Metabolic & Cardiovascular',
      badge: 'Clinical Grade',
      rating: '4.9',
      reviews: 98,
      image: 'assets/images/service-2.webp',
      desc: 'Molecularly distilled, ultra-pure triglyceride-form wild cod liver oil formulated for cardiovascular lipid optimization and inflammation dampening.',
      specs: {
        'EPA / DHA': '1,400mg EPA / 1,000mg DHA',
        'Purity Standard': 'IFOS 5-Star Certified, Heavy Metal Free',
        'Form': 'Natural Triglyceride (rTG) for 70% Higher Absorption',
        'Certifications': 'Wild-Caught Certified Sustainable'
      }
    },
    'magnesium': {
      id: 'magnesium',
      title: 'Bioavailable Magnesium Glycinate Complex',
      price: 36.00,
      category: 'micronutrients',
      categoryName: 'Sleep & Micronutrients',
      badge: 'Sleep & Cortisol',
      rating: '4.9',
      reviews: 215,
      image: 'assets/images/service-3.webp',
      desc: 'High-absorption dual chelate crossing the blood-brain barrier for restorative deep sleep, cortisol downregulation, and neuromuscular calm.',
      specs: {
        'Elemental Magnesium': '400mg Pure Bisglycinate + L-Threonate',
        'Bioavailability': 'Chelated Amino Complex (Zero Laxative Effect)',
        'Primary Focus': 'Cortisol Downregulation & REM Rest',
        'Certifications': '100% Vegan, Gluten-Free'
      }
    },
    'whey-isolate': {
      id: 'whey-isolate',
      title: 'Hydrolyzed Grass-Fed Native Whey Isolate',
      price: 62.00,
      category: 'athletic',
      categoryName: 'Athletic Recovery',
      badge: 'Muscle Recovery',
      rating: '5.0',
      reviews: 84,
      image: 'assets/images/service-4.webp',
      desc: 'Zero lactose, micro-filtered cold process whey with 27g protein and 6.2g BCAAs per scoop to support lean mass maintenance and satiety.',
      specs: {
        'Protein per Scoop': '27g Bioactive Native Whey Isolate',
        'BCAAs / Leucine': '6.2g BCAAs (2.9g Leucine)',
        'Lactose': '< 0.1g (Zero Digestive Distress)',
        'Source': '100% Pasture-Raised Grass-Fed Dairy'
      }
    },
    'vitamin-d3k2': {
      id: 'vitamin-d3k2',
      title: 'Liposomal Vitamin D3 + K2 (MK-7) Drops',
      price: 29.00,
      category: 'micronutrients',
      categoryName: 'Immune & Bone Health',
      badge: 'Immune Shield',
      rating: '4.8',
      reviews: 112,
      image: 'assets/images/about-nutrition.webp',
      desc: 'Fast-absorbing liposomal liquid emulsion delivering 5,000 IU D3 synergized with bio-active Menaquinone-7 for arterial and bone health.',
      specs: {
        'D3 Strength': '5,000 IU Cholecalciferol',
        'K2 Strength': '100mcg Menaquinone-7 (all-trans)',
        'Carrier': 'Organic MCT Coconut Oil Emulsion',
        'Certifications': 'Soy-Free, Preservative-Free'
      }
    },
    'berberine': {
      id: 'berberine',
      title: 'Metabolic Berberine Phytosome (500mg)',
      price: 42.00,
      category: 'metabolic',
      categoryName: 'Metabolic Health',
      badge: 'Glycemic Control',
      rating: '4.9',
      reviews: 176,
      image: 'assets/images/blog-1.webp',
      desc: 'Clinically enhanced phospholipids with 9.6x greater bioavailability than raw berberine, formulated to support healthy post-meal glucose and insulin response.',
      specs: {
        'Active Dosage': '500mg Berberine Phospholipid Complex',
        'Bioavailability': '9.6x Higher Absorption than Standard Berberine',
        'Mechanism': 'AMPK Activation & Glycemic Buffering',
        'Standard': 'USP Standardized Extract'
      }
    },
    'prebiotic-fiber': {
      id: 'prebiotic-fiber',
      title: 'Complete Organic Prebiotic Polyphenol Powder',
      price: 39.00,
      category: 'gut',
      categoryName: 'Gut Health',
      badge: 'Fermentation Fuel',
      rating: '4.8',
      reviews: 67,
      image: 'assets/images/blog-2.webp',
      desc: 'Pomegranate, wild blueberry, acacia, and green tea catechins specifically calibrated to feed beneficial Akkermansia and Bifidobacteria.',
      specs: {
        'Dietary Fiber': '6g Soluble Organic Prebiotic Fiber',
        'Key Phytonutrients': 'Pomegranate Ellagitannins & Blueberry Anthocyanins',
        'Target Taxa': 'Akkermansia muciniphila & Faecalibacterium',
        'Certifications': 'USDA Certified Organic'
      }
    },
    'electrolytes': {
      id: 'electrolytes',
      title: 'Clinical Electrolyte Hydration Matrix',
      price: 32.00,
      category: 'athletic',
      categoryName: 'Athletic Recovery',
      badge: 'Peak Cellular',
      rating: '4.9',
      reviews: 129,
      image: 'assets/images/blog-3.webp',
      desc: 'Optimal 1,000mg sodium, 200mg potassium, 60mg magnesium balance without maltodextrin, artificial food dyes, or sugar spikes.',
      specs: {
        'Electrolyte Ratio': '1000mg Na / 200mg K / 60mg Mg',
        'Sugar': '0g Sugar (Stevia Leaf Sweetened)',
        'Additives': 'Zero Artificial Colors or Anti-Caking Agents',
        'Flavor': 'Natural Citrus Lime'
      }
    }
  };

  // Blog Articles Catalog Definition
  const articlesCatalog = {
    1: {
      id: 1,
      title: 'Best Foods to Naturally Regulate Cortisol & Eliminate 2 PM Energy Crashes',
      category: 'Metabolic Health',
      readTime: '5 min read',
      date: 'Oct 18, 2026',
      author: 'Dr. Daniel Carter, MD',
      authorRole: 'Chief Clinical Endocrinologist',
      authorAvatar: 'assets/images/team-1.webp',
      image: 'assets/images/blog-1.webp',
      content: `
        <p>The infamous "2 PM afternoon slump" is frequently misdiagnosed as simple physical tiredness or inadequate sleep. In clinical dietetics, we examine blood cortisol rhythms and postprandial glucose curves to uncover the true underlying etiology: reactive hypoglycemia compounded by dysregulated adrenal rhythms.</p>
        <p>When an individual consumes high-glycemic carbohydrates or skips a morning protein anchor, insulin spikes rapidly. Within 90 to 180 minutes, circulating blood glucose crashes beneath baseline. The body perceives this sudden drop as an acute biological emergency, triggering a compensatory surge of cortisol and epinephrine to liberate hepatic glycogen.</p>
        <p>By shifting to an evidence-based morning leucine threshold (minimum 30 grams of high-quality protein) paired with unrefined high-amylose complex carbohydrates and clinical magnesium bisglycinate, patients flatten both glucose peaks and reactive cortisol spikes.</p>
      `,
      takeaways: [
        'Target 30g+ of intact protein within 60 minutes of waking to anchor the orexin wakefulness pathway.',
        'Swap refined midday carbohydrates for prebiotic resistant starches (lentils, cooled quinoa, roasted sweet potatoes).',
        'Supplement with 300-400mg elemental magnesium glycinate in the late afternoon to prevent cortisol surges.',
        'Avoid high-dose caffeine after 12:00 PM to protect slow-wave deep sleep architecture.'
      ]
    },
    2: {
      id: 2,
      title: 'Clinical Insights on Restoring Gut Flora Diversity After Antibiotics',
      category: 'Microbiome Science',
      readTime: '7 min read',
      date: 'Oct 12, 2026',
      author: 'Emily Carter, MS, RD',
      authorRole: 'Head of Pediatric & Digestive Nutrition',
      authorAvatar: 'assets/images/team-2.webp',
      image: 'assets/images/blog-2.webp',
      content: `
        <p>Broad-spectrum antibiotics are lifesaving medical therapies, but their impact on human intestinal ecology can be profound. In high-resolution 16S rRNA metagenomic stool sequencing, a standard 7-day course of broad-spectrum antibiotics often eliminates up to 35% of beneficial microbial taxa, severely diminishing short-chain fatty acid (SCFA) synthesis.</p>
        <p>Attempting immediate megadose probiotic supplementation during or directly after antibiotic treatment without mucosal support frequently exacerbates symptoms, causing gas, distension, and histamine reactivity. Clinical protocols must follow a phased restorative architecture: barrier stabilization, followed by strategic prebiotic polyphenol seeding.</p>
        <p>In our clinic, patients undergo a 3-phase reconditioning protocol utilizing bioactive L-glutamine, zinc carnosine, spore-forming coagulants, and soluble prebiotic fibers that systematically restore Akkermansia muciniphila and Faecalibacterium prausnitzii populations within 8 to 12 weeks.</p>
      `,
      takeaways: [
        'Phase 1 (Weeks 1-2): Reinforce gut mucosal integrity using L-glutamine and deglycyrrhizinated licorice (DGL).',
        'Phase 2 (Weeks 3-6): Introduce spore-based probiotic organisms capable of surviving gastric acid.',
        'Phase 3 (Weeks 7-12): Accelerate microbial diversity by consuming 30+ distinct botanical fiber species weekly.',
        'Track biomarker changes via fecal calprotectin and zonulin panels to confirm mucosal healing.'
      ]
    },
    3: {
      id: 3,
      title: 'High-Protein Batch Cooking Frameworks for Demanding 60-Hour Workweeks',
      category: 'Culinary Prep',
      readTime: '6 min read',
      date: 'Oct 04, 2026',
      author: 'Chef Marcus Vance',
      authorRole: 'Clinical Culinary Medicine Specialist',
      authorAvatar: 'assets/images/team-3.webp',
      image: 'assets/images/blog-3.webp',
      content: `
        <p>For executive leaders, healthcare professionals, and busy entrepreneurs working 60+ hours per week, maintaining consistent clinical nutrition is the single greatest competitive advantage. However, relying on daily ad-hoc decision-making inevitably results in convenience dining high in refined seed oils and empty calories.</p>
        <p>The solution is not spending whole Sundays tied to the stove cooking monotonous dry chicken and steamed broccoli. Instead, we teach the "Modular Component Matrix": preparing high-yield, versatile macronutrient foundations that assemble into distinct flavor profiles in under 4 minutes flat.</p>
        <p>By batch-roasting lean proteins with neutral herb seasonings, pressure-cooking resistant complex carbs, and maintaining high-flavor fermented condiments in glass containers, individuals achieve flawless clinical adherence without burnout.</p>
      `,
      takeaways: [
        'The Component Matrix: Batch-prep 2 protein anchors, 2 complex carbohydrates, and 1 sheet-pan vegetable medley.',
        'Use the 3-minute assemble rule: Keep fresh dressings separate until moment of consumption to prevent sogginess.',
        'Freeze portioned marinated proteins in vacuum containers for instant 12-minute convection roasting.',
        'Carry portable amino acid supplements and single-serve cold-filtered whey isolate for unplanned travel.'
      ]
    },
    4: {
      id: 4,
      title: 'Insulin Sensitivity Beyond Glycemic Index: The Chrono-Nutrition Paradigm',
      category: 'Metabolic Health',
      readTime: '8 min read',
      date: 'Sep 27, 2026',
      author: 'Dr. Daniel Carter, MD',
      authorRole: 'Chief Clinical Endocrinologist',
      authorAvatar: 'assets/images/team-1.webp',
      image: 'assets/images/blog-1.webp',
      content: `
        <p>Traditional nutritional counseling has historically focused almost exclusively on what you eat—specifically calculating glycemic index and caloric density. However, modern chrono-biology reveals that when you eat is equally crucial in modulating cellular insulin sensitivity and glucose clearance.</p>
        <p>Peripheral tissues exhibit marked circadian rhythms in insulin receptor expression and glucose transporter 4 (GLUT4) translocation. A meal consumed at 8:00 AM produces a dramatically lower glycemic and insulinemic excursion compared to the exact same caloric and carbohydrate load consumed at 9:00 PM.</p>
        <p>By front-loading dietary macronutrients earlier in the day and closing the feeding window 3 to 4 hours before melatonin onset, individuals improve their HbA1c, lower visceral adipose storage, and dramatically enhance nightly growth hormone secretion.</p>
      `,
      takeaways: [
        'Front-load carbohydrate intake to coincide with daylight hours when insulin sensitivity peaks.',
        'End evening food intake a minimum of 3 hours before sleep to prevent melatonin-induced insulin resistance.',
        'Execute a 10-minute low-intensity postprandial stroll after meals to clear glucose via muscle contraction without insulin.',
        'Monitor glucose patterns utilizing Continuous Glucose Monitoring (CGM) sensors.'
      ]
    },
    5: {
      id: 5,
      title: 'The Gut-Brain Axis: Nutritional Biomarkers for Serotonin Synthesis',
      category: 'Microbiome Science',
      readTime: '6 min read',
      date: 'Sep 19, 2026',
      author: 'Emily Carter, MS, RD',
      authorRole: 'Head of Pediatric & Digestive Nutrition',
      authorAvatar: 'assets/images/team-2.webp',
      image: 'assets/images/blog-2.webp',
      content: `
        <p>It is widely acknowledged that over 90% of the body\'s total serotonin is synthesized in the gastrointestinal tract by specialized enterochromaffin cells. However, clinical dietetics goes further to investigate how specific dietary co-factors and microbial metabolites directly influence neuro-chemical balance.</p>
        <p>The conversion of dietary L-tryptophan into 5-hydroxytryptophan (5-HTP) and subsequently into serotonin is highly susceptible to inflammatory diversion along the neurotoxic kynurenine pathway when systemic inflammation (hs-CRP) is elevated.</p>
        <p>Supplying targeted co-factors—including pyridoxal-5-phosphate (active B6), methylfolate, and zinc carnosine—while simultaneously dampening intestinal inflammation redirects tryptophan down the neuro-protective serotonin pathway, promoting emotional stability and mental clarity.</p>
      `,
      takeaways: [
        'Ensure adequate daily intake of tryptophan-rich wild proteins paired with gentle complex starches.',
        'Supplement active B-complex cofactors (P-5-P, methylcobalamin, L-methylfolate) to support enzymatic conversion.',
        'Reduce systemic inflammatory triggers that shunt tryptophan down the depressive kynurenine route.',
        'Support vagal nerve tone through fermented botanical polyphenols and mindful eating practices.'
      ]
    },
    6: {
      id: 6,
      title: 'Longevity Fasting Protocols: Autophagy Induction vs. Sarcopenia Prevention',
      category: 'Culinary & Longevity',
      readTime: '7 min read',
      date: 'Sep 11, 2026',
      author: 'Dr. Daniel Carter, MD',
      authorRole: 'Chief Clinical Endocrinologist',
      authorAvatar: 'assets/images/team-1.webp',
      image: 'assets/images/blog-3.webp',
      content: `
        <p>Intermittent fasting and prolonged caloric restriction have achieved immense popularity for their documented capacity to stimulate macro-autophagy—the cellular recycling process wherein damaged mitochondria and misfolded proteins are degraded and cleared.</p>
        <p>However, an acute clinical danger arises when fasting protocols are applied indiscriminately without accounting for age, physical activity, and skeletal muscle mass preservation. Sarcopenia (age-related muscle loss) is one of the strongest independent predictors of all-cause mortality and metabolic frailty in adults over 40.</p>
        <p>We propose a precision "Pulsed Fasting Protocol": strategic 14-to-16 hour overnight fasting windows 3 to 4 days weekly, coupled with robust hyper-protein re-feeding and resistance training on non-fasted days. This captures the cellular cleansing benefits of autophagy while fiercely safeguarding vital skeletal muscle mass.</p>
      `,
      takeaways: [
        'Adopt a pulsed 14:10 or 16:8 schedule rather than perpetual severe caloric restriction.',
        'Consume at least 1.6 to 2.2 grams of protein per kilogram of ideal body weight on resistance training days.',
        'Prioritize resistance training with progressive overload to send an anti-catabolic stimulus to skeletal muscle.',
        'Measure body composition with DEXA scans or multi-frequency bio-impedance rather than standard bathroom scales.'
      ]
    }
  };

  // LocalStorage Helpers
  function getCart() {
    try {
      const data = localStorage.getItem('nourio_cart');
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    try {
      localStorage.setItem('nourio_cart', JSON.stringify(cart));
    } catch (e) {}
    updateCartBadges();
    renderCartDrawer();
  }

  function getWishlist() {
    try {
      const data = localStorage.getItem('nourio_wishlist');
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function saveWishlist(wishlist) {
    try {
      localStorage.setItem('nourio_wishlist', JSON.stringify(wishlist));
    } catch (e) {}
    updateWishlistButtons();
  }

  // Update All Cart Badges
  function updateCartBadges() {
    const cart = getCart();
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const badges = document.querySelectorAll('.cart-badge-count, .cart-drawer-count');
    badges.forEach(b => {
      b.textContent = count;
      b.classList.add('is-bumped');
      setTimeout(() => b.classList.remove('is-bumped'), 250);
    });
  }

  // Toast Notification
  function showShopToast(message, iconSvg) {
    let toast = document.querySelector('.shop-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'shop-toast';
      document.body.appendChild(toast);
    }
    const defaultIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>`;
    toast.innerHTML = `<span class="shop-toast-icon">${iconSvg || defaultIcon}</span><span>${message}</span>`;
    toast.classList.add('is-active');
    setTimeout(() => {
      toast.classList.remove('is-active');
    }, 3200);
  }

  // Add Item to Cart
  function addToCart(productId, qty = 1) {
    const product = productsCatalog[productId];
    if (!product) return;

    let cart = getCart();
    const existingIndex = cart.findIndex(item => item.id === productId);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += qty;
    } else {
      cart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        category: product.categoryName,
        quantity: qty
      });
    }

    saveCart(cart);
    showShopToast(`Added "${product.title}" to Cart!`);
    openCartDrawer();
  }

  // Update Item Quantity
  function updateCartQty(productId, delta) {
    let cart = getCart();
    const index = cart.findIndex(item => item.id === productId);
    if (index > -1) {
      cart[index].quantity += delta;
      if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
      }
      saveCart(cart);
    }
  }

  // Remove Item from Cart
  function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    showShopToast('Item removed from cart');
  }

  // Render Cart Drawer Contents
  function renderCartDrawer() {
    const body = document.querySelector('.cart-drawer-body');
    const footer = document.querySelector('.cart-drawer-footer');
    if (!body) return;

    const cart = getCart();
    if (cart.length === 0) {
      body.innerHTML = `
        <div class="cart-empty-state">
          <div class="cart-empty-icon">
            <svg viewBox="0 0 24 24"><path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12z"/></svg>
          </div>
          <h4>Your cart is empty</h4>
          <p>Explore our clinical formulas, medical supplements, and precision test kits.</p>
          <a href="shop.html" class="btn-style2 btn-teal js-close-cart-btn" style="display: inline-flex; height: 46px; line-height: 46px; padding: 0 24px;">
            <span class="theme-btn">Shop Formulas Now</span>
            <span class="theme-btn-arrow-right"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M5 13h11.86l-5.43 5.43 1.42 1.42L21.14 12l-8.29-8.29-1.42 1.42L16.86 11H5v2z"/></svg></span>
          </a>
        </div>
      `;
      if (footer) footer.style.display = 'none';
      return;
    }

    if (footer) footer.style.display = 'block';

    let subtotal = 0;
    let itemsHtml = '';

    cart.forEach(item => {
      const lineTotal = item.price * item.quantity;
      subtotal += lineTotal;
      itemsHtml += `
        <div class="cart-item-row" data-id="${item.id}">
          <img src="${item.image}" alt="${item.title}" class="cart-item-img" width="68" height="68">
          <div class="cart-item-details">
            <h5 class="cart-item-title">${item.title}</h5>
            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            <div class="cart-qty-row">
              <button type="button" class="qty-btn js-cart-minus" data-id="${item.id}" aria-label="Decrease quantity">-</button>
              <span class="qty-val">${item.quantity}</span>
              <button type="button" class="qty-btn js-cart-plus" data-id="${item.id}" aria-label="Increase quantity">+</button>
            </div>
          </div>
          <button type="button" class="cart-item-remove js-cart-remove" data-id="${item.id}" aria-label="Remove ${item.title}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </div>
      `;
    });

    body.innerHTML = itemsHtml;

    const shippingThreshold = 50.00;
    const isFreeShipping = subtotal >= shippingThreshold;
    const shippingCost = isFreeShipping ? 0 : 5.99;
    const progressPercent = Math.min(100, (subtotal / shippingThreshold) * 100);

    const subtotalEl = document.getElementById('cartSubtotalAmount');
    const shippingEl = document.getElementById('cartShippingAmount');
    const totalEl = document.getElementById('cartTotalAmount');
    const shippingBar = document.getElementById('cartFreeShippingBar');
    const shippingNote = document.getElementById('cartFreeShippingNote');

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = isFreeShipping ? 'FREE' : `$${shippingCost.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${(subtotal + shippingCost).toFixed(2)}`;
    if (shippingBar) shippingBar.style.width = `${progressPercent}%`;
    if (shippingNote) {
      if (isFreeShipping) {
        shippingNote.innerHTML = '<span style="color: #276749; font-weight: 700;">✓ You have unlocked FREE clinic delivery!</span>';
      } else {
        const remaining = (shippingThreshold - subtotal).toFixed(2);
        shippingNote.textContent = `Add $${remaining} more for FREE clinic delivery`;
      }
    }
  }

  // Cart Drawer Open/Close
  function openCartDrawer() {
    const drawer = document.querySelector('.cart-drawer');
    const overlay = document.querySelector('.cart-drawer-overlay');
    if (drawer && overlay) {
      renderCartDrawer();
      drawer.classList.add('is-active');
      overlay.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeCartDrawer() {
    const drawer = document.querySelector('.cart-drawer');
    const overlay = document.querySelector('.cart-drawer-overlay');
    if (drawer && overlay) {
      drawer.classList.remove('is-active');
      overlay.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  }

  // Toggle Wishlist
  function toggleWishlist(productId) {
    let wishlist = getWishlist();
    const index = wishlist.indexOf(productId);
    const product = productsCatalog[productId];
    const title = product ? product.title : 'Item';

    if (index > -1) {
      wishlist.splice(index, 1);
      showShopToast(`Removed "${title}" from Wishlist`);
    } else {
      wishlist.push(productId);
      showShopToast(`Saved "${title}" to Wishlist!`, `<svg width="20" height="20" viewBox="0 0 24 24" fill="#ff5252"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`);
    }

    saveWishlist(wishlist);
  }

  function updateWishlistButtons() {
    const wishlist = getWishlist();
    document.querySelectorAll('.product-wishlist-btn').forEach(btn => {
      const pid = btn.getAttribute('data-id');
      if (wishlist.includes(pid)) {
        btn.classList.add('is-active');
      } else {
        btn.classList.remove('is-active');
      }
    });
  }

  // Product Details Modal
  function openProductModal(productId) {
    const product = productsCatalog[productId];
    const modal = document.getElementById('productDetailsModal');
    const overlay = document.querySelector('.product-modal-overlay');
    if (!product || !modal || !overlay) return;

    document.getElementById('modalProductTitle').textContent = product.title;
    document.getElementById('modalProductCategory').textContent = product.categoryName;
    document.getElementById('modalProductBadge').textContent = product.badge;
    document.getElementById('modalProductPrice').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('modalProductImg').src = product.image;
    document.getElementById('modalProductImg').alt = product.title;
    document.getElementById('modalProductDesc').textContent = product.desc;
    document.getElementById('modalProductRatingCount').textContent = `(${product.reviews} reviews)`;

    const specsList = document.getElementById('modalProductSpecs');
    if (specsList && product.specs) {
      let specsHtml = '';
      for (const [key, val] of Object.entries(product.specs)) {
        specsHtml += `<li><span>${key}</span><strong>${val}</strong></li>`;
      }
      specsList.innerHTML = specsHtml;
    }

    const modalAddBtn = document.getElementById('modalAddToCartBtn');
    if (modalAddBtn) {
      modalAddBtn.setAttribute('data-id', product.id);
    }

    overlay.classList.add('is-active');
    modal.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeProductModal() {
    const modal = document.getElementById('productDetailsModal');
    const overlay = document.querySelector('.product-modal-overlay');
    if (modal && overlay) {
      overlay.classList.remove('is-active');
      modal.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  }

  // Article Reader Modal
  function openArticleModal(articleId) {
    const article = articlesCatalog[articleId];
    const modal = document.getElementById('articleReaderModal');
    const overlay = document.querySelector('.article-modal-overlay');
    if (!article || !modal || !overlay) return;

    document.getElementById('readerArticleTitle').textContent = article.title;
    document.getElementById('readerArticleCategory').textContent = article.category;
    document.getElementById('readerArticleReadTime').textContent = article.readTime;
    document.getElementById('readerArticleDate').textContent = article.date;
    document.getElementById('readerAuthorName').textContent = article.author;
    document.getElementById('readerAuthorRole').textContent = article.authorRole;
    document.getElementById('readerAuthorAvatar').src = article.authorAvatar;
    document.getElementById('readerArticleImg').src = article.image;
    document.getElementById('readerArticleImg').alt = article.title;
    document.getElementById('readerArticleBody').innerHTML = article.content;

    const takeawaysEl = document.getElementById('readerArticleTakeaways');
    if (takeawaysEl && article.takeaways) {
      let tHtml = '<ul>';
      article.takeaways.forEach(item => {
        tHtml += `<li>${item}</li>`;
      });
      tHtml += '</ul>';
      takeawaysEl.innerHTML = `<h5>Key Clinical Insights</h5>${tHtml}`;
    }

    overlay.classList.add('is-active');
    modal.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeArticleModal() {
    const modal = document.getElementById('articleReaderModal');
    const overlay = document.querySelector('.article-modal-overlay');
    if (modal && overlay) {
      overlay.classList.remove('is-active');
      modal.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  }

  // Checkout Modal Open & Render
  function openCheckoutModal() {
    const cart = getCart();
    if (cart.length === 0) {
      showShopToast('Your cart is empty. Please add items to proceed.', `<svg width="20" height="20" viewBox="0 0 24 24" fill="#e53e3e"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>`);
      return;
    }

    closeCartDrawer();

    const modal = document.getElementById('checkoutModal');
    const overlay = document.querySelector('.checkout-modal-overlay');
    if (!modal || !overlay) return;

    // Reset view to form
    const formView = document.getElementById('checkoutFormView');
    const successView = document.getElementById('checkoutSuccessView');
    if (formView) formView.style.display = 'block';
    if (successView) successView.style.display = 'none';

    // Populate order summary
    const summaryList = document.getElementById('checkoutSummaryItems');
    let subtotal = 0;
    if (summaryList) {
      let summaryHtml = '';
      cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        summaryHtml += `
          <div style="display: flex; justify-content: space-between; font-size: 0.9rem; padding: 6px 0; border-bottom: 1px dashed #edf2f7;">
            <span>${item.title} <strong>× ${item.quantity}</strong></span>
            <span style="font-weight: 700;">$${itemTotal.toFixed(2)}</span>
          </div>
        `;
      });
      summaryList.innerHTML = summaryHtml;
    }

    const shipping = subtotal >= 50.00 ? 0 : 5.99;
    const finalTotal = subtotal + shipping;

    const subEl = document.getElementById('checkoutSubtotal');
    const shipEl = document.getElementById('checkoutShipping');
    const totEl = document.getElementById('checkoutTotal');

    if (subEl) subEl.textContent = `$${subtotal.toFixed(2)}`;
    if (shipEl) shipEl.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    if (totEl) totEl.textContent = `$${finalTotal.toFixed(2)}`;

    overlay.classList.add('is-active');
    modal.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    const overlay = document.querySelector('.checkout-modal-overlay');
    if (modal && overlay) {
      overlay.classList.remove('is-active');
      modal.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  }

  // Global Delegated Event Listeners
  document.addEventListener('click', (e) => {
    // Cart Drawer Triggers
    if (e.target.closest('.js-cart-trigger')) {
      e.preventDefault();
      openCartDrawer();
      return;
    }

    // Cart Drawer Close
    if (e.target.closest('.cart-drawer-close, .cart-drawer-overlay, .js-close-cart-btn')) {
      e.preventDefault();
      closeCartDrawer();
      return;
    }

    // Add to Cart Buttons
    const addBtn = e.target.closest('.btn-add-cart, .js-add-cart-btn, #modalAddToCartBtn');
    if (addBtn) {
      e.preventDefault();
      const pid = addBtn.getAttribute('data-id');
      if (pid) {
        addToCart(pid, 1);
        if (addBtn.id === 'modalAddToCartBtn') {
          closeProductModal();
        }
      }
      return;
    }

    // Wishlist Buttons
    const wishBtn = e.target.closest('.product-wishlist-btn');
    if (wishBtn) {
      e.preventDefault();
      const pid = wishBtn.getAttribute('data-id');
      if (pid) toggleWishlist(pid);
      return;
    }

    // View Product Details
    const viewBtn = e.target.closest('.btn-view-details');
    if (viewBtn) {
      e.preventDefault();
      const pid = viewBtn.getAttribute('data-id');
      if (pid) openProductModal(pid);
      return;
    }

    // Product Modal Close
    if (e.target.closest('.product-modal-close, .product-modal-overlay')) {
      e.preventDefault();
      closeProductModal();
      return;
    }

    // Cart Quantity +/- & Remove
    const plusBtn = e.target.closest('.js-cart-plus');
    if (plusBtn) {
      e.preventDefault();
      const pid = plusBtn.getAttribute('data-id');
      if (pid) updateCartQty(pid, 1);
      return;
    }

    const minusBtn = e.target.closest('.js-cart-minus');
    if (minusBtn) {
      e.preventDefault();
      const pid = minusBtn.getAttribute('data-id');
      if (pid) updateCartQty(pid, -1);
      return;
    }

    const removeBtn = e.target.closest('.js-cart-remove');
    if (removeBtn) {
      e.preventDefault();
      const pid = removeBtn.getAttribute('data-id');
      if (pid) removeFromCart(pid);
      return;
    }

    // Proceed to Checkout Button
    if (e.target.closest('.js-checkout-btn')) {
      e.preventDefault();
      openCheckoutModal();
      return;
    }

    // Checkout Modal Close
    if (e.target.closest('.checkout-modal-close, .checkout-modal-overlay')) {
      e.preventDefault();
      closeCheckoutModal();
      return;
    }

    // Article Reader Triggers
    const articleBtn = e.target.closest('.js-open-article, .blog-read-btn');
    if (articleBtn) {
      if (articleBtn.getAttribute('href') === '404.html') return;
      e.preventDefault();
      let aid = articleBtn.getAttribute('data-article');
      if (!aid) {
        // Try to infer from card
        const card = articleBtn.closest('.blog-card-v2, .blog-card');
        if (card) {
          const allCards = Array.from(document.querySelectorAll('.blog-card-v2, .blog-card'));
          const idx = allCards.indexOf(card);
          aid = (idx >= 0 && idx < 6) ? (idx + 1) : 1;
        } else {
          aid = 1;
        }
      }
      openArticleModal(aid);
      return;
    }

    // Article Modal Close
    if (e.target.closest('.article-modal-close, .article-modal-overlay')) {
      e.preventDefault();
      closeArticleModal();
      return;
    }

    // Payment Method Radio Selection Styling
    const paymentCard = e.target.closest('.payment-method-card');
    if (paymentCard) {
      document.querySelectorAll('.payment-method-card').forEach(c => c.classList.remove('is-selected'));
      paymentCard.classList.add('is-selected');
      const radio = paymentCard.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    }
  });

  // Checkout Form Validation & Placement
  const checkoutForm = document.getElementById('checkoutOrderForm');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('checkoutName');
      const emailInput = document.getElementById('checkoutEmail');
      const phoneInput = document.getElementById('checkoutPhone');
      const addressInput = document.getElementById('checkoutAddress');
      const cityInput = document.getElementById('checkoutCity');
      const zipInput = document.getElementById('checkoutZip');

      let isValid = true;

      const validateField = (input, condition, errorMsg) => {
        if (!input) return;
        const group = input.closest('.checkout-form-group');
        let errEl = group.querySelector('.checkout-error-text');
        if (!condition) {
          isValid = false;
          input.style.borderColor = '#e53e3e';
          if (!errEl) {
            errEl = document.createElement('span');
            errEl.className = 'checkout-error-text';
            errEl.style.color = '#e53e3e';
            errEl.style.fontSize = '0.78rem';
            errEl.style.marginTop = '4px';
            group.appendChild(errEl);
          }
          errEl.textContent = errorMsg;
        } else {
          input.style.borderColor = '#e2e8f0';
          if (errEl) errEl.remove();
        }
      };

      validateField(nameInput, nameInput && nameInput.value.trim().length >= 2, 'Please enter your full name (minimum 2 characters).');
      validateField(emailInput, emailInput && emailRegexPattern.test(emailInput.value.trim()), 'Please enter a valid email address.');
      validateField(phoneInput, phoneInput && phoneInput.value.replace(/\D/g, '').length >= 7, 'Please enter a valid phone number.');
      validateField(addressInput, addressInput && addressInput.value.trim().length >= 5, 'Please enter your complete delivery address.');
      validateField(cityInput, cityInput && cityInput.value.trim().length >= 2, 'Please enter your city.');
      validateField(zipInput, zipInput && zipInput.value.trim().length >= 3, 'Please enter your postal code.');

      if (!isValid) return;

      // Submit success simulation
      const submitBtn = checkoutForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Processing Order...</span>`;
      }

      setTimeout(() => {
        const orderId = 'NOU-' + Math.floor(100000 + Math.random() * 900000);
        const cart = getCart();
        let subtotal = 0;
        cart.forEach(item => subtotal += (item.price * item.quantity));
        const shipping = subtotal >= 50.00 ? 0 : 5.99;
        const total = subtotal + shipping;

        // Render receipt
        const receiptBox = document.getElementById('orderReceiptBox');
        if (receiptBox) {
          receiptBox.innerHTML = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #e2e8f0;">
              <span>Order Number:</span>
              <strong style="color: var(--theme-color2); font-size: 1.05rem;">#${orderId}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.9rem;">
              <span>Customer:</span>
              <strong>${nameInput.value.trim()}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.9rem;">
              <span>Email Confirmation:</span>
              <span>${emailInput.value.trim()}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.9rem;">
              <span>Delivery Address:</span>
              <span>${addressInput.value.trim()}, ${cityInput.value.trim()}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 14px; padding-top: 12px; border-top: 1px dashed #cbd5e0; font-size: 1.1rem; font-weight: 800; color: var(--theme-color2);">
              <span>Total Paid:</span>
              <span>$${total.toFixed(2)}</span>
            </div>
          `;
        }

        // Show Success View
        const formView = document.getElementById('checkoutFormView');
        const successView = document.getElementById('checkoutSuccessView');
        if (formView) formView.style.display = 'none';
        if (successView) successView.style.display = 'block';

        // Clear cart
        saveCart([]);

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<span>Place Secure Order</span>`;
        }
      }, 1000);
    });
  }

  // Initialize Cart Badges & Wishlist on page load
  updateCartBadges();
  updateWishlistButtons();

});



