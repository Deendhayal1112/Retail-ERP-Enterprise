/**
 * UpdateChecker.js
 * Retail ERP Enterprise — Reusable Desktop Updates Check Manager
 *
 * Implements:
 * - Mock queries against update endpoints
 * - Stable, Beta, Development channels filtering
 */

"use strict";

import VersionService from "./VersionService.js";

export default class UpdateChecker {
  /**
   * @param {Object} logger Shared system logger
   */
  constructor(logger = console) {
    this.logger = logger;
    this.versionService = new VersionService(this.logger);
    this.channel = "Stable";
    this.logger.info(`[UpdateChecker] Service initialized. Listening on update channel: "${this.channel}"`);
  }

  /**
   * Safe set update check channel
   * @param {string} channelName Stable, Beta, Development
   */
  setChannel(channelName) {
    this.channel = channelName;
    this.logger.info(`[UpdateChecker] Update check channel changed to: "${this.channel}"`);
  }

  /**
   * Query remote repository updates
   */
  checkForUpdates() {
    this.logger.info(`[UpdateChecker] Pinging updates distribution server (channel: "${this.channel}")...`);
    
    // Simulate checking logic
    const remoteVersion = "0.2.1";
    const updateAvailable = this.versionService.compare(this.versionService.currentVersion, remoteVersion) > 0;

    const result = {
      updateAvailable,
      currentVersion: this.versionService.currentVersion,
      latestVersion: remoteVersion,
      channel: this.channel,
      lastChecked: new Date().toISOString()
    };

    if (updateAvailable) {
      this.logger.info(`[UpdateChecker] Update found! version: ${remoteVersion} (stable)`);
    } else {
      this.logger.info("[UpdateChecker] Client is already up to date.");
    }

    return result;
  }
}
