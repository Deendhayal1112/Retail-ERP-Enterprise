/**
 * RevenueAnalytics.js
 * Retail ERP Enterprise — Revenue Analytics Chart Component
 *
 * Implements:
 * - RevenueAnalytics (Main card manager)
 * - RevenueChartContainer (Visualization body panel)
 * - RevenueHeader (Details title rows)
 * - RevenueLegend (Color-coded indicators)
 * - RevenueFooter (Summary parameters metadata grid)
 * - RevenueTimeFilter (Time selection dropdown)
 */

"use strict";

export class RevenueTimeFilter {
  constructor(options = {}) {
    this.options = options;
    this.onChangeCallback = options.onChange || null;
  }

  render() {
    const select = document.createElement("select");
    select.className = "revenue-filter-dropdown-select";
    select.setAttribute("aria-label", "Select revenue analytics time range");

    const ranges = [
      { key: "today", label: "Today" },
      { key: "week", label: "This Week" },
      { key: "month", label: "This Month" },
      { key: "quarter", label: "This Quarter" },
      { key: "year", label: "This Year" },
      { key: "custom", label: "Custom Range (Static)" }
    ];

    ranges.forEach(range => {
      const opt = document.createElement("option");
      opt.value = range.key;
      opt.textContent = range.label;
      if (range.key === "month") opt.selected = true; // default
      select.appendChild(opt);
    });

    select.addEventListener("change", (e) => {
      console.log(`[Revenue Filter] Changing range key parameter to: ${e.target.value}`);
      if (this.onChangeCallback) {
        this.onChangeCallback(e.target.value);
      }
    });

    return select;
  }
}

export class RevenueHeader {
  constructor(options = {}) {
    this.title = options.title || "Revenue Overview";
    this.subtitle = options.subtitle || "Financial analytics database queries visualizer";
    this.onFilterChange = options.onFilterChange || null;
  }

  render() {
    const header = document.createElement("header");
    header.className = "revenue-header-row";

    header.innerHTML = `
      <div class="revenue-header-details">
        <h3 class="revenue-title-text">${this.title}</h3>
        <span class="revenue-subtitle-text">${this.subtitle}</span>
      </div>
      <div class="revenue-controls-box"></div>
    `;

    const controls = header.querySelector(".revenue-controls-box");
    const filter = new RevenueTimeFilter({ onChange: this.onFilterChange });
    controls.appendChild(filter.render());

    return header;
  }
}

export class RevenueLegend {
  render() {
    const row = document.createElement("div");
    row.className = "revenue-legend-row";
    row.innerHTML = `
      <div class="revenue-legend-item-tag">
        <span class="revenue-legend-color-dot revenue-line"></span>
        <span>Total Revenue</span>
      </div>
      <div class="revenue-legend-item-tag">
        <span class="revenue-legend-color-dot profit-line"></span>
        <span>Gross Profit</span>
      </div>
    `;
    return row;
  }
}

export class RevenueChartContainer {
  render() {
    const area = document.createElement("div");
    area.className = "revenue-chart-visualization-canvas-area";

    // Legend
    area.appendChild(new RevenueLegend().render());

    // Mock combo area/line chart graphic visual elements
    const graphWrapper = document.createElement("div");
    graphWrapper.className = "revenue-mock-chart-graphics-wrapper";

    const dots = [
      { height: "20%", type: "revenue-dot" },
      { height: "45%", type: "success-dot" },
      { height: "60%", type: "revenue-dot" },
      { height: "85%", type: "success-dot" },
      { height: "55%", type: "revenue-dot" }
    ];

    dots.forEach(pt => {
      const dot = document.createElement("div");
      dot.className = `revenue-mock-chart-dot-point ${pt.type}`;
      dot.style.bottom = pt.height;
      graphWrapper.appendChild(dot);
    });

    area.appendChild(graphWrapper);
    return area;
  }
}

export class RevenueFooter {
  constructor(options = {}) {
    this.options = {
      totalRevenue: options.totalRevenue || "$142,500.00",
      grossProfit: options.grossProfit || "$42,120.50",
      revenueGrowth: options.revenueGrowth || "+14.2% Growth",
      averageOrderValue: options.averageOrderValue || "$132.50 Avg",
      ...options
    };
  }

  render() {
    const footerGrid = document.createElement("footer");
    footerGrid.className = "revenue-chart-summary-footer-grid";

    const createSummaryItem = (label, value) => {
      const col = document.createElement("div");
      col.className = "revenue-summary-footer-item-card";
      col.innerHTML = `
        <span class="revenue-summary-item-label">${label}</span>
        <span class="revenue-summary-item-value">${value}</span>
      `;
      return col;
    };

    footerGrid.appendChild(createSummaryItem("Total Revenue", this.options.totalRevenue));
    footerGrid.appendChild(createSummaryItem("Gross Profit", this.options.grossProfit));
    footerGrid.appendChild(createSummaryItem("Growth Rate", this.options.revenueGrowth));
    footerGrid.appendChild(createSummaryItem("Avg Ticket Size", this.options.averageOrderValue));

    return footerGrid;
  }
}

// ─────────────────────────────────────────────────────
// MAIN REVENUE ANALYTICS COMPONENT
// ─────────────────────────────────────────────────────

export default class RevenueAnalytics {
  constructor(options = {}) {
    this.options = options;
    this.element = null;
  }

  render() {
    const card = document.createElement("div");
    card.className = "revenue-analytics-card";

    // 1. Header
    const header = new RevenueHeader({
      title: "Revenue Analytics",
      subtitle: "Monthly gross sales and financial performance summary",
      onFilterChange: (rangeKey) => {
        console.log(`[RevenueAnalytics Trigger] Fetching static chart telemetry parameters for: ${rangeKey}`);
      }
    });
    card.appendChild(header.render());

    // 2. Chart Area
    const chartArea = new RevenueChartContainer();
    card.appendChild(chartArea.render());

    // 3. Summary Footer
    const footer = new RevenueFooter();
    card.appendChild(footer.render());

    this.element = card;
    return card;
  }
}
