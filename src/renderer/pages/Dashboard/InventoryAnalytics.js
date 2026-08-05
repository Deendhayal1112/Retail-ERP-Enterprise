/**
 * InventoryAnalytics.js
 * Retail ERP Enterprise — Inventory Distribution Grid Card
 */

"use strict";

export default class InventoryAnalytics {
  render() {
    const el = document.createElement("div");
    el.className = "dashboard-card inventory-analytics-card col-span-6";
    el.innerHTML = `
      <h3 class="dashboard-card-title">Inventory Analytics</h3>
      <div class="inventory-status-rows" style="display:flex; flex-direction:column; gap:16px; width:100%; box-sizing:border-box;">
        <div class="inventory-status-item">
          <div class="inventory-status-label-row" style="display:flex; justify-content:space-between; font-size:13px; font-weight:600; margin-bottom:6px;">
            <span>In Stock Products</span>
            <span>420 items</span>
          </div>
          <div class="inventory-progress-bar-bg" style="width:100%; height:8px; background-color:#E9EDF5; border-radius:4px; overflow:hidden;">
            <div class="inventory-progress-bar-fill" style="width:85%; height:100%; background-color:#22C55E; border-radius:4px;"></div>
          </div>
        </div>
        <div class="inventory-status-item">
          <div class="inventory-status-label-row" style="display:flex; justify-content:space-between; font-size:13px; font-weight:600; margin-bottom:6px;">
            <span>Low Stock Warnings</span>
            <span>12 items</span>
          </div>
          <div class="inventory-progress-bar-bg" style="width:100%; height:8px; background-color:#E9EDF5; border-radius:4px; overflow:hidden;">
            <div class="inventory-progress-bar-fill" style="width:25%; height:100%; background-color:#F59E0B; border-radius:4px;"></div>
          </div>
        </div>
        <div class="inventory-status-item">
          <div class="inventory-status-label-row" style="display:flex; justify-content:space-between; font-size:13px; font-weight:600; margin-bottom:6px;">
            <span>Out of Stock</span>
            <span>2 items</span>
          </div>
          <div class="inventory-progress-bar-bg" style="width:100%; height:8px; background-color:#E9EDF5; border-radius:4px; overflow:hidden;">
            <div class="inventory-progress-bar-fill" style="width:5%; height:100%; background-color:#EF4444; border-radius:4px;"></div>
          </div>
        </div>
      </div>
    `;
    return el;
  }
}
