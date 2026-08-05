/**
 * IntegrationPanel.js
 * Retail ERP Enterprise — Integration test scope panel
 */

"use strict";

export default class IntegrationPanel {
  constructor() { this.element = null; }

  render() {
    const card = document.createElement("div");
    card.className = "performance-metric-card integration-panel";

    card.innerHTML = `
      <div class="metric-card-header">
        <h3 class="metric-card-title">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          Integration Tests
        </h3>
        <span class="metric-card-badge badge-normal status-badge">All Pass</span>
      </div>
      <div class="integration-tests-list" style="display:flex; flex-direction:column; gap:8px; margin-top:8px;"></div>
    `;

    this.element = card;
    return card;
  }

  update(metrics) {
    if (!this.element) return;
    const list = this.element.querySelector(".integration-tests-list");

    const tests = metrics.integration || [];
    list.innerHTML = tests.map(t => {
      const dotColor = t.pass ? "#10B981" : "#EF4444";
      return `
        <div style="display:flex; align-items:center; gap:10px; padding:6px 0; border-bottom:1px solid rgba(0,0,0,0.04);">
          <span style="width:8px; height:8px; border-radius:50%; background:${dotColor}; flex-shrink:0;"></span>
          <span style="flex:1; font-size:13px; font-weight:500; color:#334155;">${t.name}</span>
          <span style="font-size:11px; font-weight:700; color:${dotColor}; text-transform:uppercase;">${t.pass ? "Passed" : "Failed"}</span>
        </div>`;
    }).join("");

    const badge = this.element.querySelector(".status-badge");
    const hasFail = tests.some(t => !t.pass);
    if (hasFail) {
      badge.textContent = "Warning";
      badge.className = "metric-card-badge badge-warning status-badge";
    } else {
      badge.textContent = "All Pass";
      badge.className = "metric-card-badge badge-normal status-badge";
    }
  }
}
