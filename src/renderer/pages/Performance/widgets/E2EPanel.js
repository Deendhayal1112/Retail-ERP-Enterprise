/**
 * E2EPanel.js
 * Retail ERP Enterprise — E2E flow testing latency panel
 */

"use strict";

export default class E2EPanel {
  constructor() { this.element = null; }

  render() {
    const card = document.createElement("div");
    card.className = "performance-metric-card e2e-panel";

    card.innerHTML = `
      <div class="metric-card-header">
        <h3 class="metric-card-title">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.968 17.968a12 12 0 1 1 2.83-2.83"></path><path d="M6.2 6.2L12 12"></path></svg>
          E2E Flow Latency
        </h3>
        <span class="metric-card-badge badge-normal status-badge">Optimized</span>
      </div>
      <div class="e2e-tests-list" style="display:flex; flex-direction:column; gap:8px; margin-top:8px;"></div>
    `;

    this.element = card;
    return card;
  }

  update(metrics) {
    if (!this.element) return;
    const list = this.element.querySelector(".e2e-tests-list");

    const tests = metrics.e2e || [];
    list.innerHTML = tests.map(t => {
      const isSlow = t.avgLatencyMs > 1000;
      const latencyColor = isSlow ? "#B45309" : "#1E293B";
      return `
        <div style="display:flex; align-items:center; justify-content:space-between; padding:6px 0; border-bottom:1px solid rgba(0,0,0,0.04);">
          <span style="font-size:13px; font-weight:500; color:#334155;">${t.name}</span>
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:12px; font-weight:700; color:${latencyColor};">${t.avgLatencyMs} ms</span>
            <span style="font-size:10px; font-weight:600; background:#F1F5F9; color:#475569; border-radius:4px; padding:1px 6px;">E2E</span>
          </div>
        </div>`;
    }).join("");

    const badge = this.element.querySelector(".status-badge");
    const hasSlow = tests.some(t => t.avgLatencyMs > 1000);
    if (hasSlow) {
      badge.textContent = "Review";
      badge.className = "metric-card-badge badge-warning status-badge";
    } else {
      badge.textContent = "Optimized";
      badge.className = "metric-card-badge badge-normal status-badge";
    }
  }
}
