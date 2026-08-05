/**
 * TrayMenu.js
 * Retail ERP Enterprise — Desktop Native System Tray (Tray Menu Template Options)
 *
 * Implements:
 * - Tray context menu template definitions
 * - Placeholders mapping tray callbacks
 */

"use strict";

export default class TrayMenu {
  /**
   * @param {Object} logger Shared system logger
   */
  constructor(logger = console) {
    this.logger = logger;
  }

  getTemplate() {
    return [
      { label: "Open Dashboard", click: () => this.logger.info("[Tray Action] Open Dashboard triggered") },
      { type: "separator" },
      { label: "Show Window", click: () => this.logger.info("[Tray Action] Show Window triggered") },
      { label: "Hide Window", click: () => this.logger.info("[Tray Action] Hide Window triggered") },
      { label: "Restore Window", click: () => this.logger.info("[Tray Action] Restore Window triggered") },
      { type: "separator" },
      { label: "New Sale", click: () => this.logger.info("[Tray Action] New Sale POS triggered") },
      { label: "Products", click: () => this.logger.info("[Tray Action] Products list triggered") },
      { label: "Customers", click: () => this.logger.info("[Tray Action] Customers list triggered") },
      { label: "Reports", click: () => this.logger.info("[Tray Action] Reports dashboard triggered") },
      { type: "separator" },
      { label: "Settings", click: () => this.logger.info("[Tray Action] Settings panel triggered") },
      { label: "Backup Database", click: () => this.logger.info("[Tray Action] Database Backup triggered") },
      { label: "Check Updates...", click: () => this.logger.info("[Tray Action] Check for Updates triggered") },
      { type: "separator" },
      { label: "Sign Out", click: () => this.logger.info("[Tray Action] Operator Sign Out triggered") },
      { label: "Exit Application", role: "quit" }
    ];
  }
}
