/**
 * ReleaseManagementCenter.js
 * Retail ERP Enterprise — Version Control, Signing & Release coordinator
 */

"use strict";

import ReleaseMetrics        from "./ReleaseMetrics.js";
import VersionPanel          from "./VersionPanel.js";
import SigningPanel          from "./SigningPanel.js";
import ReleaseLifecyclePanel from "./ReleaseLifecyclePanel.js";
import RollbackPanel         from "./RollbackPanel.js";
import ReleaseMetadataPanel  from "./ReleaseMetadataPanel.js";

export default class ReleaseManagementCenter {
  constructor(options = {}) {
    this.options = options;
    this.activeTab = "version";
    this.version = {};
    this.history = [];
    this.signatures = [];
    this.archives = [];
    this.changelogs = [];
    this.lifecycleState = "Beta";
    this.element = null;
  }

  async loadInitialData() {
    try {
      this.version = await window.api.ipc.invoke("version:get-info");
      this.history = await window.api.ipc.invoke("version:get-history");
      this.signatures = await window.api.ipc.invoke("signing:get-signatures");
      this.archives = await window.api.ipc.invoke("rollback:get-archives");
      this.changelogs = await window.api.ipc.invoke("release:get-changelogs");
      this.lifecycleState = await window.api.ipc.invoke("release:get-lifecycle-state");
    } catch (err) {
      console.error("Failed to load release management datasets:", err);
    }
  }

  async render() {
    const container = document.createElement("div");
    container.className = "release-management-layout";

    await this.loadInitialData();

    // 1. Header
    const header = document.createElement("header");
    header.className = "release-mgmt-header";
    header.innerHTML = `
      <div>
        <h1 class="release-mgmt-title">Release Management Center</h1>
        <p class="release-mgmt-subtitle">Semantic versioning control, code signing, and recovery rollbacks.</p>
      </div>
    `;
    container.appendChild(header);

    // Render metrics scorecards
    const metrics = new ReleaseMetrics({
      version: this.version.semVer || "0.2.0-beta",
      lifecycleState: this.lifecycleState,
      signedCount: this.signatures.filter(s => s.verified).length
    });
    container.appendChild(metrics.render());

    // 2. Tabs toolbar
    const toolbar = document.createElement("div");
    toolbar.className = "release-mgmt-tabs-toolbar";
    toolbar.innerHTML = `
      <button class="release-mgmt-tab-btn ${this.activeTab === "version" ? "active" : ""}" data-tab="version">Version Control</button>
      <button class="release-mgmt-tab-btn ${this.activeTab === "signing" ? "active" : ""}" data-tab="signing">Code Signing</button>
      <button class="release-mgmt-tab-btn ${this.activeTab === "lifecycle" ? "active" : ""}" data-tab="lifecycle">Promotion Lifecycle</button>
      <button class="release-mgmt-tab-btn ${this.activeTab === "rollback" ? "active" : ""}" data-tab="rollback">Rollback Archives</button>
      <button class="release-mgmt-tab-btn ${this.activeTab === "metadata" ? "active" : ""}" data-tab="metadata">Metadata notes</button>
    `;

    toolbar.querySelectorAll(".release-mgmt-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.activeTab = btn.getAttribute("data-tab");
        this.updateActiveTabContent();
      });
    });
    container.appendChild(toolbar);

    // 3. Content workspace grid
    const mainGrid = document.createElement("div");
    mainGrid.className = "release-mgmt-content-grid";
    container.appendChild(mainGrid);

    this.element = container;
    this.updateActiveTabContent();

    return container;
  }

  async updateActiveTabContent() {
    const mainGrid = this.element.querySelector(".release-mgmt-content-grid");
    if (!mainGrid) return;
    
    mainGrid.innerHTML = "";

    this.element.querySelectorAll(".release-mgmt-tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-tab") === this.activeTab);
    });

    if (this.activeTab === "version") {
      const panel = new VersionPanel({
        current: this.version,
        history: this.history
      });
      mainGrid.appendChild(panel.render());
    } 
    else if (this.activeTab === "signing") {
      const panel = new SigningPanel({
        signatures: this.signatures,
        onSignComplete: (updatedSigs) => {
          this.signatures = updatedSigs;
          this.updateActiveTabContent();
        }
      });
      mainGrid.appendChild(panel.render());
    } 
    else if (this.activeTab === "lifecycle") {
      const panel = new ReleaseLifecyclePanel({
        currentState: this.lifecycleState,
        onPromote: async (newState) => {
          const result = await window.api.ipc.invoke("release:promote-lifecycle-state", newState);
          if (result && result.success) {
            this.lifecycleState = result.state;
            
            // Promote version number as well if moving to Stable
            if (newState === "Stable") {
              const promoted = await window.api.ipc.invoke("version:promote", "0.2.0");
              this.version = promoted.current;
              this.history = promoted.history;
            }
            
            this.updateActiveTabContent();
          }
        }
      });
      mainGrid.appendChild(panel.render());
    } 
    else if (this.activeTab === "rollback") {
      const panel = new RollbackPanel({
        archives: this.archives,
        onRollback: async (version) => {
          const result = await window.api.ipc.invoke("rollback:trigger-rollback", version);
          if (result && result.success) {
            alert(result.message);
            // Refresh info
            await this.loadInitialData();
            this.updateActiveTabContent();
          }
        }
      });
      mainGrid.appendChild(panel.render());
    } 
    else if (this.activeTab === "metadata") {
      const panel = new ReleaseMetadataPanel({
        changelogs: this.changelogs
      });
      mainGrid.appendChild(panel.render());
    }
  }
}
