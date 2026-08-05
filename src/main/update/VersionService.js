/**
 * VersionService.js
 * Retail ERP Enterprise — Reusable Desktop Version Comparator Service
 *
 * Implements:
 * - Version semantic comparisons parsing (major.minor.patch)
 * - Decoupled from Electron APIs
 */

"use strict";

export default class VersionService {
  /**
   * @param {Object} logger Shared system logger
   */
  constructor(logger = console) {
    this.logger = logger;
    this.currentVersion = "0.2.0";
    this.logger.info(`[VersionService] Service initialized. Current Version ID: ${this.currentVersion}`);
  }

  /**
   * Compare two semantic versions
   * @param {string} local  Current local version
   * @param {string} remote Remote checked version
   * @returns {number} 1 if remote is newer, -1 if local is newer, 0 if equal
   */
  compare(local, remote) {
    const parse = (v) => v.split(".").map(Number);
    const [lMaj, lMin, lPat] = parse(local);
    const [rMaj, rMin, rPat] = parse(remote);

    if (rMaj !== lMaj) return rMaj > lMaj ? 1 : -1;
    if (rMin !== lMin) return rMin > lMin ? 1 : -1;
    if (rPat !== lPat) return rPat > lPat ? 1 : -1;
    return 0;
  }
}
