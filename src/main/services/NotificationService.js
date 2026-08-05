/**
 * NotificationService.js
 * Retail ERP Enterprise — Reusable Desktop System Notification Service
 *
 * Implements:
 * - Mock desktop toast warnings alerts dispatches
 * - Decoupled from Electron APIs using mock placeholders
 * - Dependency Injection Ready
 */

"use strict";

export default class NotificationService {
  /**
   * @param {Object} logger Logger instance
   */
  constructor(logger = console) {
    this.logger = logger;
    this.logger.info("[NotificationService] Service initialized. Ready for OS notifications.");
  }

  /**
   * Dispatches a mock OS-level notification
   * @param {string} title   Notification header
   * @param {string} body    Message description
   * @param {Object} options Visual configuration overrides
   */
  showNotification(title, body, options = {}) {
    this.logger.info(`[NotificationService] Dispatching OS notification banner: "${title}" | Message: "${body}"`);
    return { id: `mock_notif_${Date.now()}`, title, body, options };
  }
}
