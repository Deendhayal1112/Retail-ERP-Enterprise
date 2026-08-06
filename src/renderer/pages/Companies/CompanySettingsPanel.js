/**
 * CompanySettingsPanel.js
 * Retail ERP Enterprise — Corporate Settings & Configuration Panel
 */

"use strict";

export default class CompanySettingsPanel {
  /**
   * @param {Object}   options
   * @param {Array}    options.companies       List of companies.
   * @param {string}   options.activeCompanyId Active company ID.
   * @param {Function} options.onSaveSettings  Callback on save config settings.
   */
  constructor(options = {}) {
    this.companies = options.companies || [];
    this.activeCompanyId = options.activeCompanyId || "";
    this.onSaveSettings = options.onSaveSettings || null;
    this.selectedCompanyId = this.activeCompanyId || this.companies[0]?.id || "";
  }

  render() {
    const panel = document.createElement("div");
    panel.className = "companies-settings-panel";

    if (this.companies.length === 0) {
      panel.innerHTML = `<div class="empty-state">No registered companies available to configure settings.</div>`;
      return panel;
    }

    const selectRow = document.createElement("div");
    selectRow.className = "company-select-row";
    selectRow.innerHTML = `
      <label class="select-label font-semibold">Select Company to Edit:</label>
      <select class="company-dropdown-select">
        ${this.companies.map(c => `<option value="${c.id}" ${c.id === this.selectedCompanyId ? "selected" : ""}>${c.name}</option>`).join("")}
      </select>
    `;
    panel.appendChild(selectRow);

    const formWrapper = document.createElement("div");
    formWrapper.className = "settings-form-wrapper";
    panel.appendChild(formWrapper);

    const renderForm = () => {
      const activeComp = this.companies.find(x => x.id === this.selectedCompanyId);
      if (!activeComp) return;

      formWrapper.innerHTML = `
        <form class="company-edit-form">
          <div class="form-grid-layout">
            <div class="form-field-item">
              <label>Company Display Name</label>
              <input type="text" name="name" value="${activeComp.name}" required />
            </div>
            <div class="form-field-item">
              <label>GSTIN Tax ID</label>
              <input type="text" name="gstin" value="${activeComp.gstin}" required />
            </div>
            <div class="form-field-item">
              <label>Phone Number</label>
              <input type="text" name="phone" value="${activeComp.phone}" required />
            </div>
            <div class="form-field-item">
              <label>Display Currency</label>
              <select name="currency">
                <option value="INR (₹)" ${activeComp.currency === "INR (₹)" ? "selected" : ""}>INR (₹) — Indian Rupee</option>
                <option value="USD ($)" ${activeComp.currency === "USD ($)" ? "selected" : ""}>USD ($) — US Dollar</option>
                <option value="EUR (€)" ${activeComp.currency === "EUR (€)" ? "selected" : ""}>EUR (€) — Euro</option>
              </select>
            </div>
            <div class="form-field-item full-width">
              <label>Physical Store / Billing Address</label>
              <input type="text" name="address" value="${activeComp.address}" required />
            </div>
          </div>
          <button type="submit" class="btn-save-settings">Save Configurations</button>
        </form>
      `;

      const form = formWrapper.querySelector(".company-edit-form");
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const data = {
          name: form.elements["name"].value.trim(),
          gstin: form.elements["gstin"].value.trim(),
          phone: form.elements["phone"].value.trim(),
          currency: form.elements["currency"].value,
          address: form.elements["address"].value.trim()
        };

        if (this.onSaveSettings) {
          this.onSaveSettings(activeComp.id, data);
        }
      });
    };

    const dropdown = selectRow.querySelector(".company-dropdown-select");
    dropdown.addEventListener("change", (e) => {
      this.selectedCompanyId = e.target.value;
      renderForm();
    });

    renderForm();

    return panel;
  }
}
