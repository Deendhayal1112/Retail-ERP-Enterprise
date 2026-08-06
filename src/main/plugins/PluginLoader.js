/**
 * PluginLoader.js
 * Retail ERP Enterprise — Mock Plugin Loader Subsystem
 *
 * Implements mock lifecycle states: Discovery, Validation, Initialization, Activation, Deactivation.
 */

"use strict";

const logger = require("../../shared/logger/logger");
const validator = require("./PluginManifestValidator");

class PluginLoader {
  constructor() {
    this.activeInstances = new Map();
  }

  /**
   * Discovers and registers a plugin manifest.
   * @param {Object} manifest Manifest JSON descriptor.
   */
  load(manifest) {
    logger.info(`[PluginLoader] Initiating discovery sequence for: ${manifest.id}`);

    // 1. Validation phase
    const validation = validator.validate(manifest);
    if (!validation.success) {
      logger.error(`[PluginLoader] Validation check failed: ${validation.error}`);
      return { success: false, error: validation.error };
    }

    // 2. Initialization & Activation phase
    logger.info(`[PluginLoader] Activating sandboxed isolation sandbox hooks for: ${manifest.name}`);
    this.activeInstances.set(manifest.id, {
      id: manifest.id,
      name: manifest.name,
      loadedAt: new Date(),
      status: "active"
    });

    return { success: true, message: `Plugin ${manifest.id} initialized and activated successfully.` };
  }

  /**
   * Deactivates and unloads a plugin.
   */
  unload(id) {
    logger.info(`[PluginLoader] Deactivating plugin instance: ${id}`);
    if (!this.activeInstances.has(id)) {
      logger.warn(`[PluginLoader] Plugin ${id} is not currently running.`);
      return { success: false, error: "Plugin is not active." };
    }

    this.activeInstances.delete(id);
    return { success: true, message: `Plugin ${id} successfully deactivated and cleaned up.` };
  }

  /**
   * Returns list of currently active plugin instances.
   */
  getActiveInstances() {
    return Array.from(this.activeInstances.values());
  }
}

module.exports = new PluginLoader();
