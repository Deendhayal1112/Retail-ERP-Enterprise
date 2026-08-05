/**
 * Dashboard.js
 * Retail ERP Enterprise — Dashboard Home Page & Content Components
 *
 * Implements the reusable page layout blocks:
 * - DashboardHome (Main page controller)
 * - BusinessStatus (Operation status bar)
 * - DashboardSection (Section wrapper panel)
 * - SectionHeader (Header layout)
 * - SectionBody (Body layout)
 * - PlaceholderCard (Metric scorecard placeholder)
 * - PlaceholderChart (Chart container placeholder)
 * - PlaceholderList (Feed lists placeholder)
 * - PlaceholderPanel (Custom controls placeholder)
 */

"use strict";

import WelcomeBanner from "../../components/WelcomeBanner/WelcomeBanner.js";
import { KPIGrid } from "../../components/KPICard/KPICard.js";
import SalesAnalytics from "../../components/SalesAnalytics/SalesAnalytics.js";
import RevenueAnalytics from "../../components/RevenueAnalytics/RevenueAnalytics.js";
import InventorySummary from "../../components/InventorySummary/InventorySummary.js";
import TopSellingProducts from "../../components/TopSellingProducts/TopSellingProducts.js";

// ─────────────────────────────────────────────────────
// 1. REUSABLE GRID SYSTEM LAYOUT COMPONENTS
// ─────────────────────────────────────────────────────

export class GridContainer {
  constructor(options = {}) {
    this.options = options;
  }
  render(children = []) {
    const el = document.createElement("div");
    el.className = "dashboard-grid-container";
    children.forEach(child => el.appendChild(child));
    return el;
  }
}

export class GridColumn {
  constructor(options = {}) {
    this.span = options.span || 12; // default spans all 12 cols
    this.className = options.className || "";
  }
  render(children = []) {
    const el = document.createElement("div");
    el.className = `dashboard-grid-col col-span-${this.span} ${this.className}`;
    children.forEach(child => el.appendChild(child));
    return el;
  }
}

// ─────────────────────────────────────────────────────
// 2. REUSABLE PLACEHOLDER COMPONENTS
// ─────────────────────────────────────────────────────

export class BusinessStatus {
  constructor(options = {}) {
    this.status = options.status || "Operational";
  }

  render() {
    const el = document.createElement("div");
    el.className = "dashboard-business-status-bar";
    el.innerHTML = `
      <div class="business-status-left">
        <span class="status-badge-indicator active"></span>
        <span class="status-label">System Health: <strong>${this.status}</strong></span>
      </div>
      <div class="business-status-right">
        <span class="status-timestamp">Last Sync: Just now</span>
      </div>
    `;
    return el;
  }
}

export class DashboardSection {
  constructor(options = {}) {
    this.className = options.className || "";
  }

  render(headerNode, bodyNode) {
    const section = document.createElement("section");
    section.className = `dashboard-section-card ${this.className}`;
    if (headerNode) section.appendChild(headerNode);
    if (bodyNode) section.appendChild(bodyNode);
    return section;
  }
}

export class SectionHeader {
  constructor(options = {}) {
    this.title = options.title || "Section";
    this.subtitle = options.subtitle || "";
  }

  render() {
    const header = document.createElement("header");
    header.className = "section-card-header";
    header.innerHTML = `
      <h3 class="section-card-title">${this.title}</h3>
      ${this.subtitle ? `<span class="section-card-subtitle">${this.subtitle}</span>` : ""}
    `;
    return header;
  }
}

export class SectionBody {
  render(contentNode) {
    const body = document.createElement("div");
    body.className = "section-card-body";
    if (contentNode) body.appendChild(contentNode);
    return body;
  }
}

export class PlaceholderCard {
  constructor(options = {}) {
    this.value = options.value || "--";
    this.trend = options.trend || "";
  }

  render() {
    const container = document.createElement("div");
    container.className = "widget-card-placeholder-body";
    container.innerHTML = `
      <div class="placeholder-card-value-row">
        <span class="placeholder-numeric-value">${this.value}</span>
        ${this.trend ? `<span class="placeholder-trend-badge">${this.trend}</span>` : ""}
      </div>
      <div class="placeholder-skeleton-lines">
        <div class="skeleton-line-item"></div>
      </div>
    `;
    return container;
  }
}

export class PlaceholderChart {
  constructor(options = {}) {
    this.height = options.height || 260;
  }

  render() {
    const container = document.createElement("div");
    container.className = "widget-chart-placeholder-body";
    container.style.minHeight = `${this.height}px`;
    container.innerHTML = `
      <div class="placeholder-chart-bar-grid">
        <div class="placeholder-chart-bar" style="height: 40%"></div>
        <div class="placeholder-chart-bar" style="height: 60%"></div>
        <div class="placeholder-chart-bar" style="height: 85%"></div>
        <div class="placeholder-chart-bar" style="height: 50%"></div>
        <div class="placeholder-chart-bar" style="height: 70%"></div>
      </div>
      <div class="placeholder-chart-labels-row">
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
      </div>
    `;
    return container;
  }
}

export class PlaceholderList {
  constructor(options = {}) {
    this.itemsCount = options.itemsCount || 3;
  }

  render() {
    const container = document.createElement("div");
    container.className = "widget-list-placeholder-body";
    
    let rowsHtml = "";
    for (let i = 0; i < this.itemsCount; i++) {
      rowsHtml += `
        <div class="placeholder-list-row-item">
          <div class="list-row-bullet"></div>
          <div class="list-row-texts">
            <div class="skeleton-line-item"></div>
            <div class="skeleton-line-item short"></div>
          </div>
        </div>
      `;
    }

    container.innerHTML = rowsHtml;
    return container;
  }
}

export class PlaceholderPanel {
  constructor(options = {}) {
    this.buttons = options.buttons || ["Action 1", "Action 2"];
  }

  render() {
    const container = document.createElement("div");
    container.className = "widget-panel-placeholder-body";
    
    this.buttons.forEach(btnLabel => {
      const btn = document.createElement("button");
      btn.className = "placeholder-panel-action-btn";
      btn.textContent = btnLabel;
      container.appendChild(btn);
    });

    return container;
  }
}

// ─────────────────────────────────────────────────────
// 3. MAIN DASHBOARD HOME VIEW CONTROLLER
// ─────────────────────────────────────────────────────

export default class DashboardHome {
  constructor(options = {}) {
    this.options = options;
    this.element = null;
  }

  /**
   * Renders the complete dashboard home interface.
   * @returns {HTMLElement} Mountable grid element.
   */
  render() {
    const outerContainer = document.createElement("div");
    outerContainer.className = "dashboard-grid-container";

    // A. Welcome Banner (12 columns) - Imported from external WelcomeBanner component
    const welcomeCol = document.createElement("div");
    welcomeCol.className = "dashboard-grid-col col-span-12";
    const banner = new WelcomeBanner();
    welcomeCol.appendChild(banner.render());
    outerContainer.appendChild(welcomeCol);

    // B. Business Status Bar (12 columns)
    const statusCol = document.createElement("div");
    statusCol.className = "dashboard-grid-col col-span-12";
    const status = new BusinessStatus();
    statusCol.appendChild(status.render());
    outerContainer.appendChild(statusCol);

    // C. KPI Scorecards Row (12 columns) - Imported from KPIGrid component
    const kpiCol = document.createElement("div");
    kpiCol.className = "dashboard-grid-col col-span-12";
    const kpiGrid = new KPIGrid();
    kpiCol.appendChild(kpiGrid.render());
    outerContainer.appendChild(kpiCol);

    // D. Sales Analytics (8 columns) - Imported from external SalesAnalytics component
    const salesCol = document.createElement("div");
    salesCol.className = "dashboard-grid-col col-span-8";
    const salesAnalytics = new SalesAnalytics();
    salesCol.appendChild(salesAnalytics.render());
    outerContainer.appendChild(salesCol);

    // E. Revenue Analytics (4 columns) - Imported from external RevenueAnalytics component
    const revenueCol = document.createElement("div");
    revenueCol.className = "dashboard-grid-col col-span-4";
    const revenueAnalytics = new RevenueAnalytics();
    revenueCol.appendChild(revenueAnalytics.render());
    outerContainer.appendChild(revenueCol);

    // F. Inventory Summary (6 columns) - Imported from external InventorySummary component
    const inventoryCol = document.createElement("div");
    inventoryCol.className = "dashboard-grid-col col-span-6";
    const inventorySummary = new InventorySummary();
    inventoryCol.appendChild(inventorySummary.render());
    outerContainer.appendChild(inventoryCol);

    // G. Top Selling Products (6 columns) - Imported from external TopSellingProducts component
    const topSellingCol = document.createElement("div");
    topSellingCol.className = "dashboard-grid-col col-span-6";
    const topSelling = new TopSellingProducts();
    topSellingCol.appendChild(topSelling.render());
    outerContainer.appendChild(topSellingCol);

    // H. Quick Actions, Notifications, & Upcoming Tasks (4 columns each)
    const assembleSection = (title, subtitle, span, bodyNode) => {
      const sectionCol = document.createElement("div");
      sectionCol.className = `dashboard-grid-col col-span-${span}`;

      const header = new SectionHeader({ title, subtitle });
      const body = new SectionBody();
      const section = new DashboardSection();

      sectionCol.appendChild(section.render(header.render(), body.render(bodyNode)));
      return sectionCol;
    };

    outerContainer.appendChild(assembleSection("Quick Operations Menu", "POS billing shortcuts & register tools", 4, new PlaceholderPanel({ buttons: ["⚡ New Invoice", "🏷️ Add Product", "📊 Run Report"] }).render()));
    outerContainer.appendChild(assembleSection("System Alerts & Notifications", "Active database logs warnings", 4, new PlaceholderList({ itemsCount: 2 }).render()));
    outerContainer.appendChild(assembleSection("Upcoming Schedule Tasks", "Store checklist milestones", 4, new PlaceholderList({ itemsCount: 2 }).render()));

    this.element = outerContainer;
    return outerContainer;
  }
}
