/**
 * ResourceManagementPanel.js
 * Retail ERP Enterprise — OS Resource Handles Panel
 */

"use strict";

export default class ResourceManagementPanel {
  constructor() { this.element = null; }

  render() {
    const card = document.createElement("div");
    card.className = "performance-metric-card resource-management-panel";
    card.innerHTML = `
      <div class="metric-card-header">
        <h3 class="metric-card-title">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
          Resource Management
        </h3>
        <span class="metric-card-badge badge-normal status-badge">Normal</span>
      </div>
      <div class="metric-stats-list">
        <div class="metric-stat-row"><span class="stat-label">Open Windows</span><span class="stat-value val-windows">--</span></div>
        <div class="metric-stat-row"><span class="stat-label">Active Timers</span><span class="stat-value val-timers">--</span></div>
        <div class="metric-stat-row"><span class="stat-label">Event Listeners</span><span class="stat-value val-listeners">--</span></div>
        <div class="metric-stat-row"><span class="stat-label">Worker Threads</span><span class="stat-value val-workers">--</span></div>
        <div class="metric-stat-row"><span class="stat-label">IPC Connections</span><span class="stat-value val-ipc">--</span></div>
        <div class="metric-stat-row"><span class="stat-label">File Handles</span><span class="stat-value val-files">--</span></div>
      </div>
    `;
    this.element = card;
    return card;
  }

  update(metrics) {
    if (!this.element) return;
    const r = metrics.resources;

    this.element.querySelector(".val-windows").textContent = r.openWindowsCount;
    this.element.querySelector(".val-timers").textContent = r.activeTimersCount;
    this.element.querySelector(".val-listeners").textContent = r.eventListenersCount;
    this.element.querySelector(".val-workers").textContent = r.workerThreadsCount;
    this.element.querySelector(".val-ipc").textContent = r.ipcConnectionsCount;
    this.element.querySelector(".val-files").textContent = r.fileHandlesCount;

    const badge = this.element.querySelector(".status-badge");
    if (r.eventListenersCount > 200 || r.activeTimersCount > 50) {
      badge.textContent = "High";
      badge.className = "metric-card-badge badge-warning status-badge";
    } else {
      badge.textContent = "Normal";
      badge.className = "metric-card-badge badge-normal status-badge";
    }
  }
}
