/**
 * StorageMetricsPanel.js
 * Retail ERP Enterprise — Storage Monitoring Panel
 */

"use strict";

export default class StorageMetricsPanel {
  constructor() {
    this.element = null;
  }

  render() {
    const card = document.createElement("div");
    card.className = "performance-metric-card storage-metrics-panel";

    card.innerHTML = `
      <div class="metric-card-header">
        <h3 class="metric-card-title">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"></path></svg>
          Storage Monitoring
        </h3>
        <span class="metric-card-badge badge-normal status-badge">Normal</span>
      </div>
      <div class="metric-stats-list">
        <div class="metric-stat-row">
          <span class="stat-label">Disk Usage</span>
          <span class="stat-value val-disk">-- MB</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Backup Size</span>
          <span class="stat-value val-backup">-- MB</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Growth Rate</span>
          <span class="stat-value val-growth">-- MB/mo</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Storage Alerts</span>
          <span class="stat-value val-alerts">--</span>
        </div>
      </div>
    `;

    this.element = card;
    return card;
  }

  update(metrics) {
    if (!this.element) return;
    const s = metrics.storage;

    const diskMb = (s.diskUsageBytes / (1024 * 1024)).toFixed(1);
    const backupMb = (s.backupSizeBytes / (1024 * 1024)).toFixed(2);

    this.element.querySelector(".val-disk").textContent = `${diskMb} MB`;
    this.element.querySelector(".val-backup").textContent = `${backupMb} MB`;
    this.element.querySelector(".val-growth").textContent = `${s.growthRateMbPerMonth} MB/mo`;
    this.element.querySelector(".val-alerts").textContent = s.storageAlertsCount;

    const badge = this.element.querySelector(".status-badge");
    if (s.storageAlertsCount > 0) {
      badge.textContent = "Alert";
      badge.className = "metric-card-badge badge-warning status-badge";
    } else {
      badge.textContent = "Normal";
      badge.className = "metric-card-badge badge-normal status-badge";
    }
  }
}
