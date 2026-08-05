/**
 * TrayBuilder.js
 * Retail ERP Enterprise — Desktop Native System Tray Template Builder
 *
 * Implements:
 * - Bootstrapping and assembly of system trays
 */

"use strict";

import TrayManager from "./TrayManager.js";

export default class TrayBuilder {
  /**
   * @param {Object} logger Shared system logger
   */
  constructor(logger = console) {
    this.logger = logger;
    this.manager = new TrayManager(this.logger);
  }

  /**
   * Builds and initializes system tray
   * @param {string} iconPath Absolute path to the icon file
   */
  build(iconPath) {
    this.logger.info("[TrayBuilder] Building native system tray...");
    const tray = this.manager.init(iconPath);
    return tray;
  }
}
