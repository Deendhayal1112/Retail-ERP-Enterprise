/**
 * PluginManifestValidator.js
 * Retail ERP Enterprise — Plugin Manifest Validator
 *
 * Validates manifest templates structures before mock load registration.
 */

"use strict";

const logger = require("../../shared/logger/logger");

class PluginManifestValidator {
  /**
   * Performs schema checks.
   * @param {Object} manifest Manifest JSON data block.
   */
  validate(manifest) {
    logger.debug("[PluginManifestValidator] Starting verification check...");
    
    if (!manifest || typeof manifest !== "object") {
      return { success: false, error: "Manifest is not a valid JSON object." };
    }

    const requiredFields = ["id", "name", "version", "entryPoint"];
    for (const f of requiredFields) {
      if (!manifest[f] || typeof manifest[f] !== "string") {
        return { success: false, error: `Missing or invalid required field: "${f}" (must be string).` };
      }
    }

    // Verify format compatibility string
    if (manifest.compatibility && typeof manifest.compatibility !== "string") {
      return { success: false, error: "Optional field 'compatibility' must be a valid string selector (e.g. >=0.2.0)." };
    }

    // Verify permissions list
    if (manifest.permissions && !Array.isArray(manifest.permissions)) {
      return { success: false, error: "Optional field 'permissions' must be a list array of scopes." };
    }

    logger.info(`[PluginManifestValidator] Manifest ${manifest.id} validated successfully. ✅`);
    return { success: true };
  }
}

module.exports = new PluginManifestValidator();
