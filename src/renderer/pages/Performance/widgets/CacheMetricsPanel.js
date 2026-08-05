/**
 * CacheMetricsPanel.js
 * Retail ERP Enterprise — Page & Statement Cache Efficiency Panel
 */

"use strict";

export default class CacheMetricsPanel {
  constructor() {
    this.element = null;
  }

  render() {
    const card = document.createElement("div");
    card.className = "performance-metric-card cache-metrics-panel";

    card.innerHTML = `
      <div class="metric-card-header">
        <h3 class="metric-card-title">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
          Cache Monitoring
        </h3>
        <span class="metric-card-badge badge-normal status-badge">Efficient</span>
      </div>
      <div class="metric-stats-list">
        <div class="metric-stat-row">
          <span class="stat-label">Page Cache Hits</span>
          <span class="stat-value val-page-hits">--</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Statement Cache Hits</span>
          <span class="stat-value val-stmt-hits">--</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Cache Hit Rate</span>
          <span class="stat-value val-hit-rate">--%</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Cache Misses</span>
          <span class="stat-value val-misses">--</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Buffer Usage</span>
          <span class="stat-value val-buffer">--%</span>
        </div>
      </div>
    `;

    this.element = card;
    return card;
  }

  update(metrics) {
    if (!this.element) return;
    const c = metrics.cache;

    this.element.querySelector(".val-page-hits").textContent = c.pageCacheHits.toLocaleString();
    this.element.querySelector(".val-stmt-hits").textContent = c.statementCacheHits.toLocaleString();
    this.element.querySelector(".val-hit-rate").textContent = `${c.cacheHitRatePct}%`;
    this.element.querySelector(".val-misses").textContent = c.cacheMisses.toLocaleString();
    this.element.querySelector(".val-buffer").textContent = `${c.bufferUsagePct}%`;

    const badge = this.element.querySelector(".status-badge");
    if (c.cacheHitRatePct < 90) {
      badge.textContent = "Degraded";
      badge.className = "metric-card-badge badge-warning status-badge";
    } else {
      badge.textContent = "Efficient";
      badge.className = "metric-card-badge badge-normal status-badge";
    }
  }
}
