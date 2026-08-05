/**
 * TrayStatus.js
 * Retail ERP Enterprise — Desktop Native System Tray Status States Manager
 *
 * Implements:
 * - Managing active system connection/backup state overlays
 * - Running, Syncing, Offline, Updating, Backup Running, Error State
 */

"use strict";

export default class TrayStatus {
  /**
   * @param {Object} logger Shared system logger
   */
  constructor(logger = console) {
    this.logger = logger;
    this.currentState = "Running";
  }

  /**
   * Updates tray status and triggers icon adjustments placeholders
   * @param {string} state Status enum state
   */
  setStatus(state) {
    const validStates = ["Running", "Syncing", "Offline", "Updating", "Backup Running", "Error State"];
    if (!validStates.includes(state)) {
      this.logger.error(`[TrayStatus] Invalid state requested: ${state}`);
      return;
    }

    this.logger.info(`[TrayStatus] Transitioning system tray status: "${this.currentState}" -> "${state}"`);
    this.currentState = state;
  }
}
