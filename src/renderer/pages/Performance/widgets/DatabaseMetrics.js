/**
 * DatabaseMetrics.js
 * Retail ERP Enterprise — Database Performance Metrics Widget
 */

"use strict";

export default class DatabaseMetrics {
  constructor() {
    this.element = null;
  }

  render() {
    const card = document.createElement("div");
    card.className = "performance-metric-card database-metrics-card";

    card.innerHTML = `
      <div class="metric-card-header">
        <h3 class="metric-card-title">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"></path></svg>
          Database Metrics
        </h3>
        <span class="metric-card-badge badge-normal status-badge">Normal</span>
      </div>
      <div class="metric-stats-list">
        <div class="metric-stat-row">
          <span class="stat-label">Query Time</span>
          <span class="stat-value val-query-time">-- ms</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Slow Queries</span>
          <span class="stat-value val-slow-queries">--</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Cache Hit Rate</span>
          <span class="stat-value val-cache-hit">--%</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Database Size</span>
          <span class="stat-value val-db-size">-- MB</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">WAL Status</span>
          <span class="stat-value val-wal">--</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Connection Health</span>
          <span class="stat-value val-health">--</span>
        </div>
      </div>
    `;

    this.element = card;
    return card;
  }

  update(metrics) {
    if (!this.element) return;
    const d = metrics.database;

    const sizeMb = (d.dbSizeBytes / (1024 * 1024)).toFixed(2);

    this.element.querySelector(".val-query-time").textContent = `${d.avgQueryTimeMs} ms`;
    this.element.querySelector(".val-slow-queries").textContent = d.slowQueriesCount;
    this.element.querySelector(".val-cache-hit").textContent = `${d.cacheHitRatePercent}%`;
    this.element.querySelector(".val-db-size").textContent = `${sizeMb} MB`;
    this.element.querySelector(".val-wal").textContent = d.walJournalActive ? "Active (WAL)" : "Inactive";
    this.element.querySelector(".val-health").textContent = d.connectionHealth;

    const badge = this.element.querySelector(".status-badge");
    if (d.slowQueriesCount > 0 || d.avgQueryTimeMs > 100) {
      badge.textContent = "Warning";
      badge.className = "metric-card-badge badge-warning status-badge";
    } else {
      badge.textContent = "Normal";
      badge.className = "metric-card-badge badge-normal status-badge";
    }
  }
}
