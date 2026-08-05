/**
 * ServiceMetrics.js
 * Retail ERP Enterprise — Service Metrics Widget
 */

"use strict";

export default class ServiceMetrics {
  constructor() {
    this.element = null;
  }

  render() {
    const card = document.createElement("div");
    card.className = "performance-metric-card service-metrics-card";

    card.innerHTML = `
      <div class="metric-card-header">
        <h3 class="metric-card-title">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
          Background Services
        </h3>
        <span class="metric-card-badge badge-normal status-badge">Active</span>
      </div>
      <div class="metric-stats-list">
        <div class="metric-stat-row">
          <span class="stat-label">Sync Queue size</span>
          <span class="stat-value val-sync-queue">--</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Backup Queue size</span>
          <span class="stat-value val-backup-queue">--</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Notification Queue</span>
          <span class="stat-value val-notifications">--</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Update Queue size</span>
          <span class="stat-value val-updates">--</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Scheduler Status</span>
          <span class="stat-value val-scheduler">--</span>
        </div>
      </div>
    `;

    this.element = card;
    return card;
  }

  update(metrics) {
    if (!this.element) return;
    const b = metrics.background;

    this.element.querySelector(".val-sync-queue").textContent = b.syncQueueCount;
    this.element.querySelector(".val-backup-queue").textContent = b.backupQueueCount;
    this.element.querySelector(".val-notifications").textContent = b.notificationQueueCount;
    this.element.querySelector(".val-updates").textContent = b.updateQueueCount;
    this.element.querySelector(".val-scheduler").textContent = b.schedulerStatus;
  }
}
