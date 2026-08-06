/**
 * background.ipc.js
 * Retail ERP Enterprise — Electron IPC Background Task Handlers
 */

"use strict";

const { ipcMain } = require("electron");
const BackgroundTaskManager = require("../background/BackgroundTaskManager");
const windowManager = require("../managers/windowManager");
const logger = require("../../shared/logger/logger");
const appConfig = require("../../config/app.config");

/**
 * Validates the IPC sender to ensure it is a trusted local frame.
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
 * Registers all background task IPC handler bindings.
 */
function registerBackgroundIpcHandlers() {
  logger.info("Registering IPC Background Task Handlers...");

  BackgroundTaskManager.registerIpc(ipcMain, validateSender, () => windowManager.getMainWindow());

  // Listeners to start and stop telemetry dynamically when navigating in and out of Background Task Center
  ipcMain.on("bg-tasks:start-telemetry", (event) => {
    validateSender(event);
    const win = windowManager.getMainWindow();
    if (win) {
      BackgroundTaskManager.startTelemetry(win);
    }
  });

  ipcMain.on("bg-tasks:stop-telemetry", (event) => {
    validateSender(event);
    BackgroundTaskManager.stopTelemetry();
  });
}

module.exports = {
  registerBackgroundIpcHandlers
};
