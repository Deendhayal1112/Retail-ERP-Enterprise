/**
 * OfflineManager.js
 * Retail ERP Enterprise — Reusable Desktop Network Connection Manager
 *
 * Implements:
 * - Tracking local connection state (Online, Offline)
 * - Decoupled from Electron APIs
 */

"use strict";

export default class OfflineManager {
  /**
   * @param {Object} logger Shared system logger
   */
  constructor(logger = console) {
    this.logger = logger;
    this.connectionState = "Online";
    this.listeners = new Set();
    this.logger.info(`[OfflineManager] Service initialized. Initial Connection State: "${this.connectionState}"`);
  }

  /**
   * Safe adjust connection state triggers
   * @param {string} state Online or Offline
   */
  setConnectionState(state) {
    if (state !== "Online" && state !== "Offline") {
      this.logger.error(`[OfflineManager] Invalid connection state requested: ${state}`);
      return;
    }

    this.logger.info(`[OfflineManager] Network connection state changed: "${this.connectionState}" -> "${state}"`);
    this.connectionState = state;
    
    this.listeners.forEach(cb => cb(this.connectionState));
  }

  /**
   * Register a connection change listener
   * @param {Function} cb Callback function
   */
  onConnectionChange(cb) {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }
}
