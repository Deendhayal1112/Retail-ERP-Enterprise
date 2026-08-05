/**
 * SecurityCenter.js
 * Retail ERP Enterprise — Reusable Main Security & Compliance Page
 */

"use strict";

import SecurityMetrics         from "./SecurityMetrics.js";
import SecurityScanPanel       from "./SecurityScanPanel.js";
import ElectronSecurityPanel   from "./ElectronSecurityPanel.js";
import CompliancePanel         from "./CompliancePanel.js";
import SecurityRecommendations from "./SecurityRecommendations.js";

export default class SecurityCenter {
  constructor(options = {}) {
    this.options = options;
    this.activeTab = "scans"; // Default tab
    this.findings = [];
    this.checklists = {};
    this.electronStatus = {};
    this.element = null;
  }

  async loadInitialData() {
    try {
      this.findings = await window.api.ipc.invoke("security:get-findings");
      this.checklists = await window.api.ipc.invoke("compliance:get-checklists");
      this.electronStatus = await window.api.ipc.invoke("security:get-electron-status");
    } catch (err) {
      console.error("Failed to load security datasets:", err);
    }
  }

  async render() {
    const container = document.createElement("div");
    container.className = "security-center-layout";

    // Load initial manager payloads
    await this.loadInitialData();

    // 1. Title Header
    const header = document.createElement("header");
    header.className = "security-view-header";
    header.innerHTML = `
      <div>
        <h1 class="security-main-title">Security & Compliance</h1>
        <p class="security-main-subtitle">Manage runtime audits, vulnerability scans, and regulatory compliance standards.</p>
      </div>
    `;
    container.appendChild(header);

    // Calculate Dynamic Metrics Score
    const metrics = new SecurityMetrics({
      score: this.calculateSecurityScore(),
      totals: {
        critical: this.findings.filter(f => f.severity === "CRITICAL" && f.status !== "Resolved").length,
        medium: this.findings.filter(f => f.severity === "MEDIUM" && f.status !== "Resolved").length,
        low: this.findings.filter(f => f.severity === "LOW" && f.status !== "Resolved").length
      }
    });
    container.appendChild(metrics.render());

    // 2. Tabs Toolbar
    const tabsToolbar = document.createElement("div");
    tabsToolbar.className = "security-tabs-toolbar";
    tabsToolbar.innerHTML = `
      <button class="security-tab-btn ${this.activeTab === "scans" ? "active" : ""}" data-tab="scans">Scanning Suite</button>
      <button class="security-tab-btn ${this.activeTab === "electron" ? "active" : ""}" data-tab="electron">Electron Auditor</button>
      <button class="security-tab-btn ${this.activeTab === "compliance" ? "active" : ""}" data-tab="compliance">Compliance</button>
      <button class="security-tab-btn ${this.activeTab === "recommendations" ? "active" : ""}" data-tab="recommendations">Recommendations</button>
    `;

    tabsToolbar.querySelectorAll(".security-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.activeTab = btn.getAttribute("data-tab");
        this.updateActiveTabContent();
      });
    });
    container.appendChild(tabsToolbar);

    // 3. Main Workspace Content Area
    const mainGrid = document.createElement("div");
    mainGrid.className = "security-content-main-grid";
    container.appendChild(mainGrid);

    this.element = container;
    this.updateActiveTabContent();

    return container;
  }

  calculateSecurityScore() {
    // Basic score calculator
    let score = 100;
    const activeFindings = this.findings.filter(f => f.status !== "Resolved");
    score -= activeFindings.filter(f => f.severity === "CRITICAL").length * 5;
    score -= activeFindings.filter(f => f.severity === "MEDIUM").length * 3;
    score -= activeFindings.filter(f => f.severity === "LOW").length * 1;
    return Math.max(score, 0);
  }

  async updateActiveTabContent() {
    const mainGrid = this.element.querySelector(".security-content-main-grid");
    if (!mainGrid) return;
    
    mainGrid.innerHTML = "";

    // Toggle highlight classes on buttons
    this.element.querySelectorAll(".security-tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-tab") === this.activeTab);
    });

    if (this.activeTab === "scans") {
      const scanPanel = new SecurityScanPanel({
        onScanComplete: async () => {
          // Re-load and refresh active content
          await this.loadInitialData();
          this.updateActiveTabContent();
        }
      });
      mainGrid.appendChild(scanPanel.render());
    } 
    else if (this.activeTab === "electron") {
      const electronPanel = new ElectronSecurityPanel({ status: this.electronStatus });
      mainGrid.appendChild(electronPanel.render());
    } 
    else if (this.activeTab === "compliance") {
      const compliancePanel = new CompliancePanel({
        checklists: this.checklists,
        onToggleRule: async (standard, ruleId) => {
          const result = await window.api.ipc.invoke("compliance:toggle-rule", { standard, ruleId });
          if (result && result.success) {
            this.checklists = result.checklists;
            this.updateActiveTabContent();
          }
        }
      });
      mainGrid.appendChild(compliancePanel.render());
    } 
    else if (this.activeTab === "recommendations") {
      const recPanel = new SecurityRecommendations({
        findings: this.findings,
        complianceChecklists: this.checklists
      });
      mainGrid.appendChild(recPanel.render());
    }
  }
}
