/**
 * ApprovalPanel.js
 * Retail ERP Enterprise — Stakeholders Approval Control Panel
 */

"use strict";

export default class ApprovalPanel {
  constructor(options = {}) {
    this.options = options;
    this.approvals = options.approvals || [];
  }

  render() {
    const card = document.createElement("div");
    card.className = "rc-center-card col-span-12";
    card.innerHTML = `
      <h3 class="rc-center-card-title">Stakeholder Go-Live Approvals</h3>
      <div style="display:flex; flex-direction:column; gap:16px;">
        ${this.approvals.map(app => `
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #F1F5F9; padding-bottom:12px;">
            <div>
              <strong style="font-size:14px; color:#1E293B; display:block;">${app.role}</strong>
              <span style="font-size:12px; color:#6B7280;">Signer: ${app.signer}</span>
            </div>
            <div style="display:flex; align-items:center; gap:12px;">
              <span class="rc-badge ${app.signed ? "passed" : "warning"}">
                ${app.signed ? "SIGNED" : "PENDING"}
              </span>
              <button class="sign-btn" data-id="${app.id}" style="height:32px; padding:0 12px; border:1px solid #E9EDF5; background:none; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer; color:#1E293B;">
                ${app.signed ? "Revoke Signature" : "Sign Approval"}
              </button>
            </div>
          </div>
        `).join("")}
      </div>
    `;

    card.querySelectorAll(".sign-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        this.toggleSign(id);
      });
    });

    return card;
  }

  async toggleSign(id) {
    if (this.options.onToggleSign) {
      await this.options.onToggleSign(id);
    }
  }
}
