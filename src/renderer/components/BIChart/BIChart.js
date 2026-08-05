/**
 * BIChart.js
 * Retail ERP Enterprise — Reusable Business Intelligence Chart Components
 *
 * Implements:
 * - BIChart (Main coordinator component)
 * - ChartContainer (Standard card wrapper)
 * - ChartHeader (Details row)
 * - ChartToolbar (Action filters container)
 * - ChartLegend (Colour-coded legends)
 * - ChartPlaceholder (Mock visual graphics renderer)
 * - ChartLoader (Absolute loading overlay spinner)
 * - ChartEmptyState (Blank/Unconfigured state views)
 * - TimeRangeSelector (Time range drop selector)
 * - ExportMenu (Export dropdown selector actions)
 */

"use strict";

export class TimeRangeSelector {
  constructor(options = {}) {
    this.onChange = options.onChange || null;
  }

  render() {
    const select = document.createElement("select");
    select.className = "bi-time-selector";
    select.setAttribute("aria-label", "Select BI range");

    const optionsList = [
      { value: "7d", text: "Last 7 Days" },
      { value: "30d", text: "Last 30 Days" },
      { value: "qtr", text: "This Quarter" },
      { value: "yr", text: "This Year" }
    ];

    optionsList.forEach(opt => {
      const el = document.createElement("option");
      el.value = opt.value;
      el.textContent = opt.text;
      select.appendChild(el);
    });

    if (this.onChange) {
      select.addEventListener("change", (e) => this.onChange(e.target.value));
    }

    return select;
  }
}

export class ExportMenu {
  constructor(options = {}) {
    this.onExport = options.onExport || null;
  }

  render() {
    const wrapper = document.createElement("div");
    wrapper.className = "bi-export-menu";

    const btn = document.createElement("button");
    btn.className = "bi-export-btn";
    btn.innerHTML = `<span>Export</span> <span>▼</span>`;

    const dropdown = document.createElement("div");
    dropdown.className = "bi-export-dropdown";

    const exportTypes = [
      { key: "csv", label: "Export as CSV Spreadsheet" },
      { key: "pdf", label: "Export as Adobe PDF" },
      { key: "png", label: "Export as High-Res PNG" }
    ];

    exportTypes.forEach(type => {
      const item = document.createElement("div");
      item.className = "bi-export-item";
      item.textContent = type.label;
      item.addEventListener("click", () => {
        dropdown.classList.remove("show");
        console.log(`[BI Export] Processing layout document export type: ${type.key}`);
        if (this.onExport) this.onExport(type.key);
      });
      dropdown.appendChild(item);
    });

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.classList.toggle("show");
    });

    document.addEventListener("click", () => {
      dropdown.classList.remove("show");
    });

    wrapper.appendChild(btn);
    wrapper.appendChild(dropdown);
    return wrapper;
  }
}

export class ChartToolbar {
  constructor(options = {}) {
    this.options = options;
  }

  render() {
    const toolbar = document.createElement("div");
    toolbar.className = "bi-chart-toolbar";

    // Range select
    const range = new TimeRangeSelector({ onChange: this.options.onRangeChange });
    toolbar.appendChild(range.render());

    // Export menu
    const exp = new ExportMenu({ onExport: this.options.onExport });
    toolbar.appendChild(exp.render());

    return toolbar;
  }
}

export class ChartHeader {
  constructor(options = {}) {
    this.title = options.title || "Analytics Overview";
    this.subtitle = options.subtitle || "System BI telemetry indexes reports";
    this.onRangeChange = options.onRangeChange || null;
    this.onExport = options.onExport || null;
  }

  render() {
    const header = document.createElement("header");
    header.className = "bi-chart-header";

    header.innerHTML = `
      <div class="bi-chart-header-details">
        <h3 class="bi-chart-title">${this.title}</h3>
        <span class="bi-chart-subtitle">${this.subtitle}</span>
      </div>
    `;

    const toolbar = new ChartToolbar({
      onRangeChange: this.onRangeChange,
      onExport: this.onExport
    });

    header.appendChild(toolbar.render());
    return header;
  }
}

export class ChartLegend {
  constructor(options = {}) {
    this.labels = options.labels || ["Sales Channel 1", "Sales Channel 2"];
  }

  render() {
    const legend = document.createElement("div");
    legend.className = "bi-chart-legend";

    this.labels.forEach((lbl, idx) => {
      const item = document.createElement("div");
      item.className = "bi-legend-item";
      item.innerHTML = `
        <span class="bi-legend-dot color-${idx + 1}"></span>
        <span>${lbl}</span>
      `;
      legend.appendChild(item);
    });

    return legend;
  }
}

export class ChartLoader {
  render() {
    const overlay = document.createElement("div");
    overlay.className = "bi-chart-loader-overlay";
    overlay.innerHTML = `<div class="bi-spinner-ring"></div>`;
    return overlay;
  }
}

export class ChartEmptyState {
  constructor(options = {}) {
    this.title = options.title || "No telemetry data collected";
    this.desc = options.desc || "Ensure warehouse database records sync is operational.";
  }

  render() {
    const view = document.createElement("div");
    view.className = "bi-empty-state-view";

    view.innerHTML = `
      <span class="bi-empty-icon">📊</span>
      <h4 class="bi-empty-title">${this.title}</h4>
      <span style="font-size: 0.725rem;">${this.desc}</span>
    `;

    return view;
  }
}

export class ChartPlaceholder {
  constructor(options = {}) {
    this.type = options.type || "bar"; // bar, stacked, donut, sparkline
  }

  render() {
    const area = document.createElement("div");
    area.className = "bi-placeholder-chart-graphics";

    if (this.type === "bar" || this.type === "stacked") {
      const heights = ["45%", "65%", "85%", "55%", "75%"];
      heights.forEach(h => {
        const pillar = document.createElement("div");
        pillar.className = `bi-bar-pillar ${this.type === "stacked" ? "stacked" : ""}`;
        pillar.style.height = h;
        area.appendChild(pillar);
      });
    } else if (this.type === "donut") {
      const progressRing = document.createElement("div");
      progressRing.className = "bi-progress-ring-graphics";
      progressRing.innerHTML = `<div class="bi-ring-circle"></div>`;
      area.appendChild(progressRing);
    } else if (this.type === "sparkline") {
      const spark = document.createElement("div");
      spark.className = "bi-sparkline-line";
      area.appendChild(spark);
    }

    return area;
  }
}

export class ChartContainer {
  constructor(options = {}) {
    this.options = {
      title: options.title || "Chart Title",
      subtitle: options.subtitle || "Chart description subtext",
      chartType: options.chartType || "bar",
      legendLabels: options.legendLabels || ["Baseline", "Target Limit"],
      isLoading: options.isLoading === true,
      isEmpty: options.isEmpty === true,
      ...options
    };
  }

  render() {
    const card = document.createElement("div");
    card.className = "bi-chart-card";

    // 1. Header Details
    const header = new ChartHeader({
      title: this.options.title,
      subtitle: this.options.subtitle,
      onRangeChange: (val) => console.log(`[BI Chart] Range changed parameter to: ${val}`),
      onExport: (type) => console.log(`[BI Chart] Triggering sheet export format type: ${type}`)
    });
    card.appendChild(header.render());

    // 2. Chart Visual canvas
    const canvas = document.createElement("div");
    canvas.className = "bi-chart-body-canvas";

    if (this.options.isLoading) {
      canvas.appendChild(new ChartLoader().render());
    }

    if (this.options.isEmpty) {
      canvas.appendChild(new ChartEmptyState().render());
    } else {
      // Legend
      if (this.options.legendLabels.length > 0) {
        canvas.appendChild(new ChartLegend({ labels: this.options.legendLabels }).render());
      }
      // Placeholder graphics
      canvas.appendChild(new ChartPlaceholder({ type: this.options.chartType }).render());
    }

    card.appendChild(canvas);
    return card;
  }
}
