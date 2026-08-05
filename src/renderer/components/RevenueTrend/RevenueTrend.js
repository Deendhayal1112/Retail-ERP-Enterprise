/**
 * RevenueTrend.js
 * Retail ERP Enterprise — Reusable Revenue Trend & Profit Analytics Component
 *
 * Implements:
 * - RevenueTrend (Main coordinator card)
 * - RevenueTrendHeader (Title description header row)
 * - RevenueTrendChart (Visual combo line area canvas)
 * - RevenueTrendSummary (Financial metrics summaries list)
 * - RevenueTrendToolbar (Range and Export action buttons)
 * - RevenueTrendLegend (Key dataset labels)
 */

"use strict";

export class RevenueTrendToolbar {
  constructor(options = {}) {
    this.onRangeChange = options.onRangeChange || null;
    this.onExport = options.onExport || null;
    this.onFullScreen = options.onFullScreen || null;
  }

  render() {
    const box = document.createElement("div");
    box.className = "revenue-trend-toolbar-box";

    // Time filter dropdown
    const select = document.createElement("select");
    select.className = "revenue-trend-filter-select";
    select.setAttribute("aria-label", "Select revenue trend period");

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
      if (r.key === "month") opt.selected = true; // default
      select.appendChild(opt);
    });

    if (this.onRangeChange) {
      select.addEventListener("change", (e) => this.onRangeChange(e.target.value));
    }
    box.appendChild(select);

    // Export Action Button
    const btnExport = document.createElement("button");
    btnExport.className = "revenue-trend-action-btn";
    btnExport.innerHTML = `<span>Export</span>`;
    btnExport.addEventListener("click", () => {
      console.log("[RevenueTrend Action] Initiating document excel spreadsheet export.");
      if (this.onExport) this.onExport("csv");
    });
    box.appendChild(btnExport);

    // Full Screen Button
    const btnFull = document.createElement("button");
    btnFull.className = "revenue-trend-action-btn";
    btnFull.innerHTML = `<span>⛶</span>`;
    btnFull.addEventListener("click", () => {
      console.log("[RevenueTrend Action] Toggling full viewport layout mode.");
      if (this.onFullScreen) this.onFullScreen();
    });
    box.appendChild(btnFull);

    return box;
  }
}

export class RevenueTrendHeader {
  constructor(options = {}) {
    this.title = options.title || "Revenue Overview";
    this.subtitle = options.subtitle || "Weekly financial index indicators";
    this.onRangeChange = options.onRangeChange || null;
    this.onExport = options.onExport || null;
    this.onFullScreen = options.onFullScreen || null;
  }

  render() {
    const header = document.createElement("header");
    header.className = "revenue-trend-header-row";

    header.innerHTML = `
      <div class="revenue-trend-header-details">
        <h3 class="revenue-trend-title-text">${this.title}</h3>
        <span class="revenue-trend-subtitle-text">${this.subtitle}</span>
      </div>
    `;

    const toolbar = new RevenueTrendToolbar({
      onRangeChange: this.onRangeChange,
      onExport: this.onExport,
      onFullScreen: this.onFullScreen
    });

    header.appendChild(toolbar.render());
    return header;
  }
}

export class RevenueTrendLegend {
  render() {
    const row = document.createElement("div");
    row.className = "revenue-trend-legend-row";
    row.innerHTML = `
      <div class="revenue-trend-legend-item-tag">
        <span class="revenue-trend-legend-color-dot revenue-line"></span>
        <span>Revenue</span>
      </div>
      <div class="revenue-trend-legend-item-tag">
        <span class="revenue-trend-legend-color-dot profit-line"></span>
        <span>Gross Profit</span>
      </div>
    `;
    return row;
  }
}

export class RevenueTrendChart {
  render() {
    const area = document.createElement("div");
    area.className = "revenue-trend-canvas-area";

    // Legend
    area.appendChild(new RevenueTrendLegend().render());

    // Mock graphics wrapper
    const graphWrapper = document.createElement("div");
    graphWrapper.className = "revenue-trend-mock-graphics";

    const dotsHeights = ["25%", "50%", "70%", "85%", "45%"];
    dotsHeights.forEach(h => {
      const dot = document.createElement("div");
      dot.className = "revenue-trend-mock-dot";
      dot.style.bottom = h;
      graphWrapper.appendChild(dot);
    });

    area.appendChild(graphWrapper);
    return area;
  }
}

export class RevenueTrendSummary {
  constructor(options = {}) {
    this.options = {
      total: options.total || "$142,500.00",
      profit: options.profit || "$42,120.50",
      margin: options.margin || "29.5% Margin",
      average: options.average || "$132.50 Avg",
      growth: options.growth || "+14.2% Growth",
      achievement: options.achievement || "94.2% Met",
      ...options
    };
  }

  render() {
    const grid = document.createElement("div");
    grid.className = "revenue-trend-summary-grid";

    const createCell = (label, value) => {
      const col = document.createElement("div");
      col.className = "revenue-trend-summary-item";
      col.innerHTML = `
        <span class="revenue-trend-summary-label">${label}</span>
        <span class="revenue-trend-summary-value">${value}</span>
      `;
      return col;
    };

    grid.appendChild(createCell("Total Revenue", this.options.total));
    grid.appendChild(createCell("Gross Profit", this.options.profit));
    grid.appendChild(createCell("Profit Margin", this.options.margin));
    grid.appendChild(createCell("Avg Order Value", this.options.average));
    grid.appendChild(createCell("Growth Rate", this.options.growth));
    grid.appendChild(createCell("Quota Achievement", this.options.achievement));

    return grid;
  }
}

// ─────────────────────────────────────────────────────
// MAIN REVENUE TREND COMPONENT
// ─────────────────────────────────────────────────────

export default class RevenueTrend {
  constructor(options = {}) {
    this.options = options;
    this.element = null;
  }

  render() {
    const card = document.createElement("div");
    card.className = "revenue-trend-card";

    // 1. Header & Toolbars
    const header = new RevenueTrendHeader({
      title: "Revenue & Profit Analytics",
      subtitle: "Gross financial summaries metrics tracking",
      onRangeChange: (val) => console.log(`[RevenueTrend Component] Range changed parameters to: ${val}`),
      onExport: (type) => console.log(`[RevenueTrend Component] Exporting document spreadsheet in format: ${type}`),
      onFullScreen: () => console.log("[RevenueTrend Component] Toggling maximize focus state overlay.")
    });
    card.appendChild(header.render());

    // 2. Chart Area
    const chart = new RevenueTrendChart();
    card.appendChild(chart.render());

    // 3. Summary Footer Rows
    const summary = new RevenueTrendSummary();
    card.appendChild(summary.render());

    this.element = card;
    return card;
  }
}
