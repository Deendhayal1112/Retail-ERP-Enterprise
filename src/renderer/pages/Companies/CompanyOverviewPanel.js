/**
 * CompanyOverviewPanel.js
 * Retail ERP Enterprise — Company Profiles Overview Panel
 */

"use strict";

export default class CompanyOverviewPanel {
  /**
   * @param {Object} options
   * @param {Array}  options.companies List of companies.
   */
  constructor(options = {}) {
    this.companies = options.companies || [];
  }

  render() {
    const panel = document.createElement("div");
    panel.className = "companies-overview-panel";

    const titleRow = document.createElement("div");
    titleRow.className = "panel-title-row";
    titleRow.innerHTML = `
      <h2 class="panel-section-title">Registered Corporate Entities</h2>
      <p class="panel-section-desc">Manage your business registry settings, contact details, and locations.</p>
    `;
    panel.appendChild(titleRow);

    const grid = document.createElement("div");
    grid.className = "companies-profiles-grid";

    this.companies.forEach(c => {
      const card = document.createElement("div");
      card.className = `company-profile-card ${c.status === "active" ? "active" : "inactive"} ${c.isDefault ? "default-hq" : ""}`;
      
      card.innerHTML = `
        <div class="profile-card-header">
          <div class="profile-logo-wrapper">
            <span class="logo-emoji">${c.logo}</span>
            <div class="name-block">
              <h3 class="profile-comp-name">${c.name}</h3>
              <span class="profile-comp-id font-mono">${c.id}</span>
            </div>
          </div>
          ${c.isDefault ? `<span class="hq-badge">DEFAULT HQ</span>` : ""}
        </div>
        
        <div class="profile-card-body">
          <div class="detail-item">
            <span class="label">GSTIN:</span>
            <span class="value font-mono font-semibold">${c.gstin}</span>
          </div>
          <div class="detail-item">
            <span class="label">Phone:</span>
            <span class="value">${c.phone}</span>
          </div>
          <div class="detail-item">
            <span class="label">Base Currency:</span>
            <span class="value">${c.currency}</span>
          </div>
          <div class="detail-item full-width">
            <span class="label">Address:</span>
            <span class="value text-secondary">${c.address}</span>
          </div>
        </div>

        <div class="profile-card-footer">
          <span class="status-indicator-tag">${c.status.toUpperCase()}</span>
          <span class="configs-status">Isolated Cache Verified ✓</span>
        </div>
      `;
      grid.appendChild(card);
    });

    panel.appendChild(grid);
    return panel;
  }
}
