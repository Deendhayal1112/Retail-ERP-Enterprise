/**
 * ModuleLoadingPanel.js
 * Retail ERP Enterprise — Module Registry & Load Duration Panel
 */

"use strict";

export default class ModuleLoadingPanel {
  constructor() { this.element = null; }

  render() {
    const card = document.createElement("div");
    card.className = "performance-metric-card module-loading-panel";
    card.innerHTML = `
      <div class="metric-card-header">
        <h3 class="metric-card-title">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
          Module Loading
        </h3>
        <span class="metric-card-badge badge-normal status-badge">Loaded</span>
      </div>
      <div class="metric-stats-list">
        <div class="metric-stat-row"><span class="stat-label">Core Modules</span><span class="stat-value val-core">--</span></div>
        <div class="metric-stat-row"><span class="stat-label">Feature Modules</span><span class="stat-value val-feature">--</span></div>
        <div class="metric-stat-row"><span class="stat-label">Lazy Modules</span><span class="stat-value val-lazy">--</span></div>
        <div class="metric-stat-row"><span class="stat-label">Failed Modules</span><span class="stat-value val-failed">--</span></div>
        <div class="metric-stat-row"><span class="stat-label">Total Load Duration</span><span class="stat-value val-total-load">-- ms</span></div>
        <div class="metric-stat-row"><span class="stat-label">Dependency Resolution</span><span class="stat-value val-dep-resolve">-- ms</span></div>
      </div>
    `;
    this.element = card;
    return card;
  }

  update(metrics) {
    if (!this.element) return;
    const m = metrics.modules;

    this.element.querySelector(".val-core").textContent = m.coreModulesCount;
    this.element.querySelector(".val-feature").textContent = m.featureModulesCount;
    this.element.querySelector(".val-lazy").textContent = m.lazyModulesCount;
    this.element.querySelector(".val-failed").textContent = m.failedModulesCount;
    this.element.querySelector(".val-total-load").textContent = `${m.totalLoadDurationMs} ms`;
    this.element.querySelector(".val-dep-resolve").textContent = `${m.dependencyResolutionMs} ms`;

    const badge = this.element.querySelector(".status-badge");
    if (m.failedModulesCount > 0) {
      badge.textContent = "Failures";
      badge.className = "metric-card-badge badge-warning status-badge";
    } else {
      badge.textContent = "Loaded";
      badge.className = "metric-card-badge badge-normal status-badge";
    }
  }
}
