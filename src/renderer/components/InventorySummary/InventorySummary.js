/**
 * InventorySummary.js
 * Retail ERP Enterprise — Inventory Summary Component
 *
 * Implements:
 * - InventorySummary (Main card manager)
 * - InventoryHeader (Header title rows & view buttons)
 * - InventoryMetric (Individual metric value boxes)
 * - StockHealthBar (Operational progress bar indicators)
 * - InventoryFooter (Financial totals)
 */

"use strict";

export class InventoryHeader {
  constructor(options = {}) {
    this.title = options.title || "Inventory Summary";
    this.subtitle = options.subtitle || "Warehouse catalogue status tracker";
  }

  render() {
    const header = document.createElement("header");
    header.className = "inventory-header-row";

    header.innerHTML = `
      <div class="inventory-header-details">
        <h3 class="inventory-title-text">${this.title}</h3>
        <span class="inventory-subtitle-text">${this.subtitle}</span>
      </div>
      <button class="inventory-btn-view-all">View Catalog</button>
    `;

    header.querySelector(".inventory-btn-view-all").addEventListener("click", () => {
      console.log("[Navigation Router] Redirecting user to inventory products list.");
    });

    return header;
  }
}

export class InventoryMetric {
  constructor(options = {}) {
    this.label = options.label || "";
    this.value = options.value || "0";
    this.type = options.type || "default"; // in-stock, low-stock, out-stock, default
  }

  render() {
    const col = document.createElement("div");
    col.className = `inventory-metric-item-card metric-${this.type}`;
    col.innerHTML = `
      <span class="inventory-metric-label">${this.label}</span>
      <span class="inventory-metric-value">${this.value}</span>
    `;
    return col;
  }
}

export class StockHealthBar {
  constructor(options = {}) {
    this.percentage = options.percentage || 85;
  }

  render() {
    const wrapper = document.createElement("div");
    wrapper.className = "inventory-health-progress-wrapper";

    wrapper.innerHTML = `
      <div class="health-bar-labels-row">
        <span>Operational Stock Health</span>
        <span class="health-bar-percentage-value">${this.percentage}% Optimal</span>
      </div>
      <div class="health-progress-track">
        <div class="health-progress-fill" style="width: ${this.percentage}%"></div>
      </div>
    `;

    return wrapper;
  }
}

export class InventoryFooter {
  constructor(options = {}) {
    this.valuation = options.valuation || "$482,500.00";
    this.reorder = options.reorder || "4 Items pending";
  }

  render() {
    const footer = document.createElement("footer");
    footer.className = "inventory-footer-row";
    footer.innerHTML = `
      <span>Total Inventory Valuation: <strong class="footer-valuation-accent">${this.valuation}</strong></span>
      <span>Reorders: <strong>${this.reorder}</strong></span>
    `;
    return footer;
  }
}

// ─────────────────────────────────────────────────────
// MAIN INVENTORY SUMMARY COMPONENT
// ─────────────────────────────────────────────────────

export default class InventorySummary {
  constructor(options = {}) {
    this.options = options;
    this.element = null;
  }

  render() {
    const card = document.createElement("div");
    card.className = "inventory-summary-card";

    // 1. Header
    card.appendChild(new InventoryHeader().render());

    // 2. Metrics Section (Total, In Stock, Low Stock, Out of Stock, Categories)
    const metricsGrid = document.createElement("div");
    metricsGrid.className = "inventory-metrics-grid";

    metricsGrid.appendChild(new InventoryMetric({ label: "Total Products", value: "840 Items" }).render());
    metricsGrid.appendChild(new InventoryMetric({ label: "In Stock", value: "720 Items", type: "in-stock" }).render());
    metricsGrid.appendChild(new InventoryMetric({ label: "Low Stock Alert", value: "14 Items", type: "low-stock" }).render());
    metricsGrid.appendChild(new InventoryMetric({ label: "Out of Stock", value: "8 Items", type: "out-stock" }).render());
    metricsGrid.appendChild(new InventoryMetric({ label: "Total Categories", value: "24 Groups" }).render());
    metricsGrid.appendChild(new InventoryMetric({ label: "Total Warehouses", value: "2 Location" }).render());

    card.appendChild(metricsGrid);

    // 3. Stock Health progress bar
    card.appendChild(new StockHealthBar({ percentage: 88 }).render());

    // 4. Footer summary details
    card.appendChild(new InventoryFooter().render());

    this.element = card;
    return card;
  }
}
