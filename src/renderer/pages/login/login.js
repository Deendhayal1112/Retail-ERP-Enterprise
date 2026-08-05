/**
 * login.js
 * Retail ERP Enterprise — Login Page Controller
 *
 * Drives the interactive client form behaviors, including validation checks,
 * accessibility attributes, remember me persistence, and shortcut listeners.
 *
 * Phase 3 — Step 5: Login Integration Preparation & Final UI Polish
 */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // Select DOM Nodes
  const loginForm = document.getElementById("login-form");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const usernameError = document.getElementById("username-error");
  const passwordError = document.getElementById("password-error");
  const togglePasswordBtn = document.getElementById("toggle-password");
  const loginSubmitBtn = document.getElementById("login-submit-btn");
  const changeCompanyBtn = document.getElementById("change-company-btn");
  const activateLicenseLink = document.getElementById("activate-license-link");
  const rememberMeCheckbox = document.getElementById("remember-me");
  const loadingOverlay = document.getElementById("loading-overlay");

  // Submit blocker flag
  let isSubmitting = false;

  // Helper to trigger Toast alerts
  const showNotification = (message, type = "info") => {
    if (window.Toast) {
      window.Toast.show(message, type, 3000);
    } else {
      console.log(`[Toast ${type.toUpperCase()}]: ${message}`);
    }
  };

  // 1. Remember Me Persistence logic
  const loadRememberedState = () => {
    if (!usernameInput || !rememberMeCheckbox) return;
    const rememberedUser = localStorage.getItem("rememberedUsername");
    if (rememberedUser) {
      usernameInput.value = rememberedUser;
      rememberMeCheckbox.checked = true;
      // Focus password field instead of username if username is prefilled
      if (passwordInput) {
        passwordInput.focus();
      }
    } else {
      usernameInput.focus();
    }
  };

  const saveRememberedState = (username) => {
    if (rememberMeCheckbox && rememberMeCheckbox.checked) {
      localStorage.setItem("rememberedUsername", username);
    } else {
      localStorage.removeItem("rememberedUsername");
    }
  };

  // 2. Clear Form utility (Escape key behavior)
  const clearLoginForm = () => {
    if (usernameInput) {
      usernameInput.value = "";
      usernameInput.classList.remove("has-error", "has-success");
      usernameInput.setAttribute("aria-invalid", "false");
    }
    if (passwordInput) {
      passwordInput.value = "";
      passwordInput.classList.remove("has-error", "has-success");
      passwordInput.setAttribute("aria-invalid", "false");
    }
    if (usernameError) {
      usernameError.classList.add("hidden");
      usernameError.innerHTML = "";
    }
    if (passwordError) {
      passwordError.classList.add("hidden");
      passwordError.innerHTML = "";
    }
    if (loginSubmitBtn) {
      loginSubmitBtn.disabled = true;
    }
    if (usernameInput) {
      usernameInput.focus();
    }
    showNotification("Form fields cleared.", "info");
  };

  // Bind Escape key clear shortcut
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      // Clear form if user hits Escape
      clearLoginForm();
    }
  });

  // 3. Validation Rules
  const checkUsername = (val) => {
    const value = val.trim();
    if (!value) {
      return "Username is required.";
    }
    if (value.length < 3) {
      return "Username must be at least 3 characters.";
    }
    if (value.length > 50) {
      return "Username cannot exceed 50 characters.";
    }
    return "";
  };

  const checkPassword = (val) => {
    const value = val.trim();
    if (!value) {
      return "Password is required.";
    }
    if (value.length < 6) {
      return "Password must be at least 6 characters.";
    }
    if (value.length > 128) {
      return "Password cannot exceed 128 characters.";
    }
    return "";
  };

  // 4. Input Visual Feedback
  const showError = (input, errorContainer, message) => {
    if (!input || !errorContainer) return;
    input.classList.remove("has-success");
    input.classList.add("has-error");
    input.setAttribute("aria-invalid", "true");
    errorContainer.classList.remove("hidden");
    errorContainer.innerHTML = `
      <!-- Red alert circle SVG -->
      <svg class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <span>${message}</span>
    `;
  };

  const showSuccess = (input, errorContainer) => {
    if (!input || !errorContainer) return;
    input.classList.remove("has-error");
    input.classList.add("has-success");
    input.setAttribute("aria-invalid", "false");
    errorContainer.classList.add("hidden");
    errorContainer.innerHTML = "";
  };

  const clearErrorState = (input, errorContainer) => {
    if (!input || !errorContainer) return;
    input.classList.remove("has-error", "has-success");
    input.setAttribute("aria-invalid", "false");
    errorContainer.classList.add("hidden");
    errorContainer.innerHTML = "";
  };

  // 5. Dynamic submit button enabler
  const validateFormState = () => {
    if (!usernameInput || !passwordInput || !loginSubmitBtn) return;
    const uVal = usernameInput.value.trim();
    const pVal = passwordInput.value.trim();

    // Enable button only if both inputs satisfy minimum lengths without active errors
    const isUsernameValid = uVal.length >= 3 && uVal.length <= 50;
    const isPasswordValid = pVal.length >= 6 && pVal.length <= 128;

    loginSubmitBtn.disabled = !(isUsernameValid && isPasswordValid);
  };

  // 6. Input listener hooks
  if (usernameInput) {
    // Validate on Blur
    usernameInput.addEventListener("blur", () => {
      const errMsg = checkUsername(usernameInput.value);
      if (errMsg) {
        showError(usernameInput, usernameError, errMsg);
      } else {
        showSuccess(usernameInput, usernameError);
      }
      validateFormState();
    });

    // Clear error style immediately upon typing
    usernameInput.addEventListener("input", () => {
      clearErrorState(usernameInput, usernameError);
      validateFormState();
    });
  }

  if (passwordInput) {
    // Validate on Blur
    passwordInput.addEventListener("blur", () => {
      const errMsg = checkPassword(passwordInput.value);
      if (errMsg) {
        showError(passwordInput, passwordError, errMsg);
      } else {
        showSuccess(passwordInput, passwordError);
      }
      validateFormState();
    });

    // Clear error style immediately upon typing
    passwordInput.addEventListener("input", () => {
      clearErrorState(passwordInput, passwordError);
      validateFormState();
    });
  }

  // 7. Password Visibility Toggle
  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const currentType = passwordInput.getAttribute("type");
      const targetType = currentType === "password" ? "text" : "password";
      passwordInput.setAttribute("type", targetType);

      if (targetType === "text") {
        // Toggle eye open SVG
        togglePasswordBtn.innerHTML = `
          <svg class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        `;
        togglePasswordBtn.setAttribute("aria-label", "Hide password");
      } else {
        // Toggle eye slashed SVG
        togglePasswordBtn.innerHTML = `
          <svg class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
          </svg>
        `;
        togglePasswordBtn.setAttribute("aria-label", "Show password");
      }
    });
  }

  // 8. Interactive Form Submit Hook with double-click guard and Loading Overlay
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Guard against double submission clicks
      if (isSubmitting) return;

      const uVal = usernameInput ? usernameInput.value : "";
      const pVal = passwordInput ? passwordInput.value : "";

      const uErr = checkUsername(uVal);
      const pErr = checkPassword(pVal);

      // Perform final check on click/submit
      if (uErr || pErr) {
        if (uErr) {
          showError(usernameInput, usernameError, uErr);
          if (usernameInput) usernameInput.focus();
        } else if (pErr) {
          showError(passwordInput, passwordError, pErr);
          if (passwordInput) passwordInput.focus();
        }
        showNotification("Please correct validation warnings.", "danger");
        return;
      }

      // Commit to submission lock
      isSubmitting = true;

      // Show loading animations and overlays
      if (loginSubmitBtn) {
        loginSubmitBtn.classList.add("is-loading");
        loginSubmitBtn.disabled = true;
      }

      if (usernameInput) usernameInput.disabled = true;
      if (passwordInput) passwordInput.disabled = true;
      if (togglePasswordBtn) togglePasswordBtn.disabled = true;
      if (changeCompanyBtn) changeCompanyBtn.disabled = true;
      if (rememberMeCheckbox) rememberMeCheckbox.disabled = true;

      // Display premium glassmorphic modal loading overlay
      if (loadingOverlay) {
        loadingOverlay.classList.add("is-active");
      }

      showNotification("Connecting to workspace...", "info");

      // Save/Clear Remember Me state depending on user choice
      saveRememberedState(uVal);

      try {
        const result = await window.api.auth.login({
          username: uVal,
          password: pVal,
          rememberMe: rememberMeCheckbox && rememberMeCheckbox.checked,
        });

        if (result && result.success) {
          showNotification(
            "Authentication successful! Loading profile...",
            "success",
          );

          setTimeout(() => {
            // Dismiss loading overlays
            if (loadingOverlay) {
              loadingOverlay.classList.remove("is-active");
            }
            window.location.href = "../home/home.html";
          }, 1500);
        } else {
          // Dismiss loading overlays
          if (loadingOverlay) {
            loadingOverlay.classList.remove("is-active");
          }

          showNotification(
            result?.message || "Invalid username or password.",
            "danger",
          );

          // Highlight error fields
          if (usernameInput) {
            usernameInput.classList.add("has-error");
          }
          if (passwordInput) {
            passwordInput.classList.add("has-error");
          }

          // Reset submit blocker and re-enable inputs
          isSubmitting = false;

          if (loginSubmitBtn) {
            loginSubmitBtn.classList.remove("is-loading");
            validateFormState(); // Recalculate if button should be enabled
          }

          if (usernameInput) usernameInput.disabled = false;
          if (passwordInput) {
            passwordInput.disabled = false;
            passwordInput.value = ""; // Clear password field on failure
            passwordInput.focus();
          }
          if (togglePasswordBtn) togglePasswordBtn.disabled = false;
          if (changeCompanyBtn) changeCompanyBtn.disabled = false;
          if (rememberMeCheckbox) rememberMeCheckbox.disabled = false;
        }
      } catch (err) {
        console.error("Login process execution failure:", err);

        if (loadingOverlay) {
          loadingOverlay.classList.remove("is-active");
        }

        showNotification("Connection failure occurred.", "danger");
        isSubmitting = false;

        if (loginSubmitBtn) {
          loginSubmitBtn.classList.remove("is-loading");
          validateFormState();
        }

        if (usernameInput) usernameInput.disabled = false;
        if (passwordInput) passwordInput.disabled = false;
        if (togglePasswordBtn) togglePasswordBtn.disabled = false;
        if (changeCompanyBtn) changeCompanyBtn.disabled = false;
        if (rememberMeCheckbox) rememberMeCheckbox.disabled = false;
      }
    });
  }

  // 9. Mock Dialog events
  if (changeCompanyBtn) {
    changeCompanyBtn.addEventListener("click", (e) => {
      e.preventDefault();
      showNotification("Company selection dialog triggered (Mocked).", "info");
    });
  }

  if (activateLicenseLink) {
    activateLicenseLink.addEventListener("click", (e) => {
      e.preventDefault();
      showNotification("License activation portal triggered (Mocked).", "info");
    });
  }

  // Initial load calls
  loadRememberedState();
  validateFormState();
});
