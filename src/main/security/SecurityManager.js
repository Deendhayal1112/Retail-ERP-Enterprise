/**
 * SecurityManager.js
 * Retail ERP Enterprise — Security Manager Subsystem
 */

"use strict";

const { ipcMain } = require("electron");
const SecurityConstants = require("./SecurityConstants");
const SecurityEvents = require("./SecurityEvents");
const logger = require("../../shared/logger/logger");

class SecurityManager {
  constructor() {
    this.activeScans = new Map();
    this.findings = [
      {
        id: "FIND-001",
        category: SecurityConstants.ScanType.DEPENDENCY,
        title: "Outdated Dependency with CVE-2026-9812",
        description: "Third-party component has a known high-severity remote code execution vulnerability.",
        severity: SecurityConstants.Severity.CRITICAL,
        recommendation: "Upgrade package to version 3.4.1 or higher.",
        status: "Open"
      },
      {
        id: "FIND-002",
        category: SecurityConstants.ScanType.SECRETS,
        title: "Hardcoded API Token Found",
        description: "A sandbox API secret key was detected inside the test configuration seed assets.",
        severity: SecurityConstants.Severity.CRITICAL,
        recommendation: "Rotate credentials and externalize keys to environment configurations.",
        status: "Open"
      },
      {
        id: "FIND-003",
        category: SecurityConstants.ScanType.CONFIG,
        title: "Content Security Policy (CSP) Incomplete",
        description: "Content Security Policy header permits 'unsafe-eval' directives in development mode.",
        severity: SecurityConstants.Severity.MEDIUM,
        recommendation: "Restrict scripts origin access in production packaging parameters.",
        status: "Open"
      },
      {
        id: "FIND-004",
        category: SecurityConstants.ScanType.SUPPLY_CHAIN,
        title: "Unsigned Package Integrity Warning",
        description: "Certain modules in node_modules do not have valid package signatures verified.",
        severity: SecurityConstants.Severity.LOW,
        recommendation: "Enforce npm signature verification checks in CI/CD pipeline properties.",
        status: "Resolved"
      }
    ];
  }

  initialize() {
    logger.info("Initializing Enterprise Security Manager...");
    this.registerIpcHandlers();
  }

  registerIpcHandlers() {
    ipcMain.handle("security:run-scan", async (event, scanType) => {
      logger.info(`IPC Request: Initiating security scan for type: ${scanType}`);
      return this.triggerMockScan(event.sender, scanType);
    });

    ipcMain.handle("security:get-findings", async () => {
      return this.findings;
    });

    ipcMain.handle("security:get-electron-status", async () => {
      return {
        contextIsolation: true,
        sandbox: true,
        secureIpc: true,
        nodeIntegration: false,
        cspEnabled: true,
        preloadValidation: true
      };
    });
  }

  triggerMockScan(webContents, scanType) {
    if (this.activeScans.has(scanType)) {
      return { success: false, message: "Scan is already in progress." };
    }

    this.activeScans.set(scanType, true);
    let progress = 0;

    const intervalId = setInterval(() => {
      progress += 25;
      if (progress <= 100) {
        webContents.send("security:scan-progress", { scanType, progress });
      }

      if (progress === 100) {
        clearInterval(intervalId);
        this.activeScans.delete(scanType);
        webContents.send("security:scan-completed", {
          scanType,
          success: true,
          findings: this.findings.filter(f => f.category === scanType)
        });
      }
    }, 400);

    return { success: true, message: "Scan initiated." };
  }
}

module.exports = new SecurityManager();
