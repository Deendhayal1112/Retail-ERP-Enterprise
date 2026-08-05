/**
 * ShortcutManager.js
 * Retail ERP Enterprise — Reusable Desktop Keyboard Shortcuts Manager
 *
 * Implements:
 * - Mock keys mapping OS shortcut links dispatches
 * - Decoupled from Windows/macOS short link targets
 */

"use strict";

export default class ShortcutManager {
  /**
   * @param {Object} logger Shared system logger
   */
  constructor(logger = console) {
    this.logger = logger;
    this.logger.info("[ShortcutManager] Keyboard and desktop shortcut manager initialized.");
  }

  /**
   * Safe create shortcut on desktop
   */
  createDesktopShortcut() {
    this.logger.info("[ShortcutManager] Building mock Desktop application link shortcut file...");
    return true;
  }

  /**
   * Safe create shortcut in Start Menu
   */
  createStartMenuShortcut() {
    this.logger.info("[ShortcutManager] Building mock Start Menu application link shortcut file...");
    return true;
  }
}
