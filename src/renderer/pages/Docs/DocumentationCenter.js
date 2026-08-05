/**
 * DocumentationCenter.js
 * Retail ERP Enterprise — Guides, User Manuals & Interactive Tour Orchestrator
 */

"use strict";

import DocumentationMetrics from "./DocumentationMetrics.js";
import UserGuidePanel       from "./UserGuidePanel.js";
import AdminGuidePanel      from "./AdminGuidePanel.js";
import DeveloperGuidePanel  from "./DeveloperGuidePanel.js";
import TrainingPanel        from "./TrainingPanel.js";
import HelpCenterPanel      from "./HelpCenterPanel.js";

export default class DocumentationCenter {
  constructor(options = {}) {
    this.options = options;
    this.activeTab = "user";
    this.userGuides = [];
    this.adminGuides = [];
    this.devGuides = [];
    this.courses = [];
    this.element = null;
  }

  async loadInitialData() {
    try {
      this.userGuides = await window.api.ipc.invoke("docs:get-user-guides");
      this.adminGuides = await window.api.ipc.invoke("docs:get-admin-guides");
      this.devGuides = await window.api.ipc.invoke("docs:get-dev-guides");
      this.courses = await window.api.ipc.invoke("training:get-courses");
    } catch (err) {
      console.error("Failed to load documentation datasets:", err);
    }
  }

  async render() {
    const container = document.createElement("div");
    container.className = "docs-center-layout";

    await this.loadInitialData();

    // 1. Header
    const header = document.createElement("header");
    header.className = "docs-center-header";
    header.innerHTML = `
      <div>
        <h1 class="docs-center-title">Documentation Center</h1>
        <p class="docs-center-subtitle">Access user manuals, system diagnostics, configuration playbooks, and training courses.</p>
      </div>
    `;
    container.appendChild(header);

    // Render metrics scorecards
    const metrics = new DocumentationMetrics({
      totalGuides: this.userGuides.length + this.adminGuides.length + this.devGuides.length,
      completedCourses: this.courses.filter(c => c.completed).length,
      searchLatency: "4 ms"
    });
    container.appendChild(metrics.render());

    // 2. Tabs toolbar
    const toolbar = document.createElement("div");
    toolbar.className = "docs-center-tabs-toolbar";
    toolbar.innerHTML = `
      <button class="docs-center-tab-btn ${this.activeTab === "user" ? "active" : ""}" data-tab="user">User Documentation</button>
      <button class="docs-center-tab-btn ${this.activeTab === "admin" ? "active" : ""}" data-tab="admin">Administrator Guides</button>
      <button class="docs-center-tab-btn ${this.activeTab === "dev" ? "active" : ""}" data-tab="dev">Developer Docs</button>
      <button class="docs-center-tab-btn ${this.activeTab === "training" ? "active" : ""}" data-tab="training">User Training</button>
      <button class="docs-center-tab-btn ${this.activeTab === "help" ? "active" : ""}" data-tab="help">Help Center & Desk</button>
    `;

    toolbar.querySelectorAll(".docs-center-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.activeTab = btn.getAttribute("data-tab");
        this.updateActiveTabContent();
      });
    });
    container.appendChild(toolbar);

    // 3. Content workspace grid
    const mainGrid = document.createElement("div");
    mainGrid.className = "docs-center-content-grid";
    container.appendChild(mainGrid);

    this.element = container;
    this.updateActiveTabContent();

    return container;
  }

  async updateActiveTabContent() {
    const mainGrid = this.element.querySelector(".docs-center-content-grid");
    if (!mainGrid) return;
    
    mainGrid.innerHTML = "";

    this.element.querySelectorAll(".docs-center-tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-tab") === this.activeTab);
    });

    if (this.activeTab === "user") {
      const panel = new UserGuidePanel({
        guides: this.userGuides
      });
      mainGrid.appendChild(panel.render());
    } 
    else if (this.activeTab === "admin") {
      const panel = new AdminGuidePanel({
        guides: this.adminGuides
      });
      mainGrid.appendChild(panel.render());
    } 
    else if (this.activeTab === "dev") {
      const panel = new DeveloperGuidePanel({
        guides: this.devGuides
      });
      mainGrid.appendChild(panel.render());
    } 
    else if (this.activeTab === "training") {
      const panel = new TrainingPanel({
        courses: this.courses,
        onEnroll: async (courseId) => {
          const result = await window.api.ipc.invoke("training:enroll", courseId);
          if (result && result.success) {
            // increment progress level for simulation
            await window.api.ipc.invoke("training:update-progress", courseId, 25);
            // reload info
            await this.loadInitialData();
            this.updateActiveTabContent();
          }
        }
      });
      mainGrid.appendChild(panel.render());
    } 
    else if (this.activeTab === "help") {
      const panel = new HelpCenterPanel();
      mainGrid.appendChild(panel.render());
    }
  }
}
