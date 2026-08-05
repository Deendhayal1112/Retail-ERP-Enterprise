/**
 * DeploymentCenter.js
 * Retail ERP Enterprise — Production Deployment Center View
 */

"use strict";

import DeploymentMetrics  from "./DeploymentMetrics.js";
import EnvironmentPanel   from "./EnvironmentPanel.js";
import DeploymentStatusPanel from "./DeploymentStatusPanel.js";
import OperationsPanel    from "./OperationsPanel.js";
import RecoveryPanel      from "./RecoveryPanel.js";
import GoLiveChecklistPanel from "./GoLiveChecklistPanel.js";

export default class DeploymentCenter {
  constructor(options = {}) {
    this.options = options;
    this.activeTab = "env";
    this.variables = [];
    this.history = [];
    this.healthStats = {};
    this.plan = [];
    this.checklist = [];
    this.maintenanceMode = false;
    this.element = null;
  }

  async loadInitialData() {
    try {
      this.variables = await window.api.ipc.invoke("deploy:get-variables");
      this.history = await window.api.ipc.invoke("deploy:get-history");
      this.healthStats = await window.api.ipc.invoke("deploy:get-health");
      this.plan = await window.api.ipc.invoke("deploy:get-recovery-plan");
      this.checklist = await window.api.ipc.invoke("deploy:get-golive-checklist");
    } catch (err) {
      console.error("Failed to load deployment datasets:", err);
    }
  }

  async render() {
    const container = document.createElement("div");
    container.className = "deploy-center-layout";

    await this.loadInitialData();

    // 1. Header
    const header = document.createElement("header");
    header.className = "deploy-center-header";
    header.innerHTML = `
      <div>
        <h1 class="deploy-center-title">Deployment Center</h1>
        <p class="deploy-center-subtitle">Manage runtime variables profiles, hot-patch deployments, system availability, and recovery plans.</p>
      </div>
    `;
    container.appendChild(header);

    // Render metrics scorecards
    const metrics = new DeploymentMetrics({
      env: "Staging",
      availability: this.healthStats.availabilityPercent || 99.98,
      dbStatus: this.healthStats.dbStatus || "Healthy",
      validations: this.checklist.filter(c => c.verified).length
    });
    container.appendChild(metrics.render());

    // 2. Tabs toolbar
    const toolbar = document.createElement("div");
    toolbar.className = "deploy-center-tabs-toolbar";
    toolbar.innerHTML = `
      <button class="deploy-center-tab-btn ${this.activeTab === "env" ? "active" : ""}" data-tab="env">Environment Configs</button>
      <button class="deploy-center-tab-btn ${this.activeTab === "status" ? "active" : ""}" data-tab="status">Deployment History</button>
      <button class="deploy-center-tab-btn ${this.activeTab === "ops" ? "active" : ""}" data-tab="ops">Operations Health</button>
      <button class="deploy-center-tab-btn ${this.activeTab === "recovery" ? "active" : ""}" data-tab="recovery">Disaster Recovery</button>
      <button class="deploy-center-tab-btn ${this.activeTab === "golive" ? "active" : ""}" data-tab="golive">Go-Live Checklist</button>
    `;

    toolbar.querySelectorAll(".deploy-center-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.activeTab = btn.getAttribute("data-tab");
        this.updateActiveTabContent();
      });
    });
    container.appendChild(toolbar);

    // 3. Content workspace grid
    const mainGrid = document.createElement("div");
    mainGrid.className = "deploy-center-content-grid";
    container.appendChild(mainGrid);

    this.element = container;
    this.updateActiveTabContent();

    return container;
  }

  async updateActiveTabContent() {
    const mainGrid = this.element.querySelector(".deploy-center-content-grid");
    if (!mainGrid) return;
    
    mainGrid.innerHTML = "";

    this.element.querySelectorAll(".deploy-center-tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-tab") === this.activeTab);
    });

    if (this.activeTab === "env") {
      const panel = new EnvironmentPanel({
        variables: this.variables,
        onSave: async (key, val) => {
          const result = await window.api.ipc.invoke("deploy:update-variable", key, val);
          if (result && result.success) {
            this.variables = result.variables;
            this.updateActiveTabContent();
          }
        }
      });
      mainGrid.appendChild(panel.render());
    } 
    else if (this.activeTab === "status") {
      const panel = new DeploymentStatusPanel({
        history: this.history,
        onDeployComplete: (updatedHistory) => {
          this.history = updatedHistory;
          this.updateActiveTabContent();
        }
      });
      mainGrid.appendChild(panel.render());
    } 
    else if (this.activeTab === "ops") {
      const panel = new OperationsPanel({
        stats: this.healthStats,
        maintenanceActive: this.maintenanceMode,
        onToggleMaintenance: async () => {
          const result = await window.api.ipc.invoke("deploy:toggle-maintenance");
          if (result && result.success) {
            this.maintenanceMode = result.maintenanceActive;
            await this.loadInitialData();
            this.updateActiveTabContent();
          }
        }
      });
      mainGrid.appendChild(panel.render());
    } 
    else if (this.activeTab === "recovery") {
      const panel = new RecoveryPanel({
        plan: this.plan,
        onToggleStep: async (stepId) => {
          const result = await window.api.ipc.invoke("deploy:run-recovery-step", stepId);
          if (result && result.success) {
            this.plan = result.plan;
            this.updateActiveTabContent();
          }
        }
      });
      mainGrid.appendChild(panel.render());
    } 
    else if (this.activeTab === "golive") {
      const panel = new GoLiveChecklistPanel({
        checklist: this.checklist,
        onToggle: async (id) => {
          const result = await window.api.ipc.invoke("deploy:toggle-golive-step", id);
          if (result && result.success) {
            this.checklist = result.checklist;
            this.updateActiveTabContent();
          }
        }
      });
      mainGrid.appendChild(panel.render());
    }
  }
}
