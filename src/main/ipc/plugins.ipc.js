/**
 * plugins.ipc.js
 * Retail ERP Enterprise — IPC Plugin Handlers
 *
 * Bridges the sandboxed renderer context queries to the main process PluginManager.
 */

"use strict";

const { ipcMain } = require("electron");
const registry = require("../plugins/PluginRegistry");
const manager = require("../plugins/PluginManager");
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
 * Registers all plugin IPC event listeners.
 */
function registerPluginIpcHandlers() {
  logger.info("Registering IPC Plugin Handlers...");

  // Get Installed Plugins list
  ipcMain.handle("plugins:get-installed", async (event) => {
    validateSender(event);
    return registry.getInstalled();
  });

  // Get Available Plugins list
  ipcMain.handle("plugins:get-available", async (event) => {
    validateSender(event);
    return registry.getAvailable();
  });

  // Install Plugin
  ipcMain.handle("plugins:install", async (event, id) => {
    validateSender(event);
    return manager.install(id);
  });

  // Toggle Plugin status (active/inactive)
  ipcMain.handle("plugins:toggle", async (event, { id, active }) => {
    validateSender(event);
    return manager.togglePlugin(id, active);
  });

  // Update permissions scope list
  ipcMain.handle("plugins:update-permissions", async (event, { id, permissions }) => {
    validateSender(event);
    return manager.updatePermissions(id, permissions);
  });

  // Get Diagnostics Summary statistics
  ipcMain.handle("plugins:get-diagnostics", async (event) => {
    validateSender(event);
    return manager.getDiagnosticsReport();
  });
}

module.exports = {
  registerPluginIpcHandlers,
};
