/**
 * CompanyRegistry.js
 * Retail ERP Enterprise — Multi-Company Registry Subsystem
 *
 * Manages company lists, metadata configs, and default settings.
 */

"use strict";

const logger = require("../../shared/logger/logger");

class CompanyRegistry {
  constructor() {
    this.companies = [
      {
        id: "comp-textiles-main",
        name: "ABC Textiles (HQ)",
        gstin: "27AAAAA1111A1Z1",
        address: "102, Connaught Place, New Delhi, Delhi, 110001",
        phone: "+91 11 2345 6789",
        currency: "INR (₹)",
        logo: "🏢",
        status: "active",
        isDefault: true
      },
      {
        id: "comp-textiles-south",
        name: "ABC Textiles South Division",
        gstin: "33BBBBB2222B2Z2",
        address: "45, Khader Nawaz Khan Road, Nungambakkam, Chennai, Tamil Nadu, 600006",
        phone: "+91 44 9876 5432",
        currency: "INR (₹)",
        logo: "🌴",
        status: "active",
        isDefault: false
      },
      {
        id: "comp-apparel-export",
        name: "ABC Global Apparel Exports",
        gstin: "29CCCCC3333C3Z3",
        address: "7th Block, Koramangala Industrial Area, Bangalore, Karnataka, 560095",
        phone: "+91 80 5555 1234",
        currency: "USD ($)",
        logo: "✈️",
        status: "inactive",
        isDefault: false
      }
    ];
  }

  /**
   * Retrieves all registered company entities.
   */
  getCompanies() {
    logger.debug("[CompanyRegistry] Querying list of registered companies.");
    return this.companies;
  }

  /**
   * Registers a new company profile.
   */
  registerCompany(data) {
    logger.info(`[CompanyRegistry] Simulating registration for: ${data.name}`);
    if (!data.name || !data.gstin) {
      throw new Error("Missing required company attributes (name or GSTIN).");
    }

    const id = `comp-${data.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
    const newCompany = {
      id,
      name: data.name,
      gstin: data.gstin,
      address: data.address || "Not Specified",
      phone: data.phone || "Not Specified",
      currency: data.currency || "INR (₹)",
      logo: data.logo || "🏢",
      status: "active",
      isDefault: false
    };

    this.companies.push(newCompany);
    return { success: true, company: newCompany };
  }

  /**
   * Updates settings of an existing company.
   */
  updateCompany(id, data) {
    logger.info(`[CompanyRegistry] Updating registry data for: ${id}`);
    const comp = this.companies.find(x => x.id === id);
    if (!comp) {
      throw new Error(`Company not found: ${id}`);
    }

    comp.name = data.name || comp.name;
    comp.gstin = data.gstin || comp.gstin;
    comp.address = data.address || comp.address;
    comp.phone = data.phone || comp.phone;
    comp.currency = data.currency || comp.currency;
    comp.logo = data.logo || comp.logo;

    return comp;
  }
}

module.exports = new CompanyRegistry();
