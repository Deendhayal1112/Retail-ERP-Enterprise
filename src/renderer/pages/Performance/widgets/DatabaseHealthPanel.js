/**
 * DatabaseHealthPanel.js
 * Retail ERP Enterprise — Database Health Panel
 */

"use strict";

export default class DatabaseHealthPanel {
  constructor() {
    this.element = null;
  }

  render() {
    const card = document.createElement("div");
    card.className = "performance-metric-card db-health-panel";

    card.innerHTML = `
      <div class="metric-card-header">
        <h3 class="metric-card-title">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          Database Health
        </h3>
        <span class="metric-card-badge badge-normal status-badge">Clean</span>
      </div>
      <div class="metric-stats-list">
        <div class="metric-stat-row">
          <span class="stat-label">Database Size</span>
          <span class="stat-value val-db-size">-- MB</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">WAL Size</span>
          <span class="stat-value val-wal-size">-- MB</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Page Count</span>
          <span class="stat-value val-pages">--</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Free Pages</span>
          <span class="stat-value val-free-pages">--</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Fragmentation</span>
          <span class="stat-value val-frag">--%</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Vacuum Status</span>
          <span class="stat-value val-vacuum">--</span>
        </div>
      </div>
    `;

    this.element = card;
    return card;
  }

  update(metrics) {
    if (!this.element) return;
    const h = metrics.health;

    const dbMb = (h.dbSizeBytes / (1024 * 1024)).toFixed(2);
    const walMb = (h.walSizeBytes / (1024 * 1024)).toFixed(2);

    this.element.querySelector(".val-db-size").textContent = `${dbMb} MB`;
    this.element.querySelector(".val-wal-size").textContent = `${walMb} MB`;
    this.element.querySelector(".val-pages").textContent = h.pageCount.toLocaleString();
    this.element.querySelector(".val-free-pages").textContent = h.freePagesCount.toLocaleString();
    this.element.querySelector(".val-frag").textContent = `${h.fragmentationPct}%`;
    this.element.querySelector(".val-vacuum").textContent = h.vacuumStatus;

    const badge = this.element.querySelector(".status-badge");
    if (h.fragmentationPct > 15 || h.walSizeBytes > 10 * 1024 * 1024) {
      badge.textContent = "Warning";
      badge.className = "metric-card-badge badge-warning status-badge";
    } else {
      badge.textContent = "Clean";
      badge.className = "metric-card-badge badge-normal status-badge";
    }
  }
}
