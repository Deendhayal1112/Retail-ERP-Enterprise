/**
 * ObjectLifecyclePanel.js
 * Retail ERP Enterprise — Object Lifecycle & GC Monitoring Panel
 */

"use strict";

export default class ObjectLifecyclePanel {
  constructor() { this.element = null; }

  render() {
    const card = document.createElement("div");
    card.className = "performance-metric-card object-lifecycle-panel";
    card.innerHTML = `
      <div class="metric-card-header">
        <h3 class="metric-card-title">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
          Object Lifecycle
        </h3>
        <span class="metric-card-badge badge-normal status-badge">Healthy</span>
      </div>
      <div class="metric-stats-list">
        <div class="metric-stat-row"><span class="stat-label">Active Objects</span><span class="stat-value val-active">--</span></div>
        <div class="metric-stat-row"><span class="stat-label">Destroyed Objects</span><span class="stat-value val-destroyed">--</span></div>
        <div class="metric-stat-row"><span class="stat-label">GC Runs</span><span class="stat-value val-gc">--</span></div>
        <div class="metric-stat-row"><span class="stat-label">Memory Leaks</span><span class="stat-value val-leaks">--</span></div>
        <div class="metric-stat-row"><span class="stat-label">Retained Objects</span><span class="stat-value val-retained">--</span></div>
      </div>
    `;
    this.element = card;
    return card;
  }

  update(metrics) {
    if (!this.element) return;
    const o = metrics.objects;

    this.element.querySelector(".val-active").textContent = o.activeObjectsCount.toLocaleString();
    this.element.querySelector(".val-destroyed").textContent = o.destroyedObjectsCount.toLocaleString();
    this.element.querySelector(".val-gc").textContent = o.gcRunsCount;
    this.element.querySelector(".val-leaks").textContent = o.memoryLeaksCount;
    this.element.querySelector(".val-retained").textContent = o.retainedObjectsCount.toLocaleString();

    const badge = this.element.querySelector(".status-badge");
    if (o.memoryLeaksCount > 0 || o.retainedObjectsCount > 500) {
      badge.textContent = "Warning";
      badge.className = "metric-card-badge badge-warning status-badge";
    } else {
      badge.textContent = "Healthy";
      badge.className = "metric-card-badge badge-normal status-badge";
    }
  }
}
