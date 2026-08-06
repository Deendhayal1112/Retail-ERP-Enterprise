/**
 * WarehouseManager.js
 * Retail ERP Enterprise — Central Warehouse Subsystem Coordinator
 *
 * Coordinates registries, context settings, and telemetry dashboards.
 */

"use strict";

const logger = require("../../shared/logger/logger");
const registry = require("./WarehouseRegistry");
const transfers = require("./StockTransferManager");
const inventory = require("./WarehouseInventoryManager");
const analytics = require("./WarehouseAnalyticsManager");

class WarehouseManager {
  constructor() {
    this.isInitialized = false;
  }

  /**
   * Initializes multi-warehouse parameters.
   */
  initialize() {
    if (this.isInitialized) return;
    logger.info("Initializing Enterprise Multi-Warehouse Subsystem...");
    this.isInitialized = true;
    logger.info("Multi-Warehouse Subsystem successfully initialized. ✅");
  }

  /**
   * Returns a complete diagnostics summary metrics block.
   */
  getDiagnosticsSummary() {
    const list = registry.getWarehouses();
    const tr = transfers.getTransfers();
    const util = analytics.getUtilisationMetrics();

    return {
      totalWarehouseCount: list.length,
      pendingTransferCount: tr.filter(x => x.status === "requested").length,
      utilisationMetrics: util
    };
  }
}

module.exports = new WarehouseManager();
