/**
 * home.js
 * Retail ERP Enterprise — Home Screen Controller
 *
 * Verifies active session context on load, instantiates the master
 * DashboardLayout shell, embeds the Dashboard page placeholder widgets grid,
 * and links titlebar controls and session end actions.
 */

"use strict";

import DashboardLayout from "../../layouts/DashboardLayout/DashboardLayout.js";
import Dashboard from "../Dashboard/Dashboard.js";
import GlobalSearch from "../../components/GlobalSearch/GlobalSearch.js";
import CommandPalette from "../../components/CommandPalette/CommandPalette.js";
import KeyboardManager from "../../components/KeyboardManager/KeyboardManager.js";
import DashboardCustomizer from "../../components/DashboardCustomizer/DashboardCustomizer.js";

document.addEventListener("DOMContentLoaded", async () => {
  const appRoot = document.getElementById("app-root");

  // 1. Session Verification Check (Maintain existing login validation logic)
  try {
    const result = await window.api.auth.getSession();
    if (!result || !result.success) {
      console.warn("Unauthorized access: No active session found. Redirecting to login.");
      window.location.href = "../login/login.html";
      return;
    }

    const { user } = result;
    console.log(`Session verified for user: ${user.username} (${user.full_name})`);

    // 2. Instantiate and Render Reusable Dashboard Layout Shell
    const layout = new DashboardLayout();
    const dashboardPage = new Dashboard();

    // Render page content first
    const contentNode = document.createElement("div");
    contentNode.style.width = "100%";
    contentNode.appendChild(dashboardPage.render());

    // Render outer shell wrapping the page content node
    const layoutNode = layout.render(contentNode);

    if (appRoot) {
      appRoot.innerHTML = "";
      appRoot.appendChild(layoutNode);
    }

    // 2.5 Instantiate Global Search modal
    const globalSearch = new GlobalSearch();
    document.body.appendChild(globalSearch.render());

    // Connect top header search input focus to trigger global search modal
    const headerSearchInput = document.querySelector(".search-input-element");
    if (headerSearchInput) {
      headerSearchInput.addEventListener("focus", (e) => {
        e.preventDefault();
        headerSearchInput.blur(); // release focus from inline search bar
        globalSearch.toggle(true);
      });
      headerSearchInput.addEventListener("click", (e) => {
        e.preventDefault();
        globalSearch.toggle(true);
      });
    }

    // 2.6 Instantiate Command Palette modal
    const commandPalette = new CommandPalette();
    document.body.appendChild(commandPalette.render());

    // 2.7 Instantiate Keyboard Shortcut Manager dialog helper
    const keyboardManager = new KeyboardManager();
    document.body.appendChild(keyboardManager.render());

    // 2.8 Instantiate Dashboard Customizer drawer helper
    const customizer = new DashboardCustomizer();
    document.body.appendChild(customizer.render());

    // Connect sidebar settings menu click to trigger Dashboard Customizer slide-out
    const sidebarSettingsLink = document.querySelector(".item-settings a");
    if (sidebarSettingsLink) {
      sidebarSettingsLink.addEventListener("click", (e) => {
        e.preventDefault();
        customizer.toggle(true);
      });
    }

    // 3. Dynamic custom event bindings for Sidebar Navigation Actions
    const logoutLink = document.querySelector(".item-logout a");
    if (logoutLink) {
      logoutLink.addEventListener("click", async (e) => {
        e.preventDefault();
        try {
          console.log("Securely ending active operator session...");
          await window.api.auth.logout();
          window.location.href = "../login/login.html";
        } catch (error) {
          console.error("Logout error occurred:", error);
        }
      });
    }

    // Re-bind user profile tags dynamically inside header or sidebar
    const profileLabel = document.querySelector(".usermenu-placeholder span");
    if (profileLabel) {
      profileLabel.textContent = user.full_name;
    }

  } catch (error) {
    console.error("Failed to verify active session:", error);
    window.location.href = "../login/login.html";
    return;
  }

  // 4. Session Expiration Broadcast handler
  window.api.ipc.on("auth:session-expired", () => {
    console.warn("Session expired broadcast received. Ending connection.");
    window.location.href = "../login/login.html";
  });
});
