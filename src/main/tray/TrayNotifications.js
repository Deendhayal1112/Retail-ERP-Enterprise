/**
 * TrayNotifications.js
 * Retail ERP Enterprise — Desktop Native System Tray Notifications Dispatcher
 *
 * Implements:
 * - Mock system tray warnings and information dispatches
 * - Handles low stock, sync complete alerts
 */

"use strict";

export default class TrayNotifications {
  /**
   * @param {Object} logger Shared system logger
   */
  constructor(logger = console) {
    this.logger = logger;
  }

  /**
   * Mock notify helper
   * @param {string} title   Alert title
   * @param {string} message Alert body details
   */
  notify(title, message) {
    this.logger.info(`[TrayNotifications] Dispatching system tray alert bubble: "${title}" | Details: "${message}"`);
  }

  triggerLowStockAlert(skuCount) {
    this.notify("⚠️ Low Stock Alert", `${skuCount} items have reached or fell below threshold limit values.`);
  }

  triggerBackupCompleteAlert() {
    this.notify("✅ Database Backup Successful", "SQLite snapshot compiled and stored securely.");
  }

  triggerUpdateAvailableAlert(version) {
    this.notify("🔔 System Update Available", `Version ${version} is available. Click to download.`);
  }
}
