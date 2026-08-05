/**
 * Dashboard.js
 * Retail ERP Enterprise — Reusable Grid System & Dashboard Page
 *
 * Implements the reusable layout layout elements:
 * - GridContainer (12-column template gap 24px)
 * - GridRow (row grouping)
 * - GridColumn (span configurations)
 * - DashboardSection (master card panels with soft shadow & rounded corners)
 * - SectionHeader (titlebar)
 * - SectionBody (content wrapper)
 * - WidgetPlaceholder (shimmer skeleton logs)
 */

"use strict";

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

export class GridRow {
  constructor(options = {}) {
    this.options = options;
  }
  render(children = []) {
    const el = document.createElement("div");
    el.className = "dashboard-grid-row";
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

export class DashboardSection {
  constructor(options = {}) {
    this.options = options;
  }
  render(headerNode, bodyNode) {
    const card = document.createElement("section");
    card.className = "dashboard-section-card";
    if (headerNode) card.appendChild(headerNode);
    if (bodyNode) card.appendChild(bodyNode);
    return card;
  }
}

export class SectionHeader {
  constructor(options = {}) {
    this.title = options.title || "Section Title";
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
  constructor(options = {}) {
    this.options = options;
  }
  render(contentNode) {
    const body = document.createElement("div");
    body.className = "section-card-body";
    if (contentNode) body.appendChild(contentNode);
    return body;
  }
}

export class WidgetPlaceholder {
  constructor(options = {}) {
    this.height = options.height || 180;
  }
  render() {
    const placeholder = document.createElement("div");
    placeholder.className = "widget-skeleton-placeholder";
    placeholder.style.minHeight = `${this.height}px`;
    placeholder.innerHTML = `
      <div class="skeleton-shimmer-bar"></div>
      <div class="skeleton-shimmer-bar short"></div>
    `;
    return placeholder;
  }
}

// ─────────────────────────────────────────────────────
// 2. MAIN DASHBOARD PAGE CONTROLLER IMPLEMENTATION
// ─────────────────────────────────────────────────────

export default class Dashboard {
  constructor(options = {}) {
    this.options = options;
    this.element = null;
  }

  /**
   * Assembles the layout page components.
   * @returns {HTMLElement} The complete populated grid.
   */
  render() {
    const container = new GridContainer();
    const cols = [];

    // Helper to generate section-card with placeholders inside column wrappers
    const createSectionColumn = (title, subtitle, colSpan, height = 180) => {
      const header = new SectionHeader({ title, subtitle });
      const body = new SectionBody();
      const placeholder = new WidgetPlaceholder({ height });
      
      const bodyNode = body.render(placeholder.render());
      const section = new DashboardSection();
      const sectionNode = section.render(header.render(), bodyNode);

      return new GridColumn({ span: colSpan }).render([sectionNode]);
    };

    // A. Welcome Banner Section (12 Columns)
    const welcomeCol = new GridColumn({ span: 12 });
    const welcomeBanner = document.createElement("div");
    welcomeBanner.className = "dashboard-welcome-banner-strip";
    welcomeBanner.innerHTML = `
      <div class="welcome-banner-details">
        <span class="welcome-tag">Enterprise Retail Console</span>
        <h1 class="welcome-heading">Welcome to Retail ERP</h1>
        <p class="welcome-subtext">All database transactional instances and security credentials verified. Operational log status: 🟢 Active</p>
      </div>
      <div class="welcome-banner-actions">
        <button class="welcome-btn-pos" onclick="console.log('POS Billing shortcut clicked')">Launch POS Register</button>
      </div>
    `;
    cols.push(welcomeCol.render([welcomeBanner]));

    // B. KPI Section (4 widgets x 3 columns each)
    cols.push(createSectionColumn("Today's Sales", "Transactions value sum", 3, 100));
    cols.push(createSectionColumn("Today's Profit", "Net margin calculation", 3, 100));
    cols.push(createSectionColumn("Active Registers", "POS checkout lanes", 3, 100));
    cols.push(createSectionColumn("Low Stock Alerts", "Restock inventory trigger", 3, 100));

    // C. Charts Section (8 columns and 4 columns)
    cols.push(createSectionColumn("Sales Overview", "Weekly transaction aggregation", 8, 300));
    cols.push(createSectionColumn("Revenue Chart", "Category performance summaries", 4, 300));

    // D. Summaries Section (6 columns each)
    cols.push(createSectionColumn("Business Summary", "Profit and loss analytics", 6, 220));
    cols.push(createSectionColumn("Inventory Summary", "Warehouse stock tracking", 6, 220));

    // E. Details Section (6 columns each)
    cols.push(createSectionColumn("Recent Activity", "Operator actions security audit", 6, 220));
    cols.push(createSectionColumn("Quick Actions", "Launch billing and settings utilities", 6, 220));

    // F. Notification Area (12 Columns)
    cols.push(createSectionColumn("Notification Area", "Recent system notifications & database alerts", 12, 120));

    const gridNode = container.render(cols);
    this.element = gridNode;
    return gridNode;
  }
}
