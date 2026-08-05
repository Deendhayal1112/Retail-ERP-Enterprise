/**
 * RiskAssessmentPanel.js
 * Retail ERP Enterprise — Release Candidate Risk Assessment & Mitigations Panel
 */

"use strict";

export default class RiskAssessmentPanel {
  constructor(options = {}) {
    this.options = options;
    this.risks = options.risks || [];
  }

  render() {
    const card = document.createElement("div");
    card.className = "rc-center-card col-span-12";
    card.innerHTML = `
      <h3 class="rc-center-card-title">Release Candidate Risk Assessments</h3>
      <div style="display:flex; flex-direction:column; gap:16px;">
        ${this.risks.map(r => `
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #F1F5F9; padding-bottom:12px;">
            <div>
              <div style="display:flex; align-items:center; gap:8px;">
                <strong style="font-size:14px; color:#1E293B;">${r.description}</strong>
                <span class="rc-badge ${r.severity.toLowerCase()}">${r.severity} Severity</span>
              </div>
              <span style="font-size:12px; color:#6B7280; display:block; margin-top:4px;">Mitigation: ${r.mitigation}</span>
            </div>
            <div style="display:flex; align-items:center; gap:12px;">
              <span class="rc-badge ${r.mitigated ? "passed" : "warning"}">
                ${r.mitigated ? "MITIGATED" : "ACTIVE"}
              </span>
              <button class="mitigate-btn" data-id="${r.id}" style="height:32px; padding:0 12px; border:1px solid #E9EDF5; background:none; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer; color:#1E293B;">
                Toggle mitigation
              </button>
            </div>
          </div>
        `).join("")}
      </div>
    `;

    card.querySelectorAll(".mitigate-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        this.toggleMitigate(id);
      });
    });

    return card;
  }

  async toggleMitigate(id) {
    if (this.options.onToggleMitigate) {
      await this.options.onToggleMitigate(id);
    }
  }
}
