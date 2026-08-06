/**
 * EnterpriseForecastCenter.js
 * Retail ERP Enterprise — Enterprise Forecast Center tab manager
 */

"use strict";

import SalesForecastPanel from "./SalesForecastPanel.js";
import InventoryForecastPanel from "./InventoryForecastPanel.js";
import ProcurementForecastPanel from "./ProcurementForecastPanel.js";
import FinancialForecastPanel from "./FinancialForecastPanel.js";
import ScenarioSimulationPanel from "./ScenarioSimulationPanel.js";

export default class EnterpriseForecastCenter {
  constructor(options = {}) {
    this.options = options;
    this.activeTab = "sales";
    
    this.salesData = {};
    this.inventoryData = {};
    this.procurementData = {};
    this.financialsData = {};
    this.scenarioData = {};

    this.element = null;
  }

  async loadForecastData() {
    try {
      this.salesData = await window.api.ipc.invoke("forecasting:get-sales");
      this.inventoryData = await window.api.ipc.invoke("forecasting:get-inventory");
      this.procurementData = await window.api.ipc.invoke("forecasting:get-procurement");
      this.financialsData = await window.api.ipc.invoke("forecasting:get-financials");
      this.scenarioData = await window.api.ipc.invoke("forecasting:simulate-scenario", 5);
    } catch (err) {
      console.error("Forecasting data loading failed:", err);
    }
  }

  async render() {
    const container = document.createElement("div");
    container.className = "forecast-center-layout";

    await this.loadForecastData();

    // 1. Header
    const header = document.createElement("header");
    header.className = "forecast-center-header";
    header.innerHTML = `
      <div>
        <h1 class="forecast-center-title">Enterprise Forecasting Center</h1>
        <p class="forecast-center-subtitle">Simulate growth rate impacts, review procurement calendars, analyze stock-out trends, and manage financials in Indian Rupees (₹).</p>
      </div>
    `;
    container.appendChild(header);

    // 2. Tabs toolbar
    const toolbar = document.createElement("div");
    toolbar.className = "forecast-center-tabs-toolbar";
    toolbar.innerHTML = `
      <button class="forecast-center-tab-btn ${this.activeTab === "sales" ? "active" : ""}" data-tab="sales">Sales Forecasting</button>
      <button class="forecast-center-tab-btn ${this.activeTab === "inventory" ? "active" : ""}" data-tab="inventory">Inventory Forecasting</button>
      <button class="forecast-center-tab-btn ${this.activeTab === "procurement" ? "active" : ""}" data-tab="procurement">Procurement Planning</button>
      <button class="forecast-center-tab-btn ${this.activeTab === "financials" ? "active" : ""}" data-tab="financials">Financial Projections</button>
      <button class="forecast-center-tab-btn ${this.activeTab === "scenarios" ? "active" : ""}" data-tab="scenarios">Scenario Simulation</button>
    `;

    toolbar.querySelectorAll(".forecast-center-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        this.activeTab = btn.getAttribute("data-tab");
        this.updateActiveTabContent();
      });
    });
    container.appendChild(toolbar);

    // 3. Grid Workspace
    const mainGrid = document.createElement("div");
    mainGrid.className = "forecast-center-content-grid";
    container.appendChild(mainGrid);

    this.element = container;
    this.updateActiveTabContent();

    return container;
  }

  async updateActiveTabContent() {
    const mainGrid = this.element.querySelector(".forecast-center-content-grid");
    if (!mainGrid) return;
    
    mainGrid.innerHTML = "";

    this.element.querySelectorAll(".forecast-center-tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-tab") === this.activeTab);
    });

    if (this.activeTab === "sales") {
      const panel = new SalesForecastPanel({ projections: this.salesData });
      mainGrid.appendChild(panel.render());
    } 
    else if (this.activeTab === "inventory") {
      const panel = new InventoryForecastPanel({ forecasts: this.inventoryData });
      mainGrid.appendChild(panel.render());
    } 
    else if (this.activeTab === "procurement") {
      const panel = new ProcurementForecastPanel({ procurement: this.procurementData });
      mainGrid.appendChild(panel.render());
    } 
    else if (this.activeTab === "financials") {
      const panel = new FinancialForecastPanel({ financials: this.financialsData });
      mainGrid.appendChild(panel.render());
    } 
    else if (this.activeTab === "scenarios") {
      const panel = new ScenarioSimulationPanel({ initialData: this.scenarioData });
      mainGrid.appendChild(panel.render());
    }
  }
}
