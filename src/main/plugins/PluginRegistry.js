/**
 * PluginRegistry.js
 * Retail ERP Enterprise — Plugin Registry Subsystem
 *
 * Manages the metadata repository of installed and available plugins.
 * Preserves activation state, versions compatibility, and dependency scopes.
 */

"use strict";

const logger = require("../../shared/logger/logger");

class PluginRegistry {
  constructor() {
    // Curated default mock plugins repository database
    this.installedPlugins = [
      {
        id: "plugin-loyalty-tier",
        name: "Customer Loyalty Booster",
        version: "1.2.0",
        description: "Enables advanced customer loyalty tier programs, tier based rewards points, and promotional SMS triggers.",
        author: "Enterprise Solutions Group",
        status: "active",
        dependencies: ["pos-core"],
        compatibility: ">=0.2.0",
        permissions: ["database:read", "database:write", "ui:extension"]
      },
      {
        id: "plugin-whatsapp-alerts",
        name: "WhatsApp Automated Alerts",
        version: "2.0.4",
        description: "Replaces traditional SMS templates with rich WhatsApp Business API transaction notifications.",
        author: "Communications Ltd",
        status: "inactive",
        dependencies: ["notification-service"],
        compatibility: ">=0.2.0",
        permissions: ["network:outgoing", "database:read"]
      },
      {
        id: "plugin-audit-export",
        name: "GST Audit Report Exporter",
        version: "1.0.1",
        description: "Generates governmental compliant GSTR-1, GSTR-3B Excel sheets and directly exports them to disk.",
        author: "Taxation Systems Ltd",
        status: "active",
        dependencies: ["reports-core"],
        compatibility: ">=0.1.5",
        permissions: ["filesystem:write", "database:read"]
      }
    ];

    this.availablePlugins = [
      {
        id: "plugin-custom-barcode",
        name: "Thermal Barcode Labels Customizer",
        version: "1.5.0",
        description: "Enables interactive WYSIWYG thermal label template builder with direct system printer integration.",
        author: "Hardware Integration Team",
        compatibility: ">=0.2.0",
        rating: "4.8",
        installs: "3.2k"
      },
      {
        id: "plugin-gemini-insights",
        name: "Gemini Stock Out Predictor",
        version: "3.1.0",
        description: "Leverages Gemini cognitive LLM models to analyze recent activity and highlight upcoming stock out indicators.",
        author: "AI Core Team",
        compatibility: ">=0.2.0",
        rating: "4.9",
        installs: "8.4k"
      },
      {
        id: "plugin-stripe-reader",
        name: "Stripe Card Reader Bridge",
        version: "1.1.2",
        description: "Connects local desktop application shell to external Stripe smart terminals over local network IP addresses.",
        author: "Payment Services Inc",
        compatibility: ">=0.2.0",
        rating: "4.7",
        installs: "1.9k"
      }
    ];
  }

  /**
   * Retrieves all currently installed plugins metadata.
   */
  getInstalled() {
    logger.debug("[PluginRegistry] Fetching all installed plugins.");
    return this.installedPlugins;
  }

  /**
   * Retrieves the directory of available plugins in store.
   */
  getAvailable() {
    logger.debug("[PluginRegistry] Fetching store directory available plugins.");
    return this.availablePlugins;
  }

  /**
   * Installs an available plugin (simulated change in state).
   */
  installPlugin(id) {
    logger.info(`[PluginRegistry] Simulating download and registration for: ${id}`);
    const available = this.availablePlugins.find(x => x.id === id);
    if (!available) {
      throw new Error(`Plugin not found in registry: ${id}`);
    }

    // Check if already installed
    if (this.installedPlugins.some(x => x.id === id)) {
      return { success: true, message: "Plugin already installed." };
    }

    const newInstalled = {
      ...available,
      status: "inactive", // Starts disabled
      dependencies: [],
      permissions: ["database:read", "ui:extension"] // Defaults
    };

    this.installedPlugins.push(newInstalled);
    return { success: true, plugin: newInstalled };
  }

  /**
   * Updates state toggle activation.
   */
  toggleStatus(id, active) {
    logger.info(`[PluginRegistry] Toggling activation state for: ${id} to ${active}`);
    const p = this.installedPlugins.find(x => x.id === id);
    if (!p) {
      throw new Error(`Plugin not found in installed registry: ${id}`);
    }
    p.status = active ? "active" : "inactive";
    return p;
  }

  /**
   * Updates permissions list.
   */
  updatePermissions(id, permissions) {
    logger.info(`[PluginRegistry] Updating capability permissions for: ${id}`);
    const p = this.installedPlugins.find(x => x.id === id);
    if (!p) {
      throw new Error(`Plugin not found: ${id}`);
    }
    p.permissions = permissions;
    return p;
  }
}

module.exports = new PluginRegistry();
