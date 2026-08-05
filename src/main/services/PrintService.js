/**
 * PrintService.js
 * Retail ERP Enterprise — Reusable Desktop Document Printing Service
 *
 * Implements:
 * - Mock printer lists query and invoice printing triggers
 * - Decoupled from Electron APIs using mock placeholders
 * - Dependency Injection Ready
 */

"use strict";

export default class PrintService {
  /**
   * @param {Object} logger Logger instance
   */
  constructor(logger = console) {
    this.logger = logger;
    this.logger.info("[PrintService] Service initialized. Ready for print operations.");
  }

  /**
   * Retrieve list of local printers
   */
  getPrinters() {
    this.logger.info("[PrintService] Querying mock local system printers...");
    return [
      { name: "Billing Printer (POS-58)", status: "idle", isDefault: true },
      { name: "Office Printer (HP Laserjet)", status: "idle", isDefault: false }
    ];
  }

  /**
   * Sends print job to a target printer
   * @param {string} content HTML or raw text content
   * @param {string} printer Selected printer name
   */
  printDocument(content, printer) {
    this.logger.info(`[PrintService] Sending mock print job of length ${content.length} to printer: "${printer}"`);
    return { jobId: `print_job_${Date.now()}`, success: true };
  }
}
