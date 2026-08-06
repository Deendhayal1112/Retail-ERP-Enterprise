/**
 * APIManager.js
 * Retail ERP Enterprise — Enterprise API Platform Central Coordinator
 *
 * Bootstraps all API platform sub-managers and exposes a unified
 * diagnostics summary. Architecture only — no HTTP server is started.
 */

"use strict";

const logger = require("../../shared/logger/logger");
const registry = require("./APIRegistry");
const security = require("./APISecurityManager");
const documentation = require("./APIDocumentationManager");
const webhooks = require("./WebhookManager");

class APIManager {
  constructor() {
    this.isInitialized = false;
  }

  /**
   * Initializes the Enterprise API Platform subsystem.
   */
  initialize() {
    if (this.isInitialized) return;
    logger.info("Initializing Enterprise API Platform Subsystem...");

    const endpointCount = registry.getEndpoints().length;
    const keyCount = security.getAPIKeys().length;
    const webhookCount = webhooks.getSubscriptions().length;

    logger.info(`  ├─ Registered API Endpoints: ${endpointCount}`);
    logger.info(`  ├─ Active API Keys:           ${keyCount}`);
    logger.info(`  └─ Webhook Subscriptions:     ${webhookCount}`);

    this.isInitialized = true;
    logger.info("Enterprise API Platform Subsystem initialized successfully. ✅");
  }

  /**
   * Returns a consolidated diagnostics dashboard summary.
   */
  getDiagnosticsSummary() {
    const endpoints = registry.getEndpoints();
    const keys = security.getAPIKeys();
    const webhookSubs = webhooks.getSubscriptions();
    const modules = registry.getModuleNames();

    return {
      status: "operational",
      version: "v1",
      totalEndpoints: endpoints.length,
      totalModules: modules.length,
      modules,
      activeAPIKeys: keys.filter(k => k.status === "active").length,
      revokedAPIKeys: keys.filter(k => k.status === "revoked").length,
      activeWebhooks: webhookSubs.filter(w => w.status === "active").length,
      totalWebhookDeliveries: webhookSubs.reduce((sum, w) => sum + w.deliveredCount, 0),
      endpointsByMethod: {
        GET: endpoints.filter(ep => ep.method === "GET").length,
        POST: endpoints.filter(ep => ep.method === "POST").length,
        PUT: endpoints.filter(ep => ep.method === "PUT").length,
        DELETE: endpoints.filter(ep => ep.method === "DELETE").length
      }
    };
  }
}

module.exports = new APIManager();
