/**
 * BundleMetricsPanel.js
 * Retail ERP Enterprise — Bundle Loading & Code Splitting Panel
 */

"use strict";

export default class BundleMetricsPanel {
  constructor() {
    this.element = null;
  }

  render() {
    const card = document.createElement("div");
    card.className = "performance-metric-card bundle-metrics-panel";

    card.innerHTML = `
      <div class="metric-card-header">
        <h3 class="metric-card-title">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
          Bundle & Chunk Splits
        </h3>
        <span class="metric-card-badge badge-normal status-badge">Optimized</span>
      </div>
      <div class="metric-stats-list">
        <div class="metric-stat-row">
          <span class="stat-label">Lazy Modules Loaded</span>
          <span class="stat-value val-lazy-mods">--</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Dynamic Imports Count</span>
          <span class="stat-value val-dyn-imports">--</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Chunk Loading Duration</span>
          <span class="stat-value val-chunk-time">-- ms</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Route Splitting</span>
          <span class="stat-value val-routes">--</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Component Splitting</span>
          <span class="stat-value val-splitting">--</span>
        </div>
      </div>
    `;

    this.element = card;
    return card;
  }

  update(metrics) {
    if (!this.element) return;
    const b = metrics.bundle;

    this.element.querySelector(".val-lazy-mods").textContent = b.lazyModulesCount;
    this.element.querySelector(".val-dyn-imports").textContent = b.dynamicImportsCount;
    this.element.querySelector(".val-chunk-time").textContent = `${b.chunkLoadingTimeMs} ms`;
    this.element.querySelector(".val-routes").textContent = b.routeSplittingActive ? "Active" : "Disabled";
    this.element.querySelector(".val-splitting").textContent = b.componentSplittingActive ? "Active" : "Disabled";
  }
}
