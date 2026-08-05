/**
 * RecoveryPanel.js
 * Retail ERP Enterprise — Disaster Recovery & Failover Panel
 */

"use strict";

export default class RecoveryPanel {
  constructor(options = {}) {
    this.options = options;
    this.plan = options.plan || [];
  }

  render() {
    const card = document.createElement("div");
    card.className = "deploy-center-card col-span-12";
    card.innerHTML = `
      <h3 class="deploy-center-card-title">Disaster Recovery & Redundant Failover Plan</h3>
      <div style="display:flex; flex-direction:column; gap:20px;">
        <div class="recovery-list-container" style="display:grid; grid-template-columns:1fr; gap:16px;"></div>
      </div>
    `;

    const container = card.querySelector(".recovery-list-container");
    this.plan.forEach(step => {
      const row = document.createElement("div");
      row.className = "deploy-row-item";

      const verifiedClass = step.status === "Completed" ? "healthy" : "warning";

      row.innerHTML = `
        <div>
          <strong style="color:#1E293B; font-size:14px; display:block;">${step.task}</strong>
          <span style="font-size:12px; color:#6B7280;">Failover Task ID: ${step.id}</span>
        </div>
        <div style="display:flex; align-items:center; gap:12px;">
          <span class="deploy-badge ${verifiedClass}">
            ${step.status}
          </span>
          <button class="run-recovery-btn" data-id="${step.id}" style="height:32px; padding:0 12px; border:1px solid #E9EDF5; background-color:#FFFFFF; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer; color:#1E293B;">
            Toggle Status
          </button>
        </div>
      `;

      row.querySelector(".run-recovery-btn").addEventListener("click", () => {
        this.runStep(step.id);
      });

      container.appendChild(row);
    });

    return card;
  }

  async runStep(stepId) {
    if (this.options.onToggleStep) {
      await this.options.onToggleStep(stepId);
    }
  }
}
