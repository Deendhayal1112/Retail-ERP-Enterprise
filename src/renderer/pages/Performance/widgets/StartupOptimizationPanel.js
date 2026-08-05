/**
 * StartupOptimizationPanel.js
 * Retail ERP Enterprise — Deferred Loading, Cache & Critical Path Panel
 */

"use strict";

export default class StartupOptimizationPanel {
  constructor() { this.element = null; }

  render() {
    const card = document.createElement("div");
    card.className = "performance-metric-card startup-optimization-panel";
    card.innerHTML = `
      <div class="metric-card-header">
        <h3 class="metric-card-title">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
          Startup Optimization
        </h3>
        <span class="metric-card-badge badge-normal status-badge">Optimized</span>
      </div>
      <div class="metric-stats-list">
        <div class="metric-stat-row"><span class="stat-label">Deferred Loading</span><span class="stat-value val-deferred">-- jobs</span></div>
        <div class="metric-stat-row"><span class="stat-label">Startup Cache Hit Rate</span><span class="stat-value val-cache-hit">--%</span></div>
        <div class="metric-stat-row"><span class="stat-label">Preloaded Modules</span><span class="stat-value val-preloaded">--</span></div>
        <div class="metric-stat-row"><span class="stat-label">Splash Duration</span><span class="stat-value val-splash">-- ms</span></div>
        <div class="metric-stat-row"><span class="stat-label">Critical Path Est.</span><span class="stat-value val-critical">-- ms</span></div>
      </div>
    `;
    this.element = card;
    return card;
  }

  update(metrics) {
    if (!this.element) return;
    const o = metrics.optimization;

    this.element.querySelector(".val-deferred").textContent = `${o.deferredLoadingCount} jobs`;
    this.element.querySelector(".val-cache-hit").textContent = `${o.cacheHitRatePct}%`;
    this.element.querySelector(".val-preloaded").textContent = o.preloadedModulesCount;
    this.element.querySelector(".val-splash").textContent = `${o.splashDurationMs} ms`;
    this.element.querySelector(".val-critical").textContent = `${o.criticalPathMs} ms`;

    const badge = this.element.querySelector(".status-badge");
    if (o.criticalPathMs > 4000 || o.cacheHitRatePct < 70) {
      badge.textContent = "Review";
      badge.className = "metric-card-badge badge-warning status-badge";
    } else {
      badge.textContent = "Optimized";
      badge.className = "metric-card-badge badge-normal status-badge";
    }
  }
}
