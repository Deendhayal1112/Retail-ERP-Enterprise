/**
 * WarehouseOverviewPanel.js
 * Retail ERP Enterprise — Warehouses Registry Profiles Panel
 */

"use strict";

export default class WarehouseOverviewPanel {
  /**
   * @param {Object} options
   * @param {Array}  options.warehouses List of warehouses.
   */
  constructor(options = {}) {
    this.warehouses = options.warehouses || [];
  }

  render() {
    const panel = document.createElement("div");
    panel.className = "warehouse-overview-panel";

    const titleRow = document.createElement("div");
    titleRow.className = "panel-title-row";
    titleRow.innerHTML = `
      <h2 class="panel-section-title">Logistics & Storage Hubs</h2>
      <p class="panel-section-desc">Manage physical warehouse registry listings, maximum storage cubic limits, and assigned personnel managers.</p>
    `;
    panel.appendChild(titleRow);

    const grid = document.createElement("div");
    grid.className = "warehouses-profiles-grid";

    this.warehouses.forEach(w => {
      const card = document.createElement("div");
      const pct = Math.round((w.capacityUsed / w.capacityMax) * 100);
      const isCritical = pct > 90;

      card.className = `warehouse-profile-card ${w.status === "active" ? "active" : "inactive"} ${w.isDefault ? "default-hub" : ""}`;
      
      card.innerHTML = `
        <div class="profile-card-header">
          <div class="profile-logo-wrapper">
            <span class="logo-emoji">🏢</span>
            <div class="name-block">
              <h3 class="profile-wh-name">${w.name}</h3>
              <span class="profile-wh-code font-mono">${w.code}</span>
            </div>
          </div>
          ${w.isDefault ? `<span class="default-badge">DEFAULT HUB</span>` : ""}
        </div>
        
        <div class="profile-card-body">
          <div class="detail-item">
            <span class="label">Storage Manager:</span>
            <span class="value font-semibold">${w.manager}</span>
          </div>
          <div class="detail-item">
            <span class="label">Physical Zone:</span>
            <span class="value font-mono font-semibold">${w.id.split("-")[1].toUpperCase()}</span>
          </div>
          <div class="detail-item full-width">
            <span class="label">Capacity Usage:</span>
            <div class="capacity-progress-wrapper">
              <div class="progress-bar-container">
                <div class="progress-bar-fill ${isCritical ? "critical-fill" : ""}" style="width: ${pct}%"></div>
              </div>
              <span class="progress-percentage font-mono font-semibold ${isCritical ? "critical-text" : ""}">${pct}% (${w.capacityUsed.toLocaleString()} / ${w.capacityMax.toLocaleString()} units)</span>
            </div>
          </div>
          <div class="detail-item full-width mt-2">
            <span class="label">Address Location:</span>
            <span class="value text-secondary">${w.location}</span>
          </div>
        </div>

        <div class="profile-card-footer">
          <span class="status-indicator-tag">${w.status.toUpperCase()}</span>
          <span class="configs-status">Zonal Bin Mapping Sync'd ✓</span>
        </div>
      `;
      grid.appendChild(card);
    });

    panel.appendChild(grid);
    return panel;
  }
}
