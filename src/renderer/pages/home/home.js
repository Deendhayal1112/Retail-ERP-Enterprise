/**
 * home.js
 * Retail ERP Enterprise — Home Screen Controller
 *
 * Verifies active session context on load, displays current user parameters,
 * and links titlebar controls and session end actions.
 *
 * Phase 5 — Step 3: Session Management & Login Integration
 */

"use strict";

document.addEventListener("DOMContentLoaded", async () => {
  const welcomeMessage = document.getElementById("welcome-message");
  const metaUsername = document.getElementById("meta-username");
  const metaRole = document.getElementById("meta-role");
  const metaUuid = document.getElementById("meta-uuid");
  const logoutBtn = document.getElementById("logout-btn");

  // Title Bar Control Nodes
  const minBtn = document.getElementById("win-min");
  const maxBtn = document.getElementById("win-max");
  const closeBtn = document.getElementById("win-close");

  /**
   * Helper to retrieve active role translation name.
   * @param {number} roleId Role identification index.
   * @returns {string} Human readable name.
   */
  const getRoleName = (roleId) => {
    switch (roleId) {
      case 1:
        return "Administrator";
      case 2:
        return "Manager";
      case 3:
        return "Cashier";
      case 4:
        return "Viewer";
      default:
        return "Operator";
    }
  };

  // 1. Session Verification Check
  try {
    const result = await window.api.auth.getSession();
    if (!result || !result.success) {
      console.warn(
        "Unauthorized access: No active session found. Redirecting to login.",
      );
      window.location.href = "../login/login.html";
      return;
    }

    const { user } = result;

    // Populate welcome messages and meta fields
    if (welcomeMessage)
      welcomeMessage.innerText = `Welcome, ${user.full_name}!`;
    if (metaUsername) metaUsername.innerText = user.username;
    if (metaRole) metaRole.innerText = getRoleName(user.role_id);
    if (metaUuid) metaUuid.innerText = user.uuid;
  } catch (error) {
    console.error("Failed to verify active session:", error);
    window.location.href = "../login/login.html";
    return;
  }

  // 2. Bind Secure Logout Event
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        await window.api.auth.logout();
        window.location.href = "../login/login.html";
      } catch (error) {
        console.error("Logout error occurred:", error);
      }
    });
  }

  // 3. Bind Window Frame Control Handlers
  if (minBtn) {
    minBtn.addEventListener("click", () => window.api.window.minimize());
  }
  if (maxBtn) {
    maxBtn.addEventListener("click", () => window.api.window.maximize());
  }
  if (closeBtn) {
    closeBtn.addEventListener("click", () => window.api.window.close());
  }

  // Listen to background session expiration broadcast
  window.api.ipc.on("auth:session-expired", () => {
    console.warn("Session expired broadcast received. Ending connection.");
    window.location.href = "../login/login.html";
  });
});
