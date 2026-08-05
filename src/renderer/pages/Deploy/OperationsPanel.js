/**
 * OperationsPanel.js
 * Retail ERP Enterprise — Production System availability & Operations
 */

"use strict";

export default class OperationsPanel {
  constructor(options = {}) {
    this.options = options;
    this.stats = options.stats || {};
    this.maintenanceActive = options.maintenanceActive || false;
  }

  render() {
    const card = document.createElement("div");
    card.className = "deploy-center-card col-span-12";
    card.innerHTML = `
      <h3 class="deploy-center-card-title">Production Health Monitoring & Operations</h3>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:24px;">
        <!-- Left: Health parameters -->
        <div>
          <h4 style="font-size:15px; font-weight:600; color:#1E293B; margin-bottom:12px;">Active Health Parameters</h4>
          <div style="display:flex; flex-direction:column; gap:12px;">
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid #F1F5F9; padding-bottom:8px; font-size:13px;">
              <span style="color:#6B7280;">SRE System Availability</span>
              <strong style="color:#1E293B;">${this.stats.availabilityPercent}%</strong>
            </div>
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid #F1F5F9; padding-bottom:8px; font-size:13px;">
              <span style="color:#6B7280;">Database Health</span>
              <strong style="color:#1E293B;">${this.stats.dbStatus}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid #F1F5F9; padding-bottom:8px; font-size:13px;">
              <span style="color:#6B7280;">Storage Space Status</span>
              <strong style="color:#1E293B;">${this.stats.diskSpaceUsedGb} GB / ${this.stats.diskSpaceAvailableGb} GB Used</strong>
            </div>
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid #F1F5F9; padding-bottom:8px; font-size:13px;">
              <span style="color:#6B7280;">Backup Replication status</span>
              <strong style="color:#10B981;">${this.stats.backupStatus}</strong>
            </div>
          </div>
        </div>

        <!-- Right: Maintenance Mode controls -->
        <div>
          <h4 style="font-size:15px; font-weight:600; color:#1E293B; margin-bottom:12px;">Operations & Maintenance Toggle</h4>
          <div style="padding:16px; border:1px solid #E9EDF5; border-radius:12px; background-color:#F8FAFC; display:flex; flex-direction:column; gap:12px;">
            <div>
              <strong style="font-size:14px; color:#1E293B; display:block;">Activate Maintenance Mode</strong>
              <span style="font-size:12px; color:#6B7280;">Blocks transaction checkout pipelines to perform schema upgrades safely.</span>
            </div>
            <button class="toggle-maintenance-btn" style="height:36px; border:none; background-color:${this.maintenanceActive ? "#EF4444" : "#5B3DF5"}; color:#FFFFFF; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer;">
              ${this.maintenanceActive ? "Deactivate Maintenance" : "Activate Maintenance Mode"}
            </button>
          </div>
        </div>
      </div>
    `;

    card.querySelector(".toggle-maintenance-btn").addEventListener("click", () => {
      this.toggleMaintenance();
    });

    return card;
  }

  async toggleMaintenance() {
    if (this.options.onToggleMaintenance) {
      await this.options.onToggleMaintenance();
    }
  }
}
