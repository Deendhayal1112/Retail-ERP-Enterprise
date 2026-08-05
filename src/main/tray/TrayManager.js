/**
 * TrayManager.js
 * Retail ERP Enterprise — Desktop Native System Tray Manager
 *
 * Implements:
 * - Coordination of tray icons lifecycle
 * - Integration of menu templates, notifications and status state triggers
 */

"use strict";

import TrayMenu from "./TrayMenu.js";
import TrayActions from "./TrayActions.js";
import TrayNotifications from "./TrayNotifications.js";
import TrayStatus from "./TrayStatus.js";

export default class TrayManager {
  /**
   * @param {Object} logger Shared system logger
   */
  constructor(logger = console) {
    this.logger = logger;
    this.menu = new TrayMenu(this.logger);
    this.actions = new TrayActions(this.logger);
    this.notifications = new TrayNotifications(this.logger);
    this.status = new TrayStatus(this.logger);
    this.trayInstance = null;
  }

  /**
   * Mock build tray icons attachment
   * @param {string} iconPath Target icon absolute location path
   */
  init(iconPath) {
    this.logger.info(`[TrayManager] Initializing system tray instance mapping path: ${iconPath}`);
    this.trayInstance = {
      icon: iconPath,
      tooltip: `Retail ERP Status: ${this.status.currentState}`,
      menu: this.menu.getTemplate()
    };
    this.logger.info("[TrayManager] System tray successfully mounted and loaded.");
    return this.trayInstance;
  }

  /**
   * Destroy active tray
   */
  destroy() {
    if (this.trayInstance) {
      this.logger.info("[TrayManager] Destroying tray icon instance...");
      this.trayInstance = null;
    }
  }
}
