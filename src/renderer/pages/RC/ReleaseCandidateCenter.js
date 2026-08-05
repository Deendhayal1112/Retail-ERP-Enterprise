/**
 * ReleaseCandidateCenter.js
 * Retail ERP Enterprise — Release Candidate, approvals and risk assessor coordinator
 */

"use strict";

import RCMetrics           from "./RCMetrics.js";
import CandidatePanel      from "./CandidatePanel.js";
import ValidationPanel     from "./ValidationPanel.js";
import ChecklistPanel      from "./ChecklistPanel.js";
import ApprovalPanel       from "./ApprovalPanel.js";
import RiskAssessmentPanel from "./RiskAssessmentPanel.js";

export default class ReleaseCandidateCenter {
  constructor(options = {}) {
    this.options = options;
    this.activeTab = "candidate";
    this.candidate = {};
    this.validations = [];
    this.checklist = [];
    this.approvals = [];
    this.risks = [];
    this.element = null;
  }

  async loadInitialData() {
    try {
      this.candidate = await window.api.ipc.invoke("rc:get-info");
      this.validations = await window.api.ipc.invoke("rc:get-validations");
      this.checklist = await window.api.ipc.invoke("rc:get-checklist");
      this.approvals = await window.api.ipc.invoke("rc:get-approvals");
      this.risks = await window.api.ipc.invoke("rc:get-risks");
    } catch (err) {
      console.error("Failed to load release candidate review datasets:", err);
    }
  }

  async render() {
    const container = document.createElement("div");
    container.className = "rc-center-layout";

    await this.loadInitialData();

    // 1. Header
    const header = document.createElement("header");
    header.className = "rc-center-header";
    header.innerHTML = `
      <div>
        <h1 class="rc-center-title">Release Candidate Center</h1>
        <p class="rc-center-subtitle">Validate compliance checks, sign off approvals, and assess release risks.</p>
      </div>
    `;
    container.appendChild(header);

    // Render metrics scorecards
    const metrics = new RCMetrics({
      version: this.candidate.version || "0.2.0-rc1",
      validations: this.validations.filter(v => v.verified).length,
      risks: this.risks.filter(r => !r.mitigated).length,
      approvals: this.approvals.filter(a => a.signed).length
    });
    container.appendChild(metrics.render());

    // 2. Tabs toolbar
    const toolbar = document.createElement("div");
    toolbar.className = "rc-center-tabs-toolbar";
    toolbar.innerHTML = `
      <button class="rc-center-tab-btn ${this.activeTab === "candidate" ? "active" : ""}" data-tab="candidate">Candidate Details</button>
      <button class="rc-center-tab-btn ${this.activeTab === "validation" ? "active" : ""}" data-tab="validation">Validation Gates</button>
      <button class="rc-center-tab-btn ${this.activeTab === "checklist" ? "active" : ""}" data-tab="checklist">Release Checklist</button>
      <button class="rc-center-tab-btn ${this.activeTab === "approval" ? "active" : ""}" data-tab="approval">Go-Live Approvals</button>
      <button class="rc-center-tab-btn ${this.activeTab === "risk" ? "active" : ""}" data-tab="risk">Risk Assessments</button>
    `;

    toolbar.querySelectorAll(".rc-center-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.activeTab = btn.getAttribute("data-tab");
        this.updateActiveTabContent();
      });
    });
    container.appendChild(toolbar);

    // 3. Content workspace grid
    const mainGrid = document.createElement("div");
    mainGrid.className = "rc-center-content-grid";
    container.appendChild(mainGrid);

    this.element = container;
    this.updateActiveTabContent();

    return container;
  }

  async updateActiveTabContent() {
    const mainGrid = this.element.querySelector(".rc-center-content-grid");
    if (!mainGrid) return;
    
    mainGrid.innerHTML = "";

    this.element.querySelectorAll(".rc-center-tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-tab") === this.activeTab);
    });

    if (this.activeTab === "candidate") {
      const panel = new CandidatePanel({
        candidate: this.candidate,
        onSaveNotes: async (notes) => {
          const result = await window.api.ipc.invoke("rc:update-notes", notes);
          if (result && result.success) {
            this.candidate = result.candidate;
            this.updateActiveTabContent();
          }
        }
      });
      mainGrid.appendChild(panel.render());
    } 
    else if (this.activeTab === "validation") {
      const panel = new ValidationPanel({
        validations: this.validations,
        onToggle: async (id) => {
          const result = await window.api.ipc.invoke("rc:toggle-validation", id);
          if (result && result.success) {
            this.validations = result.validations;
            this.updateActiveTabContent();
          }
        }
      });
      mainGrid.appendChild(panel.render());
    } 
    else if (this.activeTab === "checklist") {
      const panel = new ChecklistPanel({
        checklist: this.checklist,
        onToggle: async (id) => {
          const result = await window.api.ipc.invoke("rc:toggle-checklist", id);
          if (result && result.success) {
            this.checklist = result.checklist;
            this.updateActiveTabContent();
          }
        }
      });
      mainGrid.appendChild(panel.render());
    } 
    else if (this.activeTab === "approval") {
      const panel = new ApprovalPanel({
        approvals: this.approvals,
        onToggleSign: async (id) => {
          const result = await window.api.ipc.invoke("rc:toggle-approval", id);
          if (result && result.success) {
            this.approvals = result.approvals;
            this.updateActiveTabContent();
          }
        }
      });
      mainGrid.appendChild(panel.render());
    } 
    else if (this.activeTab === "risk") {
      const panel = new RiskAssessmentPanel({
        risks: this.risks,
        onToggleMitigate: async (id) => {
          const result = await window.api.ipc.invoke("rc:toggle-risk-mitigation", id);
          if (result && result.success) {
            this.risks = result.risks;
            this.updateActiveTabContent();
          }
        }
      });
      mainGrid.appendChild(panel.render());
    }
  }
}
