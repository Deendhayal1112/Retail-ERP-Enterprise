/**
 * ComplianceManager.js
 * Retail ERP Enterprise — Compliance Checklist Subsystem
 */

"use strict";

const { ipcMain } = require("electron");
const logger = require("../../shared/logger/logger");

class ComplianceManager {
  constructor() {
    this.checklists = {
      owasp: [
        { id: "OWASP-01", rule: "Context Isolation Activated", status: "PASSED", category: "System" },
        { id: "OWASP-02", rule: "Disable Node Integration in Renderer", status: "PASSED", category: "System" },
        { id: "OWASP-03", rule: "Verify Preload Script Location Bounds", status: "PASSED", category: "System" },
        { id: "OWASP-04", rule: "Content Security Policy (CSP) Directives", status: "FAILED", category: "Network" },
        { id: "OWASP-05", rule: "Validate IPC Origin Domain Security", status: "PASSED", category: "System" }
      ],
      privacy: [
        { id: "PRIV-01", rule: "Encrypt SQLite Local Database Assets", status: "FAILED", category: "Storage" },
        { id: "PRIV-02", rule: "Enforce Auto-logout Timeout Limits", status: "PASSED", category: "Session" },
        { id: "PRIV-03", rule: "Mask Sensitive Customer Profiles PII", status: "PASSED", category: "PII" }
      ],
      license: [
        { id: "LIC-01", rule: "Scan Open Source Third-Party Licenses", status: "PASSED", category: "Legal" },
        { id: "LIC-02", rule: "Verify Proprietary Software License Status", status: "PASSED", category: "Legal" }
      ]
    };
  }

  initialize() {
    logger.info("Initializing Enterprise Compliance Manager...");
    this.registerIpcHandlers();
  }

  registerIpcHandlers() {
    ipcMain.handle("compliance:get-checklists", async () => {
      return this.checklists;
    });

    ipcMain.handle("compliance:toggle-rule", async (event, { standard, ruleId }) => {
      logger.info(`Toggling compliance rule status: standard=${standard}, ruleId=${ruleId}`);
      if (this.checklists[standard]) {
        const item = this.checklists[standard].find(r => r.id === ruleId);
        if (item) {
          item.status = item.status === "PASSED" ? "FAILED" : "PASSED";
          return { success: true, checklists: this.checklists };
        }
      }
      return { success: false, message: "Rule not found." };
    });
  }
}

module.exports = new ComplianceManager();
