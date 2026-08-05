/**
 * PrinterService.js
 * Retail ERP Enterprise — Reusable Desktop Native Printer Connector
 *
 * Implements:
 * - Mock printer list search and custom configurations
 * - Decoupled from Electron APIs
 */

"use strict";

export default class PrinterService {
  /**
   * @param {Object} logger Shared system logger
   */
  constructor(logger = console) {
    this.logger = logger;
    this.logger.info("[PrinterService] Service initialized. Ready for hardware connections.");
  }

  /**
   * Safe fetch local printers lists
   */
  getSystemPrinters() {
    this.logger.info("[PrinterService] Loading local printer settings profiles...");
    return [
      { name: "POS Thermal Printer (TSP-100)", type: "Thermal", DPI: 203, default: true },
      { name: "Backoffice Printer (LaserJet Pro)", type: "Laser", DPI: 600, default: false }
    ];
  }

  /**
   * Configure paper margin dimensions
   * @param {string} size e.g. A4, 58mm roll, 80mm roll
   */
  getPaperProfile(size = "A4") {
    this.logger.info(`[PrinterService] Querying margin configurations profile for paper size: ${size}`);
    return { width: "80mm", margin: "2mm", orientation: "portrait" };
  }
}
