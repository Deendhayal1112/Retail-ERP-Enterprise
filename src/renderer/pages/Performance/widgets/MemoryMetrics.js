/**
 * MemoryMetrics.js
 * Retail ERP Enterprise — Memory Metrics Widget
 */

"use strict";

export default class MemoryMetrics {
  constructor() {
    this.element = null;
  }

  render() {
    const card = document.createElement("div");
    card.className = "performance-metric-card memory-metrics-card";

    card.innerHTML = `
      <div class="metric-card-header">
        <h3 class="metric-card-title">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
          Memory Metrics
        </h3>
        <span class="metric-card-badge badge-normal status-badge">Normal</span>
      </div>
      <div class="metric-stats-list">
        <div class="metric-stat-row">
          <span class="stat-label">Heap Usage</span>
          <span class="stat-value val-heap">-- MB</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">RAM Usage</span>
          <span class="stat-value val-ram">-- MB</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Cache Usage</span>
          <span class="stat-value val-cache">-- MB</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Object Count</span>
          <span class="stat-value val-objects">--</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Garbage Collections</span>
          <span class="stat-value val-gc">--</span>
        </div>
        <div class="metric-stat-row">
          <span class="stat-label">Memory Trend</span>
          <span class="stat-value val-trend">--</span>
        </div>
      </div>
    `;

    this.element = card;
    return card;
  }

  update(metrics) {
    if (!this.element || !metrics || !metrics.memory) return;
    const m = metrics.memory;

    const heapMb = (m.heapUsageBytes / (1024 * 1024)).toFixed(1);
    const ramMb = (m.ramUsageBytes / (1024 * 1024)).toFixed(1);
    const cacheMb = (m.cacheUsageBytes / (1024 * 1024)).toFixed(1);

    this.element.querySelector(".val-heap").textContent = `${heapMb} MB`;
    this.element.querySelector(".val-ram").textContent = `${ramMb} MB`;
    this.element.querySelector(".val-cache").textContent = `${cacheMb} MB`;
    this.element.querySelector(".val-objects").textContent = m.objectCount.toLocaleString();
    this.element.querySelector(".val-gc").textContent = m.garbageCollectionCount;
    this.element.querySelector(".val-trend").textContent = m.memoryTrend;

    const badge = this.element.querySelector(".status-badge");
    if (m.heapUsageBytes > 150 * 1024 * 1024) {
      badge.textContent = "Warning";
      badge.className = "metric-card-badge badge-warning status-badge";
    } else {
      badge.textContent = "Normal";
      badge.className = "metric-card-badge badge-normal status-badge";
    }
  }
}
