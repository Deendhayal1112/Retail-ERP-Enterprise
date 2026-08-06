/**
 * SmartAnalyticsCenter.js
 * Retail ERP Enterprise — Smart Analytics coordinator
 */

"use strict";

import ExecutiveDashboardPanel  from "./ExecutiveDashboardPanel.js";
import ExecutiveKPIPanel        from "./ExecutiveKPIPanel.js";
import TrendAnalysisPanel       from "./TrendAnalysisPanel.js";
import BusinessIntelligencePanel from "./BusinessIntelligencePanel.js";
import PredictiveInsightsPanel  from "./PredictiveInsightsPanel.js";

export default class SmartAnalyticsCenter {
  constructor(options = {}) {
    this.options = options;
    this.activeTab = "dashboard";
    this.summary = {};
    this.kpis = [];
    this.trends = [];
    this.recommendations = [];
    this.forecasts = {};
    this.element = null;
  }

  async loadInitialData() {
    try {
      this.summary = await window.api.ipc.invoke("analytics:get-summary");
      this.kpis = await window.api.ipc.invoke("analytics:get-kpis");
      this.trends = await window.api.ipc.invoke("analytics:get-trends");
      this.recommendations = await window.api.ipc.invoke("analytics:get-recommendations");
      this.forecasts = await window.api.ipc.invoke("analytics:get-forecasts");
    } catch (err) {
      console.error("Failed to load smart analytics datasets:", err);
    }
  }

  async render() {
    const container = document.createElement("div");
    container.className = "analytics-center-layout";

    await this.loadInitialData();

    // 1. Header
    const header = document.createElement("header");
    header.className = "analytics-center-header";
    header.innerHTML = `
      <div>
        <h1 class="analytics-center-title">Smart Analytics Center</h1>
        <p class="analytics-center-subtitle">Monitor Key Performance Indicators (KPIs), view historical monthly trends, review forecasts, and check business recommendations.</p>
      </div>
    `;
    container.appendChild(header);

    // 2. Tabs toolbar
    const toolbar = document.createElement("div");
    toolbar.className = "analytics-center-tabs-toolbar";
    toolbar.innerHTML = `
      <button class="analytics-center-tab-btn ${this.activeTab === "dashboard" ? "active" : ""}" data-tab="dashboard">Executive Dashboard</button>
      <button class="analytics-center-tab-btn ${this.activeTab === "kpis" ? "active" : ""}" data-tab="kpis">Executive KPIs</button>
      <button class="analytics-center-tab-btn ${this.activeTab === "trends" ? "active" : ""}" data-tab="trends">Trend Analysis</button>
      <button class="analytics-center-tab-btn ${this.activeTab === "bi" ? "active" : ""}" data-tab="bi">Business Intelligence</button>
      <button class="analytics-center-tab-btn ${this.activeTab === "predictive" ? "active" : ""}" data-tab="predictive">Predictive Insights</button>
    `;

    toolbar.querySelectorAll(".analytics-center-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.activeTab = btn.getAttribute("data-tab");
        this.updateActiveTabContent();
      });
    });
    container.appendChild(toolbar);

    // 3. Content workspace grid
    const mainGrid = document.createElement("div");
    mainGrid.className = "analytics-center-content-grid";
    container.appendChild(mainGrid);

    this.element = container;
    this.updateActiveTabContent();

    return container;
  }

  async updateActiveTabContent() {
    const mainGrid = this.element.querySelector(".analytics-center-content-grid");
    if (!mainGrid) return;
    
    mainGrid.innerHTML = "";

    this.element.querySelectorAll(".analytics-center-tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-tab") === this.activeTab);
    });

    if (this.activeTab === "dashboard") {
      const panel = new ExecutiveDashboardPanel({
        summary: this.summary
      });
      mainGrid.appendChild(panel.render());
    } 
    else if (this.activeTab === "kpis") {
      const panel = new ExecutiveKPIPanel({
        kpis: this.kpis
      });
      mainGrid.appendChild(panel.render());
    } 
    else if (this.activeTab === "trends") {
      const panel = new TrendAnalysisPanel({
        trends: this.trends
      });
      mainGrid.appendChild(panel.render());
    } 
    else if (this.activeTab === "bi") {
      const panel = new BusinessIntelligencePanel({
        recommendations: this.recommendations
      });
      mainGrid.appendChild(panel.render());
    } 
    else if (this.activeTab === "predictive") {
      const panel = new PredictiveInsightsPanel({
        forecasts: this.forecasts
      });
      mainGrid.appendChild(panel.render());
    }
  }
}
