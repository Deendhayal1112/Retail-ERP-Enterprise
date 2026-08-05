/**
 * VirtualizationPanel.js
 * Retail ERP Enterprise — Virtualization Monitoring Panel
 */

"use strict";

export default class VirtualizationPanel {
  constructor() {
    this.element = null;
  }

  render() {
    const card = document.createElement("div");
    card.className = "performance-metric-card virtualization-panel";

    card.innerHTML = `
      <div class="metric-card-header">
        <h3 class="metric-card-title">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
          Viewport Virtualization
        </h3>
        <span class="metric-card-badge badge-normal status-badge">Active</span>
      </div>
      <div class="metric-stats-list">
        <div class="metric-stat-row">
          <span class="stat-label">Virtual Lists Active</span>
          <span class="stat-value val-lists">--</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Infinite Scroll</span>
          <span class="stat-value val-infinite">--</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Visible Items</span>
          <span class="stat-value val-visible">--</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Buffer Size</span>
          <span class="stat-value val-buffer">--</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Scroll Performance</span>
          <span class="stat-value val-scroll-perf">--%</span>
        </div>
      </div>
    `;

    this.element = card;
    return card;
  }

  update(metrics) {
    if (!this.element) return;
    const v = metrics.virtualization;

    this.element.querySelector(".val-lists").textContent = v.virtualListsCount;
    this.element.querySelector(".val-infinite").textContent = v.infiniteScrollActive ? "Enabled" : "Disabled";
    this.element.querySelector(".val-visible").textContent = v.visibleItemsCount;
    this.element.querySelector(".val-buffer").textContent = v.bufferSizeCount;
    this.element.querySelector(".val-scroll-perf").textContent = `${v.scrollPerformanceScore}%`;

    const badge = this.element.querySelector(".status-badge");
    if (v.scrollPerformanceScore < 95) {
      badge.textContent = "Degraded";
      badge.className = "metric-card-badge badge-warning status-badge";
    } else {
      badge.textContent = "Active";
      badge.className = "metric-card-badge badge-normal status-badge";
    }
  }
}
