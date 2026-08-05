/**
 * TrayService.js
 * Retail ERP Enterprise — Reusable Desktop System Tray Service
 *
 * Implements:
 * - Mock system tray rendering, menus, and double click actions
 * - Decoupled from Electron APIs using mock placeholders
 * - Dependency Injection Ready
 */

"use strict";

export default class TrayService {
  /**
   * @param {Object} logger Logger instance
   */
  constructor(logger = console) {
    this.logger = logger;
    this.trayIcon = null;
    this.logger.info("[TrayService] Service initialized. Ready for system tray attachment.");
  }

  /**
   * Creates system tray icon
   * @param {string} iconPath Absolute path to the icon file
   */
  createTray(iconPath) {
    this.logger.info(`[TrayService] Attaching mock system tray icon at path: ${iconPath}`);
    this.trayIcon = {
      path: iconPath,
      tooltip: "Retail ERP Enterprise",
      setContextMenu: (menuTemplate) => {
        this.logger.info("[TrayService] Tray context menu options attached:", menuTemplate);
      },
      destroy: () => {
        this.logger.info("[TrayService] Tray icon destroyed.");
        this.trayIcon = null;
      }
    };
    return this.trayIcon;
  }

  /**
   * Destroys active tray icon
   */
  destroy() {
    if (this.trayIcon) {
      this.trayIcon.destroy();
    }
  }
}
