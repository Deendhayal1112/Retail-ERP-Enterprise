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

import WelcomeBanner         from "../../components/WelcomeBanner/WelcomeBanner.js";
import { KPIGrid }           from "../../components/KPICard/KPICard.js";
import MiniKPIGrid           from "../../components/MiniKPI/MiniKPI.js";
import AnalyticsToolbar      from "../../components/AnalyticsToolbar/AnalyticsToolbar.js";
import SalesTrend            from "../../components/SalesTrend/SalesTrend.js";
import RevenueTrend          from "../../components/RevenueTrend/RevenueTrend.js";
import InventoryDistribution from "../../components/InventoryDistribution/InventoryDistribution.js";
import CategorySales         from "../../components/CategorySales/CategorySales.js";
import BusinessComparison    from "../../components/BusinessComparison/BusinessComparison.js";
import TopSellingProducts    from "../../components/TopSellingProducts/TopSellingProducts.js";
import RecentActivities      from "../../components/RecentActivities/RecentActivities.js";
import Notifications         from "../../components/Notifications/Notifications.js";
import QuickActions          from "../../components/QuickActions/QuickActions.js";
import FavoritesManager      from "../../components/FavoritesManager/FavoritesManager.js";
import BusinessHealth        from "../../components/BusinessHealth/BusinessHealth.js";

// ─────────────────────────────────────────────────────
// 1. REUSABLE GRID SYSTEM LAYOUT COMPONENTS
// ─────────────────────────────────────────────────────

export class GridContainer {
  constructor(options = {}) { this.options = options; }
  render(children = []) {
    const el = document.createElement("div");
    el.className = "dashboard-grid-container";
    children.forEach(child => el.appendChild(child));
    return el;
  }
}

export class GridColumn {
  constructor(options = {}) {
    this.span      = options.span      || 12;
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
  constructor(options = {}) { this.className = options.className || ""; }
  render(headerNode, bodyNode) {
    const section = document.createElement("section");
    section.className = `dashboard-section-card ${this.className}`;
    if (headerNode) section.appendChild(headerNode);
    if (bodyNode)   section.appendChild(bodyNode);
    return section;
  }
}

export class SectionHeader {
  constructor(options = {}) {
    this.title    = options.title    || "Section";
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
  constructor(options = {}) { this.height = options.height || 260; }
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
        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span>
      </div>
    `;
    return container;
  }
}

export class PlaceholderList {
  constructor(options = {}) { this.itemsCount = options.itemsCount || 3; }
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
        </div>`;
    }
    container.innerHTML = rowsHtml;
    return container;
  }
}

export class PlaceholderPanel {
  constructor(options = {}) { this.buttons = options.buttons || ["Action 1", "Action 2"]; }
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

    // ── Row 1: Welcome Banner (12) ────────────────────────────────────────
    const welcomeCol = document.createElement("div");
    welcomeCol.className = "dashboard-grid-col col-span-12";
    welcomeCol.appendChild(new WelcomeBanner().render());
    outerContainer.appendChild(welcomeCol);

    // ── Row 2: Business Status Bar (12) ───────────────────────────────────
    const statusCol = document.createElement("div");
    statusCol.className = "dashboard-grid-col col-span-12";
    statusCol.appendChild(new BusinessStatus().render());
    outerContainer.appendChild(statusCol);

    // ── Row 3: KPI Scorecards (12) ────────────────────────────────────────
    const kpiCol = document.createElement("div");
    kpiCol.className = "dashboard-grid-col col-span-12";
    kpiCol.appendChild(new KPIGrid().render());
    outerContainer.appendChild(kpiCol);

    // ── Row 4: Executive Mini KPI Charts (12) ─────────────────────────────
    const miniKpiCol = document.createElement("div");
    miniKpiCol.className = "dashboard-grid-col col-span-12";
    miniKpiCol.appendChild(new MiniKPIGrid().render());
    outerContainer.appendChild(miniKpiCol);

    // ── Row 4b: Central Interactive Analytics Toolbar (12) ────────────────
    const toolbarCol = document.createElement("div");
    toolbarCol.className = "dashboard-grid-col col-span-12";
    toolbarCol.appendChild(new AnalyticsToolbar().render());
    outerContainer.appendChild(toolbarCol);

    // ── Row 5: Sales Trend (8) + Revenue Trend (4) ────────────────────────
    const salesCol = document.createElement("div");
    salesCol.className = "dashboard-grid-col col-span-8";
    salesCol.appendChild(new SalesTrend().render());
    outerContainer.appendChild(salesCol);

    const revenueCol = document.createElement("div");
    revenueCol.className = "dashboard-grid-col col-span-4";
    revenueCol.appendChild(new RevenueTrend().render());
    outerContainer.appendChild(revenueCol);

    // ── Row 6: Inventory Distribution (6) + Category Sales (6) ───────────
    const inventoryCol = document.createElement("div");
    inventoryCol.className = "dashboard-grid-col col-span-6";
    inventoryCol.appendChild(new InventoryDistribution().render());
    outerContainer.appendChild(inventoryCol);

    const categoryCol = document.createElement("div");
    categoryCol.className = "dashboard-grid-col col-span-6";
    categoryCol.appendChild(new CategorySales().render());
    outerContainer.appendChild(categoryCol);

    // ── Row 7: Business Performance Comparison (12) ───────────────────────
    const comparisonCol = document.createElement("div");
    comparisonCol.className = "dashboard-grid-col col-span-12";
    comparisonCol.appendChild(new BusinessComparison().render());
    outerContainer.appendChild(comparisonCol);

    // ── Row 8: Top Selling Products (6) + Recent Activities (6) ──────────
    const topSellingCol = document.createElement("div");
    topSellingCol.className = "dashboard-grid-col col-span-6";
    topSellingCol.appendChild(new TopSellingProducts().render());
    outerContainer.appendChild(topSellingCol);

    const recentActivitiesCol = document.createElement("div");
    recentActivitiesCol.className = "dashboard-grid-col col-span-6";
    recentActivitiesCol.appendChild(new RecentActivities().render());
    outerContainer.appendChild(recentActivitiesCol);

    // ── Row 9: Notifications (6) + Quick Actions (6) ──────────────────────
    const notificationsCol = document.createElement("div");
    notificationsCol.className = "dashboard-grid-col col-span-6";
    notificationsCol.appendChild(new Notifications().render());
    outerContainer.appendChild(notificationsCol);

    const quickCol = document.createElement("div");
    quickCol.className = "dashboard-grid-col col-span-6";
    quickCol.appendChild(new QuickActions().render());
    outerContainer.appendChild(quickCol);

    // ── Row 9b: Favorites & Recently Visited (12) ──────────────────────────
    const favCol = document.createElement("div");
    favCol.className = "dashboard-grid-col col-span-12";
    favCol.appendChild(new FavoritesManager().render());
    outerContainer.appendChild(favCol);

    // ── Row 10: Business Health Summary (12) ──────────────────────────────
    const healthCol = document.createElement("div");
    healthCol.className = "dashboard-grid-col col-span-12";
    healthCol.appendChild(new BusinessHealth().render());
    outerContainer.appendChild(healthCol);

    this.element = outerContainer;
    return outerContainer;
  }
}
