/**
 * SystemHealthPanel.js
 * Retail ERP Enterprise — CPU, RAM, Disk & Network panel
 */

"use strict";

export default class SystemHealthPanel {
  constructor() { this.element = null; }

  render() {
    const card = document.createElement("div");
    card.className = "performance-metric-card system-health-panel";
    card.innerHTML = `
      <div class="metric-card-header">
        <h3 class="metric-card-title">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>
          System Diagnostics
        </h3>
        <span class="metric-card-badge badge-normal status-badge">Optimal</span>
      </div>
      <div class="metric-stats-list">
        <div class="metric-stat-row"><span class="stat-label">CPU Usage</span><span class="stat-value val-cpu">--%</span></div>
        <div class="metric-stat-row"><span class="stat-label">Memory Usage</span><span class="stat-value val-mem">--%</span></div>
        <div class="metric-stat-row"><span class="stat-label">Disk Space Free</span><span class="stat-value val-disk">--%</span></div>
        <div class="metric-stat-row"><span class="stat-label">GPU Performance</span><span class="stat-value val-gpu">--%</span></div>
        <div class="metric-stat-row"><span class="stat-label">Network Status</span><span class="stat-value val-network">--</span></div>
        <div class="metric-stat-row"><span class="stat-label">Power Source</span><span class="stat-value val-battery">--</span></div>
      </div>
    `;
    this.element = card;
    return card;
  }

  update(metrics) {
    if (!this.element) return;
    const s = metrics.system;

    this.element.querySelector(".val-cpu").textContent = `${s.cpuUsagePct}%`;
    this.element.querySelector(".val-mem").textContent = `${s.memoryUsagePct}%`;
    this.element.querySelector(".val-disk").textContent = `${(100 - s.diskUsagePct).toFixed(1)}% free`;
    this.element.querySelector(".val-gpu").textContent = `${s.gpuUsagePct}%`;
    this.element.querySelector(".val-network").textContent = s.networkStatus;
    this.element.querySelector(".val-battery").textContent = s.batteryStatus;

    const badge = this.element.querySelector(".status-badge");
    if (s.cpuUsagePct > 70 || s.networkStatus === "Disconnected") {
      badge.textContent = "Degraded";
      badge.className = "metric-card-badge badge-warning status-badge";
    } else {
      badge.textContent = "Optimal";
      badge.className = "metric-card-badge badge-normal status-badge";
    }
  }
}
