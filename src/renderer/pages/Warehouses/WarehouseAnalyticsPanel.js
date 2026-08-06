/**
 * WarehouseAnalyticsPanel.js
 * Retail ERP Enterprise — Warehouses Capacity Analytics Panel
 */

"use strict";

export default class WarehouseAnalyticsPanel {
  /**
   * @param {Object} options
   * @param {Array}  options.metrics List of capacity metrics.
   */
  constructor(options = {}) {
    this.metrics = options.metrics || [];
  }

  render() {
    const panel = document.createElement("div");
    panel.className = "warehouse-analytics-panel";

    panel.innerHTML = `
      <h2 class="panel-section-title">Storage Space Utilisation Analytics</h2>
      <p class="panel-section-desc">Monitor volumetric capacity loads across hubs to predict overflow risks and schedule optimization transfers.</p>
    `;

    const container = document.createElement("div");
    container.className = "analytics-charts-grid";

    this.metrics.forEach(m => {
      const card = document.createElement("div");
      card.className = "analytics-chart-card";

      // Choose warning theme based on status
      let progressColor = "var(--primary-500)";
      if (m.status === "critical") progressColor = "var(--danger-500)";
      else if (m.status === "warning") progressColor = "var(--warning-500)";

      card.innerHTML = `
        <h3 class="chart-wh-name">${m.name}</h3>
        <p class="chart-wh-code font-mono">${m.code}</p>
        
        <div class="circular-progress-container">
          <svg class="circular-progress-svg" viewBox="0 0 100 100">
            <circle class="bg-circle" cx="50" cy="50" r="40"></circle>
            <circle class="fill-circle" cx="50" cy="50" r="40" 
              stroke="${progressColor}"
              stroke-dasharray="251.2" 
              stroke-dashoffset="${251.2 - (251.2 * m.pct) / 100}"></circle>
          </svg>
          <div class="progress-inner-text">
            <span class="pct-val font-mono font-bold">${m.pct}%</span>
            <span class="pct-label">Utilized</span>
          </div>
        </div>

        <div class="metrics-legend mt-4">
          <div class="legend-row">
            <span class="legend-label text-muted">Used:</span>
            <span class="legend-val font-mono font-semibold">${m.capacityUsed.toLocaleString()} units</span>
          </div>
          <div class="legend-row">
            <span class="legend-label text-muted">Limit:</span>
            <span class="legend-val font-mono font-semibold">${m.capacityMax.toLocaleString()} units</span>
          </div>
          <div class="legend-row">
            <span class="legend-label text-muted">Alert Level:</span>
            <span class="legend-val font-semibold text-capitalize alert-${m.status}">${m.status.toUpperCase()}</span>
          </div>
        </div>
      `;

      container.appendChild(card);
    });

    panel.appendChild(container);
    return panel;
  }
}
