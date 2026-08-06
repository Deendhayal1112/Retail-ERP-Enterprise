/**
 * PluginCenter.js
 * Retail ERP Enterprise — Enterprise Plugin Center View coordinator
 *
 * Implements tab selection swaps, loads IPC list records, and binds
 * action listeners to manager components.
 */

"use strict";

import InstalledPluginsPanel from "./InstalledPluginsPanel.js";
import PluginRegistryPanel   from "./PluginRegistryPanel.js";
import PluginPermissionsPanel from "./PluginPermissionsPanel.js";
import DeveloperToolsPanel   from "./DeveloperToolsPanel.js";

export default class PluginCenter {
  constructor(options = {}) {
    this.options = options;
    this.activeTab = "installed";
    
    // Internal data stores
    this.installedPlugins = [];
    this.availablePlugins = [];
    this.scopes = [];
    this.diagnostics = {};
    
    this.element = null;
  }

  /**
   * Loads plugins registries database records from IPC.
   */
  async loadData() {
    try {
      this.installedPlugins = await window.api.ipc.invoke("plugins:get-installed");
      this.availablePlugins = await window.api.ipc.invoke("plugins:get-available");
      
      const diag = await window.api.ipc.invoke("plugins:get-diagnostics");
      this.diagnostics = diag || {};
      this.scopes = diag?.permissionsList || [];
    } catch (err) {
      console.error("Failed to query plugins IPC metadata:", err);
    }
  }

  async render() {
    const container = document.createElement("div");
    container.className = "plugins-center-container";

    await this.loadData();

    // 1. Header
    const header = document.createElement("header");
    header.className = "plugins-center-header";
    header.innerHTML = `
      <div class="header-title-block">
        <h1 class="plugins-title">Enterprise Plugin Center</h1>
        <p class="plugins-subtitle">Extend ERP functionality with sandboxed local widgets, customize printers templates, and verify API scopes permissions.</p>
      </div>
      <div class="header-stats-chips">
        <div class="stat-chip">Active: <span class="accent">${this.diagnostics.activeCount || 0}</span></div>
        <div class="stat-chip text-muted">Total: <span>${this.diagnostics.totalInstalledCount || 0}</span></div>
      </div>
    `;
    container.appendChild(header);

    // 2. Tab Toolbar
    const toolbar = document.createElement("div");
    toolbar.className = "plugins-tab-toolbar";
    toolbar.innerHTML = `
      <button class="tab-btn ${this.activeTab === "installed" ? "active" : ""}" data-tab="installed">Installed Plugins</button>
      <button class="tab-btn ${this.activeTab === "store" ? "active" : ""}" data-tab="store">Plugin Store Directory</button>
      <button class="tab-btn ${this.activeTab === "permissions" ? "active" : ""}" data-tab="permissions">API Access Scopes</button>
      <button class="tab-btn ${this.activeTab === "dev" ? "active" : ""}" data-tab="dev">Developer Tools & SDK</button>
    `;

    toolbar.querySelectorAll(".tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.activeTab = btn.getAttribute("data-tab");
        this.updateActiveTabContent();
      });
    });
    container.appendChild(toolbar);

    // 3. Main Workspace Mount Point
    const mainGrid = document.createElement("div");
    mainGrid.className = "plugins-content-grid";
    container.appendChild(mainGrid);

    this.element = container;
    this.updateActiveTabContent();

    return container;
  }

  async updateActiveTabContent() {
    const mainGrid = this.element.querySelector(".plugins-content-grid");
    if (!mainGrid) return;

    mainGrid.innerHTML = "";

    // Sync button statuses
    this.element.querySelectorAll(".tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-tab") === this.activeTab);
    });

    if (this.activeTab === "installed") {
      const panel = new InstalledPluginsPanel({
        plugins: this.installedPlugins,
        onToggle: async (id, checked) => {
          const res = await window.api.ipc.invoke("plugins:toggle", { id, active: checked });
          if (res.success) {
            window.Toast?.show(`Plugin status updated: ${checked ? "Active" : "Inactive"}.`, "success", 3000);
            await this.loadData();
            this.updateActiveTabContent();
          } else {
            window.Toast?.show(res.error || "Failed to toggle status.", "danger", 3000);
          }
        }
      });
      mainGrid.appendChild(panel.render());
      
    } else if (this.activeTab === "store") {
      const panel = new PluginRegistryPanel({
        available: this.availablePlugins,
        onInstall: async (id) => {
          const res = await window.api.ipc.invoke("plugins:install", id);
          if (res.success) {
            window.Toast?.show("Plugin installed successfully! Configure permissions under Scopes.", "success", 3000);
            await this.loadData();
            this.updateActiveTabContent();
          } else {
            window.Toast?.show(res.error || "Failed to install.", "danger", 3000);
          }
        }
      });
      mainGrid.appendChild(panel.render());
      
    } else if (this.activeTab === "permissions") {
      const panel = new PluginPermissionsPanel({
        plugins: this.installedPlugins,
        scopes: this.scopes,
        onSavePerms: async (id, permissions) => {
          const res = await window.api.ipc.invoke("plugins:update-permissions", { id, permissions });
          if (res.success) {
            window.Toast?.show("Capabilities permissions scope updated.", "success", 3000);
            await this.loadData();
            this.updateActiveTabContent();
          } else {
            window.Toast?.show(res.error || "Failed to update permissions.", "danger", 3000);
          }
        }
      });
      mainGrid.appendChild(panel.render());
      
    } else if (this.activeTab === "dev") {
      const panel = new DeveloperToolsPanel();
      mainGrid.appendChild(panel.render());
    }
  }
}
