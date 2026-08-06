/**
 * WarehouseManagementCenter.js
 * Retail ERP Enterprise — Multi-Warehouse Management Center coordinator
 *
 * Implements tab selection swaps, loads IPC registries, and submits transfers requests.
 */

"use strict";

import WarehouseOverviewPanel   from "./WarehouseOverviewPanel.js";
import StockTransferPanel       from "./StockTransferPanel.js";
import WarehouseInventoryPanel  from "./WarehouseInventoryPanel.js";
import WarehouseAnalyticsPanel  from "./WarehouseAnalyticsPanel.js";

export default class WarehouseManagementCenter {
  constructor(options = {}) {
    this.options = options;
    this.activeTab = "overview";

    this.warehouses = [];
    this.transfers = [];
    this.inventory = [];
    this.diagnostics = {};
    
    this.element = null;
  }

  /**
   * Loads registries records from IPC.
   */
  async loadData() {
    try {
      this.warehouses = await window.api.ipc.invoke("warehouses:get-all");
      this.transfers = await window.api.ipc.invoke("warehouses:get-transfers");
      this.inventory = await window.api.ipc.invoke("warehouses:get-inventory");
      
      const diag = await window.api.ipc.invoke("warehouses:get-diagnostics");
      this.diagnostics = diag || {};
    } catch (err) {
      console.error("Failed to load warehouse IPC parameters:", err);
    }
  }

  async render() {
    const container = document.createElement("div");
    container.className = "warehouses-center-container";

    await this.loadData();

    // 1. Header
    const header = document.createElement("header");
    header.className = "warehouses-center-header";
    header.innerHTML = `
      <div class="header-title-block">
        <h1 class="warehouses-title">Warehouse & Inventory Distribution Center</h1>
        <p class="warehouses-subtitle">Manage physical locations registry details, track transfer requests movements, review zone picking bins, and inspect capacity limits.</p>
      </div>
      <div class="header-stats-chips">
        <div class="stat-chip">Locations: <span class="accent">${this.diagnostics.totalWarehouseCount || 0}</span></div>
        <div class="stat-chip text-muted">Pending Transfers: <span>${this.diagnostics.pendingTransferCount || 0}</span></div>
      </div>
    `;
    container.appendChild(header);

    // 2. Tab Toolbar
    const toolbar = document.createElement("div");
    toolbar.className = "warehouses-tab-toolbar";
    toolbar.innerHTML = `
      <button class="tab-btn ${this.activeTab === "overview" ? "active" : ""}" data-tab="overview">Warehouse Profiles</button>
      <button class="tab-btn ${this.activeTab === "transfers" ? "active" : ""}" data-tab="transfers">Stock Transfers</button>
      <button class="tab-btn ${this.activeTab === "inventory" ? "active" : ""}" data-tab="inventory">Zonal Inventory Maps</button>
      <button class="tab-btn ${this.activeTab === "analytics" ? "active" : ""}" data-tab="analytics">Storage Analytics</button>
    `;

    toolbar.querySelectorAll(".tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.activeTab = btn.getAttribute("data-tab");
        this.updateActiveTabContent();
      });
    });
    container.appendChild(toolbar);

    // 3. Main Content Grid
    const mainGrid = document.createElement("div");
    mainGrid.className = "warehouses-content-grid";
    container.appendChild(mainGrid);

    this.element = container;
    this.updateActiveTabContent();

    return container;
  }

  async updateActiveTabContent() {
    const mainGrid = this.element.querySelector(".warehouses-content-grid");
    if (!mainGrid) return;

    mainGrid.innerHTML = "";

    // Sync button classes active state
    this.element.querySelectorAll(".tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-tab") === this.activeTab);
    });

    if (this.activeTab === "overview") {
      const panel = new WarehouseOverviewPanel({
        warehouses: this.warehouses
      });
      mainGrid.appendChild(panel.render());
      
    } else if (this.activeTab === "transfers") {
      const panel = new StockTransferPanel({
        transfers: this.transfers,
        warehouses: this.warehouses,
        onSubmitTransfer: async (data) => {
          const res = await window.api.ipc.invoke("warehouses:submit-transfer", data);
          if (res.success) {
            window.Toast?.show("Stock transfer request submitted for approvals.", "success", 3000);
            await this.loadData();
            this.updateActiveTabContent();
          } else {
            window.Toast?.show(res.error || "Failed to submit request.", "danger", 3000);
          }
        },
        onApprove: async (id) => {
          const res = await window.api.ipc.invoke("warehouses:approve-transfer", { id, approver: "Manager Node" });
          if (res) {
            window.Toast?.show("Transfer request approved. Stock state set to In-Transit.", "success", 3000);
            await this.loadData();
            this.updateActiveTabContent();
          }
        },
        onReceive: async (id) => {
          const res = await window.api.ipc.invoke("warehouses:receive-transfer", id);
          if (res) {
            window.Toast?.show("Transfer received cleanly. Stock context allocated.", "success", 3000);
            await this.loadData();
            this.updateActiveTabContent();
          }
        }
      });
      mainGrid.appendChild(panel.render());
      
    } else if (this.activeTab === "inventory") {
      const panel = new WarehouseInventoryPanel({
        inventory: this.inventory,
        warehouses: this.warehouses
      });
      mainGrid.appendChild(panel.render());
      
    } else if (this.activeTab === "analytics") {
      const panel = new WarehouseAnalyticsPanel({
        metrics: this.diagnostics.utilisationMetrics || []
      });
      mainGrid.appendChild(panel.render());
    }
  }
}
