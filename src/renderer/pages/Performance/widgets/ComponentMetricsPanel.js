/**
 * ComponentMetricsPanel.js
 * Retail ERP Enterprise — Component Tree Structure Analytics Panel
 */

"use strict";

export default class ComponentMetricsPanel {
  constructor() {
    this.element = null;
  }

  render() {
    const card = document.createElement("div");
    card.className = "performance-metric-card component-metrics-panel";

    card.innerHTML = `
      <div class="metric-card-header">
        <h3 class="metric-card-title">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
          Component Analytics
        </h3>
        <span class="metric-card-badge badge-normal status-badge">Optimized</span>
      </div>
      <div class="metric-stats-list">
        <div class="metric-stat-row">
          <span class="stat-label">Mounted Components</span>
          <span class="stat-value val-mounted">--</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Updated Components</span>
          <span class="stat-value val-updated">--</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Memoized Components</span>
          <span class="stat-value val-memoized">--</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Lazy Components</span>
          <span class="stat-value val-lazy">--</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Suspense Boundaries</span>
          <span class="stat-value val-suspense">--</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Component Tree Depth</span>
          <span class="stat-value val-depth">--</span>
        </div>
      </div>
    `;

    this.element = card;
    return card;
  }

  update(metrics) {
    if (!this.element) return;
    const c = metrics.components;

    this.element.querySelector(".val-mounted").textContent = c.mountedCount;
    this.element.querySelector(".val-updated").textContent = c.updatedCount;
    this.element.querySelector(".val-memoized").textContent = c.memoizedCount;
    this.element.querySelector(".val-lazy").textContent = c.lazyCount;
    this.element.querySelector(".val-suspense").textContent = c.suspenseBoundariesCount;
    this.element.querySelector(".val-depth").textContent = c.componentTreeDepth;
  }
}
