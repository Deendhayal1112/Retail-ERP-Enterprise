/**
 * BusinessHealth.js
 * Retail ERP Enterprise — Business Health Summary Component
 *
 * Implements:
 * - BusinessHealth (Main card manager)
 * - BusinessHealthHeader (Header layout)
 * - HealthScore (Overall KPI score visualization panel)
 * - HealthMetric (Individual health items)
 * - StatusBadge (Simple state values tag)
 * - HealthProgressBar (Ratio indicators)
 */

"use strict";

export class BusinessHealthHeader {
  constructor(options = {}) {
    this.title = options.title || "Business Health Summary";
    this.subtitle = options.subtitle || "High-level index metrics performance report";
  }

  render() {
    const header = document.createElement("header");
    header.className = "business-health-header";

    header.innerHTML = `
      <div class="business-health-header-details">
        <h3 class="business-health-title-text">${this.title}</h3>
        <span class="business-health-subtitle-text">${this.subtitle}</span>
      </div>
      <button class="activities-btn-view-all">Export Report</button>
    `;

    header.querySelector(".activities-btn-view-all").addEventListener("click", () => {
      console.log("[BusinessHealth Center] Exporting PDF business health index telemetry logs.");
    });

    return header;
  }
}

export class StatusBadge {
  constructor(options = {}) {
    this.text = options.text || "Good";
    this.status = options.status || "success";
  }

  render() {
    const badge = document.createElement("span");
    badge.className = "score-status-badge";
    badge.textContent = this.text;
    if (this.status !== "success") {
      badge.style.backgroundColor = "var(--badge-warning-bg)";
      badge.style.color = "var(--badge-warning-text)";
    }
    return badge;
  }
}

export class HealthProgressBar {
  constructor(options = {}) {
    this.percentage = options.percentage || 50;
    this.status = options.status || "success"; // success, warning, info
  }

  render() {
    const track = document.createElement("div");
    track.className = "health-progress-bar-track";

    const fill = document.createElement("div");
    fill.className = `health-progress-bar-fill ${this.status}`;
    fill.style.width = `${this.percentage}%`;

    track.appendChild(fill);
    return track;
  }
}

export class HealthMetric {
  constructor(options = {}) {
    this.metric = {
      label: options.label || "",
      percentage: options.percentage || 50,
      status: options.status || "success",
      value: options.value || "",
      ...options
    };
  }

  render() {
    const container = document.createElement("div");
    container.className = "health-metric-row-item";

    // Label row
    const labelRow = document.createElement("div");
    labelRow.className = "health-metric-label-row";
    labelRow.innerHTML = `
      <span>${this.metric.label}</span>
      <strong>${this.metric.value}</strong>
    `;
    container.appendChild(labelRow);

    // Progress bar
    const bar = new HealthProgressBar({ percentage: this.metric.percentage, status: this.metric.status });
    container.appendChild(bar.render());

    return container;
  }
}

export class HealthScore {
  constructor(options = {}) {
    this.score = options.score || 94;
    this.label = options.label || "Excellent";
  }

  render() {
    const dial = document.createElement("div");
    dial.className = "overall-health-score-dial-box";

    dial.innerHTML = `
      <span style="font-size: 0.675rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted);">Overall Index Score</span>
      <div class="score-circular-value-label">${this.score}</div>
      <div class="score-status-badge-container"></div>
      <span class="score-description-subtext">All operation modules (POS register, local SQLite storage, backups) are operating at peak efficiency.</span>
    `;

    const container = dial.querySelector(".score-status-badge-container");
    const badge = new StatusBadge({ text: this.label, status: "success" });
    container.appendChild(badge.render());

    return dial;
  }
}

// ─────────────────────────────────────────────────────
// MAIN BUSINESS HEALTH COMPONENT
// ─────────────────────────────────────────────────────

export default class BusinessHealth {
  constructor(options = {}) {
    this.options = options;
    this.element = null;

    // Default mock health metrics listings
    this.metrics = [
      { label: "Sales Target Performance", percentage: 92, status: "success", value: "92% Met" },
      { label: "Inventory Turnover Health", percentage: 88, status: "success", value: "Optimal" },
      { label: "Cash Flow Coverage Index", percentage: 95, status: "success", value: "95% Safe" },
      { label: "Customer Satisfaction Survey Ratio", percentage: 90, status: "success", value: "4.8 / 5" },
      { label: "System Operational Status", percentage: 99, status: "success", value: "99.9% Uptime" },
      { label: "SQLite Automated Backup Status", percentage: 100, status: "success", value: "Secure" }
    ];
  }

  render() {
    const card = document.createElement("div");
    card.className = "business-health-card";

    // 1. Header Details
    card.appendChild(new BusinessHealthHeader().render());

    // 2. Body Grid (Metrics list on left, Dial score card on right)
    const bodyGrid = document.createElement("div");
    bodyGrid.className = "business-health-body-grid";

    const leftCol = document.createElement("div");
    leftCol.className = "health-metrics-list-column";
    this.metrics.forEach(m => {
      const metricItem = new HealthMetric(m);
      leftCol.appendChild(metricItem.render());
    });
    bodyGrid.appendChild(leftCol);

    const rightCol = new HealthScore({ score: 94, label: "Excellent" });
    bodyGrid.appendChild(rightCol.render());

    card.appendChild(bodyGrid);

    // 3. Footer Details
    const footer = document.createElement("footer");
    footer.className = "business-health-footer";
    footer.innerHTML = `
      <span>Intelligence Model Status: <strong>Calibrated</strong></span>
      <span>Last Evaluation: <strong>Just Now</strong></span>
    `;
    card.appendChild(footer);

    this.element = card;
    return card;
  }
}
