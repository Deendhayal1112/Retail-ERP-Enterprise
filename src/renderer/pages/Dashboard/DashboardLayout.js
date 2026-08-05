/**
 * DashboardLayout.js
 * Retail ERP Enterprise — Reusable Grid Layout Component
 */

"use strict";

export default class DashboardLayout {
  render(children = {}) {
    const container = document.createElement("div");
    container.className = "dashboard-workspace-layout";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "24px";
    container.style.padding = "32px";
    container.style.backgroundColor = "#F8FAFC";
    container.style.boxSizing = "border-box";
    container.style.width = "100%";

    // Header container
    if (children.header) {
      container.appendChild(children.header);
    }

    // Main layout grid
    const mainGrid = document.createElement("div");
    mainGrid.className = "dashboard-content-main-grid";
    mainGrid.style.display = "grid";
    mainGrid.style.gridTemplateColumns = "repeat(12, 1fr)";
    mainGrid.style.gap = "24px";
    mainGrid.style.width = "100%";
    mainGrid.style.boxSizing = "border-box";

    // Row 1: KPI Grid (12 columns wide internally, containing 5 cards)
    if (children.kpiGrid) {
      const kpiRow = document.createElement("div");
      kpiRow.className = "dashboard-grid-col col-span-12";
      kpiRow.appendChild(children.kpiGrid);
      mainGrid.appendChild(kpiRow);
    }

    // Row 2: SalesOverview (5) + TopProducts (4) + BusinessSummary (3)
    if (children.salesOverview) mainGrid.appendChild(children.salesOverview);
    if (children.topProducts) mainGrid.appendChild(children.topProducts);
    if (children.businessSummary) mainGrid.appendChild(children.businessSummary);

    // Row 3: InventoryStatus/Analytics (4) + RecentActivity/Bills (4) + Notifications (4)
    if (children.inventoryAnalytics) mainGrid.appendChild(children.inventoryAnalytics);
    if (children.recentActivity) mainGrid.appendChild(children.recentActivity);
    if (children.notifications) mainGrid.appendChild(children.notifications);

    // Row 4: FooterStatus (12)
    if (children.footerStatus) {
      const footerRow = document.createElement("div");
      footerRow.className = "dashboard-grid-col col-span-12";
      footerRow.appendChild(children.footerStatus);
      mainGrid.appendChild(footerRow);
    }

    container.appendChild(mainGrid);
    return container;
  }
}
