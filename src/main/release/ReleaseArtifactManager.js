/**
 * ReleaseArtifactManager.js
 * Retail ERP Enterprise — Distribution Release Artifacts Manager
 */

"use strict";

const fs = require("fs");
const path = require("path");

class ReleaseArtifactManager {
  constructor() {
    this.artifacts = [
      { name: "Retail_ERP_Setup_v0.2.0.exe", size: "54.2 MB", type: "NSIS Installer", sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855" },
      { name: "Retail_ERP_Portable_v0.2.0.exe", size: "48.7 MB", type: "Windows Portable", sha256: "1e2f3d4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e" },
      { name: "Retail_ERP_v0.2.0.dmg", size: "82.1 MB", type: "macOS DMG Disk", sha256: "9f8e7d6c5b4a3c2b1a0f9e8d7c6b5a4c3b2a1a0f9e8d7c6b5a4c3b2a1a0f9e8d" },
      { name: "Retail_ERP_v0.2.0.AppImage", size: "75.4 MB", type: "Linux AppImage", sha256: "a1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f90" }
    ];

    this.releaseManifest = {
      version: "0.2.0-beta",
      releaseDate: "2026-08-05",
      stability: "Beta",
      changelog: [
        "Added Enterprise Security Testing, Vulnerability Assessment & Compliance Framework.",
        "Refactored POS layout widgets grids for 12-column expanding responsiveness.",
        "Created system diagnostics submenu groups.",
        "Mocked multi-channel packaging installer validations."
      ]
    };
  }

  async getArtifacts() {
    return this.artifacts;
  }

  async getManifest() {
    return this.releaseManifest;
  }

  async compileManifestReport(data) {
    const reportDir = path.join(__dirname, "../../../logs/releases");
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    const reportPath = path.join(reportDir, `manifest_${this.releaseManifest.version}.json`);
    const compiledContent = {
      compiledAt: new Date().toISOString(),
      release: this.releaseManifest,
      artifacts: this.artifacts,
      validationChecklist: data.compliance || []
    };

    fs.writeFileSync(reportPath, JSON.stringify(compiledContent, null, 2), "utf8");
    return { success: true, filePath: reportPath };
  }
}

module.exports = ReleaseArtifactManager;
