/**
 * QualityMetricsPanel.js
 * Retail ERP Enterprise — QA Dashboard Top Metrics Bar
 */

"use strict";

export default class QualityMetricsPanel {
  constructor() { this.element = null; }

  render() {
    const card = document.createElement("div");
    card.className = "performance-dashboard-grid";
    card.style.gridTemplateColumns = "repeat(auto-fit, minmax(200px, 1fr))";
    card.style.width = "100%";

    card.innerHTML = `
      <div class="performance-metric-card active-card">
        <span class="stat-label">Automation Coverage</span>
        <span class="val-avg-cov" style="display:block; font-size:24px; font-weight:700; color:#2563EB;">--%</span>
      </div>
      <div class="performance-metric-card queued-card">
        <span class="stat-label">Total Suite Tests</span>
        <span class="val-total" style="display:block; font-size:24px; font-weight:700; color:#475569;">0</span>
      </div>
      <div class="performance-metric-card completed-card">
        <span class="stat-label">Automated Pass Rate</span>
        <span class="val-pass-rate" style="display:block; font-size:24px; font-weight:700; color:#10B981;">--%</span>
      </div>
      <div class="performance-metric-card failed-card">
        <span class="stat-label">Failed Assertions</span>
        <span class="val-failed" style="display:block; font-size:24px; font-weight:700; color:#EF4444;">0</span>
      </div>
    `;

    this.element = card;
    return card;
  }

  update(metrics) {
    if (!this.element) return;

    // Calculate average unit coverage
    const cov = metrics.unitCoverage;
    const avg = (cov.componentsPct + cov.hooksPct + cov.utilitiesPct + cov.servicesPct + cov.repositoriesPct + cov.storePct) / 6;

    this.element.querySelector(".val-avg-cov").textContent = `${avg.toFixed(1)}%`;
    this.element.querySelector(".val-total").textContent = metrics.totalTestsCount;
    this.element.querySelector(".val-pass-rate").textContent = `${metrics.passRatePct}%`;
    this.element.querySelector(".val-failed").textContent = metrics.failedTestsCount;
  }
}
