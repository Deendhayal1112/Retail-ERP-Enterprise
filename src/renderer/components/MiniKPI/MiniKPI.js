/**
 * MiniKPI.js
 * Retail ERP Enterprise — Executive KPI Mini Charts Component
 *
 * Implements:
 * - MiniKPIGrid  (Responsive 6-column grid coordinator)
 * - MiniKPI      (Individual KPI card with sparkline)
 * - MiniSparkline     (Compact bar-based sparkline visualization)
 * - MiniTrendBadge    (Up/down/neutral growth pill)
 * - MiniComparisonLabel (Footer comparison text)
 */

"use strict";

// ─────────────────────────────────────────────────────
// MINI SPARKLINE (compact bar-based placeholder chart)
// ─────────────────────────────────────────────────────

export class MiniSparkline {
  /**
   * @param {Object} options
   * @param {number[]} options.data   Array of values (0–100) for bar heights
   * @param {string}   options.tone   CSS class variant applied to parent card
   */
  constructor(options = {}) {
    this.data = options.data || [40, 55, 48, 70, 62, 80, 75, 90, 68, 85, 72, 95];
    this.tone = options.tone || "";
  }

  render() {
    const wrap = document.createElement("div");
    wrap.className = "mini-sparkline-wrap";

    const max = Math.max(...this.data);

    this.data.forEach(val => {
      const bar = document.createElement("div");
      bar.className = "mini-sparkline-bar";
      bar.style.height = `${Math.round((val / max) * 100)}%`;
      bar.setAttribute("title", `Value: ${val}`);
      wrap.appendChild(bar);
    });

    return wrap;
  }
}

// ─────────────────────────────────────────────────────
// MINI TREND BADGE
// ─────────────────────────────────────────────────────

export class MiniTrendBadge {
  /**
   * @param {Object} options
   * @param {string}  options.direction  "up" | "down" | "neutral"
   * @param {string}  options.label      e.g. "+12.4%"
   */
  constructor(options = {}) {
    this.direction = options.direction || "up";
    this.label     = options.label     || "+0.0%";
  }

  render() {
    const badge = document.createElement("span");
    badge.className = `mini-trend-badge ${this.direction}`;

    const arrow = this.direction === "up" ? "↑" : this.direction === "down" ? "↓" : "→";
    badge.innerHTML = `<span>${arrow}</span><span>${this.label}</span>`;
    return badge;
  }
}

// ─────────────────────────────────────────────────────
// MINI COMPARISON LABEL
// ─────────────────────────────────────────────────────

export class MiniComparisonLabel {
  /**
   * @param {Object} options
   * @param {string} options.text  e.g. "vs Last Month: $28,400"
   */
  constructor(options = {}) {
    this.text = options.text || "vs Last Month";
  }

  render() {
    const el = document.createElement("div");
    el.className = "mini-comparison-label";
    el.innerHTML = this.text;
    return el;
  }
}

// ─────────────────────────────────────────────────────
// MINI KPI CARD (individual)
// ─────────────────────────────────────────────────────

export class MiniKPI {
  /**
   * @param {Object} options
   * @param {string}   options.id          CSS variant class ("sales", "revenue", etc.)
   * @param {string}   options.icon        Emoji or text icon
   * @param {string}   options.title       KPI label text
   * @param {string}   options.value       Formatted display value
   * @param {string}   options.direction   Trend direction "up" | "down" | "neutral"
   * @param {string}   options.growth      Growth text e.g. "+12.4%"
   * @param {number[]} options.sparkData   Array of sparkline bar heights (0–100)
   * @param {string}   options.comparison  Footer comparison text (HTML allowed)
   */
  constructor(options = {}) {
    this.id         = options.id         || "sales";
    this.icon       = options.icon       || "📊";
    this.title      = options.title      || "KPI Title";
    this.value      = options.value      || "--";
    this.direction  = options.direction  || "up";
    this.growth     = options.growth     || "+0.0%";
    this.sparkData  = options.sparkData  || [40, 55, 48, 70, 62, 80, 75, 90, 68, 85, 72, 95];
    this.comparison = options.comparison || "vs Last Month";
  }

  render() {
    const card = document.createElement("div");
    card.className = `mini-kpi-card ${this.id}`;

    // — Top Row: Icon + Trend Badge —
    const topRow = document.createElement("div");
    topRow.className = "mini-kpi-top-row";

    const iconWrap = document.createElement("div");
    iconWrap.className = "mini-kpi-icon-wrap";
    iconWrap.setAttribute("aria-hidden", "true");
    iconWrap.textContent = this.icon;
    topRow.appendChild(iconWrap);

    const badge = new MiniTrendBadge({ direction: this.direction, label: this.growth });
    topRow.appendChild(badge.render());

    card.appendChild(topRow);

    // — Meta: Title + Value —
    const meta = document.createElement("div");
    meta.className = "mini-kpi-meta";
    meta.innerHTML = `
      <span class="mini-kpi-title">${this.title}</span>
      <span class="mini-kpi-value">${this.value}</span>
    `;
    card.appendChild(meta);

    // — Sparkline —
    const sparkline = new MiniSparkline({ data: this.sparkData, tone: this.id });
    card.appendChild(sparkline.render());

    // — Comparison Label Footer —
    const compLabel = new MiniComparisonLabel({ text: this.comparison });
    card.appendChild(compLabel.render());

    return card;
  }
}

// ─────────────────────────────────────────────────────
// MINI KPI GRID (coordinator)
// ─────────────────────────────────────────────────────

export default class MiniKPIGrid {
  constructor(options = {}) {
    this.cards = options.cards || MiniKPIGrid.defaultCards();
    this.element = null;
  }

  /**
   * Default placeholder KPI card definitions.
   * @returns {Object[]}
   */
  static defaultCards() {
    return [
      {
        id:         "sales",
        icon:       "💰",
        title:      "Total Sales",
        value:      "$38,400",
        direction:  "up",
        growth:     "+12.4%",
        sparkData:  [30, 45, 38, 60, 52, 70, 65, 80, 58, 75, 62, 90],
        comparison: `vs Last Month: <strong>$34,200</strong>`
      },
      {
        id:         "revenue",
        icon:       "📈",
        title:      "Total Revenue",
        value:      "$142,500",
        direction:  "up",
        growth:     "+14.2%",
        sparkData:  [50, 62, 55, 78, 68, 85, 72, 92, 80, 88, 76, 95],
        comparison: `vs Last Month: <strong>$124,800</strong>`
      },
      {
        id:         "orders",
        icon:       "🛒",
        title:      "Total Orders",
        value:      "1,248",
        direction:  "up",
        growth:     "+8.6%",
        sparkData:  [40, 52, 44, 68, 56, 74, 60, 82, 66, 78, 64, 88],
        comparison: `vs Last Month: <strong>1,149 orders</strong>`
      },
      {
        id:         "customers",
        icon:       "👥",
        title:      "Customers",
        value:      "3,842",
        direction:  "up",
        growth:     "+5.2%",
        sparkData:  [60, 65, 62, 70, 68, 75, 72, 80, 74, 82, 78, 86],
        comparison: `vs Last Month: <strong>3,652 customers</strong>`
      },
      {
        id:         "profit",
        icon:       "🏦",
        title:      "Net Profit",
        value:      "$42,120",
        direction:  "up",
        growth:     "+9.8%",
        sparkData:  [35, 48, 42, 62, 54, 72, 60, 80, 65, 75, 68, 88],
        comparison: `vs Last Month: <strong>$38,360</strong>`
      },
      {
        id:         "inventory",
        icon:       "📦",
        title:      "Inventory Value",
        value:      "$218,400",
        direction:  "down",
        growth:     "-2.1%",
        sparkData:  [90, 85, 88, 80, 82, 75, 78, 70, 74, 68, 72, 65],
        comparison: `vs Last Month: <strong>$223,100</strong>`
      }
    ];
  }

  render() {
    const grid = document.createElement("div");
    grid.className = "mini-kpi-grid";

    this.cards.forEach(cfg => {
      const card = new MiniKPI(cfg);
      grid.appendChild(card.render());
    });

    this.element = grid;
    return grid;
  }
}
