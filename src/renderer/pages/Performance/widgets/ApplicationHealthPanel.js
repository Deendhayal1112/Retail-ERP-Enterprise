/**
 * ApplicationHealthPanel.js
 * Retail ERP Enterprise — Main, Renderer, DB, IPC & Sync layer status panel
 */

"use strict";

export default class ApplicationHealthPanel {
  constructor() { this.element = null; }

  render() {
    const card = document.createElement("div");
    card.className = "performance-metric-card application-health-panel";
    card.innerHTML = `
      <div class="metric-card-header">
        <h3 class="metric-card-title">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          Application Status
        </h3>
        <span class="metric-card-badge badge-normal status-badge">Healthy</span>
      </div>
      <div class="metric-stats-list">
        <div class="metric-stat-row"><span class="stat-label">Renderer Thread</span><span class="stat-value val-renderer">--</span></div>
        <div class="metric-stat-row"><span class="stat-label">Main Process</span><span class="stat-value val-main">--</span></div>
        <div class="metric-stat-row"><span class="stat-label">Database Connection</span><span class="stat-value val-db">--</span></div>
        <div class="metric-stat-row"><span class="stat-label">IPC Bridges</span><span class="stat-value val-ipc">--</span></div>
        <div class="metric-stat-row"><span class="stat-label">Background Queue</span><span class="stat-value val-bg">--</span></div>
        <div class="metric-stat-row"><span class="stat-label">Offline Sync Syncing</span><span class="stat-value val-sync">--</span></div>
      </div>
    `;
    this.element = card;
    return card;
  }

  update(metrics) {
    if (!this.element) return;
    const a = metrics.application;

    this.element.querySelector(".val-renderer").textContent = a.rendererStatus;
    this.element.querySelector(".val-main").textContent = a.mainProcessStatus;
    this.element.querySelector(".val-db").textContent = a.databaseStatus;
    this.element.querySelector(".val-ipc").textContent = a.ipcStatus;
    this.element.querySelector(".val-bg").textContent = a.backgroundServices;
    this.element.querySelector(".val-sync").textContent = a.syncStatus;

    const badge = this.element.querySelector(".status-badge");
    const hasIssues = Object.values(a).some(v => v === "Degraded" || v === "Warning" || v === "Down");
    if (hasIssues) {
      badge.textContent = "Warning";
      badge.className = "metric-card-badge badge-warning status-badge";
    } else {
      badge.textContent = "Healthy";
      badge.className = "metric-card-badge badge-normal status-badge";
    }
  }
}
