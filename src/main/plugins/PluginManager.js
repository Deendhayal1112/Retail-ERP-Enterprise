/**
 * PluginManager.js
 * Retail ERP Enterprise — Central Plugin Manager Subsystem Coordinator
 *
 * Exposes core APIs to initialize the framework and query logs/states.
 */

"use strict";

const logger = require("../../shared/logger/logger");
const registry = require("./PluginRegistry");
const loader = require("./PluginLoader");
const permissions = require("./PluginPermissionManager");

class PluginManager {
  constructor() {
    this.isInitialized = false;
  }

  /**
   * Bootstraps the Plugin Subsystem.
   */
  initialize() {
    if (this.isInitialized) return;
    
    logger.info("Initializing Enterprise Plugin Framework Subsystem...");
    
    // Discover and load active plugins on startup
    const installed = registry.getInstalled();
    installed.forEach(p => {
      if (p.status === "active") {
        loader.load({
          id: p.id,
          name: p.name,
          version: p.version,
          entryPoint: `${p.id}.js`,
          compatibility: p.compatibility,
          permissions: p.permissions
        });
      }
    });

    this.isInitialized = true;
    logger.info("Enterprise Plugin Framework successfully initialized. ✅");
  }

  /**
   * Triggers install simulation.
   */
  install(id) {
    try {
      const res = registry.installPlugin(id);
      return res;
    } catch (err) {
      logger.error(`[PluginManager] Installation error: ${err.message}`);
      return { success: false, error: err.message };
    }
  }

  /**
   * Toggles status activation.
   */
  togglePlugin(id, active) {
    try {
      const p = registry.toggleStatus(id, active);
      if (active) {
        loader.load({
          id: p.id,
          name: p.name,
          version: p.version,
          entryPoint: `${p.id}.js`,
          compatibility: p.compatibility,
          permissions: p.permissions
        });
      } else {
        loader.unload(id);
      }
      return { success: true, plugin: p };
    } catch (err) {
      logger.error(`[PluginManager] Status toggle error: ${err.message}`);
      return { success: false, error: err.message };
    }
  }

  /**
   * Updates capability list.
   */
  updatePermissions(id, list) {
    try {
      const p = registry.updatePermissions(id, list);
      return { success: true, plugin: p };
    } catch (err) {
      logger.error(`[PluginManager] Permissions update error: ${err.message}`);
      return { success: false, error: err.message };
    }
  }

  /**
   * Compiles the dashboard statistics report.
   */
  getDiagnosticsReport() {
    const installed = registry.getInstalled();
    const active = loader.getActiveInstances();
    const scopes = permissions.getScopes();

    return {
      totalInstalledCount: installed.length,
      activeCount: active.length,
      inactiveCount: installed.length - active.length,
      availableCount: registry.getAvailable().length,
      permissionsList: scopes
    };
  }
}

module.exports = new PluginManager();
