/**
 * PluginPermissionManager.js
 * Retail ERP Enterprise — Plugin Permissions Subsystem
 *
 * Enforces fine-grained capability checks on system permissions.
 * Binds keys for DB, Local Files, IPC routing, and UI modifications.
 */

"use strict";

const logger = require("../../shared/logger/logger");

class PluginPermissionManager {
  constructor() {
    // List of all supported security scopes
    this.availableScopes = [
      { key: "database:read", label: "Database Read Access", description: "Allow plugin to query local SQLite database tables." },
      { key: "database:write", label: "Database Write Access", description: "Allow plugin to insert, update, or delete database rows." },
      { key: "filesystem:write", label: "Filesystem Export Access", description: "Allow plugin to export spreadsheets or PDF receipts to disk." },
      { key: "network:outgoing", label: "Outgoing API Requests", description: "Allow plugin to contact external business webhooks or APIs." },
      { key: "ui:extension", label: "UI Layout Modifications", description: "Allow plugin to append tabs, navigation links, or dashboards." }
    ];
  }

  /**
   * Returns list of all system scopes.
   */
  getScopes() {
    logger.debug("[PluginPermissionManager] Fetching security scopes directory.");
    return this.availableScopes;
  }

  /**
   * Verifies if a plugin holds a specific capability target.
   * @param {Object} plugin Plugin metadata record.
   * @param {string} permission The scope key to check.
   */
  verify(plugin, permission) {
    if (!plugin) return false;
    if (plugin.status !== "active") {
      logger.warn(`Permission request denied. Plugin ${plugin.id} is currently disabled.`);
      return false;
    }
    const hasPermission = plugin.permissions && plugin.permissions.includes(permission);
    logger.debug(`[PermissionCheck] Plugin: ${plugin.id} | Request: ${permission} | Allowed: ${hasPermission}`);
    return hasPermission;
  }
}

module.exports = new PluginPermissionManager();
