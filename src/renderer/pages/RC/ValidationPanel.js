/**
 * ValidationPanel.js
 * Retail ERP Enterprise — Release Candidate Validation checklist
 */

"use strict";

export default class ValidationPanel {
  constructor(options = {}) {
    this.options = options;
    this.validations = options.validations || [];
  }

  render() {
    const card = document.createElement("div");
    card.className = "rc-center-card col-span-12";
    card.innerHTML = `
      <h3 class="rc-center-card-title">Release Candidate Validation Gates</h3>
      <div style="display:flex; flex-direction:column; gap:16px;">
        ${this.validations.map(item => `
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #F1F5F9; padding-bottom:12px;">
            <div>
              <strong style="font-size:14px; color:#1E293B; display:block;">${item.name}</strong>
              <span style="font-size:12px; color:#6B7280;">Validation ID: ${item.id}</span>
            </div>
            <div style="display:flex; align-items:center; gap:12px;">
              <span class="rc-badge ${item.verified ? "passed" : "warning"}">
                ${item.verified ? "VERIFIED" : "PENDING"}
              </span>
              <button class="verify-gate-btn" data-id="${item.id}" style="height:32px; padding:0 12px; border:1px solid #E9EDF5; background:none; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer; color:#1E293B;">
                Toggle verification
              </button>
            </div>
          </div>
        `).join("")}
      </div>
    `;

    card.querySelectorAll(".verify-gate-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        this.toggleVerify(id);
      });
    });

    return card;
  }

  async toggleVerify(id) {
    if (this.options.onToggle) {
      await this.options.onToggle(id);
    }
  }
}
