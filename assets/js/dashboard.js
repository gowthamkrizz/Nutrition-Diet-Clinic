/**
 * STACKLY DASHBOARDS - ADMIN & CUSTOMER JAVASCRIPT
 * Interactivity: Fixed Layouts, Mobile Offcanvas Drawer & Backdrop,
 * Active ScrollSpy, Water Counter, Meal Plan Switcher & Checklists
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ===================================================================
     1. DARK MODE TOGGLE & PERSISTENCE
  =================================================================== */
  const darkModeToggle = document.querySelector('.js-dark-mode-toggle');
  if (darkModeToggle) {
    if (localStorage.getItem('stackly-dark-mode') === 'true') {
      document.body.classList.add('dark-mode');
    }

    darkModeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      localStorage.setItem('stackly-dark-mode', isDark);
    });
  }

  /* ===================================================================
     2. MOBILE SIDEBAR OFFCANVAS DRAWER & BACKDROP OVERLAY
  =================================================================== */
  const menuToggle = document.querySelector('.dash-menu-toggle');
  const sidebar = document.querySelector('.dash-sidebar');
  const overlay = document.querySelector('.dash-sidebar-overlay');
  const closeBtn = document.querySelector('.js-sidebar-close');
  const menuLinks = document.querySelectorAll('.dash-sidebar .menu-item');

  function openSidebar() {
    if (sidebar) sidebar.classList.add('mobile-open');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    if (sidebar) sidebar.classList.remove('mobile-open');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (sidebar && sidebar.classList.contains('mobile-open')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
  }

  if (overlay) {
    overlay.addEventListener('click', closeSidebar);
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeSidebar);
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar && sidebar.classList.contains('mobile-open')) {
      closeSidebar();
    }
  });

  /* ===================================================================
     3. DEDICATED SECTION PANEL SWITCHER (Zero Overlapping)
  =================================================================== */
  const panels = document.querySelectorAll('main.dash-content .dash-panel');

  function switchSection(targetId, updateHistory = true) {
    if (!targetId) return false;
    const cleanId = targetId.replace(/^#/, '');
    const targetPanel = document.getElementById(cleanId);

    if (!targetPanel || !targetPanel.classList.contains('dash-panel')) {
      return false;
    }

    // Hide all panels and display only target panel
    panels.forEach(p => p.classList.remove('active-panel'));
    targetPanel.classList.add('active-panel');

    // Update sidebar menu items
    menuLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${cleanId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Update browser URL hash without causing a jump
    if (updateHistory && window.location.hash !== `#${cleanId}`) {
      try {
        history.pushState(null, '', `#${cleanId}`);
      } catch (e) {
        window.location.hash = `#${cleanId}`;
      }
    }

    // Scroll to top of main content/window
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Close mobile sidebar if open
    if (window.innerWidth <= 992) {
      closeSidebar();
    }

    return true;
  }

  // Handle sidebar navigation clicks & in-page panel links
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href === '#' || href === '#!') return;

    const targetId = href.substring(1);
    const handled = switchSection(targetId, true);
    if (handled) {
      e.preventDefault();
    }
  });

  // Handle browser back/forward buttons
  window.addEventListener('popstate', () => {
    const hash = window.location.hash ? window.location.hash.substring(1) : '';
    if (hash) {
      switchSection(hash, false);
    } else if (panels.length > 0) {
      const defaultId = panels[0].getAttribute('id');
      switchSection(defaultId, false);
    }
  });

  // Activate initial panel based on URL hash or default to first panel
  if (panels.length > 0) {
    const initialHash = window.location.hash ? window.location.hash.substring(1) : '';
    const initialHandled = initialHash ? switchSection(initialHash, false) : false;
    if (!initialHandled) {
      const alreadyActive = document.querySelector('main.dash-content .dash-panel.active-panel');
      if (alreadyActive) {
        switchSection(alreadyActive.getAttribute('id'), false);
      } else {
        switchSection(panels[0].getAttribute('id'), false);
      }
    }
  }

  /* ===================================================================
     4. WATER INTAKE COUNTER (Customer Dashboard)
  =================================================================== */
  const waterMinus = document.querySelector('.js-water-minus');
  const waterPlus = document.querySelector('.js-water-plus');
  const waterGlasses = document.querySelectorAll('.water-glass');
  const waterCountText = document.querySelector('.js-water-count');

  if (waterGlasses.length > 0) {
    let currentGlasses = 5; // Default 5/8

    function updateWaterDisplay() {
      waterGlasses.forEach((glass, idx) => {
        if (idx < currentGlasses) {
          glass.classList.add('filled');
        } else {
          glass.classList.remove('filled');
        }
      });
      if (waterCountText) {
        waterCountText.textContent = `${currentGlasses} / 8 Glasses (${(currentGlasses * 0.25).toFixed(2)}L)`;
      }
    }

    updateWaterDisplay();

    if (waterPlus) {
      waterPlus.addEventListener('click', () => {
        if (currentGlasses < 8) {
          currentGlasses++;
          updateWaterDisplay();
        }
      });
    }

    if (waterMinus) {
      waterMinus.addEventListener('click', () => {
        if (currentGlasses > 0) {
          currentGlasses--;
          updateWaterDisplay();
        }
      });
    }
  }

  /* ===================================================================
     5. MEAL PLAN DAY SWITCHER (Customer Dashboard)
  =================================================================== */
  const mealDayBtns = document.querySelectorAll('.meal-day-btn');
  const mealPlanTitle = document.querySelector('.js-active-day-title');

  const mealSchedules = {
    'Monday': [
      { type: 'Breakfast', title: 'Avocado Toast & Poached Egg', macros: '380 kcal • 18g Protein • 32g Carbs' },
      { type: 'Lunch', title: 'Quinoa Buddha Bowl with Tahini', macros: '520 kcal • 22g Protein • 58g Carbs' },
      { type: 'Dinner', title: 'Grilled Salmon & Steamed Asparagus', macros: '590 kcal • 42g Protein • 16g Carbs' },
      { type: 'Snack', title: 'Greek Yogurt with Blueberries & Chia', macros: '210 kcal • 14g Protein • 20g Carbs' }
    ],
    'Tuesday': [
      { type: 'Breakfast', title: 'Berry Protein Smoothie Bowl', macros: '350 kcal • 24g Protein • 42g Carbs' },
      { type: 'Lunch', title: 'Mediterranean Chickpea & Feta Salad', macros: '490 kcal • 19g Protein • 54g Carbs' },
      { type: 'Dinner', title: 'Baked Lemon Herb Chicken Breast', macros: '540 kcal • 45g Protein • 22g Carbs' },
      { type: 'Snack', title: 'Roasted Almonds & Apple Slices', macros: '190 kcal • 6g Protein • 18g Carbs' }
    ],
    'Wednesday': [
      { type: 'Breakfast', title: 'Steel-Cut Oatmeal with Walnut & Honey', macros: '390 kcal • 12g Protein • 62g Carbs' },
      { type: 'Lunch', title: 'Turkey & Spinach Whole Wheat Wrap', macros: '460 kcal • 32g Protein • 44g Carbs' },
      { type: 'Dinner', title: 'Pan-Seared Cod with Roasted Sweet Potato', macros: '510 kcal • 38g Protein • 34g Carbs' },
      { type: 'Snack', title: 'Celery Sticks with Organic Peanut Butter', macros: '180 kcal • 8g Protein • 12g Carbs' }
    ],
    'Thursday': [
      { type: 'Breakfast', title: 'Scrambled Eggs with Spinach & Mushrooms', macros: '360 kcal • 26g Protein • 10g Carbs' },
      { type: 'Lunch', title: 'Lentil Soup with Kale & Multigrain Roll', macros: '480 kcal • 24g Protein • 60g Carbs' },
      { type: 'Dinner', title: 'Tofu & Vegetable Stir-Fry with Brown Rice', macros: '530 kcal • 28g Protein • 58g Carbs' },
      { type: 'Snack', title: 'Cottage Cheese with Sliced Peaches', macros: '190 kcal • 16g Protein • 18g Carbs' }
    ],
    'Friday': [
      { type: 'Breakfast', title: 'Chia Seed Pudding with Mango Puree', macros: '340 kcal • 10g Protein • 46g Carbs' },
      { type: 'Lunch', title: 'Tuna Nicoise Salad with Boiled Egg', macros: '510 kcal • 36g Protein • 28g Carbs' },
      { type: 'Dinner', title: 'Grass-Fed Sirloin with Broccoli Mash', macros: '610 kcal • 48g Protein • 18g Carbs' },
      { type: 'Snack', title: 'Mixed Pumpkin & Sunflower Seeds', macros: '170 kcal • 7g Protein • 10g Carbs' }
    ],
    'Saturday': [
      { type: 'Breakfast', title: 'Banana Oat Protein Pancakes', macros: '420 kcal • 25g Protein • 55g Carbs' },
      { type: 'Lunch', title: 'Grilled Veggie & Hummus Pita Pocket', macros: '450 kcal • 16g Protein • 58g Carbs' },
      { type: 'Dinner', title: 'Shrimp & Zucchini Noodles Pesto', macros: '480 kcal • 34g Protein • 20g Carbs' },
      { type: 'Snack', title: 'Dark Chocolate (85%) & Walnuts', macros: '200 kcal • 5g Protein • 14g Carbs' }
    ],
    'Sunday': [
      { type: 'Breakfast', title: 'Veggie Frittata with Feta Cheese', macros: '370 kcal • 24g Protein • 14g Carbs' },
      { type: 'Lunch', title: 'Roasted Beetroot, Goat Cheese & Arugula', macros: '440 kcal • 15g Protein • 42g Carbs' },
      { type: 'Dinner', title: 'Herb-Roasted Turkey Tenderloin', macros: '530 kcal • 44g Protein • 26g Carbs' },
      { type: 'Snack', title: 'Matcha Green Tea Latte & Rice Cake', macros: '160 kcal • 6g Protein • 22g Carbs' }
    ]
  };

  mealDayBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      mealDayBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const day = btn.textContent.trim();
      if (mealPlanTitle) mealPlanTitle.textContent = `${day}'s Clinical Nutrition Plan`;

      const meals = mealSchedules[day] || mealSchedules['Monday'];
      const cardsGrid = document.querySelector('.meal-cards-grid');
      if (cardsGrid) {
        cardsGrid.innerHTML = meals.map(m => `
          <div class="meal-card-item">
            <span class="meal-badge">${m.type}</span>
            <div class="meal-title">${m.title}</div>
            <div class="meal-macros">${m.macros}</div>
          </div>
        `).join('');
      }
    });
  });

  /* ===================================================================
     6. ADMIN TABLE SEARCH FILTER
  =================================================================== */
  const adminSearch = document.querySelector('.js-admin-table-search');
  const tableRows = document.querySelectorAll('#appointments .dash-table tbody tr');

  if (adminSearch && tableRows.length > 0) {
    adminSearch.addEventListener('input', () => {
      const q = adminSearch.value.toLowerCase().trim();
      tableRows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(q) ? '' : 'none';
      });
    });
  }

  /* ===================================================================
     7. INTERACTIVE CHECKLISTS (Supplements & Groceries)
  =================================================================== */
  const checkItems = document.querySelectorAll('.grocery-check-item input[type="checkbox"], .supp-checkbox');
  checkItems.forEach(ch => {
    ch.addEventListener('change', () => {
      const parent = ch.closest('label') || ch.closest('.supplement-card');
      if (parent) {
        if (ch.checked) {
          parent.style.opacity = '0.65';
        } else {
          parent.style.opacity = '1';
        }
      }
    });
  });

  /* ===================================================================
     8. DYNAMIC USER PROFILE & LOGOUT SESSION HANDLER
     Only entered Name & Email are displayed in the profile area
  =================================================================== */
  function syncUserProfile() {
    try {
      const authUserStr = localStorage.getItem('stackly_auth_user');
      const regUserStr = localStorage.getItem('stackly_registered_user');
      let userData = null;
      if (authUserStr) {
        userData = JSON.parse(authUserStr);
      } else if (regUserStr) {
        userData = JSON.parse(regUserStr);
      }

      if (userData) {
        const displayName = userData.fullName || userData.name || userData.username;
        const displayEmail = userData.email;

        if (displayName) {
          document.querySelectorAll('.user-display-name').forEach(el => {
            el.textContent = displayName;
          });
          const firstName = displayName.split(' ')[0];
          document.querySelectorAll('.user-display-first-name').forEach(el => {
            el.textContent = firstName;
          });
        }

        if (displayEmail) {
          document.querySelectorAll('.user-display-email').forEach(el => {
            el.textContent = displayEmail;
            el.setAttribute('title', displayEmail);
          });
        }
      }
    } catch (err) {
      console.warn('Unable to sync user session profile:', err);
    }
  }

  syncUserProfile();

  // Logout button handler
  const logoutButtons = document.querySelectorAll('.sidebar-logout-btn');
  logoutButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      try {
        localStorage.removeItem('stackly_auth_user');
      } catch (err) {}
    });
  });

  // Notification bell button interaction -> redirects to 404
  const notifBtns = document.querySelectorAll('.nav-icon-btn[aria-label="Notifications"]');
  notifBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '404.html';
    });
  });

  // Top header search inputs -> redirect to 404 on Enter
  const dashSearchInputs = document.querySelectorAll('.dash-search input');
  dashSearchInputs.forEach(input => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        window.location.href = '404.html';
      }
    });
  });

  // Chat message input bar -> redirect to 404 on Enter
  const chatInput = document.querySelector('.chat-reply-input-bar input');
  if (chatInput) {
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        window.location.href = '404.html';
      }
    });
  }

});
