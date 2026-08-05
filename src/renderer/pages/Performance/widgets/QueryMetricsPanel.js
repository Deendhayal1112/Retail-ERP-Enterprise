/**
 * QueryMetricsPanel.js
 * Retail ERP Enterprise — SQL Query Performance Panel
 */

"use strict";

export default class QueryMetricsPanel {
  constructor() {
    this.element = null;
  }

  render() {
    const card = document.createElement("div");
    card.className = "performance-metric-card query-metrics-panel";

    card.innerHTML = `
      <div class="metric-card-header">
        <h3 class="metric-card-title">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
          Query Performance
        </h3>
        <span class="metric-card-badge badge-normal status-badge">Healthy</span>
      </div>
      <div class="metric-stats-list">
        <div class="metric-stat-row">
          <span class="stat-label">Avg Query Time</span>
          <span class="stat-value val-avg-query">-- ms</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Max Query Time</span>
          <span class="stat-value val-max-query">-- ms</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Slow Queries</span>
          <span class="stat-value val-slow">--</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Failed Queries</span>
          <span class="stat-value val-failed">--</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Transaction Duration</span>
          <span class="stat-value val-tx-duration">-- ms</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Query Queue</span>
          <span class="stat-value val-queue">--</span>
        </div>
      </div>
    `;

    this.element = card;
    return card;
  }

  update(metrics) {
    if (!this.element) return;
    const q = metrics.query;

    this.element.querySelector(".val-avg-query").textContent = `${q.avgQueryTimeMs} ms`;
    this.element.querySelector(".val-max-query").textContent = `${q.maxQueryTimeMs} ms`;
    this.element.querySelector(".val-slow").textContent = q.slowQueriesCount;
    this.element.querySelector(".val-failed").textContent = q.failedQueriesCount;
    this.element.querySelector(".val-tx-duration").textContent = `${q.transactionDurationMs} ms`;
    this.element.querySelector(".val-queue").textContent = q.queryQueueLength;

    const badge = this.element.querySelector(".status-badge");
    if (q.slowQueriesCount > 0 || q.avgQueryTimeMs > 80) {
      badge.textContent = "Warning";
      badge.className = "metric-card-badge badge-warning status-badge";
    } else {
      badge.textContent = "Healthy";
      badge.className = "metric-card-badge badge-normal status-badge";
    }
  }
}
