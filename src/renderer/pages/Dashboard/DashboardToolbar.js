/**
 * DashboardToolbar.js
 * Retail ERP Enterprise — Reusable Action Toolbar Component
 */

"use strict";

export default class DashboardToolbar {
  render() {
    const el = document.createElement("div");
    el.className = "dashboard-action-toolbar";
    el.innerHTML = `
      <div class="toolbar-filters-group">
        <select class="toolbar-select-filter" aria-label="Select Date Range">
          <option>Today</option>
          <option selected>Last 7 Days</option>
          <option>This Month</option>
          <option>Custom Range</option>
        </select>
        <select class="toolbar-select-filter" aria-label="Select Warehouse Location">
          <option>All Warehouses</option>
          <option>Main Store</option>
          <option>Annex Warehouse</option>
        </select>
      </div>
      <div class="toolbar-buttons-group">
        <button class="toolbar-action-btn">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          Export
        </button>
      </div>
    `;
    return el;
  }
}
