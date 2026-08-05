/**
 * UpdateManager.js
 * Retail ERP Enterprise — Reusable Desktop Update Orchestrator
 *
 * Implements:
 * - Coordinating updates checks, downloads, installations, and rollbacks
 * - Decoupled from physical distributions networks
 */

"use strict";

import UpdateChecker from "./UpdateChecker.js";
import UpdateDownloader from "./UpdateDownloader.js";
import UpdateInstaller from "./UpdateInstaller.js";
import RollbackManager from "./RollbackManager.js";
import ReleaseNotesService from "./ReleaseNotesService.js";

export default class UpdateManager {
  /**
   * @param {Object} logger Shared system logger
   */
  constructor(logger = console) {
    this.logger = logger;
    this.checker = new UpdateChecker(this.logger);
    this.downloader = new UpdateDownloader(this.logger);
    this.installer = new UpdateInstaller(this.logger);
    this.rollback = new RollbackManager(this.logger);
    this.notes = new ReleaseNotesService(this.logger);

    this.preferences = {
      autoCheck: true,
      autoDownload: false,
      backupBeforeUpdate: true
    };
    this.logger.info("[UpdateManager] Service initialized. Ready for coordinating update loops.");
  }

  /**
   * Safe check, download and apply updates sequence
   */
  executeAutoUpdateWorkflow() {
    this.logger.info("[UpdateManager] Starting auto-updater workflow...");
    const checkResult = this.checker.checkForUpdates();

    if (checkResult.updateAvailable) {
      const releaseNotes = this.notes.fetchNotes(checkResult.latestVersion);
      this.logger.info(`[UpdateManager] Update found. Release Notes:`, releaseNotes.notes);

      // Download patch
      this.downloader.startDownload(checkResult.latestVersion, (pct) => {
        if (pct === 100) {
          // Trigger install
          this.installer.installPackage(`/tmp/updates/${checkResult.latestVersion}.pkg`);
        }
      });
    } else {
      this.logger.info("[UpdateManager] No update required. Client running latest stable patch.");
    }
  }
}
