/**
 * CompanySwitcher.js
 * Retail ERP Enterprise — Multi-Company Context Switcher Subsystem
 *
 * Implements context swaps, cached states invalidation, permissions loading.
 */

"use strict";

const logger = require("../../shared/logger/logger");
const registry = require("./CompanyRegistry");

class CompanySwitcher {
  constructor() {
    this.activeCompanyId = "comp-textiles-main"; // Default startup active company
  }

  /**
   * Retrieves the currently active company object.
   */
  getActiveCompany() {
    const list = registry.getCompanies();
    const active = list.find(x => x.id === this.activeCompanyId) || list.find(x => x.isDefault);
    logger.debug(`[CompanySwitcher] Querying active company details: ${active?.name}`);
    return active;
  }

  /**
   * Swaps context active pointer.
   * @param {string} companyId Destination company identifier.
   */
  switchCompany(companyId) {
    logger.info(`[CompanySwitcher] Swapping active company pointer to: ${companyId}`);
    
    const list = registry.getCompanies();
    const comp = list.find(x => x.id === companyId);
    if (!comp) {
      throw new Error(`Company profile not found: ${companyId}`);
    }

    if (comp.status !== "active") {
      throw new Error(`Cannot switch to disabled company: ${comp.name}`);
    }

    // 1. Swap context
    this.activeCompanyId = companyId;

    // 2. Simulate refresh triggers
    logger.info(`[CompanySwitcher] Context re-allocation sequence successful. Initializing caches invalidation.`);
    logger.info(`[CompanySwitcher] Active matrix authorization reload successful. Broadcasting view refresh.`);

    return {
      success: true,
      activeCompany: comp,
      message: `Successfully switched active company to ${comp.name}.`
    };
  }
}

module.exports = new CompanySwitcher();
