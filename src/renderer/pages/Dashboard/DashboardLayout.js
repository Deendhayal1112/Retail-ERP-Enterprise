/**
 * DashboardLayout.js
 * Retail ERP Enterprise — Reusable Grid Layout Component
 */

"use strict";

export default class DashboardLayout {
  render(children = {}) {
    const container = document.createElement("div");
    container.className = "dashboard-workspace-layout";

    // Header container
    if (children.header) {
      container.appendChild(children.header);
    }

    // Hero/Toolbar row
    if (children.hero || children.toolbar) {
      const topBar = document.createElement("div");
      topBar.className = "dashboard-top-actions-row";
      if (children.hero) topBar.appendChild(children.hero);
      if (children.toolbar) topBar.appendChild(children.toolbar);
      container.appendChild(topBar);
    }

    // Main layout grid
    const mainGrid = document.createElement("div");
    mainGrid.className = "dashboard-content-main-grid";

    // Append child widgets
    const order = [
      "kpiGrid",
      "salesOverview",
      "revenueAnalytics",
      "inventoryAnalytics",
      "businessHealth",
      "topProducts",
      "quickActions",
      "notifications",
      "recentActivity",
      "favorites"
    ];

    order.forEach(key => {
      if (children[key]) {
        mainGrid.appendChild(children[key]);
      }
    });

    container.appendChild(mainGrid);

    // Footer container
    if (children.footerStatus) {
      container.appendChild(children.footerStatus);
    }

    return container;
  }
}
