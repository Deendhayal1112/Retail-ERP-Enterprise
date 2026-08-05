/**
 * InventoryDistribution.js
 * Retail ERP Enterprise — Inventory Distribution & Stock Health Component
 *
 * Implements:
 * - InventoryDistribution (Main coordinator component)
 * - InventoryDistributionHeader (Header title rows)
 * - InventoryDonutChart (Donut canvas ring visualization)
 * - InventorySummary (Totals and counts grid)
 * - StockHealthPanel (Side panel warning logs)
 * - InventoryToolbar (Range filters and maximize buttons)
 * - InventoryLegend (Chart labels legend dots)
 */

"use strict";

export class InventoryToolbar {
  constructor(options = {}) {
    this.onRangeChange = options.onRangeChange || null;
    this.onExport = options.onExport || null;
    this.onFullScreen = options.onFullScreen || null;
  }

  render() {
    const box = document.createElement("div");
    box.className = "inventory-dist-toolbar-box";

    // Period filter select
    const select = document.createElement("select");
    select.className = "inventory-dist-filter-select";
    select.setAttribute("aria-label", "Select inventory trend range");

    const periods = [
      { key: "today", text: "Today" },
      { key: "week", text: "This Week" },
      { key: "month", text: "This Month" },
      { key: "quarter", text: "This Quarter" },
      { key: "year", text: "This Year" },
      { key: "custom", text: "Custom Range (Static)" }
    ];

    periods.forEach(p => {
      const opt = document.createElement("option");
      opt.value = p.key;
      opt.textContent = p.text;
      if (p.key === "month") opt.selected = true; // default
      select.appendChild(opt);
    });

    if (this.onRangeChange) {
      select.addEventListener("change", (e) => this.onRangeChange(e.target.value));
    }
    box.appendChild(select);

    // Export button actions
    const btnExport = document.createElement("button");
    btnExport.className = "inventory-dist-action-btn";
    btnExport.innerHTML = `<span>Export</span>`;
    btnExport.addEventListener("click", () => {
      console.log("[InventoryDistribution Action] Initiating document excel spreadsheet export.");
      if (this.onExport) this.onExport("csv");
    });
    box.appendChild(btnExport);

    // Full Screen Button
    const btnFull = document.createElement("button");
    btnFull.className = "inventory-dist-action-btn";
    btnFull.innerHTML = `<span>⛶</span>`;
    btnFull.addEventListener("click", () => {
      console.log("[InventoryDistribution Action] Toggling full viewport layout mode.");
      if (this.onFullScreen) this.onFullScreen();
    });
    box.appendChild(btnFull);

    return box;
  }
}

export class InventoryDistributionHeader {
  constructor(options = {}) {
    this.title = options.title || "Inventory Overview";
    this.subtitle = options.subtitle || "Warehouse stock metrics indicators";
    this.onRangeChange = options.onRangeChange || null;
    this.onExport = options.onExport || null;
    this.onFullScreen = options.onFullScreen || null;
  }

  render() {
    const header = document.createElement("header");
    header.className = "inventory-dist-header-row";

    header.innerHTML = `
      <div class="inventory-dist-header-details">
        <h3 class="inventory-dist-title-text">${this.title}</h3>
        <span class="inventory-dist-subtitle-text">${this.subtitle}</span>
      </div>
    `;

    const toolbar = new InventoryToolbar({
      onRangeChange: this.onRangeChange,
      onExport: this.onExport,
      onFullScreen: this.onFullScreen
    });

    header.appendChild(toolbar.render());
    return header;
  }
}

export class InventoryLegend {
  render() {
    const row = document.createElement("div");
    row.className = "inventory-dist-legend-row";
    row.innerHTML = `
      <div class="inventory-dist-legend-item">
        <span class="inventory-dist-legend-dot in-stock"></span>
        <span>Optimal</span>
      </div>
      <div class="inventory-dist-legend-item">
        <span class="inventory-dist-legend-dot low-stock"></span>
        <span>Low Stock</span>
      </div>
      <div class="inventory-dist-legend-item">
        <span class="inventory-dist-legend-dot out-stock"></span>
        <span>Out of Stock</span>
      </div>
    `;
    return row;
  }
}

export class InventoryDonutChart {
  render() {
    const canvas = document.createElement("div");
    canvas.className = "inventory-dist-canvas-area";

    // Legend
    canvas.appendChild(new InventoryLegend().render());

    // Circular Ring Donut
    const ringWrap = document.createElement("div");
    ringWrap.className = "inventory-donut-mock-graphics";
    ringWrap.innerHTML = `<div class="inventory-donut-circle-ring"></div>`;
    canvas.appendChild(ringWrap);

    return canvas;
  }
}

export class StockHealthPanel {
  constructor(options = {}) {
    this.alerts = options.alerts || [
      { type: "danger", title: "Out of Stock alert", count: "8 Items affected" },
      { type: "warning", title: "Low Stock warnings", count: "14 Items threshold" },
      { type: "success", title: "Fast Moving products", count: "24 Items active" },
      { type: "info", title: "Dead Stock tracking", count: "3 Items inactive" }
    ];
  }

  render() {
    const col = document.createElement("div");
    col.className = "inventory-side-panel-alerts";

    const label = document.createElement("span");
    col.appendChild(label);
    label.className = "inventory-side-panel-header";
    label.textContent = "Operational Alerts Checklist";

    this.alerts.forEach(alt => {
      const card = document.createElement("div");
      card.className = `inventory-side-panel-row-card ${alt.type}-alert`;
      card.innerHTML = `
        <span style="font-weight: 600; color: var(--text-primary);">${alt.title}</span>
        <span style="font-size: 0.675rem; color: var(--text-muted); font-weight: 700;">${alt.count}</span>
      `;
      col.appendChild(card);
    });

    return col;
  }
}

export class InventorySummary {
  constructor(options = {}) {
    this.options = {
      total: options.total || "840 Items",
      inStock: options.inStock || "720 Items",
      lowStock: options.lowStock || "14 Items",
      outOfStock: options.outOfStock || "8 Items",
      categories: options.categories || "24 Groups",
      warehouses: options.warehouses || "2 Locations",
      ...options
    };
  }

  render() {
    const grid = document.createElement("div");
    grid.className = "inventory-dist-summary-grid";

    const createCell = (label, value) => {
      const col = document.createElement("div");
      col.className = "inventory-dist-summary-item";
      col.innerHTML = `
        <span class="inventory-dist-summary-label">${label}</span>
        <span class="inventory-dist-summary-value">${value}</span>
      `;
      return col;
    };

    grid.appendChild(createCell("Total Products", this.options.total));
    grid.appendChild(createCell("In Stock", this.options.inStock));
    grid.appendChild(createCell("Low Stock", this.options.lowStock));
    grid.appendChild(createCell("Out of Stock", this.options.outOfStock));
    grid.appendChild(createCell("Categories", this.options.categories));
    grid.appendChild(createCell("Warehouses", this.options.warehouses));

    return grid;
  }
}

// ─────────────────────────────────────────────────────
// MAIN INVENTORY DISTRIBUTION COMPONENT
// ─────────────────────────────────────────────────────

export default class InventoryDistribution {
  constructor(options = {}) {
    this.options = options;
    this.element = null;
  }

  render() {
    const card = document.createElement("div");
    card.className = "inventory-dist-card";

    // 1. Header & Toolbars
    const header = new InventoryDistributionHeader({
      title: "Inventory Distribution & Stock Health",
      subtitle: "Daily warehouse level stock limits metrics",
      onRangeChange: (val) => console.log(`[InventoryDistribution] Range changed parameters to: ${val}`),
      onExport: (type) => console.log(`[InventoryDistribution] Exporting document spreadsheet in format: ${type}`),
      onFullScreen: () => console.log("[InventoryDistribution] Toggling maximize focus state overlay.")
    });
    card.appendChild(header.render());

    // 2. Split Body (Chart on left, Side Panel Alerts on right)
    const bodyGrid = document.createElement("div");
    bodyGrid.className = "inventory-dist-body-grid";

    bodyGrid.appendChild(new InventoryDonutChart().render());
    bodyGrid.appendChild(new StockHealthPanel().render());

    card.appendChild(bodyGrid);

    // 3. Summary Footer Row
    card.appendChild(new InventorySummary().render());

    this.element = card;
    return card;
  }
}
