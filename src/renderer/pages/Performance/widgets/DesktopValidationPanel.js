/**
 * DesktopValidationPanel.js
 * Retail ERP Enterprise — Electron platform assertion validation panel
 */

"use strict";

export default class DesktopValidationPanel {
  constructor() { this.element = null; }

  render() {
    const card = document.createElement("div");
    card.className = "performance-metric-card desktop-validation-panel";

    card.innerHTML = `
      <div class="metric-card-header">
        <h3 class="metric-card-title">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>
          Electron Assertions
        </h3>
        <span class="metric-card-badge badge-normal status-badge">Certified</span>
      </div>
      <div class="desktop-tests-list" style="display:flex; flex-direction:column; gap:8px; margin-top:8px;"></div>
    `;

    this.element = card;
    return card;
  }

  update(metrics) {
    if (!this.element) return;
    const list = this.element.querySelector(".desktop-tests-list");

    const tests = metrics.desktop || [];
    list.innerHTML = tests.map(t => {
      const dotColor = t.pass ? "#10B981" : "#EF4444";
      return `
        <div style="display:flex; align-items:center; gap:10px; padding:6px 0; border-bottom:1px solid rgba(0,0,0,0.04);">
          <span style="width:8px; height:8px; border-radius:50%; background:${dotColor}; flex-shrink:0;"></span>
          <span style="flex:1; font-size:13px; font-weight:500; color:#334155;">${t.name}</span>
          <span style="font-size:10px; font-weight:700; background:rgba(16,185,129,0.06); color:${dotColor}; border-radius:4px; padding:1px 6px;">Asserted</span>
        </div>`;
    }).join("");

    const badge = this.element.querySelector(".status-badge");
    const hasFail = tests.some(t => !t.pass);
    if (hasFail) {
      badge.textContent = "Degraded";
      badge.className = "metric-card-badge badge-warning status-badge";
    } else {
      badge.textContent = "Certified";
      badge.className = "metric-card-badge badge-normal status-badge";
    }
  }
}
