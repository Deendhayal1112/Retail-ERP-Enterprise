/**
 * DistributionCenter.js
 * Retail ERP Enterprise — Reusable Release Engineering coordinator Main View
 */

"use strict";

import ReleaseMetrics           from "./ReleaseMetrics.js";
import PackagingPanel          from "./PackagingPanel.js";
import InstallerValidationPanel from "./InstallerValidationPanel.js";
import DistributionPanel        from "./DistributionPanel.js";
import ReleaseAssetsPanel       from "./ReleaseAssetsPanel.js";

export default class DistributionCenter {
  constructor(options = {}) {
    this.options = options;
    this.activeTab = "package";
    this.artifacts = [];
    this.channels = [];
    this.validations = [];
    this.manifest = { changelog: [] };
    this.element = null;
  }

  async loadInitialData() {
    try {
      this.artifacts = await window.api.ipc.invoke("release:get-artifacts");
      this.channels = await window.api.ipc.invoke("release:get-channels");
      this.validations = await window.api.ipc.invoke("release:get-validations");
      this.manifest = await window.api.ipc.invoke("release:get-manifest");
    } catch (err) {
      console.error("Failed to load release engineering datasets:", err);
    }
  }

  async render() {
    const container = document.createElement("div");
    container.className = "distribution-center-layout";

    await this.loadInitialData();

    // 1. Header
    const header = document.createElement("header");
    header.className = "release-view-header";
    header.innerHTML = `
      <div>
        <h1 class="release-main-title">Release & Distribution Center</h1>
        <p class="release-main-subtitle">Build installers packaging, check runtime validations, and deploy updates.</p>
      </div>
    `;
    container.appendChild(header);

    // Calculate build statistics metrics
    const metrics = new ReleaseMetrics({
      version: this.manifest.version || "0.2.0-beta",
      successRate: "100%",
      channelsCount: this.channels.filter(c => c.active).length
    });
    container.appendChild(metrics.render());

    // 2. Tabs toolbar
    const toolbar = document.createElement("div");
    toolbar.className = "release-tabs-toolbar";
    toolbar.innerHTML = `
      <button class="release-tab-btn ${this.activeTab === "package" ? "active" : ""}" data-tab="package">Packaging</button>
      <button class="release-tab-btn ${this.activeTab === "validation" ? "active" : ""}" data-tab="validation">Installer Validation</button>
      <button class="release-tab-btn ${this.activeTab === "distribution" ? "active" : ""}" data-tab="distribution">Distribution</button>
      <button class="release-tab-btn ${this.activeTab === "assets" ? "active" : ""}" data-tab="assets">Release Assets</button>
    `;

    toolbar.querySelectorAll(".release-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.activeTab = btn.getAttribute("data-tab");
        this.updateActiveTabContent();
      });
    });
    container.appendChild(toolbar);

    // 3. Content workspace grid
    const mainGrid = document.createElement("div");
    mainGrid.className = "release-content-grid";
    container.appendChild(mainGrid);

    this.element = container;
    this.updateActiveTabContent();

    return container;
  }

  async updateActiveTabContent() {
    const mainGrid = this.element.querySelector(".release-content-grid");
    if (!mainGrid) return;
    
    mainGrid.innerHTML = "";

    this.element.querySelectorAll(".release-tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-tab") === this.activeTab);
    });

    if (this.activeTab === "package") {
      const panel = new PackagingPanel({
        onPackageComplete: async () => {
          await this.loadInitialData();
          this.updateActiveTabContent();
        }
      });
      mainGrid.appendChild(panel.render());
    } 
    else if (this.activeTab === "validation") {
      const panel = new InstallerValidationPanel({
        validations: this.validations,
        onToggleValidation: async (id) => {
          const updated = await window.api.ipc.invoke("release:toggle-validation", id);
          this.validations = updated;
          this.updateActiveTabContent();
        }
      });
      mainGrid.appendChild(panel.render());
    } 
    else if (this.activeTab === "distribution") {
      const panel = new DistributionPanel({
        channels: this.channels,
        onToggleChannel: async (channel) => {
          const updated = await window.api.ipc.invoke("release:toggle-channel", channel);
          this.channels = updated;
          this.updateActiveTabContent();
        }
      });
      mainGrid.appendChild(panel.render());
    } 
    else if (this.activeTab === "assets") {
      const panel = new ReleaseAssetsPanel({
        artifacts: this.artifacts,
        manifest: this.manifest,
        validations: this.validations
      });
      mainGrid.appendChild(panel.render());
    }
  }
}
