/**
 * Header.js
 * Retail ERP Enterprise — Top Header Navigation Component
 *
 * Implements toolbar sections:
 * - Left: Sidebar toggle, Breadcrumb current module indicator
 * - Center: SearchBar input component
 * - Right: Action buttons (Notifications, Messages, Theme, Date/Time logs, Quick POS Sale, Profile)
 */

import SearchBar from "../SearchBar/SearchBar.js";
import UserMenu from "../UserMenu/UserMenu.js";
import NotificationPanel from "../NotificationPanel/NotificationPanel.js";
import Breadcrumb from "../Breadcrumb/Breadcrumb.js";

export default class Header {
  constructor(options = {}) {
    this.options = {
      currentModule: "Dashboard",
      ...options
    };
    this.element = null;

    // Sub-components
    this.searchBar = new SearchBar();
    this.userMenu = new UserMenu();
    this.notificationPanel = new NotificationPanel();
    this.breadcrumb = new Breadcrumb({ currentModule: this.options.currentModule });
  }

  /**
   * Renders the header row.
   * @returns {HTMLElement} Complete Header row element.
   */
  render() {
    const container = document.createElement("div");
    container.className = "header-navigation-row";

    // 1. LEFT SECTION (Sidebar Toggle, Breadcrumbs)
    const leftSection = document.createElement("div");
    leftSection.className = "header-left-section";

    // Toggle button
    const toggleBtn = document.createElement("button");
    toggleBtn.className = "header-sidebar-toggle-btn";
    toggleBtn.setAttribute("aria-label", "Toggle sidebar expansion");
    toggleBtn.innerHTML = "☰";
    
    toggleBtn.addEventListener("click", () => {
      const sidebar = document.querySelector(".sidebar-navigation-panel");
      if (sidebar) {
        const isCollapsed = sidebar.classList.toggle("collapsed");
        const collapseToggle = document.querySelector(".sidebar-collapse-toggle");
        if (collapseToggle) {
          collapseToggle.innerHTML = isCollapsed ? "▶" : "◀";
        }
      }
    });

    leftSection.appendChild(toggleBtn);
    leftSection.appendChild(this.breadcrumb.render());
    container.appendChild(leftSection);

    // 2. CENTER SECTION (Search bar)
    const centerSection = document.createElement("div");
    centerSection.className = "header-center-section";
    centerSection.appendChild(this.searchBar.render());
    container.appendChild(centerSection);

    // 3. RIGHT SECTION (Messages, Notifications, Theme, Date/Time, Quick Sale, User Menu)
    const rightSection = document.createElement("div");
    rightSection.className = "header-right-section";

    // Message Center button
    const msgBtn = document.createElement("button");
    msgBtn.className = "header-action-button-item button-messages";
    msgBtn.setAttribute("aria-label", "Open Message Center");
    msgBtn.innerHTML = `
      <span>✉️</span>
      <span class="action-item-badge-count">2</span>
    `;
    msgBtn.addEventListener("click", () => {
      console.log("[Header Action] Message Center drawer triggered.");
    });
    rightSection.appendChild(msgBtn);

    // Notification Panel
    rightSection.appendChild(this.notificationPanel.render());

    // Theme Toggle button
    const themeBtn = document.createElement("button");
    themeBtn.className = "header-action-button-item button-theme-toggle";
    themeBtn.setAttribute("aria-label", "Toggle Dark/Light Mode");
    themeBtn.innerHTML = "🌙";
    themeBtn.addEventListener("click", () => {
      console.log("[Header Action] Theme toggle clicked.");
    });
    rightSection.appendChild(themeBtn);

    // Current Date/Time Log
    const dateTimeLog = document.createElement("div");
    dateTimeLog.className = "header-date-time-log";
    dateTimeLog.innerHTML = `
      <span class="date-log-label">Aug 5, 2026</span>
      <span class="time-accent">13:00 PM</span>
    `;
    rightSection.appendChild(dateTimeLog);

    // Quick POS Action Button
    const newSaleBtn = document.createElement("button");
    newSaleBtn.className = "header-btn-quick-new-sale";
    newSaleBtn.innerHTML = `<span>⚡</span> <span>New Sale</span>`;
    newSaleBtn.addEventListener("click", () => {
      console.log("[Quick POS] Launching new POS sale transaction invoice.");
    });
    rightSection.appendChild(newSaleBtn);

    // User Profile dropdown menu
    rightSection.appendChild(this.userMenu.render());

    container.appendChild(rightSection);
    this.element = container;
    return container;
  }
}
