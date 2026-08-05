/**
 * EnterpriseUATCenter.js
 * Retail ERP Enterprise — QA, User Acceptance Testing & Defects coordinator
 */

"use strict";

import QAMetrics             from "./QAMetrics.js";
import QAStatusPanel         from "./QAStatusPanel.js";
import UATPanel              from "./UATPanel.js";
import BusinessValidationPanel from "./BusinessValidationPanel.js";
import DefectManagementPanel from "./DefectManagementPanel.js";
import ReleaseReadinessPanel from "./ReleaseReadinessPanel.js";

export default class EnterpriseUATCenter {
  constructor(options = {}) {
    this.options = options;
    this.activeTab = "status";
    this.validations = [];
    this.checklist = [];
    this.businessValidations = [];
    this.bugs = [];
    this.readiness = {};
    this.element = null;
  }

  async loadInitialData() {
    try {
      this.validations = await window.api.ipc.invoke("qa:get-validations");
      this.checklist = await window.api.ipc.invoke("qa:get-uat-checklist");
      this.businessValidations = await window.api.ipc.invoke("qa:get-business-validations");
      this.bugs = await window.api.ipc.invoke("qa:get-bugs");
      this.readiness = await window.api.ipc.invoke("qa:get-readiness");
    } catch (err) {
      console.error("Failed to load QA center datasets:", err);
    }
  }

  async render() {
    const container = document.createElement("div");
    container.className = "qa-center-layout";

    await this.loadInitialData();

    // 1. Header
    const header = document.createElement("header");
    header.className = "qa-center-header";
    header.innerHTML = `
      <div>
        <h1 class="qa-center-title">Enterprise QA & UAT Center</h1>
        <p class="qa-center-subtitle">Monitor automated test suites passing rates, log UAT feature reviews, track bugs, and manage stakeholder Go-Live sign-offs.</p>
      </div>
    `;
    container.appendChild(header);

    // Compute pass rate
    const totalAssertions = this.validations.reduce((acc, curr) => acc + curr.total, 0);
    const passedAssertions = this.validations.reduce((acc, curr) => acc + curr.passed, 0);
    const passRate = totalAssertions > 0 ? ((passedAssertions / totalAssertions) * 100).toFixed(1) : 100;

    // Render metrics scorecards
    const metrics = new QAMetrics({
      passRate,
      openBugs: this.bugs.filter(b => b.status === "Open").length,
      readinessScore: this.calculateReadinessScore()
    });
    container.appendChild(metrics.render());

    // 2. Tabs toolbar
    const toolbar = document.createElement("div");
    toolbar.className = "qa-center-tabs-toolbar";
    toolbar.innerHTML = `
      <button class="qa-center-tab-btn ${this.activeTab === "status" ? "active" : ""}" data-tab="status">QA Validation</button>
      <button class="qa-center-tab-btn ${this.activeTab === "uat" ? "active" : ""}" data-tab="uat">UAT checklists</button>
      <button class="qa-center-tab-btn ${this.activeTab === "business" ? "active" : ""}" data-tab="business">Business Validations</button>
      <button class="qa-center-tab-btn ${this.activeTab === "defect" ? "active" : ""}" data-tab="defect">Defect Management</button>
      <button class="qa-center-tab-btn ${this.activeTab === "readiness" ? "active" : ""}" data-tab="readiness">Release Readiness</button>
    `;

    toolbar.querySelectorAll(".qa-center-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.activeTab = btn.getAttribute("data-tab");
        this.updateActiveTabContent();
      });
    });
    container.appendChild(toolbar);

    // 3. Content workspace grid
    const mainGrid = document.createElement("div");
    mainGrid.className = "qa-center-content-grid";
    container.appendChild(mainGrid);

    this.element = container;
    this.updateActiveTabContent();

    return container;
  }

  calculateReadinessScore() {
    let score = 0;
    if (this.readiness.qaLeadApproved) score += 25;
    if (this.readiness.uatManagerApproved) score += 25;
    if (this.readiness.businessSponsorApproved) score += 25;
    if (this.readiness.technicalLeadApproved) score += 25;
    return score;
  }

  async updateActiveTabContent() {
    const mainGrid = this.element.querySelector(".qa-center-content-grid");
    if (!mainGrid) return;
    
    mainGrid.innerHTML = "";

    this.element.querySelectorAll(".qa-center-tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-tab") === this.activeTab);
    });

    if (this.activeTab === "status") {
      const panel = new QAStatusPanel({
        validations: this.validations,
        onTestComplete: (updatedValids) => {
          this.validations = updatedValids;
          this.updateActiveTabContent();
        }
      });
      mainGrid.appendChild(panel.render());
    } 
    else if (this.activeTab === "uat") {
      const panel = new UATPanel({
        checklist: this.checklist,
        onToggle: async (id) => {
          const result = await window.api.ipc.invoke("qa:toggle-uat-feature", id);
          if (result && result.success) {
            this.checklist = result.checklist;
            this.updateActiveTabContent();
          }
        }
      });
      mainGrid.appendChild(panel.render());
    } 
    else if (this.activeTab === "business") {
      const panel = new BusinessValidationPanel({
        validations: this.businessValidations,
        onToggle: async (id) => {
          const result = await window.api.ipc.invoke("qa:toggle-business-validation", id);
          if (result && result.success) {
            this.businessValidations = result.validations;
            this.updateActiveTabContent();
          }
        }
      });
      mainGrid.appendChild(panel.render());
    } 
    else if (this.activeTab === "defect") {
      const panel = new DefectManagementPanel({
        bugs: this.bugs,
        onResolve: async (bugId) => {
          const result = await window.api.ipc.invoke("qa:resolve-bug", bugId);
          if (result && result.success) {
            this.bugs = result.bugs;
            this.updateActiveTabContent();
          }
        }
      });
      mainGrid.appendChild(panel.render());
    } 
    else if (this.activeTab === "readiness") {
      const panel = new ReleaseReadinessPanel({
        readiness: this.readiness,
        onToggle: async (role) => {
          const result = await window.api.ipc.invoke("qa:toggle-readiness", role);
          if (result && result.success) {
            this.readiness = result.readiness;
            this.updateActiveTabContent();
          }
        }
      });
      mainGrid.appendChild(panel.render());
    }
  }
}
