/**
 * CategorySales.js
 * Retail ERP Enterprise — Category-wise Sales Analytics Component
 *
 * Implements:
 * - CategorySales (Main coordinator component)
 * - CategorySalesHeader (Header title details row)
 * - CategorySalesChart (Horizontal bar progress stacks)
 * - CategorySalesSummary (Totals and performance values grid)
 * - CategoryInsights (Insights warning logs)
 * - CategoryToolbar (Range and Export action button buttons)
 * - CategoryLegend (Data series dots)
 */

"use strict";

export class CategoryToolbar {
  constructor(options = {}) {
    this.onRangeChange = options.onRangeChange || null;
    this.onExport = options.onExport || null;
    this.onFullScreen = options.onFullScreen || null;
  }

  render() {
    const box = document.createElement("div");
    box.className = "category-sales-toolbar-box";

    // Period selector dropdown
    const select = document.createElement("select");
    select.className = "category-sales-filter-select";
    select.setAttribute("aria-label", "Select category sales period");

    const periods = [
      { key: "today", text: "Today" },
      { key: "7d", text: "Last 7 Days" },
      { key: "month", text: "This Month" },
      { key: "last_month", text: "Last Month" },
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

    // Export Excel action button
    const btnExport = document.createElement("button");
    btnExport.className = "category-sales-action-btn";
    btnExport.innerHTML = `<span>Export</span>`;
    btnExport.addEventListener("click", () => {
      console.log("[CategorySales Action] Initiating document excel spreadsheet export.");
      if (this.onExport) this.onExport("csv");
    });
    box.appendChild(btnExport);

    // Full Screen Button
    const btnFull = document.createElement("button");
    btnFull.className = "category-sales-action-btn";
    btnFull.innerHTML = `<span>⛶</span>`;
    btnFull.addEventListener("click", () => {
      console.log("[CategorySales Action] Toggling full viewport layout mode.");
      if (this.onFullScreen) this.onFullScreen();
    });
    box.appendChild(btnFull);

    return box;
  }
}

export class CategorySalesHeader {
  constructor(options = {}) {
    this.title = options.title || "Category Sales";
    this.subtitle = options.subtitle || "Category level stock performance logs";
    this.onRangeChange = options.onRangeChange || null;
    this.onExport = options.onExport || null;
    this.onFullScreen = options.onFullScreen || null;
  }

  render() {
    const header = document.createElement("header");
    header.className = "category-sales-header-row";

    header.innerHTML = `
      <div class="category-sales-header-details">
        <h3 class="category-sales-title-text">${this.title}</h3>
        <span class="category-sales-subtitle-text">${this.subtitle}</span>
      </div>
    `;

    const toolbar = new CategoryToolbar({
      onRangeChange: this.onRangeChange,
      onExport: this.onExport,
      onFullScreen: this.onFullScreen
    });

    header.appendChild(toolbar.render());
    return header;
  }
}

export class CategoryLegend {
  render() {
    const row = document.createElement("div");
    row.className = "category-sales-legend-row";
    row.innerHTML = `
      <div class="category-sales-legend-item">
        <span class="category-sales-legend-dot apparel"></span>
        <span>Apparel & Clothing</span>
      </div>
      <div class="category-sales-legend-item">
        <span class="category-sales-legend-dot footwear"></span>
        <span>Footwear Shoes</span>
      </div>
      <div class="category-sales-legend-item">
        <span class="category-sales-legend-dot electronics"></span>
        <span>Electronics Accessories</span>
      </div>
    `;
    return row;
  }
}

export class CategorySalesChart {
  render() {
    const canvas = document.createElement("div");
    canvas.className = "category-sales-canvas-area";

    // Legend
    canvas.appendChild(new CategoryLegend().render());

    // Horizontal bars progress stack
    const barStack = document.createElement("div");
    barStack.className = "category-sales-bar-chart-stack";

    const data = [
      { name: "Apparel & Clothing", percent: 75, val: "$28,400.00", class: "apparel" },
      { name: "Footwear Shoes", percent: 55, val: "$16,200.00", class: "footwear" },
      { name: "Electronics Accessories", percent: 35, val: "$8,500.00", class: "electronics" }
    ];

    data.forEach(item => {
      const row = document.createElement("div");
      row.className = "category-sales-bar-row";

      row.innerHTML = `
        <div class="category-sales-bar-info">
          <span>${item.name}</span>
          <strong>${item.val} (${item.percent}%)</strong>
        </div>
        <div class="category-sales-bar-track">
          <div class="category-sales-bar-fill ${item.class}" style="width: ${item.percent}%"></div>
        </div>
      `;

      barStack.appendChild(row);
    });

    canvas.appendChild(barStack);
    return canvas;
  }
}

export class CategoryInsights {
  constructor(options = {}) {
    this.insights = options.insights || [
      { type: "trending", title: "Fastest Growing Category", desc: "Apparel & Clothing (+18.4% growth trigger)" },
      { type: "warning", title: "Lowest Performing Category", desc: "Electronics Accessories (-2.5% decrease limit)" },
      { type: "trending", title: "Recommended Stock Actions", desc: "Increase Footwear levels before weekend surge" }
    ];
  }

  render() {
    const col = document.createElement("div");
    col.className = "category-insights-panel";

    const label = document.createElement("span");
    col.appendChild(label);
    label.className = "category-insights-panel-header";
    label.textContent = "AI Financial Category Insights";

    this.insights.forEach(ins => {
      const card = document.createElement("div");
      card.className = `category-insights-row-card ${ins.type}`;
      card.innerHTML = `
        <span style="font-weight: 700; color: var(--text-primary); font-size: 0.725rem;">${ins.title}</span>
        <span style="font-size: 0.775rem; color: var(--text-secondary); line-height: var(--lh-snug);">${ins.desc}</span>
      `;
      col.appendChild(card);
    });

    return col;
  }
}

export class CategorySalesSummary {
  constructor(options = {}) {
    this.options = {
      best: options.best || "Apparel & Clothing",
      revenue: options.revenue || "$53,100.00",
      orders: options.orders || "540 Orders",
      growth: options.growth || "+11.2% Growth",
      share: options.share || "53% Share",
      average: options.average || "$98.50 ticket",
      ...options
    };
  }

  render() {
    const grid = document.createElement("div");
    grid.className = "category-sales-summary-grid";

    const createCell = (label, value) => {
      const col = document.createElement("div");
      col.className = "category-sales-summary-item";
      col.innerHTML = `
        <span class="category-sales-summary-label">${label}</span>
        <span class="category-sales-summary-value">${value}</span>
      `;
      return col;
    };

    grid.appendChild(createCell("Best Category", this.options.best));
    grid.appendChild(createCell("Total Revenue", this.options.revenue));
    grid.appendChild(createCell("Growth Rate", this.options.growth));

    return grid;
  }
}

// ─────────────────────────────────────────────────────
// MAIN CATEGORY SALES COMPONENT
// ─────────────────────────────────────────────────────

export default class CategorySales {
  constructor(options = {}) {
    this.options = options;
    this.element = null;
  }

  render() {
    const card = document.createElement("div");
    card.className = "category-sales-card";

    // 1. Header Details
    const header = new CategorySalesHeader({
      title: "Category-wise Sales Analytics",
      subtitle: "Category level checkouts breakdown analytics",
      onRangeChange: (val) => console.log(`[CategorySales] Range changed parameters to: ${val}`),
      onExport: (type) => console.log(`[CategorySales] Exporting document spreadsheet in format: ${type}`),
      onFullScreen: () => console.log("[CategorySales] Toggling maximize focus state overlay.")
    });
    card.appendChild(header.render());

    // 2. Split Body (Chart on left, Insights Panel on right)
    const bodyGrid = document.createElement("div");
    bodyGrid.className = "category-sales-body-grid";

    bodyGrid.appendChild(new CategorySalesChart().render());
    bodyGrid.appendChild(new CategoryInsights().render());

    card.appendChild(bodyGrid);

    // 3. Summary Footer Row
    card.appendChild(new CategorySalesSummary().render());

    this.element = card;
    return card;
  }
}
