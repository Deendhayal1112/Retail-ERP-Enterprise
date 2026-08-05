/**
 * home.js
 * Retail ERP Enterprise — Home Screen Controller
 *
 * Verifies active session context on load, instantiates the master
 * DashboardLayout shell, embeds the Dashboard page placeholder widgets grid,
 * and links titlebar controls and session end actions.
 */

"use strict";

import DashboardLayout from "../../layouts/DashboardLayout/DashboardLayout.js?v=1.0.1";
import Dashboard from "../Dashboard/Dashboard.js?v=1.0.1";
import GlobalSearch from "../../components/GlobalSearch/GlobalSearch.js";
import CommandPalette from "../../components/CommandPalette/CommandPalette.js";
import KeyboardManager from "../../components/KeyboardManager/KeyboardManager.js";
import DashboardCustomizer from "../../components/DashboardCustomizer/DashboardCustomizer.js";
import SettingsLayout from "../Settings/Settings.js?v=1.0.1";
import PerformanceCenter from "../Performance/PerformanceCenter.js";
import RendererPerformanceCenter from "../Performance/RendererPerformanceCenter.js";
import DatabasePerformanceCenter from "../Performance/DatabasePerformanceCenter.js";
import MemoryManagementCenter from "../Performance/MemoryManagementCenter.js";
import StartupPerformanceCenter from "../Performance/StartupPerformanceCenter.js";
import BundleOptimizationCenter from "../Performance/BundleOptimizationCenter.js";
import BackgroundTaskCenter from "../Performance/BackgroundTaskCenter.js";
import EnterpriseHealthCenter from "../Performance/EnterpriseHealthCenter.js";
import EnterpriseUATCenter from "../QA/EnterpriseUATCenter.js";
import CICDDashboard from "../Performance/CICDDashboard.js";
import SecurityCenter from "../Security/SecurityCenter.js";
import DistributionCenter from "../Release/DistributionCenter.js";
import ReleaseManagementCenter from "../ReleaseManagement/ReleaseManagementCenter.js";
import DocumentationCenter from "../Docs/DocumentationCenter.js";
import DeploymentCenter from "../Deploy/DeploymentCenter.js";

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
    let activePerformanceModule = null;

    // Render outer shell wrapping the page content node directly
    const layoutNode = layout.render(dashboardPage.render());

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

    // Connect routing clicks dynamically to swap page content viewports
    const sidebarLinks = document.querySelectorAll(".sidebar-nav-link, .submenu-link");
    sidebarLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        const route = link.getAttribute("data-route");
        if (!route) return;

        const pageWrapper = document.querySelector(".page-wrapper-grid");
        if (!pageWrapper) return;

        // Cleanup active loops
        if (activePerformanceModule) {
          activePerformanceModule.destroy();
          activePerformanceModule = null;
        }

        if (route === "security") {
          e.preventDefault();
          pageWrapper.innerHTML = "";
          const securityCenter = new SecurityCenter();
          securityCenter.render().then(node => {
            pageWrapper.appendChild(node);
          });

          // Update header module breadcrumb focus label
          const breadcrumbText = document.querySelector(".breadcrumb-current");
          if (breadcrumbText) breadcrumbText.textContent = "Security & Compliance";
        } else if (route === "release-center") {
          e.preventDefault();
          pageWrapper.innerHTML = "";
          const distCenter = new DistributionCenter();
          distCenter.render().then(node => {
            pageWrapper.appendChild(node);
          });

          // Update header module breadcrumb focus label
          const breadcrumbText = document.querySelector(".breadcrumb-current");
          if (breadcrumbText) breadcrumbText.textContent = "Release & Distribution Center";
        } else if (route === "release-management") {
          e.preventDefault();
          pageWrapper.innerHTML = "";
          const releaseMgmtCenter = new ReleaseManagementCenter();
          releaseMgmtCenter.render().then(node => {
            pageWrapper.appendChild(node);
          });

          // Update header module breadcrumb focus label
          const breadcrumbText = document.querySelector(".breadcrumb-current");
          if (breadcrumbText) breadcrumbText.textContent = "Release Management Center";
        } else if (route === "docs-center") {
          e.preventDefault();
          pageWrapper.innerHTML = "";
          const docsCenter = new DocumentationCenter();
          docsCenter.render().then(node => {
            pageWrapper.appendChild(node);
          });

          // Update header module breadcrumb focus label
          const breadcrumbText = document.querySelector(".breadcrumb-current");
          if (breadcrumbText) breadcrumbText.textContent = "Documentation Center";
        } else if (route === "deploy-center") {
          e.preventDefault();
          pageWrapper.innerHTML = "";
          const deployCenter = new DeploymentCenter();
          deployCenter.render().then(node => {
            pageWrapper.appendChild(node);
          });

          // Update header module breadcrumb focus label
          const breadcrumbText = document.querySelector(".breadcrumb-current");
          if (breadcrumbText) breadcrumbText.textContent = "Deployment Center";
        } else if (route === "settings") {
          e.preventDefault();
          pageWrapper.innerHTML = "";
          const settingsModule = new SettingsLayout();
          pageWrapper.appendChild(settingsModule.render());

          // Update header module breadcrumb focus label
          const breadcrumbText = document.querySelector(".breadcrumb-current");
          if (breadcrumbText) breadcrumbText.textContent = "Settings";
        } else if (route === "dashboard") {
          e.preventDefault();
          pageWrapper.innerHTML = "";
          pageWrapper.appendChild(dashboardPage.render());

          // Update header module breadcrumb focus label
          const breadcrumbText = document.querySelector(".breadcrumb-current");
          if (breadcrumbText) breadcrumbText.textContent = "Dashboard";
        } else if (route === "performance") {
          e.preventDefault();
          pageWrapper.innerHTML = "";
          activePerformanceModule = new PerformanceCenter();
          pageWrapper.appendChild(activePerformanceModule.render());

          // Update header module breadcrumb focus label
          const breadcrumbText = document.querySelector(".breadcrumb-current");
          if (breadcrumbText) breadcrumbText.textContent = "Performance Center";
        } else if (route === "renderer-performance") {
          e.preventDefault();
          pageWrapper.innerHTML = "";
          activePerformanceModule = new RendererPerformanceCenter();
          pageWrapper.appendChild(activePerformanceModule.render());

          // Update header module breadcrumb focus label
          const breadcrumbText = document.querySelector(".breadcrumb-current");
          if (breadcrumbText) breadcrumbText.textContent = "Renderer Optimization";
        } else if (route === "database-tuning") {
          e.preventDefault();
          pageWrapper.innerHTML = "";
          activePerformanceModule = new DatabasePerformanceCenter();
          pageWrapper.appendChild(activePerformanceModule.render());

          // Update header module breadcrumb focus label
          const breadcrumbText = document.querySelector(".breadcrumb-current");
          if (breadcrumbText) breadcrumbText.textContent = "Database Tuning";
        } else if (route === "memory-management") {
          e.preventDefault();
          pageWrapper.innerHTML = "";
          activePerformanceModule = new MemoryManagementCenter();
          pageWrapper.appendChild(activePerformanceModule.render());

          // Update header module breadcrumb focus label
          const breadcrumbText = document.querySelector(".breadcrumb-current");
          if (breadcrumbText) breadcrumbText.textContent = "Memory Management";
        } else if (route === "startup-profiler") {
          e.preventDefault();
          pageWrapper.innerHTML = "";
          activePerformanceModule = new StartupPerformanceCenter();
          pageWrapper.appendChild(activePerformanceModule.render());

          // Update header module breadcrumb focus label
          const breadcrumbText = document.querySelector(".breadcrumb-current");
          if (breadcrumbText) breadcrumbText.textContent = "Startup Profiler";
        } else if (route === "bundle-optimizer") {
          e.preventDefault();
          pageWrapper.innerHTML = "";
          activePerformanceModule = new BundleOptimizationCenter();
          pageWrapper.appendChild(activePerformanceModule.render());

          // Update header module breadcrumb focus label
          const breadcrumbText = document.querySelector(".breadcrumb-current");
          if (breadcrumbText) breadcrumbText.textContent = "Bundle Optimizer";
        } else if (route === "background-tasks") {
          e.preventDefault();
          pageWrapper.innerHTML = "";
          activePerformanceModule = new BackgroundTaskCenter();
          pageWrapper.appendChild(activePerformanceModule.render());

          // Update header module breadcrumb focus label
          const breadcrumbText = document.querySelector(".breadcrumb-current");
          if (breadcrumbText) breadcrumbText.textContent = "Background Services";
        } else if (route === "diagnostics-health") {
          e.preventDefault();
          pageWrapper.innerHTML = "";
          activePerformanceModule = new EnterpriseHealthCenter();
          pageWrapper.appendChild(activePerformanceModule.render());

          // Update header module breadcrumb focus label
          const breadcrumbText = document.querySelector(".breadcrumb-current");
          if (breadcrumbText) breadcrumbText.textContent = "Diagnostics & Health";
        } else if (route === "enterprise-qa") {
          e.preventDefault();
          pageWrapper.innerHTML = "";
          const uatCenter = new EnterpriseUATCenter();
          uatCenter.render().then(node => {
            pageWrapper.appendChild(node);
          });

          // Update header module breadcrumb focus label
          const breadcrumbText = document.querySelector(".breadcrumb-current");
          if (breadcrumbText) breadcrumbText.textContent = "Enterprise QA Center";
        } else if (route === "cicd-pipeline") {
          e.preventDefault();
          pageWrapper.innerHTML = "";
          activePerformanceModule = new CICDDashboard();
          pageWrapper.appendChild(activePerformanceModule.render());

          // Update header module breadcrumb focus label
          const breadcrumbText = document.querySelector(".breadcrumb-current");
          if (breadcrumbText) breadcrumbText.textContent = "CI/CD Pipeline";
        }
      });
    });

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
