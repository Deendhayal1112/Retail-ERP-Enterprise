/**
 * SyncLogger.js
 * Retail ERP Enterprise — Reusable Sync Log Tracker
 *
 * Implements:
 * - Tracking local changes synchronization histories logs
 * - Decoupled from Electron APIs
 */

"use strict";

export default class SyncLogger {
  /**
   * @param {Object} logger Shared system logger
   */
  constructor(logger = console) {
    this.logger = logger;
    this.logs = [];
    this.logger.info("[SyncLogger] Service initialized. Ready for recording data replication traces.");
  }

  /**
   * Safe log sync transaction events
   * @param {string} type   Event action description
   * @param {string} status Success or error status
   * @param {Object} meta   Metadata dictionary
   */
  logEvent(type, status, meta = {}) {
    const entry = {
      timestamp: new Date().toISOString(),
      type,
      status,
      meta
    };
    this.logs.unshift(entry);
    this.logger.info(`[SyncLogger] Registered Event: [${type}] Status: "${status}"`, meta);
    return entry;
  }
}
