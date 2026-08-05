/**
 * CICDMetrics.js
 * Retail ERP Enterprise — CI/CD Pipeline Metrics Model Schema
 */

"use strict";

export default class CICDMetrics {
  constructor() {
    this.timestamp = Date.now();
    this.activeBuildEnv = "Staging"; // "Development" | "Staging" | "Production"
    this.overallStatus = "success";  // "success" | "running" | "failed"

    this.pipeline = {
      checkoutStatus: "complete",
      lintStatus: "complete",
      testStatus: "complete",
      buildStatus: "complete",
      durationSec: 185
    };

    this.gates = {
      eslintWarnings: 3,
      eslintErrors: 0,
      prettierPassing: true,
      dependencyVulnerabilities: 0,
      secretsDetected: 0,
      licenseCompliance: true
    };

    this.packaging = {
      windowsInstallerSizeMb: 112.5,
      macOSDmgSizeMb: 124.2,
      linuxAppImageSizeMb: 98.4,
      portableArchiveSizeMb: 85.1,
      installerValidationPassed: true
    };

    this.deployment = {
      releaseNotes: "Patch updates to memory manager limits, dynamic routing, and health scoring radial meters.",
      versionTag: "v0.2.0-rc2",
      rollbackChannelsAvailable: true,
      publishingTarget: "GitHub Releases"
    };

    this.runsHistory = [
      { id: "run-4", tag: "v0.2.0-rc2", status: "success", duration: "3m 05s", date: "Today, 19:42" },
      { id: "run-3", tag: "v0.2.0-rc1", status: "failed", duration: "1m 12s", date: "Yesterday, 14:10" },
      { id: "run-2", tag: "v0.1.9-stable", status: "success", duration: "2m 58s", date: "Aug 4, 11:20" }
    ];
  }
}
