/**
 * CompanyPermissionManager.js
 * Retail ERP Enterprise — Multi-Company Permissions Matrix Manager
 *
 * Implements access controls mapping across isolated companies.
 */

"use strict";

const logger = require("../../shared/logger/logger");

class CompanyPermissionManager {
  constructor() {
    this.matrix = {
      "comp-textiles-main": {
        admin: ["database:read", "database:write", "settings:write", "users:manage", "reports:export"],
        manager: ["database:read", "database:write", "reports:export"],
        employee: ["database:read", "pos:checkout"]
      },
      "comp-textiles-south": {
        admin: ["database:read", "database:write", "settings:write", "users:manage", "reports:export"],
        manager: ["database:read", "database:write"],
        employee: ["database:read", "pos:checkout"]
      }
    };
  }

  /**
   * Retrieves access matrix directory.
   */
  getMatrix(id) {
    logger.debug(`[CompanyPermissionManager] Fetching access matrix for: ${id}`);
    if (!this.matrix[id]) {
      this.matrix[id] = {
        admin: ["database:read", "database:write", "reports:export"],
        manager: ["database:read"],
        employee: ["database:read"]
      };
    }
    return this.matrix[id];
  }

  /**
   * Updates capability list for a role.
   */
  updateRolePermissions(companyId, role, permissions) {
    logger.info(`[CompanyPermissionManager] Updating permission scopes for role: ${role} in ${companyId}`);
    const companyMatrix = this.getMatrix(companyId);
    companyMatrix[role] = permissions;
    return companyMatrix;
  }
}

module.exports = new CompanyPermissionManager();
