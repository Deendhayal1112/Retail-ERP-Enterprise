/**
 * auth.ipc.js
 * Retail ERP Enterprise — Electron IPC Authentication Handlers
 *
 * Exposes system authentication APIs to sandboxed renderer processes.
 * Bridges renderer events to backend controllers safely.
 *
 * Phase 5 — Step 3: Session Management & Login Integration
 */

"use strict";

const { ipcMain } = require("electron");
const authController = require("../../backend/controllers/auth.controller");
const logger = require("../../shared/logger/logger");
const appConfig = require("../../config/app.config");

/**
 * Validates the IPC sender to ensure it is a trusted local frame.
 * @param {Electron.IpcMainInvokeEvent} event Electron IPC event.
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
 * Registers all authentication IPC handler bindings.
 */
function registerAuthIpcHandlers() {
  logger.info("Registering IPC Authentication Handlers...");

  // 1. Login Handler
  ipcMain.handle("auth:login", async (event, credentials) => {
    validateSender(event);

    // Validate type and structure of credentials
    if (!credentials || typeof credentials !== "object" || Array.isArray(credentials)) {
      logger.warn("Security Alert: Rejected invalid credentials structure payload.");
      return { success: false, message: "Invalid username or password." };
    }

    const { username, password, rememberMe } = credentials;
    if (typeof username !== "string" || typeof password !== "string") {
      logger.warn("Security Alert: Credentials parameters must be string types.");
      return { success: false, message: "Invalid username or password." };
    }

    logger.info(
      `IPC login request received for user: "${username || "unknown"}"`,
    );

    // Fetch context from event caller
    const ipAddress = "127.0.0.1"; // Offline desktop default IP
    const userAgent = event.sender.getUserAgent() || "ElectronRenderer";

    return await authController.loginDirect({
      username,
      password,
      rememberMe: !!rememberMe,
    }, {
      ipAddress,
      userAgent,
    });
  });

  // 2. Logout Handler
  ipcMain.handle("auth:logout", async (event) => {
    validateSender(event);
    logger.info("IPC logout request received.");
    return authController.logoutDirect();
  });

  // 3. Get Session Handler
  ipcMain.handle("auth:get-session", async (event) => {
    validateSender(event);
    return authController.getSessionDirect();
  });
}

module.exports = {
  registerAuthIpcHandlers,
};
