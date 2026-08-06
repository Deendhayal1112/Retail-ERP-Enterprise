/**
 * WarehouseAnalyticsManager.js
 * Retail ERP Enterprise — Warehouse Analytics Subsystem
 *
 * Compiles telemetry capacity utilisation indicators.
 */

"use strict";

const logger = require("../../shared/logger/logger");
const registry = require("./WarehouseRegistry");

class WarehouseAnalyticsManager {
  /**
   * Compiles utilization metrics.
   */
  getUtilisationMetrics() {
    logger.debug("[WarehouseAnalyticsManager] Gathering warehouse capacity statistics.");
    const list = registry.getWarehouses();

    return list.map(wh => {
      const pct = Math.round((wh.capacityUsed / wh.capacityMax) * 100);
      return {
        id: wh.id,
        name: wh.name,
        code: wh.code,
        capacityMax: wh.capacityMax,
        capacityUsed: wh.capacityUsed,
        pct,
        status: pct > 90 ? "critical" : pct > 70 ? "warning" : "nominal"
      };
    });
  }
}

module.exports = new WarehouseAnalyticsManager();
