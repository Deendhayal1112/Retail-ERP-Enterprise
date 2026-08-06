/**
 * ForecastingConstants.js
 * Retail ERP Enterprise — Enterprise Forecasting constants
 */

"use strict";

const ForecastModes = {
  SALES: "Sales",
  INVENTORY: "Inventory",
  PROCUREMENT: "Procurement",
  FINANCIAL: "Financial",
  SCENARIOS: "Scenarios"
};

const ScenarioTypes = {
  BEST_CASE: "Best Case",
  EXPECTED_CASE: "Expected Case",
  WORST_CASE: "Worst Case"
};

module.exports = {
  ForecastModes,
  ScenarioTypes
};
