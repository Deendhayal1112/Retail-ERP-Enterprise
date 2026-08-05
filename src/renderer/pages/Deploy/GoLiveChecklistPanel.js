/**
 * GoLiveChecklistPanel.js
 * Retail ERP Enterprise — Production Sign-Off Verification Checks Panel
 */

"use strict";

export default class GoLiveChecklistPanel {
  constructor(options = {}) {
    this.options = options;
    this.checklist = options.checklist || [];
  }

  render() {
    const card = document.createElement("div");
    card.className = "deploy-center-card col-span-12";
    card.innerHTML = `
      <h3 class="deploy-center-card-title">Go-Live Sign-Off & Production Validation</h3>
      <div style="display:flex; flex-direction:column; gap:16px;">
        ${this.checklist.map(item => `
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #F1F5F9; padding-bottom:12px;">
            <div>
              <strong style="font-size:14px; color:#1E293B; display:block;">${item.task}</strong>
              <span style="font-size:12px; color:#6B7280;">Validation ID: ${item.id}</span>
            </div>
            <div style="display:flex; align-items:center; gap:12px;">
              <span class="deploy-badge ${item.verified ? "healthy" : "warning"}">
                ${item.verified ? "VERIFIED" : "PENDING"}
              </span>
              <button class="verify-btn" data-id="${item.id}" style="height:32px; padding:0 12px; border:1px solid #E9EDF5; background:none; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer; color:#1E293B;">
                Toggle Sign-Off
              </button>
            </div>
          </div>
        `).join("")}
      </div>
    `;

    card.querySelectorAll(".verify-btn").forEach(btn => {
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
