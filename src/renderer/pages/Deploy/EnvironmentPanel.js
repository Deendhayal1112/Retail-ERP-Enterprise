/**
 * EnvironmentPanel.js
 * Retail ERP Enterprise — Configuration Variables Control Panel
 */

"use strict";

export default class EnvironmentPanel {
  constructor(options = {}) {
    this.options = options;
    this.variables = options.variables || [];
    this.element = null;
  }

  render() {
    const card = document.createElement("div");
    card.className = "deploy-center-card col-span-12";
    card.innerHTML = `
      <h3 class="deploy-center-card-title">Environment Variables & Configurations Profiles</h3>
      <div style="display:flex; flex-direction:column; gap:20px;">
        <div class="vars-list-container" style="display:grid; grid-template-columns:1fr; gap:16px;"></div>
      </div>
    `;

    const container = card.querySelector(".vars-list-container");
    this.variables.forEach(v => {
      const row = document.createElement("div");
      row.className = "deploy-row-item";
      row.innerHTML = `
        <div>
          <strong style="color:#1E293B; font-size:14px; display:block;">${v.key}</strong>
          <span style="font-size:12px; color:#6B7280;">Profile: ${v.profile} | Type: ${v.type}</span>
        </div>
        <div style="display:flex; align-items:center; gap:12px;">
          <input type="text" class="var-val-input" data-key="${v.key}" value="${v.value}" style="height:32px; padding:0 8px; border:1px solid #E9EDF5; border-radius:6px; font-size:13px; color:#1F2937; width:200px;" />
          <button class="save-var-btn" data-key="${v.key}" style="height:32px; padding:0 12px; border:none; background-color:#5B3DF5; color:#FFFFFF; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer;">
            Save
          </button>
        </div>
      `;

      row.querySelector(".save-var-btn").addEventListener("click", () => {
        const inputVal = row.querySelector(".var-val-input").value;
        this.saveVariable(v.key, inputVal);
      });

      container.appendChild(row);
    });

    this.element = card;
    return card;
  }

  async saveVariable(key, val) {
    if (this.options.onSave) {
      await this.options.onSave(key, val);
    }
  }
}
