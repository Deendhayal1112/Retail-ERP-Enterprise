/**
 * SalesTrend.js
 * Retail ERP Enterprise — Reusable Sales Trend Chart Component
 *
 * Implements:
 * - SalesTrend (Main coordinator card)
 * - SalesTrendHeader (Title description header row)
 * - SalesTrendChart (Visual canvas line area plots)
 * - SalesTrendSummary (Sales parameters grid rows)
 * - SalesTrendToolbar (Range and Export action buttons)
 * - SalesTrendLegend (Key dataset labels)
 */

"use strict";

export class SalesTrendToolbar {
  constructor(options = {}) {
    this.onRangeChange = options.onRangeChange || null;
    this.onExport = options.onExport || null;
    this.onFullScreen = options.onFullScreen || null;
  }

  render() {
    const box = document.createElement("div");
    box.className = "sales-trend-toolbar-box";

    // Time filter dropdown
    const select = document.createElement("select");
    select.className = "sales-trend-filter-select";
    select.setAttribute("aria-label", "Select sales trend period");

    const ranges = [
      { key: "today", text: "Today" },
      { key: "7d", text: "Last 7 Days" },
      { key: "month", text: "This Month" },
      { key: "last_month", text: "Last Month" },
      { key: "quarter", text: "This Quarter" },
      { key: "year", text: "This Year" },
      { key: "custom", text: "Custom Range (Static)" }
    ];

    ranges.forEach(r => {
      const opt = document.createElement("option");
      opt.value = r.key;
      opt.textContent = r.text;
      if (r.key === "7d") opt.selected = true; // default
      select.appendChild(opt);
    });

    if (this.onRangeChange) {
      select.addEventListener("change", (e) => this.onRangeChange(e.target.value));
    }
    box.appendChild(select);

    // Export Action Button
    const btnExport = document.createElement("button");
    btnExport.className = "sales-trend-action-btn";
    btnExport.innerHTML = `<span>Export</span>`;
    btnExport.addEventListener("click", () => {
      console.log("[SalesTrend Action] Initiating document excel spreadsheet export.");
      if (this.onExport) this.onExport("csv");
    });
    box.appendChild(btnExport);

    // Full Screen Button
    const btnFull = document.createElement("button");
    btnFull.className = "sales-trend-action-btn";
    btnFull.innerHTML = `<span>⛶ Maximize</span>`;
    btnFull.addEventListener("click", () => {
      console.log("[SalesTrend Action] Toggling full viewport layout mode.");
      if (this.onFullScreen) this.onFullScreen();
    });
    box.appendChild(btnFull);

    return box;
  }
}

export class SalesTrendHeader {
  constructor(options = {}) {
    this.title = options.title || "Sales Trend";
    this.subtitle = options.subtitle || "Weekly gross performance metrics overview";
    this.onRangeChange = options.onRangeChange || null;
    this.onExport = options.onExport || null;
    this.onFullScreen = options.onFullScreen || null;
  }

  render() {
    const header = document.createElement("header");
    header.className = "sales-trend-header-row";

    header.innerHTML = `
      <div class="sales-trend-header-details">
        <h3 class="sales-trend-title-text">${this.title}</h3>
        <span class="sales-trend-subtitle-text">${this.subtitle}</span>
      </div>
    `;

    const toolbar = new SalesTrendToolbar({
      onRangeChange: this.onRangeChange,
      onExport: this.onExport,
      onFullScreen: this.onFullScreen
    });

    header.appendChild(toolbar.render());
    return header;
  }
}

export class SalesTrendLegend {
  render() {
    const row = document.createElement("div");
    row.className = "sales-trend-legend-row";
    row.innerHTML = `
      <div class="sales-trend-legend-item-tag">
        <span class="sales-trend-legend-color-dot current-line"></span>
        <span>Sales Revenue</span>
      </div>
      <div class="sales-trend-legend-item-tag">
        <span class="sales-trend-legend-color-dot target-line"></span>
        <span>Target Performance</span>
      </div>
    `;
    return row;
  }
}

export class SalesTrendChart {
  render() {
    const area = document.createElement("div");
    area.className = "sales-trend-canvas-area";

    // Legend
    area.appendChild(new SalesTrendLegend().render());

    // Mock graphics wrapper
    const graphWrapper = document.createElement("div");
    graphWrapper.className = "sales-trend-mock-graphics";

    const dotsHeights = ["20%", "40%", "65%", "85%", "50%", "75%", "90%"];
    dotsHeights.forEach(h => {
      const dot = document.createElement("div");
      dot.className = "sales-trend-mock-dot";
      dot.style.bottom = h;
      graphWrapper.appendChild(dot);
    });

    area.appendChild(graphWrapper);
    return area;
  }
}

export class SalesTrendSummary {
  constructor(options = {}) {
    this.options = {
      total: options.total || "$38,400.00",
      average: options.average || "$5,485.00",
      bestDay: options.bestDay || "Saturday ($8,420)",
      growth: options.growth || "+12.4% Up",
      status: options.status || "Calibrated",
      ...options
    };
  }

  render() {
    const grid = document.createElement("div");
    grid.className = "sales-trend-summary-grid";

    const createCell = (label, value) => {
      const col = document.createElement("div");
      col.className = "sales-trend-summary-item";
      col.innerHTML = `
        <span class="sales-trend-summary-label">${label}</span>
        <span class="sales-trend-summary-value">${value}</span>
      `;
      return col;
    };

    grid.appendChild(createCell("Total Sales", this.options.total));
    grid.appendChild(createCell("Average Ticket", this.options.average));
    grid.appendChild(createCell("Peak Performance Day", this.options.bestDay));
    grid.appendChild(createCell("Growth Rate", this.options.growth));
    grid.appendChild(createCell("Telemetry Status", this.options.status));

    return grid;
  }
}

// ─────────────────────────────────────────────────────
// MAIN SALES TREND COMPONENT
// ─────────────────────────────────────────────────────

export default class SalesTrend {
  constructor(options = {}) {
    this.options = options;
    this.element = null;
  }

  render() {
    const card = document.createElement("div");
    card.className = "sales-trend-card";

    // 1. Header & Toolbars
    const header = new SalesTrendHeader({
      title: "Sales Trend Analytics",
      subtitle: "Daily checkout index performance metrics tracking",
      onRangeChange: (val) => console.log(`[SalesTrend Component] Range changed parameters to: ${val}`),
      onExport: (type) => console.log(`[SalesTrend Component] Exporting document spreadsheet in format: ${type}`),
      onFullScreen: () => console.log("[SalesTrend Component] Toggling maximize focus state overlay.")
    });
    card.appendChild(header.render());

    // 2. Chart Area
    const chart = new SalesTrendChart();
    card.appendChild(chart.render());

    // 3. Summary Footer Rows
    const summary = new SalesTrendSummary();
    card.appendChild(summary.render());

    this.element = card;
    return card;
  }
}
