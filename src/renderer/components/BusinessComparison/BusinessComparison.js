/**
 * BusinessComparison.js
 * Retail ERP Enterprise — Business Performance Comparison Component
 *
 * Implements:
 * - BusinessComparison (Main coordinator component)
 * - ComparisonHeader (Title, mode pills, toolbar controls)
 * - ComparisonChart (Grouped multi-bar placeholder canvas)
 * - ComparisonSummary (Period difference metric grid)
 * - ComparisonInsights (Right-side AI insight cards)
 * - ComparisonToolbar (Export and full-screen action buttons)
 * - ComparisonLegend (Current vs Previous period dots)
 */

"use strict";

// ─────────────────────────────────────────────────────
// COMPARISON MODE TABS
// ─────────────────────────────────────────────────────

export class ComparisonModeTabs {
  constructor(options = {}) {
    this.activeMode = options.activeMode || "month";
    this.onChange = options.onChange || null;
  }

  render() {
    const tabs = document.createElement("div");
    tabs.className = "comparison-mode-tabs";

    const modes = [
      { key: "day",     text: "Day" },
      { key: "week",    text: "Week" },
      { key: "month",   text: "Month" },
      { key: "quarter", text: "Quarter" },
      { key: "year",    text: "Year" },
      { key: "custom",  text: "Custom" }
    ];

    modes.forEach(m => {
      const btn = document.createElement("button");
      btn.className = `comparison-mode-tab-btn${m.key === this.activeMode ? " active" : ""}`;
      btn.textContent = m.text;
      btn.addEventListener("click", () => {
        tabs.querySelectorAll(".comparison-mode-tab-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        console.log(`[BusinessComparison] Comparison mode switched to: ${m.key}`);
        if (this.onChange) this.onChange(m.key);
      });
      tabs.appendChild(btn);
    });

    return tabs;
  }
}

// ─────────────────────────────────────────────────────
// TOOLBAR
// ─────────────────────────────────────────────────────

export class ComparisonToolbar {
  constructor(options = {}) {
    this.onRangeChange = options.onRangeChange || null;
    this.onExport     = options.onExport     || null;
    this.onFullScreen = options.onFullScreen || null;
    this.activeMode   = options.activeMode   || "month";
    this.onModeChange = options.onModeChange || null;
  }

  render() {
    const box = document.createElement("div");
    box.className = "comparison-toolbar-box";

    // Mode tabs
    const modeTabs = new ComparisonModeTabs({
      activeMode: this.activeMode,
      onChange: this.onModeChange
    });
    box.appendChild(modeTabs.render());

    // Custom period selector dropdown
    const select = document.createElement("select");
    select.className = "comparison-filter-select";
    select.setAttribute("aria-label", "Select comparison period");

    const periods = [
      { key: "today_vs_yesterday",     text: "Today vs Yesterday" },
      { key: "week_vs_last_week",      text: "This Week vs Last Week" },
      { key: "month_vs_last_month",    text: "This Month vs Last Month" },
      { key: "quarter_vs_last_quarter", text: "This Quarter vs Last Quarter" },
      { key: "year_vs_last_year",      text: "This Year vs Last Year" },
      { key: "custom",                 text: "Custom Period (Static)" }
    ];

    periods.forEach(p => {
      const opt = document.createElement("option");
      opt.value = p.key;
      opt.textContent = p.text;
      if (p.key === "month_vs_last_month") opt.selected = true;
      select.appendChild(opt);
    });

    if (this.onRangeChange) {
      select.addEventListener("change", (e) => this.onRangeChange(e.target.value));
    }
    box.appendChild(select);

    // Export button
    const btnExport = document.createElement("button");
    btnExport.className = "comparison-action-btn";
    btnExport.innerHTML = `<span>Export</span>`;
    btnExport.addEventListener("click", () => {
      console.log("[BusinessComparison Action] Initiating document excel spreadsheet export.");
      if (this.onExport) this.onExport("csv");
    });
    box.appendChild(btnExport);

    // Full Screen button
    const btnFull = document.createElement("button");
    btnFull.className = "comparison-action-btn";
    btnFull.innerHTML = `<span>⛶</span>`;
    btnFull.addEventListener("click", () => {
      console.log("[BusinessComparison Action] Toggling full viewport layout mode.");
      if (this.onFullScreen) this.onFullScreen();
    });
    box.appendChild(btnFull);

    return box;
  }
}

// ─────────────────────────────────────────────────────
// HEADER
// ─────────────────────────────────────────────────────

export class ComparisonHeader {
  constructor(options = {}) {
    this.title        = options.title    || "Business Performance Comparison";
    this.subtitle     = options.subtitle || "Period-over-period variance analytics";
    this.onRangeChange = options.onRangeChange || null;
    this.onExport     = options.onExport     || null;
    this.onFullScreen = options.onFullScreen || null;
    this.onModeChange = options.onModeChange || null;
  }

  render() {
    const header = document.createElement("header");
    header.className = "comparison-header-row";

    const details = document.createElement("div");
    details.className = "comparison-header-details";
    details.innerHTML = `
      <h3 class="comparison-title-text">${this.title}</h3>
      <span class="comparison-subtitle-text">${this.subtitle}</span>
    `;
    header.appendChild(details);

    const toolbar = new ComparisonToolbar({
      onRangeChange: this.onRangeChange,
      onExport:      this.onExport,
      onFullScreen:  this.onFullScreen,
      onModeChange:  this.onModeChange
    });
    header.appendChild(toolbar.render());

    return header;
  }
}

// ─────────────────────────────────────────────────────
// LEGEND
// ─────────────────────────────────────────────────────

export class ComparisonLegend {
  render() {
    const row = document.createElement("div");
    row.className = "comparison-legend-row";
    row.innerHTML = `
      <div class="comparison-legend-item">
        <span class="comparison-legend-dot current-period"></span>
        <span>This Month</span>
      </div>
      <div class="comparison-legend-item">
        <span class="comparison-legend-dot previous-period"></span>
        <span>Last Month</span>
      </div>
    `;
    return row;
  }
}

// ─────────────────────────────────────────────────────
// CHART (grouped multi-bar placeholder)
// ─────────────────────────────────────────────────────

export class ComparisonChart {
  render() {
    const canvas = document.createElement("div");
    canvas.className = "comparison-canvas-area";

    // Legend
    canvas.appendChild(new ComparisonLegend().render());

    // Grouped bars data (placeholder)
    const barData = [
      { label: "Wk 1", current: "78%",  previous: "62%"  },
      { label: "Wk 2", current: "85%",  previous: "71%"  },
      { label: "Wk 3", current: "60%",  previous: "80%"  },
      { label: "Wk 4", current: "92%",  previous: "68%"  },
      { label: "Wk 5", current: "70%",  previous: "55%"  }
    ];

    const barGroups = document.createElement("div");
    barGroups.className = "comparison-bar-chart-groups";

    barData.forEach(d => {
      const group = document.createElement("div");
      group.className = "comparison-bar-group";

      const barCurrent = document.createElement("div");
      barCurrent.className = "comparison-bar-single current";
      barCurrent.style.height = d.current;
      barCurrent.title = `This Month: ${d.current}`;
      group.appendChild(barCurrent);

      const barPrev = document.createElement("div");
      barPrev.className = "comparison-bar-single previous";
      barPrev.style.height = d.previous;
      barPrev.title = `Last Month: ${d.previous}`;
      group.appendChild(barPrev);

      barGroups.appendChild(group);
    });

    canvas.appendChild(barGroups);

    // X-axis labels
    const xLabels = document.createElement("div");
    xLabels.className = "comparison-x-axis-labels";
    barData.forEach(d => {
      const lbl = document.createElement("span");
      lbl.textContent = d.label;
      xLabels.appendChild(lbl);
    });
    canvas.appendChild(xLabels);

    return canvas;
  }
}

// ─────────────────────────────────────────────────────
// INSIGHTS PANEL
// ─────────────────────────────────────────────────────

export class ComparisonInsights {
  constructor(options = {}) {
    this.insights = options.insights || [
      {
        type:  "best-period",
        title: "Best Performing Period",
        desc:  "Week 4 — $12,400.00 peak revenue spike (+34.2%)"
      },
      {
        type:  "weakest-period",
        title: "Weakest Period",
        desc:  "Week 3 — Revenue dipped 25% below monthly average"
      },
      {
        type:  "opportunity",
        title: "Growth Opportunity",
        desc:  "Footwear category underperforming. Stock push recommended"
      },
      {
        type:  "ai-insight",
        title: "AI Business Prediction",
        desc:  "Week 5 trend indicates +18% revenue trajectory vs prior month"
      }
    ];
  }

  render() {
    const col = document.createElement("div");
    col.className = "comparison-insights-panel";

    const label = document.createElement("span");
    label.className = "comparison-insights-header";
    label.textContent = "Period Performance Insights";
    col.appendChild(label);

    this.insights.forEach(ins => {
      const card = document.createElement("div");
      card.className = `comparison-insights-card ${ins.type}`;
      card.innerHTML = `
        <span style="font-weight: 700; color: var(--text-primary); font-size: 0.725rem;">${ins.title}</span>
        <span style="font-size: 0.75rem; color: var(--text-secondary); line-height: var(--lh-snug);">${ins.desc}</span>
      `;
      col.appendChild(card);
    });

    return col;
  }
}

// ─────────────────────────────────────────────────────
// SUMMARY ROW
// ─────────────────────────────────────────────────────

export class ComparisonSummary {
  constructor(options = {}) {
    this.options = {
      sales:     options.sales     || "+$8,200.00",
      revenue:   options.revenue   || "+$11,400.00",
      profit:    options.profit    || "+$3,120.00",
      orders:    options.orders    || "+124 Orders",
      customers: options.customers || "+38 Customers",
      trend:     options.trend     || "↑ Upward Trend",
      ...options
    };
  }

  render() {
    const grid = document.createElement("div");
    grid.className = "comparison-summary-grid";

    const createCell = (label, value, tone = "neutral") => {
      const col = document.createElement("div");
      col.className = "comparison-summary-item";
      col.innerHTML = `
        <span class="comparison-summary-label">${label}</span>
        <span class="comparison-summary-value ${tone}">${value}</span>
      `;
      return col;
    };

    grid.appendChild(createCell("Sales Diff",    this.options.sales,     "positive"));
    grid.appendChild(createCell("Revenue Diff",  this.options.revenue,   "positive"));
    grid.appendChild(createCell("Profit Diff",   this.options.profit,    "positive"));
    grid.appendChild(createCell("Orders Diff",   this.options.orders,    "positive"));
    grid.appendChild(createCell("Customer Growth", this.options.customers, "positive"));
    grid.appendChild(createCell("Overall Trend", this.options.trend));

    return grid;
  }
}

// ─────────────────────────────────────────────────────
// MAIN BUSINESS COMPARISON COMPONENT
// ─────────────────────────────────────────────────────

export default class BusinessComparison {
  constructor(options = {}) {
    this.options = options;
    this.element = null;
  }

  render() {
    const card = document.createElement("div");
    card.className = "business-comparison-card";

    // 1. Header + Toolbar + Mode Tabs
    const header = new ComparisonHeader({
      title:         "Business Performance Comparison",
      subtitle:      "Weekly / Monthly / Yearly period variance analytics",
      onRangeChange: (val) => console.log(`[BusinessComparison] Period changed to: ${val}`),
      onExport:      (type) => console.log(`[BusinessComparison] Exporting in format: ${type}`),
      onFullScreen:  () => console.log("[BusinessComparison] Toggling maximize overlay."),
      onModeChange:  (mode) => console.log(`[BusinessComparison] Mode changed to: ${mode}`)
    });
    card.appendChild(header.render());

    // 2. Split Body (Chart left, Insights right)
    const bodyGrid = document.createElement("div");
    bodyGrid.className = "comparison-body-grid";

    bodyGrid.appendChild(new ComparisonChart().render());
    bodyGrid.appendChild(new ComparisonInsights().render());

    card.appendChild(bodyGrid);

    // 3. Summary Footer Row
    card.appendChild(new ComparisonSummary().render());

    this.element = card;
    return card;
  }
}
