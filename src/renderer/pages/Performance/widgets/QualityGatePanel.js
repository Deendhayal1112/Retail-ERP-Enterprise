/**
 * QualityGatePanel.js
 * Retail ERP Enterprise — Quality standards enforcement status panel
 */

"use strict";

export default class QualityGatePanel {
  constructor() { this.element = null; }

  render() {
    const card = document.createElement("div");
    card.className = "performance-metric-card quality-gate-panel";

    card.innerHTML = `
      <div class="metric-card-header">
        <h3 class="metric-card-title">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          Quality Gates
        </h3>
        <span class="metric-card-badge badge-normal status-badge">Secure</span>
      </div>
      <div class="gates-list" style="display:flex; flex-direction:column; gap:8px; margin-top:8px;"></div>
    `;

    this.element = card;
    return card;
  }

  update(metrics) {
    if (!this.element) return;
    const g = metrics.gates;

    const list = this.element.querySelector(".gates-list");
    const rules = [
      { name: "ESLint Warning Threshold", value: `${g.eslintWarnings} warnings`, pass: g.eslintWarnings < 5 },
      { name: "Prettier Format Integrity", value: g.prettierPassing ? "Passing" : "Formatting issues", pass: g.prettierPassing },
      { name: "Dependency Vulnerabilities", value: `${g.dependencyVulnerabilities} found`, pass: g.dependencyVulnerabilities === 0 },
      { name: "Secret Scanner Status", value: `${g.secretsDetected} matches`, pass: g.secretsDetected === 0 },
      { name: "License Compliance Check", value: g.licenseCompliance ? "Approved" : "Failed", pass: g.licenseCompliance }
    ];

    list.innerHTML = rules.map(r => {
      const dotColor = r.pass ? "#10B981" : "#EF4444";
      return `
        <div style="display:flex; align-items:center; justify-content:space-between; padding:6px 0; border-bottom:1px solid rgba(0,0,0,0.04); font-size:13px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="width:8px; height:8px; border-radius:50%; background:${dotColor}; flex-shrink:0;"></span>
            <span style="font-weight:500; color:#334155;">${r.name}</span>
          </div>
          <span style="font-size:12px; font-weight:700; color:#1E293B;">${r.value}</span>
        </div>`;
    }).join("");

    const badge = this.element.querySelector(".status-badge");
    const passed = rules.every(r => r.pass);
    if (passed) {
      badge.textContent = "Secure";
      badge.className = "metric-card-badge badge-normal status-badge";
    } else {
      badge.textContent = "Review";
      badge.className = "metric-card-badge badge-warning status-badge";
    }
  }
}
