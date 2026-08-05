/**
 * IndexMetricsPanel.js
 * Retail ERP Enterprise — Index Coverage & Hit Rate Panel
 */

"use strict";

export default class IndexMetricsPanel {
  constructor() {
    this.element = null;
  }

  render() {
    const card = document.createElement("div");
    card.className = "performance-metric-card index-metrics-panel";

    card.innerHTML = `
      <div class="metric-card-header">
        <h3 class="metric-card-title">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="12" x2="14" y2="12"></line><line x1="4" y1="18" x2="18" y2="18"></line></svg>
          Index Monitoring
        </h3>
        <span class="metric-card-badge badge-normal status-badge">Optimal</span>
      </div>
      <div class="metric-stats-list">
        <div class="metric-stat-row">
          <span class="stat-label">Total Indexes</span>
          <span class="stat-value val-total-idx">--</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Index Hit Rate</span>
          <span class="stat-value val-hit-rate">--%</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Missing Indexes</span>
          <span class="stat-value val-missing">--</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Duplicate Indexes</span>
          <span class="stat-value val-duplicate">--</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Unused Indexes</span>
          <span class="stat-value val-unused">--</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Index Usage</span>
          <span class="stat-value val-usage">--%</span>
        </div>
      </div>
    `;

    this.element = card;
    return card;
  }

  update(metrics) {
    if (!this.element) return;
    const i = metrics.indexes;

    this.element.querySelector(".val-total-idx").textContent = i.totalIndexesCount;
    this.element.querySelector(".val-hit-rate").textContent = `${i.indexHitRatePct}%`;
    this.element.querySelector(".val-missing").textContent = i.missingIndexesCount;
    this.element.querySelector(".val-duplicate").textContent = i.duplicateIndexesCount;
    this.element.querySelector(".val-unused").textContent = i.unusedIndexesCount;
    this.element.querySelector(".val-usage").textContent = `${i.indexUsagePct}%`;

    const badge = this.element.querySelector(".status-badge");
    if (i.missingIndexesCount > 0 || i.indexHitRatePct < 90) {
      badge.textContent = "Review";
      badge.className = "metric-card-badge badge-warning status-badge";
    } else {
      badge.textContent = "Optimal";
      badge.className = "metric-card-badge badge-normal status-badge";
    }
  }
}
