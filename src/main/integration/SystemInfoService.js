/**
 * SystemInfoService.js
 * Retail ERP Enterprise — Reusable Desktop System Information Reader
 *
 * Implements:
 * - Mock diagnostics queries for OS, CPU, RAM, Disk usages
 * - Decoupled from native OS tools
 */

"use strict";

export default class SystemInfoService {
  /**
   * @param {Object} logger Shared system logger
   */
  constructor(logger = console) {
    this.logger = logger;
    this.logger.info("[SystemInfoService] Service initialized. Ready for hardware queries.");
  }

  /**
   * Safe fetch CPU and memory usages
   */
  getHardwareSpecs() {
    this.logger.info("[SystemInfoService] Compiling local hardware diagnostic logs...");
    return {
      os: "macOS Ventura 13.4.1",
      cpu: "Apple M2 (8 Cores)",
      ram: { total: "16 GB", used: "6.8 GB", available: "9.2 GB" },
      disk: { total: "250 GB", free: "148.2 GB", format: "APFS" },
      electronVersion: "25.3.0",
      nodeVersion: "18.15.0",
      chromeVersion: "114.0.5735.289"
    };
  }
}
