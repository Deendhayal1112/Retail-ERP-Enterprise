/**
 * CacheManagementPanel.js
 * Retail ERP Enterprise — UI/DB/Image/API Cache Layers Panel
 */

"use strict";

export default class CacheManagementPanel {
  constructor() { this.element = null; }

  render() {
    const card = document.createElement("div");
    card.className = "performance-metric-card cache-management-panel";
    card.innerHTML = `
      <div class="metric-card-header">
        <h3 class="metric-card-title">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5z"></path><path d="M9 3v18M15 3v18M3 9h18M3 15h18"></path></svg>
          Cache Management
        </h3>
        <span class="metric-card-badge badge-normal status-badge">Efficient</span>
      </div>
      <div class="metric-stats-list">
        <div class="metric-stat-row"><span class="stat-label">UI Cache</span><span class="stat-value val-ui-cache">-- MB</span></div>
        <div class="metric-stat-row"><span class="stat-label">Database Cache</span><span class="stat-value val-db-cache">-- MB</span></div>
        <div class="metric-stat-row"><span class="stat-label">Image Cache</span><span class="stat-value val-img-cache">-- MB</span></div>
        <div class="metric-stat-row"><span class="stat-label">API Cache</span><span class="stat-value val-api-cache">-- MB</span></div>
        <div class="metric-stat-row"><span class="stat-label">Cache Hit Rate</span><span class="stat-value val-hit-rate">--%</span></div>
        <div class="metric-stat-row"><span class="stat-label">Last Cleanup</span><span class="stat-value val-last-cleanup">--</span></div>
      </div>
    `;
    this.element = card;
    return card;
  }

  update(metrics) {
    if (!this.element) return;
    const c = metrics.cache;
    const toMb = b => (b / (1024 * 1024)).toFixed(1);

    this.element.querySelector(".val-ui-cache").textContent = `${toMb(c.uiCacheBytes)} MB`;
    this.element.querySelector(".val-db-cache").textContent = `${toMb(c.databaseCacheBytes)} MB`;
    this.element.querySelector(".val-img-cache").textContent = `${toMb(c.imageCacheBytes)} MB`;
    this.element.querySelector(".val-api-cache").textContent = `${toMb(c.apiCacheBytes)} MB`;
    this.element.querySelector(".val-hit-rate").textContent = `${c.cacheHitRatePct}%`;
    this.element.querySelector(".val-last-cleanup").textContent = c.lastCleanupAgo;

    const badge = this.element.querySelector(".status-badge");
    if (c.cacheHitRatePct < 85) {
      badge.textContent = "Degraded";
      badge.className = "metric-card-badge badge-warning status-badge";
    } else {
      badge.textContent = "Efficient";
      badge.className = "metric-card-badge badge-normal status-badge";
    }
  }
}
