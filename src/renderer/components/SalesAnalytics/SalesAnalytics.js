/**
 * SalesAnalytics.js
 * Retail ERP Enterprise — Sales Analytics Chart Component
 *
 * Implements:
 * - SalesAnalytics (Main card manager)
 * - ChartContainer (Visualization body panel)
 * - ChartHeader (Details title rows)
 * - ChartLegend (Color-coded indicators)
 * - ChartFooter (Summary parameters metadata grid)
 * - TimeFilter (Time selection dropdown)
 */

"use strict";

export class TimeFilter {
  constructor(options = {}) {
    this.options = options;
    this.onChangeCallback = options.onChange || null;
  }

  render() {
    const select = document.createElement("select");
    select.className = "time-filter-dropdown-select";
    select.setAttribute("aria-label", "Select analytics time range");

    const ranges = [
      { key: "today", label: "Today" },
      { key: "yesterday", label: "Yesterday" },
      { key: "week", label: "This Week" },
      { key: "month", label: "This Month" },
      { key: "year", label: "This Year" },
      { key: "custom", label: "Custom Range (Static)" }
    ];

    ranges.forEach(range => {
      const opt = document.createElement("option");
      opt.value = range.key;
      opt.textContent = range.label;
      if (range.key === "week") opt.selected = true; // default
      select.appendChild(opt);
    });

    select.addEventListener("change", (e) => {
      console.log(`[Analytics Filter] Changing range key parameter to: ${e.target.value}`);
      if (this.onChangeCallback) {
        this.onChangeCallback(e.target.value);
      }
    });

    return select;
  }
}

export class ChartHeader {
  constructor(options = {}) {
    this.title = options.title || "Analytics Overview";
    this.subtitle = options.subtitle || "System telemetry logs data visualization";
    this.onFilterChange = options.onFilterChange || null;
  }

  render() {
    const header = document.createElement("header");
    header.className = "chart-header-row";

    header.innerHTML = `
      <div class="chart-header-details">
        <h3 class="chart-title-text">${this.title}</h3>
        <span class="chart-subtitle-text">${this.subtitle}</span>
      </div>
      <div class="chart-controls-box"></div>
    `;

    const controls = header.querySelector(".chart-controls-box");
    const filter = new TimeFilter({ onChange: this.onFilterChange });
    controls.appendChild(filter.render());

    return header;
  }
}

export class ChartLegend {
  render() {
    const row = document.createElement("div");
    row.className = "chart-legend-row";
    row.innerHTML = `
      <div class="legend-item-tag">
        <span class="legend-color-dot sales-line"></span>
        <span>Sales Revenue</span>
      </div>
      <div class="legend-item-tag">
        <span class="legend-color-dot target-line"></span>
        <span>Daily Target Limit</span>
      </div>
    `;
    return row;
  }
}

export class ChartContainer {
  render() {
    const area = document.createElement("div");
    area.className = "chart-visualization-canvas-area";

    // Legend
    area.appendChild(new ChartLegend().render());

    // Mock bar chart graph visual elements
    const graphWrapper = document.createElement("div");
    graphWrapper.className = "mock-chart-graphics-wrapper";

    const dataPoints = [
      { label: "Mon", height: "42%" },
      { label: "Tue", height: "55%" },
      { label: "Wed", height: "82%" },
      { label: "Thu", height: "60%" },
      { label: "Fri", height: "72%" },
      { label: "Sat", height: "90%" },
      { label: "Sun", height: "35%" }
    ];

    dataPoints.forEach(pt => {
      const pillar = document.createElement("div");
      pillar.className = "mock-chart-bar-pillar";
      pillar.style.height = pt.height;
      pillar.innerHTML = `<span class="chart-bar-pillar-label">${pt.label}</span>`;
      graphWrapper.appendChild(pillar);
    });

    area.appendChild(graphWrapper);
    return area;
  }
}

export class ChartFooter {
  constructor(options = {}) {
    this.options = {
      totalSales: options.totalSales || "$24,500.00",
      averageSales: options.averageSales || "$3,500.00",
      highestSalesDay: options.highestSalesDay || "$5,240.00 (Sat)",
      lowestSalesDay: options.lowestSalesDay || "$1,120.00 (Sun)",
      ...options
    };
  }

  render() {
    const footerGrid = document.createElement("footer");
    footerGrid.className = "chart-summary-footer-grid";

    const createSummaryItem = (label, value) => {
      const col = document.createElement("div");
      col.className = "summary-footer-item-card";
      col.innerHTML = `
        <span class="summary-item-label">${label}</span>
        <span class="summary-item-value">${value}</span>
      `;
      return col;
    };

    footerGrid.appendChild(createSummaryItem("Total Sales Sum", this.options.totalSales));
    footerGrid.appendChild(createSummaryItem("Avg Daily Value", this.options.averageSales));
    footerGrid.appendChild(createSummaryItem("Peak Performance Day", this.options.highestSalesDay));
    footerGrid.appendChild(createSummaryItem("Lowest Checkout Day", this.options.lowestSalesDay));

    return footerGrid;
  }
}

// ─────────────────────────────────────────────────────
// MAIN SALES ANALYTICS COMPONENT
// ─────────────────────────────────────────────────────

export default class SalesAnalytics {
  constructor(options = {}) {
    this.options = options;
    this.element = null;
  }

  render() {
    const card = document.createElement("div");
    card.className = "sales-analytics-card";

    // 1. Header
    const header = new ChartHeader({
      title: "Sales Analytics Overview",
      subtitle: "Weekly sales transactional tracking statistics",
      onFilterChange: (rangeKey) => {
        console.log(`[SalesAnalytics Trigger] Fetching static chart telemetry parameters for: ${rangeKey}`);
      }
    });
    card.appendChild(header.render());

    // 2. Chart Area
    const chartArea = new ChartContainer();
    card.appendChild(chartArea.render());

    // 3. Summary Footer
    const footer = new ChartFooter();
    card.appendChild(footer.render());

    this.element = card;
    return card;
  }
}
