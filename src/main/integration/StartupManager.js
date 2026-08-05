/**
 * StartupManager.js
 * Retail ERP Enterprise — Reusable Desktop Auto-Launch Manager
 *
 * Implements:
 * - Mock keys mapping OS startup configurations
 * - Decoupled from Windows registry / plist configurations
 */

"use strict";

export default class StartupManager {
  /**
   * @param {Object} logger Shared system logger
   */
  constructor(logger = console) {
    this.logger = logger;
    this.autoLaunchEnabled = false;
    this.logger.info("[StartupManager] Auto-launch system initialized.");
  }

  /**
   * Safe set auto-launch values
   * @param {boolean} enable Auto-start toggle status
   */
  setAutoLaunch(enable) {
    this.autoLaunchEnabled = enable;
    this.logger.info(`[StartupManager] Setting system launch-on-boot configuration status = ${enable}`);
    return true;
  }

  /**
   * Safe fetch launch configuration status
   */
  isAutoLaunchEnabled() {
    this.logger.info(`[StartupManager] Querying system launch configuration status = ${this.autoLaunchEnabled}`);
    return this.autoLaunchEnabled;
  }
}
