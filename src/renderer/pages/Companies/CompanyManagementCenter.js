/**
 * CompanyManagementCenter.js
 * Retail ERP Enterprise — Multi-Company Center coordinator
 *
 * Links switching requests, registry tables loading, and context settings save triggers.
 */

"use strict";

import CompanyOverviewPanel    from "./CompanyOverviewPanel.js";
import CompanySwitcherPanel    from "./CompanySwitcherPanel.js";
import CompanySettingsPanel    from "./CompanySettingsPanel.js";
import CompanyPermissionsPanel from "./CompanyPermissionsPanel.js";

export default class CompanyManagementCenter {
  constructor(options = {}) {
    this.options = options;
    this.activeTab = "overview";

    this.companies = [];
    this.activeCompanyId = "";
    this.element = null;
  }

  /**
   * Loads registries records from IPC.
   */
  async loadData() {
    try {
      this.companies = await window.api.ipc.invoke("companies:get-all");
      const active = await window.api.ipc.invoke("companies:get-active");
      this.activeCompanyId = active?.id || "";
    } catch (err) {
      console.error("Failed to load company IPC metrics:", err);
    }
  }

  async render() {
    const container = document.createElement("div");
    container.className = "companies-center-container";

    await this.loadData();

    // 1. Header
    const header = document.createElement("header");
    header.className = "companies-center-header";
    header.innerHTML = `
      <div class="header-title-block">
        <h1 class="companies-title">Company Management Center</h1>
        <p class="companies-subtitle">Manage multi-company locations, register GST IDs, isolate database partitions, and monitor roles access permissions.</p>
      </div>
      <div class="header-active-badge">
        Active Workspace: <span class="badge-value font-semibold font-mono">${this.companies.find(x => x.id === this.activeCompanyId)?.name || "Unknown"}</span>
      </div>
    `;
    container.appendChild(header);

    // 2. Tab Toolbar
    const toolbar = document.createElement("div");
    toolbar.className = "companies-tab-toolbar";
    toolbar.innerHTML = `
      <button class="tab-btn ${this.activeTab === "overview" ? "active" : ""}" data-tab="overview">Registered Profiles</button>
      <button class="tab-btn ${this.activeTab === "switcher" ? "active" : ""}" data-tab="switcher">Workspace Switcher</button>
      <button class="tab-btn ${this.activeTab === "settings" ? "active" : ""}" data-tab="settings">Isolated Settings</button>
      <button class="tab-btn ${this.activeTab === "matrix" ? "active" : ""}" data-tab="matrix">Access Permissions Matrix</button>
    `;

    toolbar.querySelectorAll(".tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.activeTab = btn.getAttribute("data-tab");
        this.updateActiveTabContent();
      });
    });
    container.appendChild(toolbar);

    // 3. Main content mount point
    const mainGrid = document.createElement("div");
    mainGrid.className = "companies-content-grid";
    container.appendChild(mainGrid);

    this.element = container;
    this.updateActiveTabContent();

    return container;
  }

  async updateActiveTabContent() {
    const mainGrid = this.element.querySelector(".companies-content-grid");
    if (!mainGrid) return;

    mainGrid.innerHTML = "";

    // Sync button states
    this.element.querySelectorAll(".tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-tab") === this.activeTab);
    });

    if (this.activeTab === "overview") {
      const panel = new CompanyOverviewPanel({
        companies: this.companies
      });
      mainGrid.appendChild(panel.render());
      
    } else if (this.activeTab === "switcher") {
      const panel = new CompanySwitcherPanel({
        companies: this.companies,
        activeCompanyId: this.activeCompanyId,
        onSwitchCompany: async (id) => {
          const res = await window.api.ipc.invoke("companies:switch", id);
          if (res.success) {
            window.Toast?.show(`Workspace context switched: ${res.activeCompany.name}.`, "success", 3000);
            
            // Switch current breadcrumb if needed
            const storeLabel = document.querySelector(".sidebar-footer-store-info .store-name");
            if (storeLabel) storeLabel.textContent = res.activeCompany.name;
            
            await this.loadData();
            
            // Re-render header active badge
            const badgeValue = this.element.querySelector(".header-active-badge .badge-value");
            if (badgeValue) badgeValue.textContent = res.activeCompany.name;
            
            this.updateActiveTabContent();
          } else {
            window.Toast?.show(res.error || "Failed to switch company.", "danger", 3000);
          }
        }
      });
      mainGrid.appendChild(panel.render());
      
    } else if (this.activeTab === "settings") {
      const panel = new CompanySettingsPanel({
        companies: this.companies,
        activeCompanyId: this.activeCompanyId,
        onSaveSettings: async (id, data) => {
          const res = await window.api.ipc.invoke("companies:update", { id, data });
          if (res) {
            window.Toast?.show("Company settings updated and saved.", "success", 3000);
            await this.loadData();
            this.updateActiveTabContent();
          }
        }
      });
      mainGrid.appendChild(panel.render());
      
    } else if (this.activeTab === "matrix") {
      const panel = new CompanyPermissionsPanel({
        companies: this.companies,
        activeCompanyId: this.activeCompanyId,
        onGetMatrix: async (id) => {
          return await window.api.ipc.invoke("companies:get-matrix", id);
        },
        onSaveRolePerms: async (companyId, role, list) => {
          const res = await window.api.ipc.invoke("companies:update-role-perms", { companyId, role, permissions: list });
          if (res) {
            window.Toast?.show(`Access matrix updated for role: ${role.toUpperCase()}`, "success", 2000);
          }
        }
      });
      const node = await panel.render();
      mainGrid.appendChild(node);
    }
  }
}
