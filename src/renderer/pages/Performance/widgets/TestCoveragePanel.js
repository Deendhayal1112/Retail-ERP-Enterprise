/**
 * TestCoveragePanel.js
 * Retail ERP Enterprise — Unit Test coverage progress bar panel
 */

"use strict";

export default class TestCoveragePanel {
  constructor() { this.element = null; }

  render() {
    const card = document.createElement("div");
    card.className = "performance-metric-card test-coverage-panel";

    card.innerHTML = `
      <div class="metric-card-header">
        <h3 class="metric-card-title">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
          Unit Test Coverage
        </h3>
        <span class="metric-card-badge badge-normal status-badge">Pass</span>
      </div>
      <div class="coverage-bars-list" style="display:flex; flex-direction:column; gap:10px; margin-top:8px;"></div>
    `;

    this.element = card;
    return card;
  }

  update(metrics) {
    if (!this.element) return;
    const cov = metrics.unitCoverage;

    const layers = [
      { name: "React Components", pct: cov.componentsPct, color: "#2563EB" },
      { name: "Custom Hooks", pct: cov.hooksPct, color: "#7C3AED" },
      { name: "Helper Utilities", pct: cov.utilitiesPct, color: "#10B981" },
      { name: "Core Services", pct: cov.servicesPct, color: "#F59E0B" },
      { name: "Repositories API", pct: cov.repositoriesPct, color: "#EC4899" },
      { name: "App Store Reducer", pct: cov.storePct, color: "#475569" }
    ];

    const list = this.element.querySelector(".coverage-bars-list");
    list.innerHTML = layers.map(l => {
      const isWarn = l.pct < 80.0;
      return `
        <div>
          <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:3px; font-weight:600; color:#475569;">
            <span>${l.name}</span>
            <span style="color:${isWarn ? "#D97706" : l.color};">${l.pct}%</span>
          </div>
          <div style="width:100%; height:6px; background:#F1F5F9; border-radius:3px; overflow:hidden;">
            <div style="width:${l.pct}%; height:100%; background:${isWarn ? "#F59E0B" : l.color}; border-radius:3px; transition:width 0.4s ease;"></div>
          </div>
        </div>`;
    }).join("");

    const badge = this.element.querySelector(".status-badge");
    const hasWarning = layers.some(l => l.pct < 80.0);
    if (hasWarning) {
      badge.textContent = "Review";
      badge.className = "metric-card-badge badge-warning status-badge";
    } else {
      badge.textContent = "Optimal";
      badge.className = "metric-card-badge badge-normal status-badge";
    }
  }
}
