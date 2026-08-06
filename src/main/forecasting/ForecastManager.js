/**
 * ForecastManager.js
 * Retail ERP Enterprise — Primary Forecasting entry coordinator
 */

"use strict";

const SalesForecastManager = require("./SalesForecastManager");
const InventoryForecastManager = require("./InventoryForecastManager");
const ProcurementForecastManager = require("./ProcurementForecastManager");
const FinancialForecastManager = require("./FinancialForecastManager");
const ScenarioManager = require("./ScenarioManager");

class ForecastManager {
  constructor() {
    this.salesMgr = new SalesForecastManager();
    this.inventoryMgr = new InventoryForecastManager();
    this.procurementMgr = new ProcurementForecastManager();
    this.financialsMgr = new FinancialForecastManager();
    this.scenarioMgr = new ScenarioManager();
  }

  async getSalesForecast() {
    return await this.salesMgr.getProjections();
  }

  async getInventoryForecast() {
    return await this.inventoryMgr.getForecasts();
  }

  async getProcurementForecast() {
    return await this.procurementMgr.getProcurementData();
  }

  async getFinancialForecast() {
    return await this.financialsMgr.getFinancials();
  }

  async runScenarioSimulation(growthRate) {
    return await this.scenarioMgr.runSimulation(growthRate);
  }
}

module.exports = ForecastManager;
