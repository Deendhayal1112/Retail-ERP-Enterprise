/**
 * DefectManagementPanel.js
 * Retail ERP Enterprise — Bug Tracking & Defect logs
 */

"use strict";

export default class DefectManagementPanel {
  constructor(options = {}) {
    this.options = options;
    this.bugs = options.bugs || [];
  }

  render() {
    const card = document.createElement("div");
    card.className = "qa-center-card col-span-12";
    card.innerHTML = `
      <h3 class="qa-center-card-title">Defect Management & Bug Tracking</h3>
      <div style="display:flex; flex-direction:column; gap:16px;">
        ${this.bugs.map(bug => `
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #F1F5F9; padding-bottom:12px;">
            <div>
              <div style="display:flex; align-items:center; gap:8px;">
                <strong style="font-size:14px; color:#1E293B;">${bug.id} | ${bug.title}</strong>
                <span class="qa-badge ${bug.priority.toLowerCase()}">${bug.priority}</span>
              </div>
              <span style="font-size:12px; color:#6B7280; display:block; margin-top:4px;">Status: ${bug.status}</span>
            </div>
            <button class="resolve-bug-btn" data-id="${bug.id}" style="height:32px; padding:0 12px; border:1px solid #E9EDF5; background:none; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer; color:#1E293B;">
              ${bug.status === "Resolved" ? "Reopen Bug" : "Resolve Bug"}
            </button>
          </div>
        `).join("")}
      </div>
    `;

    card.querySelectorAll(".resolve-bug-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        this.resolveBug(id);
      });
    });

    return card;
  }

  async resolveBug(bugId) {
    if (this.options.onResolve) {
      await this.options.onResolve(bugId);
    }
  }
}
