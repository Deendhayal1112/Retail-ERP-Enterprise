/**
 * CompanyContextManager.js
 * Retail ERP Enterprise — Company Context Configurations Manager
 *
 * Simulates company-level isolated database state caches and configurations.
 */

"use strict";

const logger = require("../../shared/logger/logger");

class CompanyContextManager {
  constructor() {
    this.contexts = new Map();
    
    // Default mock data caches isolation pools
    this.contexts.set("comp-textiles-main", {
      cashBalance: 145200.00,
      inventoryItemsCount: 4520,
      recentActivityLog: [
        { type: "sale", desc: "Sold 3 Premium Cotton Slim-Fit Shirts", val: "₹4,497.00" },
        { type: "restock", desc: "Manual Restock: Linen Summer Trousers", val: "+50 qty" }
      ]
    });

    this.contexts.set("comp-textiles-south", {
      cashBalance: 84300.00,
      inventoryItemsCount: 2190,
      recentActivityLog: [
        { type: "sale", desc: "Sold 1 Premium Silk Saree", val: "₹12,500.00" },
        { type: "restock", desc: "Received order from supplier ABC Corp", val: "+120 qty" }
      ]
    });
  }

  /**
   * Retrieves context values.
   */
  getContext(id) {
    logger.debug(`[CompanyContextManager] Querying state cache for company context: ${id}`);
    if (!this.contexts.has(id)) {
      // Lazy init blank context
      this.contexts.set(id, {
        cashBalance: 0.00,
        inventoryItemsCount: 0,
        recentActivityLog: []
      });
    }
    return this.contexts.get(id);
  }
}

module.exports = new CompanyContextManager();
