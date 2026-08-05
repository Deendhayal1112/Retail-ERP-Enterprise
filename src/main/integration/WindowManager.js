/**
 * WindowManager.js
 * Retail ERP Enterprise — Reusable Desktop Window Position & Layout Cache Manager
 *
 * Implements:
 * - Mock coordinates caching for restoring last window size/pos
 * - Decoupled from Electron APIs
 */

"use strict";

export default class WindowManager {
  /**
   * @param {Object} logger Shared system logger
   */
  constructor(logger = console) {
    this.logger = logger;
    this.cachedLayout = {
      width: 1440,
      height: 900,
      x: 100,
      y: 100,
      isFullscreen: false
    };
    this.logger.info("[WindowManager] Layout settings manager initialized.");
  }

  /**
   * Safe fetch cached positions
   */
  getLastKnownBounds() {
    this.logger.info("[WindowManager] Resolving window bounds cache parameters:", this.cachedLayout);
    return this.cachedLayout;
  }

  /**
   * Safe save bounds parameters
   * @param {Object} bounds Coordinates dictionary
   */
  saveBounds(bounds) {
    this.logger.info("[WindowManager] Caching updated bounds parameters:", bounds);
    this.cachedLayout = { ...this.cachedLayout, ...bounds };
    return true;
  }
}
