/**
 * InstallerValidationPanel.js
 * Retail ERP Enterprise — Installer Integrity Validation Checks Panel
 */

"use strict";

export default class InstallerValidationPanel {
  constructor(options = {}) {
    this.options = options;
    this.validations = options.validations || [];
  }

  render() {
    const card = document.createElement("div");
    card.className = "release-card col-span-12";
    card.innerHTML = `
      <h3 class="release-card-title">Installer Integrity Verification Checklist</h3>
      <div class="validations-container" style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
        <div class="validations-left-column" style="display:flex; flex-direction:column; gap:16px;"></div>
        <div class="validations-right-column" style="display:flex; flex-direction:column; gap:16px;"></div>
      </div>
    `;

    const leftCol = card.querySelector(".validations-left-column");
    const rightCol = card.querySelector(".validations-right-column");

    this.validations.forEach((item, index) => {
      const row = document.createElement("div");
      row.style.display = "flex";
      row.style.justifyContent = "space-between";
      row.style.alignItems = "center";
      row.style.borderBottom = "1px solid #F1F5F9";
      row.style.paddingBottom = "10px";

      const isPassed = item.status === "PASSED";
      const badgeClass = item.status.toLowerCase();

      row.innerHTML = `
        <div style="display:flex; align-items:center; gap:10px;">
          <input type="checkbox" class="validation-checkbox" data-id="${item.id}" ${isPassed ? "checked" : ""} style="cursor:pointer;" />
          <div>
            <strong style="font-size:13px; color:#1E293B; display:block;">${item.phase}</strong>
            <span style="font-size:11px; color:#6B7280;">${item.description}</span>
          </div>
        </div>
        <span class="validation-badge ${badgeClass}">${item.status}</span>
      `;

      row.querySelector(".validation-checkbox").addEventListener("change", async (e) => {
        e.preventDefault();
        if (this.options.onToggleValidation) {
          await this.options.onToggleValidation(item.id);
        }
      });

      if (index % 2 === 0) {
        leftCol.appendChild(row);
      } else {
        rightCol.appendChild(row);
      }
    });

    return card;
  }
}
