/**
 * WarehouseInventoryManager.js
 * Retail ERP Enterprise — Warehouse Inventory Distribution Manager
 *
 * Implements mock inventory allocations, bin maps, and storage valuations.
 */

"use strict";

const logger = require("../../shared/logger/logger");

class WarehouseInventoryManager {
  constructor() {
    // Inventory quantities mapped per warehouse and product SKU
    this.stockMap = [
      {
        warehouseId: "wh-central-delhi",
        sku: "APP-SHIRT-COTTON",
        available: 1200,
        reserved: 150,
        damaged: 15,
        returned: 22,
        valuation: 1797000.00, // ₹1497.50 * quantity
        bin: "ZONE-A-RACK-02-SHELF-C"
      },
      {
        warehouseId: "wh-central-delhi",
        sku: "APP-JEANS-INDIGO",
        available: 840,
        reserved: 80,
        damaged: 8,
        returned: 12,
        valuation: 2060800.00,
        bin: "ZONE-B-RACK-04-SHELF-A"
      },
      {
        warehouseId: "wh-chennai-port",
        sku: "APP-SHIRT-COTTON",
        available: 600,
        reserved: 30,
        damaged: 5,
        returned: 4,
        valuation: 898500.00,
        bin: "ZONE-T-RACK-01-SHELF-D"
      },
      {
        warehouseId: "wh-bengaluru-cold",
        sku: "APP-SILK-SAREE",
        available: 140,
        reserved: 10,
        damaged: 2,
        returned: 0,
        valuation: 1750000.00,
        bin: "ZONE-S-RACK-08-SHELF-B"
      }
    ];
  }

  /**
   * Retrieves stock entries.
   */
  getStockMap(warehouseId = null) {
    logger.debug(`[WarehouseInventoryManager] Querying stock levels map for WH: ${warehouseId || "ALL"}`);
    if (warehouseId) {
      return this.stockMap.filter(x => x.warehouseId === warehouseId);
    }
    return this.stockMap;
  }
}

module.exports = new WarehouseInventoryManager();
