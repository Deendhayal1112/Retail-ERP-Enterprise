/**
 * apiPlatform.ipc.js
 * Retail ERP Enterprise — IPC API Platform Event Handlers
 *
 * Bridges renderer context requests to the main process API platform subsystem.
 * All channels are validated for safe origins before processing.
 */

"use strict";

const { ipcMain } = require("electron");
const manager     = require("../api-platform/APIManager");
const registry    = require("../api-platform/APIRegistry");
const security    = require("../api-platform/APISecurityManager");
const docs        = require("../api-platform/APIDocumentationManager");
const webhooks    = require("../api-platform/WebhookManager");
const logger      = require("../../shared/logger/logger");
const appConfig   = require("../../config/app.config");

/**
 * Validates the IPC sender origin against known safe contexts.
 */
function validateSender(event) {
  if (!event || !event.sender) throw new Error("Invalid IPC event context.");
  const url = event.senderFrame ? event.senderFrame.url : event.sender.getURL();
  if (!url) {
    logger.warn("Security Alert: Blocked IPC message — missing sender URL.");
    throw new Error("Access Denied: Missing sender origin.");
  }
  const isLocalFile = url.startsWith("file://");
  const isDevTools  = url.startsWith("chrome-extension://") || url.startsWith("devtools://");
  if (!isLocalFile && (!isDevTools || appConfig.isProduction)) {
    logger.warn(`Security Alert: Blocked IPC from unauthorized origin: ${url}`);
    throw new Error("Access Denied: Unauthorized IPC origin.");
  }
}

/**
 * Registers all API Platform IPC handlers.
 */
function registerAPIPlatformIpcHandlers() {
  logger.info("Registering IPC API Platform Handlers...");

  // ─── Platform Diagnostics ──────────────────────────────────────────────────
  ipcMain.handle("api-platform:get-diagnostics", async (event) => {
    validateSender(event);
    return manager.getDiagnosticsSummary();
  });

  // ─── API Registry / Endpoints ─────────────────────────────────────────────
  ipcMain.handle("api-platform:get-endpoints", async (event) => {
    validateSender(event);
    return registry.getEndpoints();
  });

  ipcMain.handle("api-platform:get-endpoints-by-module", async (event, module) => {
    validateSender(event);
    return registry.getEndpointsByModule(module);
  });

  ipcMain.handle("api-platform:get-modules", async (event) => {
    validateSender(event);
    return registry.getModuleNames();
  });

  // ─── API Security & Keys ──────────────────────────────────────────────────
  ipcMain.handle("api-platform:get-keys", async (event) => {
    validateSender(event);
    return security.getAPIKeys();
  });

  ipcMain.handle("api-platform:generate-key", async (event, data) => {
    validateSender(event);
    return security.generateKey(data);
  });

  ipcMain.handle("api-platform:revoke-key", async (event, id) => {
    validateSender(event);
    return security.revokeKey(id);
  });

  ipcMain.handle("api-platform:get-audit-logs", async (event) => {
    validateSender(event);
    return security.getAuditLogs();
  });

  ipcMain.handle("api-platform:get-scopes", async (event) => {
    validateSender(event);
    return security.getAvailableScopes();
  });

  // ─── API Documentation & OpenAPI ─────────────────────────────────────────
  ipcMain.handle("api-platform:get-openapi-spec", async (event) => {
    validateSender(event);
    return docs.getOpenAPISpec();
  });

  ipcMain.handle("api-platform:get-sample-code", async (event, { endpointId, language }) => {
    validateSender(event);
    return docs.getSampleCode(endpointId, language);
  });

  ipcMain.handle("api-platform:get-sdk-info", async (event) => {
    validateSender(event);
    return docs.getSDKInfo();
  });

  // ─── Webhooks ─────────────────────────────────────────────────────────────
  ipcMain.handle("api-platform:get-webhooks", async (event) => {
    validateSender(event);
    return webhooks.getSubscriptions();
  });

  ipcMain.handle("api-platform:get-webhook-events", async (event) => {
    validateSender(event);
    return webhooks.getAvailableEvents();
  });

  ipcMain.handle("api-platform:register-webhook", async (event, data) => {
    validateSender(event);
    return webhooks.registerSubscription(data);
  });

  ipcMain.handle("api-platform:delete-webhook", async (event, id) => {
    validateSender(event);
    return webhooks.deleteSubscription(id);
  });

  ipcMain.handle("api-platform:simulate-webhook", async (event, { id, event: evtType }) => {
    validateSender(event);
    return webhooks.simulateDelivery(id, evtType);
  });

  ipcMain.handle("api-platform:get-webhook-logs", async (event) => {
    validateSender(event);
    return webhooks.getDeliveryLogs();
  });

  logger.info("IPC API Platform Handlers registered. ✅");
}

module.exports = { registerAPIPlatformIpcHandlers };
