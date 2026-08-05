/**
 * AuditManager.js
 * Retail ERP Enterprise — Security Audit Logs Manager
 */

"use strict";

const { ipcMain } = require("electron");
const logger = require("../../shared/logger/logger");

class AuditManager {
  constructor() {
    this.logs = [
      { id: "LOG-01", event: "SYSTEM_INITIALIZED", operator: "system", details: "Enterprise Security Center loaded.", timestamp: "Just now" },
      { id: "LOG-02", event: "SECURITY_SCAN_TRIGGERED", operator: "admin", details: "Manual configuration scan triggered by operator.", timestamp: "10m ago" },
      { id: "LOG-03", event: "COMPLIANCE_RULE_TOGGLED", operator: "admin", details: "Modified state of OWASP rule OWASP-04.", timestamp: "30m ago" },
      { id: "LOG-04", event: "VULNERABILITY_REPORT_DOWNLOADED", operator: "admin", details: "Downloaded compiled security findings report.", timestamp: "1h ago" }
    ];
  }

  initialize() {
    logger.info("Initializing Security Audit Trail Subsystem...");
    this.registerIpcHandlers();
  }

  registerIpcHandlers() {
    ipcMain.handle("security:get-audit-logs", async () => {
      return this.logs;
    });

    ipcMain.handle("security:write-audit-log", async (event, { eventName, details, operator = "admin" }) => {
      const newLog = {
        id: `LOG-${Date.now()}`,
        event: eventName,
        operator,
        details,
        timestamp: "Just now"
      };
      this.logs.unshift(newLog);
      return { success: true, logs: this.logs };
    });
  }
}

module.exports = new AuditManager();
