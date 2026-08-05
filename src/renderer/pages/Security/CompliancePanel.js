/**
 * CompliancePanel.js
 * Retail ERP Enterprise — Compliance Standard Checklists Panel
 */

"use strict";

export default class CompliancePanel {
  constructor(options = {}) {
    this.options = options;
    this.checklists = options.checklists || {};
    this.element = null;
  }

  render() {
    const card = document.createElement("div");
    card.className = "security-card col-span-12";
    card.innerHTML = `
      <h3 class="security-card-title">Compliance Checklists & Standards</h3>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:24px;">
        <!-- OWASP Checklist -->
        <div>
          <h4 style="font-size:15px; font-weight:600; color:#1E293B; margin-bottom:12px;">OWASP Desktop Checklist</h4>
          <div class="owasp-list" style="display:flex; flex-direction:column; gap:12px;"></div>
        </div>

        <!-- Privacy & Regulations -->
        <div>
          <h4 style="font-size:15px; font-weight:600; color:#1E293B; margin-bottom:12px;">Privacy & Licensing Rules</h4>
          <div class="privacy-list" style="display:flex; flex-direction:column; gap:12px;"></div>
        </div>
      </div>
    `;

    const owaspContainer = card.querySelector(".owasp-list");
    const privacyContainer = card.querySelector(".privacy-list");

    // Populate OWASP checklist
    if (this.checklists.owasp) {
      this.checklists.owasp.forEach(item => {
        owaspContainer.appendChild(this._createChecklistRow("owasp", item));
      });
    }

    // Populate Privacy / License checklists
    if (this.checklists.privacy) {
      this.checklists.privacy.forEach(item => {
        privacyContainer.appendChild(this._createChecklistRow("privacy", item));
      });
    }
    if (this.checklists.license) {
      this.checklists.license.forEach(item => {
        privacyContainer.appendChild(this._createChecklistRow("license", item));
      });
    }

    this.element = card;
    return card;
  }

  _createChecklistRow(standard, item) {
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.justifyContent = "space-between";
    row.style.alignItems = "center";
    row.style.borderBottom = "1px solid #F1F5F9";
    row.style.paddingBottom = "8px";

    const isPassed = item.status === "PASSED";

    row.innerHTML = `
      <div style="display:flex; align-items:center; gap:8px;">
        <input type="checkbox" class="compliance-checkbox" data-id="${item.id}" ${isPassed ? "checked" : ""} style="cursor:pointer;" />
        <span style="font-size:13px; color:#1E293B; font-weight:500;">${item.rule}</span>
      </div>
      <span style="font-size:11px; font-weight:700; color:${isPassed ? "#10B981" : "#EF4444"};">${item.status}</span>
    `;

    // Bind event check toggles
    row.querySelector(".compliance-checkbox").addEventListener("change", async (e) => {
      e.preventDefault();
      if (this.options.onToggleRule) {
        await this.options.onToggleRule(standard, item.id);
      }
    });

    return row;
  }
}
