/**
 * ExportManager.js
 * Retail ERP Enterprise — Reusable Desktop Data Exports Manager
 *
 * Implements:
 * - Mock dataset export compiles to CSV, Excel, and JSON files
 * - Decoupled from physical database engines
 */

"use strict";

export default class ExportManager {
  /**
   * @param {Object} logger Shared system logger
   */
  constructor(logger = console) {
    this.logger = logger;
    this.logger.info("[ExportManager] Service initialized. Ready for processing output datasets.");
  }

  /**
   * Safe compile and write data queries outputs
   * @param {string} category Products, Customers, Inventory, Sales, Purchases, Reports, Settings
   * @param {string} destPath Target file location
   * @param {string} format   CSV, Excel or JSON
   */
  compileExport(category, destPath, format = "csv") {
    this.logger.info(`[ExportManager] Querying database records for category: "${category}"`);
    this.logger.info(`[ExportManager] Rendering output records layout into ${format.toUpperCase()} formatting...`);
    const finalFile = `${destPath}/export_${category}_${Date.now()}.${format}`;
    this.logger.info(`[ExportManager] Successfully wrote dataset export to target file location: ${finalFile}`);
    return { success: true, file: finalFile };
  }
}
