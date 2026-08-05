/**
 * InstallerManager.js
 * Retail ERP Enterprise — Simulated Installer Validation Checklists Manager
 */

"use strict";

const { ValidationPhases } = require("./ReleaseConstants");

class InstallerManager {
  constructor() {
    this.validations = [
      { id: "v_fresh", phase: ValidationPhases.FRESH_INSTALL, status: "PASSED", description: "Fresh directory write integrity check." },
      { id: "v_upgrade", phase: ValidationPhases.UPGRADE, status: "PASSED", description: "Validates schema upgrades and config migration." },
      { id: "v_repair", phase: ValidationPhases.REPAIR, status: "PASSED", description: "Verifies corrupted runtime files replacement." },
      { id: "v_silent", phase: ValidationPhases.SILENT_INSTALL, status: "WARNING", description: "Evaluates auto-install command parameters." },
      { id: "v_uninstall", phase: ValidationPhases.UNINSTALL, status: "PASSED", description: "Checks complete cleanup of directories." },
      { id: "v_preserve", phase: ValidationPhases.DATA_PRESERVATION, status: "PASSED", description: "Asserts store transaction tables persist across installs." }
    ];
  }

  async getValidations() {
    return this.validations;
  }

  async toggleValidation(id) {
    const item = this.validations.find(v => v.id === id);
    if (!item) throw new Error("Validation check item not found.");
    item.status = item.status === "PASSED" ? "FAILED" : "PASSED";
    return this.validations;
  }
}

module.exports = InstallerManager;
