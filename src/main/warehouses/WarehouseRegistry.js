/**
 * WarehouseRegistry.js
 * Retail ERP Enterprise — Warehouse Registry Subsystem
 *
 * Manages warehouse listings, details capacities, and location status.
 */

"use strict";

const logger = require("../../shared/logger/logger");

class WarehouseRegistry {
  constructor() {
    this.warehouses = [
      {
        id: "wh-central-delhi",
        name: "Central Delhi Logistics Hub",
        code: "WH-DL-01",
        location: "Kirti Nagar Industrial Area, New Delhi",
        capacityMax: 50000, // volume units
        capacityUsed: 36500,
        manager: "Ramanathan Iyer",
        status: "active",
        isDefault: true
      },
      {
        id: "wh-chennai-port",
        name: "Chennai Port Transit Warehouse",
        code: "WH-TN-02",
        location: "Royapuram, Chennai",
        capacityMax: 30000,
        capacityUsed: 14200,
        manager: "Karthik Subramanian",
        status: "active",
        isDefault: false
      },
      {
        id: "wh-bengaluru-cold",
        name: "Bengaluru Whitefield Storage",
        code: "WH-KA-03",
        location: "Whitefield, Bengaluru",
        capacityMax: 20000,
        capacityUsed: 19800, // Near limit
        manager: "Manjunath Gowda",
        status: "active",
        isDefault: false
      }
    ];
  }

  /**
   * Retrieves all registered warehouses.
   */
  getWarehouses() {
    logger.debug("[WarehouseRegistry] Querying list of warehouses.");
    return this.warehouses;
  }

  /**
   * Registers a new warehouse.
   */
  registerWarehouse(data) {
    logger.info(`[WarehouseRegistry] Simulating registration for: ${data.name}`);
    if (!data.name || !data.code) {
      throw new Error("Missing required warehouse code or name.");
    }

    const id = `wh-${data.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
    const newWh = {
      id,
      name: data.name,
      code: data.code,
      location: data.location || "Not Specified",
      capacityMax: Number(data.capacityMax) || 10000,
      capacityUsed: 0,
      manager: data.manager || "Not Assigned",
      status: "active",
      isDefault: false
    };

    this.warehouses.push(newWh);
    return { success: true, warehouse: newWh };
  }
}

module.exports = new WarehouseRegistry();
