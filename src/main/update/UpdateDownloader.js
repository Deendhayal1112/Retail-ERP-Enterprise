/**
 * UpdateDownloader.js
 * Retail ERP Enterprise — Reusable Background Update Downloader
 *
 * Implements:
 * - Mock download progress status updates (0% to 100%)
 * - Decoupled from physical download networks
 */

"use strict";

export default class UpdateDownloader {
  /**
   * @param {Object} logger Shared system logger
   */
  constructor(logger = console) {
    this.logger = logger;
    this.logger.info("[UpdateDownloader] Service initialized. Ready for background downloads.");
  }

  /**
   * Safe initiate download progress routines
   * @param {string}   version  Version tag to download
   * @param {Function} progress Callback returning numeric progress
   */
  startDownload(version, progress) {
    this.logger.info(`[UpdateDownloader] Starting download for patch installer package: ${version}`);
    
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 20;
      if (progress) progress(currentProgress);
      this.logger.info(`[UpdateDownloader] Download progress: ${currentProgress}%`);

      if (currentProgress >= 100) {
        clearInterval(interval);
        this.logger.info("[UpdateDownloader] Patch installer downloaded successfully. Ready to apply.");
      }
    }, 200);
  }
}
