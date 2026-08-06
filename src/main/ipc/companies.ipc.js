/**
 * companies.ipc.js
 * Retail ERP Enterprise — IPC Multi-Company Event Handlers
 *
 * Bridges the sandboxed renderer context queries to the main process CompanyManager.
 */

"use strict";

const { ipcMain } = require("electron");
const registry = require("../companies/CompanyRegistry");
const switcher = require("../companies/CompanySwitcher");
const permissions = require("../companies/CompanyPermissionManager");
const manager = require("../companies/CompanyManager");
const logger = require("../../shared/logger/logger");
const appConfig = require("../../config/app.config");

/**
 * Validates the IPC sender context.
 */
function validateSender(event) {
  if (!event || !event.sender) {
    throw new Error("Invalid IPC event context.");
  }
  const url = event.senderFrame ? event.senderFrame.url : event.sender.getURL();
  if (!url) {
    logger.warn("Security Alert: Blocked IPC message due to missing sender URL.");
    throw new Error("Access Denied: Missing sender origin.");
  }

  const isLocalFile = url.startsWith("file://");
  const isDevTools = url.startsWith("chrome-extension://") || url.startsWith("devtools://");

  if (!isLocalFile && (!isDevTools || appConfig.isProduction)) {
    logger.warn(`Security Alert: Blocked IPC message from unauthorized origin: ${url}`);
    throw new Error("Access Denied: Unauthorized IPC origin.");
  }
}

/**
 * Registers all multi-company IPC event listeners.
 */
function registerCompanyIpcHandlers() {
  logger.info("Registering IPC Company Handlers...");

  // Get all registered companies
  ipcMain.handle("companies:get-all", async (event) => {
    validateSender(event);
    return registry.getCompanies();
  });

  // Get active company details
  ipcMain.handle("companies:get-active", async (event) => {
    validateSender(event);
    return switcher.getActiveCompany();
  });

  // Register new company
  ipcMain.handle("companies:register", async (event, data) => {
    validateSender(event);
    return registry.registerCompany(data);
  });

  // Update existing company settings details
  ipcMain.handle("companies:update", async (event, { id, data }) => {
    validateSender(event);
    return registry.updateCompany(id, data);
  });

  // Swap active company context
  ipcMain.handle("companies:switch", async (event, id) => {
    validateSender(event);
    return switcher.switchCompany(id);
  });

  // Get permissions access matrix
  ipcMain.handle("companies:get-matrix", async (event, id) => {
    validateSender(event);
    return permissions.getMatrix(id);
  });

  // Update role scopes permissions
  ipcMain.handle("companies:update-role-perms", async (event, { companyId, role, permissions: list }) => {
    validateSender(event);
    return permissions.updateRolePermissions(companyId, role, list);
  });

  // Get Diagnostics summary details
  ipcMain.handle("companies:get-diagnostics", async (event) => {
    validateSender(event);
    return manager.getDiagnosticsSummary();
  });
}

module.exports = {
  registerCompanyIpcHandlers
};
