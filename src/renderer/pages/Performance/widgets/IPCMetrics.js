/**
 * IPCMetrics.js
 * Retail ERP Enterprise — IPC Metrics Widget
 */

"use strict";

export default class IPCMetrics {
  constructor() {
    this.element = null;
  }

  render() {
    const card = document.createElement("div");
    card.className = "performance-metric-card ipc-metrics-card";

    card.innerHTML = `
      <div class="metric-card-header">
        <h3 class="metric-card-title">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          IPC Communication
        </h3>
        <span class="metric-card-badge badge-normal status-badge">Normal</span>
      </div>
      <div class="metric-stats-list">
        <div class="metric-stat-row">
          <span class="stat-label">Total IPC Calls</span>
          <span class="stat-value val-calls">--</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Avg Response Time</span>
          <span class="stat-value val-latency">-- ms</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Failed Requests</span>
          <span class="stat-value val-failed">--</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Pending Requests</span>
          <span class="stat-value val-pending">--</span>
        </div>
      </div>
    `;

    this.element = card;
    return card;
  }

  update(metrics) {
    if (!this.element) return;
    const i = metrics.ipc;

    this.element.querySelector(".val-calls").textContent = i.totalCallsCount.toLocaleString();
    this.element.querySelector(".val-latency").textContent = `${i.avgResponseTimeMs} ms`;
    this.element.querySelector(".val-failed").textContent = i.failedRequestsCount;
    this.element.querySelector(".val-pending").textContent = i.pendingRequestsCount;

    const badge = this.element.querySelector(".status-badge");
    if (i.avgResponseTimeMs > 50) {
      badge.textContent = "Warning";
      badge.className = "metric-card-badge badge-warning status-badge";
    } else {
      badge.textContent = "Normal";
      badge.className = "metric-card-badge badge-normal status-badge";
    }
  }
}
