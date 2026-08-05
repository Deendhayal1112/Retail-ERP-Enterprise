/**
 * ReleaseMetadataManager.js
 * Retail ERP Enterprise — Version Release Notes & Changelogs Manager
 */

"use strict";

const fs = require("fs");
const path = require("path");

class ReleaseMetadataManager {
  constructor() {
    this.changelogs = [
      { version: "0.2.0-beta", date: "2026-08-05", changes: ["Enhanced security pre-audits validations.", "Integrated System Diagnostics submenu grouped views.", "Added Release Engineering installer center."] },
      { version: "0.1.9-alpha", date: "2026-07-28", changes: ["Refactored Store Settings UI cards and active themes list.", "Optimized Database Tuning pragmas and index telemetry metrics."] }
    ];
  }

  async getChangelogs() {
    return this.changelogs;
  }

  async compileReleaseMetadata(data) {
    const reportDir = path.join(__dirname, "../../../logs/releases");
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    const reportPath = path.join(reportDir, `metadata_release_${data.version}.json`);
    const compiledContent = {
      compiledAt: new Date().toISOString(),
      changelogs: this.changelogs,
      releaseMetadata: data
    };

    fs.writeFileSync(reportPath, JSON.stringify(compiledContent, null, 2), "utf8");
    return { success: true, filePath: reportPath };
  }
}

module.exports = ReleaseMetadataManager;
