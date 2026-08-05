/**
 * Header.js
 * Retail ERP Enterprise — Top Header Navigation Component
 *
 * Implements toolbar placeholders for:
 * - Search bar search input field
 * - Notification bell and messages indicator
 * - Calendar / date log indicators
 * - Quick action Pos launches buttons
 * - Logged-in user metadata summaries
 */

"use strict";

const SearchBar = require("../SearchBar");
const UserMenu = require("../UserMenu");
const NotificationPanel = require("../NotificationPanel");

class Header {
  constructor(options = {}) {
    this.options = options;
    this.element = null;

    this.searchBar = new SearchBar();
    this.userMenu = new UserMenu();
    this.notificationPanel = new NotificationPanel();
  }

  render() {
    const container = document.createElement("div");
    container.className = "header-navigation-row";

    // 1. Left Section (Search Bar Placeholder)
    const leftSec = document.createElement("div");
    leftSec.className = "header-left-section";
    leftSec.appendChild(this.searchBar.render());
    container.appendChild(leftSec);

    // 2. Right Section (Notifications, Calendar, Quick Actions, User Menu)
    const rightSec = document.createElement("div");
    rightSec.className = "header-right-section";

    // Quick Action button
    const quickPosBtn = document.createElement("button");
    quickPosBtn.className = "header-btn-quick-pos";
    quickPosBtn.textContent = "⚡ Quick POS";
    quickPosBtn.addEventListener("click", () => {
      console.log("[Quick Action] Launching Quick POS instance Billing screen.");
    });
    rightSec.appendChild(quickPosBtn);

    // Notifications indicator
    rightSec.appendChild(this.notificationPanel.render());

    // Calendar date/time placeholders
    const dateBadge = document.createElement("div");
    dateBadge.className = "header-date-badge";
    dateBadge.innerHTML = `<span class="date-icon">📅</span> <span class="date-text">Aug 5, 2026</span>`;
    rightSec.appendChild(dateBadge);

    // User Menu / Profile summaries
    rightSec.appendChild(this.userMenu.render());

    container.appendChild(rightSec);
    this.element = container;
    return container;
  }
}

module.exports = Header;
