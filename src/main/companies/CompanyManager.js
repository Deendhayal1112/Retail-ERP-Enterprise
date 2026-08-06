/**
 * CompanyManager.js
 * Retail ERP Enterprise — Central Company Manager Coordinator
 *
 * Coordinates registries, context settings, and telemetry dashboards.
 */

"use strict";

const logger = require("../../shared/logger/logger");
const registry = require("./CompanyRegistry");
const switcher = require("./CompanySwitcher");
const contexts = require("./CompanyContextManager");
const permissions = require("./CompanyPermissionManager");

class CompanyManager {
  constructor() {
    this.isInitialized = false;
  }

  /**
   * Initializes multi-company parameters.
   */
  initialize() {
    if (this.isInitialized) return;
    logger.info("Initializing Enterprise Multi-Company Architecture Subsystem...");
    this.isInitialized = true;
    logger.info("Multi-Company Subsystem successfully initialized. ✅");
  }

  /**
   * Queries summary report.
   */
  getDiagnosticsSummary() {
    const list = registry.getCompanies();
    const activeComp = switcher.getActiveCompany();
    const activeContext = contexts.getContext(activeComp.id);

    return {
      activeCompanyId: activeComp.id,
      totalCompanyCount: list.length,
      activeContext,
      matrixList: permissions.getMatrix(activeComp.id)
    };
  }
}

module.exports = new CompanyManager();
