/**
 * KPICard.js
 * Retail ERP Enterprise — Reusable KPI Scorecard Components
 *
 * Implements sections:
 * - KPIGrid (wrapper node)
 * - KPICard (card details panel)
 * - KPIIcon (color-coded status indicator)
 * - KPILabel (module titles)
 * - KPIValue (metric counters)
 * - KPITrend (percentage changes)
 */

"use strict";

export class KPIIcon {
  constructor(options = {}) {
    this.icon = options.icon || "📊";
    this.type = options.type || "default"; // sales, orders, revenue, stock, default
  }

  render() {
    const box = document.createElement("div");
    box.className = `kpi-icon-box ${this.type}`;
    box.textContent = this.icon;
    return box;
  }
}

export class KPILabel {
  constructor(options = {}) {
    this.text = options.text || "";
  }

  render() {
    const span = document.createElement("span");
    span.className = "kpi-card-label";
    span.textContent = this.text;
    return span;
  }
}

export class KPIValue {
  constructor(options = {}) {
    this.value = options.value || "0.00";
  }

  render() {
    const div = document.createElement("div");
    div.className = "kpi-card-value";
    div.textContent = this.value;
    return div;
  }
}

export class KPITrend {
  constructor(options = {}) {
    this.value = options.value || "";
    this.direction = options.direction || "stable"; // up, down, stable
  }

  render() {
    if (!this.value) return document.createTextNode("");
    
    const badge = document.createElement("span");
    badge.className = `kpi-trend-badge-pill ${this.direction}`;
    
    let arrow = "→";
    if (this.direction === "up") arrow = "↑";
    if (this.direction === "down") arrow = "↓";

    badge.innerHTML = `<span>${arrow}</span> <span>${this.value}</span>`;
    return badge;
  }
}

export class KPICard {
  constructor(options = {}) {
    this.options = {
      label: options.label || "KPI Metrics",
      value: options.value || "--",
      icon: options.icon || "📊",
      type: options.type || "default",
      trend: options.trend || "",
      direction: options.direction || "stable",
      ...options
    };
    this.element = null;
  }

  render() {
    const card = document.createElement("div");
    card.className = "kpi-card-panel";

    // A. Header Row (Label + Icon)
    const headerRow = document.createElement("div");
    headerRow.className = "kpi-card-header-row";
    
    headerRow.appendChild(new KPILabel({ text: this.options.label }).render());
    headerRow.appendChild(new KPIIcon({ icon: this.options.icon, type: this.options.type }).render());
    card.appendChild(headerRow);

    // B. Body Row (Value + Trend)
    const bodyRow = document.createElement("div");
    bodyRow.className = "kpi-card-body-row";

    bodyRow.appendChild(new KPIValue({ value: this.options.value }).render());
    bodyRow.appendChild(new KPITrend({ value: this.options.trend, direction: this.options.direction }).render());
    card.appendChild(bodyRow);

    this.element = card;
    return card;
  }
}

// ─────────────────────────────────────────────────────
// KPI GRID CONTAINER COMPONENT
// ─────────────────────────────────────────────────────

export class KPIGrid {
  constructor(options = {}) {
    this.options = options;
    this.element = null;

    // Default mock KPI panels data configurations
    this.kpis = [
      { key: "sales", label: "Today's Sales", value: "$4,250.00", icon: "💰", type: "sales", trend: "12.5%", direction: "up" },
      { key: "orders", label: "Today's Orders", value: "32 Orders", icon: "📦", type: "orders", trend: "8.1%", direction: "up" },
      { key: "revenue", label: "Total Revenue", value: "$124,500", icon: "📊", type: "revenue", trend: "1.2%", direction: "down" },
      { key: "stock", label: "Low Stock Items", value: "14 Items", icon: "⚠️", type: "stock", trend: "Critical", direction: "down" }
    ];
  }

  render() {
    const container = document.createElement("div");
    container.className = "kpi-grid-container";

    this.kpis.forEach(kpiData => {
      const card = new KPICard(kpiData);
      container.appendChild(card.render());
    });

    this.element = container;
    return container;
  }
}
