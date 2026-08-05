/**
 * VersionManager.js
 * Retail ERP Enterprise — Version Control Manager
 */

"use strict";

class VersionManager {
  constructor() {
    this.current = {
      semVer: "0.2.0-beta",
      buildNumber: 281,
      releaseDate: "2026-08-05",
      buildMetadata: "sha.5a2d8e4"
    };

    this.history = [
      { semVer: "0.2.0-beta", buildNumber: 281, releaseDate: "2026-08-05", status: "Active" },
      { semVer: "0.1.9-alpha", buildNumber: 275, releaseDate: "2026-07-28", status: "Archived" },
      { semVer: "0.1.5", buildNumber: 260, releaseDate: "2026-07-10", status: "Archived" }
    ];
  }

  async getVersionInfo() {
    return this.current;
  }

  async getVersionHistory() {
    return this.history;
  }

  async promoteBuild(targetSemVer) {
    this.current.semVer = targetSemVer;
    this.current.buildNumber += 1;
    this.current.releaseDate = new Date().toISOString().slice(0, 10);
    
    // Add to history
    this.history.unshift({
      semVer: this.current.semVer,
      buildNumber: this.current.buildNumber,
      releaseDate: this.current.releaseDate,
      status: "Active"
    });
    
    return { success: true, current: this.current, history: this.history };
  }
}

module.exports = VersionManager;
