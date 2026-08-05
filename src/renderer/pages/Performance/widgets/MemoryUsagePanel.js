/**
 * MemoryUsagePanel.js
 * Retail ERP Enterprise — Heap, RAM, Peak & Growth Panel
 */

"use strict";

export default class MemoryUsagePanel {
  constructor() { this.element = null; }

  render() {
    const card = document.createElement("div");
    card.className = "performance-metric-card memory-usage-panel";
    card.innerHTML = `
      <div class="metric-card-header">
        <h3 class="metric-card-title">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
          Memory Usage
        </h3>
        <span class="metric-card-badge badge-normal status-badge">Stable</span>
      </div>
      <div class="metric-stats-list">
        <div class="metric-stat-row"><span class="stat-label">Heap Usage</span><span class="stat-value val-heap">-- MB</span></div>
        <div class="metric-stat-row"><span class="stat-label">RAM Usage</span><span class="stat-value val-ram">-- MB</span></div>
        <div class="metric-stat-row"><span class="stat-label">Peak Memory</span><span class="stat-value val-peak">-- MB</span></div>
        <div class="metric-stat-row"><span class="stat-label">Available Memory</span><span class="stat-value val-available">-- MB</span></div>
        <div class="metric-stat-row"><span class="stat-label">Memory Trend</span><span class="stat-value val-trend">--</span></div>
        <div class="metric-stat-row"><span class="stat-label">Growth Rate</span><span class="stat-value val-growth">-- MB/min</span></div>
      </div>
    `;
    this.element = card;
    return card;
  }

  update(metrics) {
    if (!this.element) return;
    const m = metrics.memory;
    const toMb = b => (b / (1024 * 1024)).toFixed(1);

    this.element.querySelector(".val-heap").textContent = `${toMb(m.heapUsageBytes)} MB`;
    this.element.querySelector(".val-ram").textContent = `${toMb(m.ramUsageBytes)} MB`;
    this.element.querySelector(".val-peak").textContent = `${toMb(m.peakMemoryBytes)} MB`;
    this.element.querySelector(".val-available").textContent = `${toMb(m.availableMemoryBytes)} MB`;
    this.element.querySelector(".val-trend").textContent = m.memoryTrend;
    this.element.querySelector(".val-growth").textContent = `${m.growthRateMbPerMin} MB/min`;

    const badge = this.element.querySelector(".status-badge");
    if (m.heapUsageBytes > 150 * 1024 * 1024 || m.memoryTrend === "Rising") {
      badge.textContent = "Warning";
      badge.className = "metric-card-badge badge-warning status-badge";
    } else {
      badge.textContent = m.memoryTrend;
      badge.className = "metric-card-badge badge-normal status-badge";
    }
  }
}
