/**
 * TaskMetricsPanel.js
 * Retail ERP Enterprise — Telemetry Summary Panel
 */

"use strict";

export default class TaskMetricsPanel {
  constructor() {
    this.element = null;
  }

  render() {
    const wrapper = document.createElement("div");
    wrapper.className = "performance-dashboard-grid";
    wrapper.style.gridTemplateColumns = "repeat(auto-fit, minmax(200px, 1fr))";
    wrapper.style.width = "100%";

    wrapper.innerHTML = `
      <div class="performance-metric-card active-card">
        <span class="stat-label">Active Tasks</span>
        <span class="stat-value val-active" style="display:block; font-size:24px; font-weight:700; color:#2563EB;">0</span>
      </div>
      <div class="performance-metric-card queued-card">
        <span class="stat-label">Queued Tasks</span>
        <span class="stat-value val-queued" style="display:block; font-size:24px; font-weight:700; color:#F59E0B;">0</span>
      </div>
      <div class="performance-metric-card completed-card">
        <span class="stat-label">Completed Tasks</span>
        <span class="stat-value val-completed" style="display:block; font-size:24px; font-weight:700; color:#10B981;">0</span>
      </div>
      <div class="performance-metric-card failed-card">
        <span class="stat-label">Failed Tasks</span>
        <span class="stat-value val-failed" style="display:block; font-size:24px; font-weight:700; color:#EF4444;">0</span>
      </div>
      <div class="performance-metric-card duration-card">
        <span class="stat-label">Avg Duration</span>
        <span class="stat-value val-duration" style="display:block; font-size:24px; font-weight:700; color:#475569;">-- ms</span>
      </div>
      <div class="performance-metric-card utilization-card">
        <span class="stat-label">Worker CPU</span>
        <span class="stat-value val-utilization" style="display:block; font-size:24px; font-weight:700; color:#7C3AED;">--%</span>
      </div>
    `;

    this.element = wrapper;
    return wrapper;
  }

  update(metrics) {
    if (!this.element) return;
    this.element.querySelector(".val-active").textContent = metrics.activeTasksCount;
    this.element.querySelector(".val-queued").textContent = metrics.queuedTasksCount;
    this.element.querySelector(".val-completed").textContent = metrics.completedTasksCount;
    this.element.querySelector(".val-failed").textContent = metrics.failedTasksCount;
    this.element.querySelector(".val-duration").textContent = metrics.averageDurationMs > 0 ? `${metrics.averageDurationMs} ms` : "--";
    this.element.querySelector(".val-utilization").textContent = `${metrics.cpuUtilizationPct}%`;
  }
}
