/**
 * STACKLY - Clinical Nutrition & Diet Therapy
 * Interactive Authentication & Form Validation Engine
 * Handles Login, Signup, Live Password Strength, Demo Autofill, Modals & Toasts
 */

document.addEventListener('DOMContentLoaded', () => {

  // -------------------------------------------------------------
  // 1. TOAST NOTIFICATION SYSTEM
  // -------------------------------------------------------------
  let toastContainer = document.querySelector('.auth-toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'auth-toast-container';
    document.body.appendChild(toastContainer);
  }

  window.showToast = function(title, message, type = 'info', duration = 4500) {
    const toast = document.createElement('div');
    toast.className = `auth-toast toast-${type}`;

    let iconHtml = '<i class="fas fa-info-circle auth-toast-icon"></i>';
    if (type === 'success') {
      iconHtml = '<i class="fas fa-check-circle auth-toast-icon"></i>';
    } else if (type === 'error') {
      iconHtml = '<i class="fas fa-exclamation-triangle auth-toast-icon"></i>';
    }

    toast.innerHTML = `
      ${iconHtml}
      <div class="auth-toast-content">
        <div class="auth-toast-title">${title}</div>
        <div class="auth-toast-message">${message}</div>
      </div>
      <button class="auth-toast-close" aria-label="Close notification">&times;</button>
    `;

    toastContainer.appendChild(toast);

    const closeBtn = toast.querySelector('.auth-toast-close');
    const dismiss = () => {
      toast.classList.add('hiding');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    };

    closeBtn.addEventListener('click', dismiss);
    const timer = setTimeout(dismiss, duration);
    toast.addEventListener('mouseenter', () => clearTimeout(timer));
  };

  // -------------------------------------------------------------
  // 2. PASSWORD VISIBILITY TOGGLE HELPER
  // -------------------------------------------------------------
  function setupPasswordToggle(inputId, toggleBtnId) {
    const input = document.getElementById(inputId);
    const toggleBtn = document.getElementById(toggleBtnId);
    if (!input || !toggleBtn) return;

    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const isPassword = input.getAttribute('type') === 'password';
      input.setAttribute('type', isPassword ? 'text' : 'password');

      const icon = toggleBtn.querySelector('i');
      if (icon) {
        if (isPassword) {
          icon.classList.remove('fa-eye');
          icon.classList.add('fa-eye-slash');
        } else {
          icon.classList.remove('fa-eye-slash');
          icon.classList.add('fa-eye');
        }
      }
    });
  }

  setupPasswordToggle('loginPassword', 'loginPassToggle');
  setupPasswordToggle('signupPassword', 'signupPassToggle');
  setupPasswordToggle('signupConfirmPassword', 'signupConfirmPassToggle');

  // -------------------------------------------------------------
  // 3. PASSWORD STRENGTH & REAL-TIME CHECKLIST VALIDATOR
  // -------------------------------------------------------------
  function updatePassRules(password, prefix = 'login') {
    const ruleLen = document.getElementById(`${prefix}RuleLen`);
    const ruleUpper = document.getElementById(`${prefix}RuleUpper`);
    const ruleLower = document.getElementById(`${prefix}RuleLower`);
    const ruleNum = document.getElementById(`${prefix}RuleNum`);

    const hasLen = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNum = /[0-9]/.test(password);

    function updateItem(el, isMet) {
      if (!el) return;
      if (isMet) {
        el.classList.add('rule-met');
        const icon = el.querySelector('i');
        if (icon) icon.className = 'fas fa-check-circle';
      } else {
        el.classList.remove('rule-met');
        const icon = el.querySelector('i');
        if (icon) icon.className = 'far fa-check-circle';
      }
    }

    updateItem(ruleLen, hasLen);
    updateItem(ruleUpper, hasUpper);
    updateItem(ruleLower, hasLower);
    updateItem(ruleNum, hasNum);

    return hasLen && hasUpper && hasLower && hasNum;
  }

  // -------------------------------------------------------------
  // 4. FIELD ERROR HELPERS
  // -------------------------------------------------------------
  function setFieldError(input, errorEl, message) {
    if (input) {
      input.classList.add('input-error');
      input.classList.remove('input-success');
    }
    if (errorEl) {
      if (message) {
        const span = errorEl.querySelector('span');
        if (span) span.textContent = message;
      }
      errorEl.classList.add('visible');
    }
  }

  function clearFieldError(input, errorEl) {
    if (input) {
      input.classList.remove('input-error');
      input.classList.add('input-success');
    }
    if (errorEl) {
      errorEl.classList.remove('visible');
    }
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneRegex = /^[0-9]{10}$/;

  // -------------------------------------------------------------
  // 5. LOGIN PAGE LOGIC
  // -------------------------------------------------------------
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    const usernameInput = document.getElementById('loginUsername');
    const usernameError = document.getElementById('loginUsernameError');
    const portalSelect = document.getElementById('loginPortal');
    const portalError = document.getElementById('loginPortalError');
    const emailInput = document.getElementById('loginEmail');
    const emailError = document.getElementById('loginEmailError');
    const passInput = document.getElementById('loginPassword');
    const passError = document.getElementById('loginPasswordError');
    const submitBtn = document.getElementById('loginSubmitBtn');

    // Check if redirected from signup page
    const wasRegistered = sessionStorage.getItem('stackly_just_registered') === 'true';
    if (wasRegistered) {
      const regUserStr = localStorage.getItem('stackly_registered_user');
      let regUser = null;
      try { regUser = regUserStr ? JSON.parse(regUserStr) : null; } catch(e) {}

      const paramEmail = urlParams.get('email') || (regUser ? regUser.email : '');
      const regName = regUser ? (regUser.fullName || regUser.name || (regUser.firstName ? `${regUser.firstName} ${regUser.lastName || ''}`.trim() : regUser.username)) : '';

      if (emailInput && paramEmail) {
        emailInput.value = paramEmail;
        clearFieldError(emailInput, emailError);
      }
      if (usernameInput && (regName || paramEmail)) {
        usernameInput.value = regName || paramEmail.split('@')[0];
        clearFieldError(usernameInput, usernameError);
      }
      if (portalSelect && regUser && regUser.portal) {
        portalSelect.value = regUser.portal;
        clearFieldError(portalSelect, portalError);
      }

      showToast('Account Created!', 'Your account has been created. Please enter your password to sign in.', 'success', 5000);
      sessionStorage.removeItem('stackly_just_registered');

      if (passInput) {
        setTimeout(() => passInput.focus(), 300);
      }
    }

    // Real-time input validation listeners
    if (usernameInput) {
      usernameInput.addEventListener('input', () => {
        if (usernameInput.value.trim().length >= 3) clearFieldError(usernameInput, usernameError);
      });
      usernameInput.addEventListener('blur', () => {
        if (usernameInput.value.trim().length < 3) {
          setFieldError(usernameInput, usernameError, 'Username must be at least 3 characters.');
        } else {
          clearFieldError(usernameInput, usernameError);
        }
      });
    }

    if (portalSelect) {
      portalSelect.addEventListener('change', () => {
        if (portalSelect.value) clearFieldError(portalSelect, portalError);
      });
    }

    if (emailInput) {
      emailInput.addEventListener('input', () => {
        if (emailRegex.test(emailInput.value.trim())) clearFieldError(emailInput, emailError);
      });
      emailInput.addEventListener('blur', () => {
        if (!emailRegex.test(emailInput.value.trim())) {
          setFieldError(emailInput, emailError, 'Please enter a valid email address (e.g. name@domain.com).');
        } else {
          clearFieldError(emailInput, emailError);
        }
      });
    }

    if (passInput) {
      passInput.addEventListener('input', () => {
        const isValid = updatePassRules(passInput.value, 'login');
        if (isValid) clearFieldError(passInput, passError);
      });
      passInput.addEventListener('blur', () => {
        const isValid = updatePassRules(passInput.value, 'login');
        if (!isValid) {
          setFieldError(passInput, passError, 'Password must satisfy all 4 security criteria below.');
        } else {
          clearFieldError(passInput, passError);
        }
      });
    }

    // Submit handler
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      let firstInvalid = null;

      if (!usernameInput || usernameInput.value.trim().length < 3) {
        setFieldError(usernameInput, usernameError, 'Username must be at least 3 characters.');
        isValid = false;
        if (!firstInvalid) firstInvalid = usernameInput;
      } else {
        clearFieldError(usernameInput, usernameError);
      }

      if (!portalSelect || !portalSelect.value) {
        setFieldError(portalSelect, portalError, 'Please select your clinical portal.');
        isValid = false;
        if (!firstInvalid) firstInvalid = portalSelect;
      } else {
        clearFieldError(portalSelect, portalError);
      }

      if (!emailInput || !emailRegex.test(emailInput.value.trim())) {
        setFieldError(emailInput, emailError, 'Please enter a valid email address.');
        isValid = false;
        if (!firstInvalid) firstInvalid = emailInput;
      } else {
        clearFieldError(emailInput, emailError);
      }

      const passValid = updatePassRules(passInput ? passInput.value : '', 'login');
      if (!passInput || !passValid) {
        setFieldError(passInput, passError, 'Password must satisfy all 4 criteria below.');
        isValid = false;
        if (!firstInvalid) firstInvalid = passInput;
      } else {
        clearFieldError(passInput, passError);
      }

      if (!isValid) {
        if (firstInvalid) firstInvalid.focus();
        showToast('Incomplete Credentials', 'Please check highlighted fields before signing in.', 'error');
        return;
      }

      // Valid credentials submitted
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';
      }

      const portalNames = {
        'customer': 'Patient & Wellness Portal',
        'admin': 'Clinical Dietitian Console'
      };

      const selectedPortal = portalSelect.value;
      const portalLabel = portalNames[selectedPortal] || 'Stackly Console';

      let regUser = null;
      try {
        regUser = JSON.parse(localStorage.getItem('stackly_registered_user'));
      } catch (e) {}

      let enteredName = usernameInput.value.trim();
      let firstName = enteredName.split(' ')[0] || enteredName;
      let lastName = enteredName.split(' ').slice(1).join(' ') || '';

      if (regUser && regUser.email.toLowerCase() === emailInput.value.trim().toLowerCase()) {
        if (regUser.fullName) enteredName = regUser.fullName;
        if (regUser.firstName) firstName = regUser.firstName;
        if (regUser.lastName) lastName = regUser.lastName;
      }

      const userSession = {
        firstName: firstName,
        lastName: lastName,
        fullName: enteredName,
        name: enteredName,
        username: usernameInput.value.trim(),
        email: emailInput.value.trim(),
        portal: selectedPortal,
        portalName: portalLabel,
        isLoggedIn: true,
        loginTime: new Date().toISOString()
      };
      localStorage.setItem('stackly_auth_user', JSON.stringify(userSession));

      showToast('Access Granted', `Welcome back, ${enteredName}! Connecting to ${portalLabel}...`, 'success');

      setTimeout(() => {
        if (selectedPortal === 'admin' || emailInput.value.toLowerCase().includes('admin')) {
          window.location.href = 'dashboard-admin.html';
        } else {
          window.location.href = 'dashboard-customer.html';
        }
      }, 900);
    });
  }

  // -------------------------------------------------------------
  // 6. SIGNUP PAGE LOGIC
  // -------------------------------------------------------------
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    const firstNameInput = document.getElementById('signupFirstName');
    const firstNameError = document.getElementById('signupFirstNameError');
    const lastNameInput = document.getElementById('signupLastName');
    const lastNameError = document.getElementById('signupLastNameError');
    const emailInput = document.getElementById('signupEmail');
    const emailError = document.getElementById('signupEmailError');
    const phoneInput = document.getElementById('signupPhone');
    const phoneError = document.getElementById('signupPhoneError');
    const portalSelect = document.getElementById('signupPortal');
    const portalError = document.getElementById('signupPortalError');
    const passInput = document.getElementById('signupPassword');
    const passError = document.getElementById('signupPasswordError');
    const confirmPassInput = document.getElementById('signupConfirmPassword');
    const confirmPassError = document.getElementById('signupConfirmPasswordError');
    const termsCheck = document.getElementById('signupTerms');
    const termsError = document.getElementById('signupTermsError');
    const submitBtn = document.getElementById('signupSubmitBtn');

    // Phone input filter (digits only, max 10)
    if (phoneInput) {
      phoneInput.addEventListener('input', () => {
        phoneInput.value = phoneInput.value.replace(/\D/g, '').slice(0, 10);
        if (phoneRegex.test(phoneInput.value)) {
          clearFieldError(phoneInput, phoneError);
        }
      });
      phoneInput.addEventListener('blur', () => {
        if (!phoneRegex.test(phoneInput.value)) {
          setFieldError(phoneInput, phoneError, 'Please enter a valid 10-digit phone number.');
        } else {
          clearFieldError(phoneInput, phoneError);
        }
      });
    }

    if (firstNameInput) {
      firstNameInput.addEventListener('input', () => {
        if (firstNameInput.value.trim().length >= 2) clearFieldError(firstNameInput, firstNameError);
      });
      firstNameInput.addEventListener('blur', () => {
        if (firstNameInput.value.trim().length < 2) {
          setFieldError(firstNameInput, firstNameError, 'First name must be at least 2 characters.');
        } else {
          clearFieldError(firstNameInput, firstNameError);
        }
      });
    }

    if (lastNameInput) {
      lastNameInput.addEventListener('input', () => {
        if (lastNameInput.value.trim().length >= 1) clearFieldError(lastNameInput, lastNameError);
      });
      lastNameInput.addEventListener('blur', () => {
        if (lastNameInput.value.trim().length < 1) {
          setFieldError(lastNameInput, lastNameError, 'Last name is required.');
        } else {
          clearFieldError(lastNameInput, lastNameError);
        }
      });
    }

    if (emailInput) {
      emailInput.addEventListener('input', () => {
        if (emailRegex.test(emailInput.value.trim())) clearFieldError(emailInput, emailError);
      });
      emailInput.addEventListener('blur', () => {
        if (!emailRegex.test(emailInput.value.trim())) {
          setFieldError(emailInput, emailError, 'Please enter a valid email address.');
        } else {
          clearFieldError(emailInput, emailError);
        }
      });
    }

    if (portalSelect) {
      portalSelect.addEventListener('change', () => {
        if (portalSelect.value) clearFieldError(portalSelect, portalError);
      });
    }

    if (passInput) {
      passInput.addEventListener('input', () => {
        const isValid = updatePassRules(passInput.value, 'signup');
        if (isValid) clearFieldError(passInput, passError);
        if (confirmPassInput && confirmPassInput.value) {
          if (confirmPassInput.value === passInput.value) {
            clearFieldError(confirmPassInput, confirmPassError);
          } else {
            setFieldError(confirmPassInput, confirmPassError, 'Passwords do not match.');
          }
        }
      });
      passInput.addEventListener('blur', () => {
        const isValid = updatePassRules(passInput.value, 'signup');
        if (!isValid) {
          setFieldError(passInput, passError, 'Password must satisfy all 4 criteria below.');
        } else {
          clearFieldError(passInput, passError);
        }
      });
    }

    if (confirmPassInput) {
      confirmPassInput.addEventListener('input', () => {
        if (confirmPassInput.value === passInput.value) {
          clearFieldError(confirmPassInput, confirmPassError);
        }
      });
      confirmPassInput.addEventListener('blur', () => {
        if (confirmPassInput.value !== passInput.value) {
          setFieldError(confirmPassInput, confirmPassError, 'Passwords do not match.');
        } else {
          clearFieldError(confirmPassInput, confirmPassError);
        }
      });
    }

    if (termsCheck) {
      termsCheck.addEventListener('change', () => {
        if (termsCheck.checked && termsError) {
          termsError.classList.remove('visible');
        }
      });
    }

    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      let firstInvalid = null;

      if (!firstNameInput || firstNameInput.value.trim().length < 2) {
        setFieldError(firstNameInput, firstNameError, 'First name must be at least 2 characters.');
        isValid = false;
        if (!firstInvalid) firstInvalid = firstNameInput;
      } else {
        clearFieldError(firstNameInput, firstNameError);
      }

      if (!lastNameInput || lastNameInput.value.trim().length < 1) {
        setFieldError(lastNameInput, lastNameError, 'Last name is required.');
        isValid = false;
        if (!firstInvalid) firstInvalid = lastNameInput;
      } else {
        clearFieldError(lastNameInput, lastNameError);
      }

      if (!emailInput || !emailRegex.test(emailInput.value.trim())) {
        setFieldError(emailInput, emailError, 'Please enter a valid email address.');
        isValid = false;
        if (!firstInvalid) firstInvalid = emailInput;
      } else {
        clearFieldError(emailInput, emailError);
      }

      if (!phoneInput || !phoneRegex.test(phoneInput.value.trim())) {
        setFieldError(phoneInput, phoneError, 'Please enter a valid 10-digit phone number.');
        isValid = false;
        if (!firstInvalid) firstInvalid = phoneInput;
      } else {
        clearFieldError(phoneInput, phoneError);
      }

      if (!portalSelect || !portalSelect.value) {
        setFieldError(portalSelect, portalError, 'Please select your target portal.');
        isValid = false;
        if (!firstInvalid) firstInvalid = portalSelect;
      } else {
        clearFieldError(portalSelect, portalError);
      }

      const passValid = updatePassRules(passInput ? passInput.value : '', 'signup');
      if (!passInput || !passValid) {
        setFieldError(passInput, passError, 'Password must satisfy all 4 criteria below.');
        isValid = false;
        if (!firstInvalid) firstInvalid = passInput;
      } else {
        clearFieldError(passInput, passError);
      }

      if (!confirmPassInput || confirmPassInput.value !== (passInput ? passInput.value : '')) {
        setFieldError(confirmPassInput, confirmPassError, 'Passwords do not match.');
        isValid = false;
        if (!firstInvalid) firstInvalid = confirmPassInput;
      } else {
        clearFieldError(confirmPassInput, confirmPassError);
      }

      if (!termsCheck || !termsCheck.checked) {
        if (termsError) termsError.classList.add('visible');
        isValid = false;
        if (!firstInvalid) firstInvalid = termsCheck;
      } else {
        if (termsError) termsError.classList.remove('visible');
      }

      if (!isValid) {
        if (firstInvalid) firstInvalid.focus();
        showToast('Registration Incomplete', 'Please review all highlighted fields and agree to the Terms.', 'error');
        return;
      }

      // Successful Registration
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
      }

      const fName = firstNameInput.value.trim();
      const lName = lastNameInput.value.trim();
      const fullName = `${fName} ${lName}`.trim();
      const email = emailInput.value.trim();
      const phone = phoneInput.value.trim();
      const portal = portalSelect.value;

      const registeredUser = {
        firstName: fName,
        lastName: lName,
        fullName: fullName,
        name: fullName,
        username: fullName,
        email: email,
        phone: phone,
        portal: portal,
        createdAt: new Date().toISOString()
      };

      localStorage.setItem('stackly_registered_user', JSON.stringify(registeredUser));
      localStorage.setItem('stackly_auth_user', JSON.stringify(registeredUser));
      sessionStorage.setItem('stackly_just_registered', 'true');

      showToast('Account Created Successfully!', 'Redirecting to login page...', 'success');

      setTimeout(() => {
        window.location.href = 'login.html';
      }, 950);
    });
  }

  // -------------------------------------------------------------
  // 7. FORGOT PASSWORD MODAL LOGIC
  // -------------------------------------------------------------
  const forgotModal = document.getElementById('forgotPassModal');
  const forgotOpenLinks = document.querySelectorAll('.auth-forgot-link');
  const forgotCloseBtn = document.getElementById('forgotPassClose');
  const forgotForm = document.getElementById('forgotPassForm');

  if (forgotModal) {
    forgotOpenLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        forgotModal.classList.add('active');
      });
    });

    if (forgotCloseBtn) {
      forgotCloseBtn.addEventListener('click', () => forgotModal.classList.remove('active'));
    }

    forgotModal.addEventListener('click', (e) => {
      if (e.target === forgotModal) forgotModal.classList.remove('active');
    });

    if (forgotForm) {
      forgotForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const forgotEmail = document.getElementById('forgotEmail');
        if (forgotEmail && emailRegex.test(forgotEmail.value.trim())) {
          forgotModal.classList.remove('active');
          showToast('Reset Link Dispatched', `Password recovery instructions have been sent to ${forgotEmail.value.trim()}`, 'success');
          forgotForm.reset();
        } else {
          showToast('Invalid Email', 'Please enter a valid email address to receive password reset link.', 'error');
        }
      });
    }
  }

});
