"use strict";

/**
 * license.config.js
 * Retail ERP Enterprise — License Configuration
 *
 * Configuration for the software license management system.
 * v0.1.0 operates in offline evaluation mode.
 * Full license enforcement will be implemented in a future phase.
 *
 * Phase 1 — Step 4: Application Configuration Integration
 */

require("./secrets");

const licenseConfig = {
  // ─────────────────────────────────────────────
  // APPLICATION IDENTITY
  // ─────────────────────────────────────────────
  app: {
    name: "Retail ERP Enterprise",
    version: process.env.APP_VERSION || "0.2.0",
    publisher: "Retail ERP Enterprise Team",
    website: "https://retailerp.com",
    supportEmail: "support@retailerp.com",
  },

  // ─────────────────────────────────────────────
  // LICENSE TYPES
  // ─────────────────────────────────────────────
  types: {
    EVALUATION: "evaluation",
    SINGLE: "single",
    MULTI: "multi",
    ENTERPRISE: "enterprise",
  },

  // ─────────────────────────────────────────────
  // CURRENT LICENSE (v0.1.0 — Evaluation Mode)
  // ─────────────────────────────────────────────
  current: {
    type: "evaluation",
    maxUsers: 1,
    maxStores: 1,
    // Evaluation expires 90 days after first launch
    trialDays: 90,
    // Features enabled in v0.1.0
    features: {
      login: true,
      dashboard: false,
      inventory: false,
      pos: false,
      reports: false,
      customers: false,
      employees: false,
    },
  },

  // ─────────────────────────────────────────────
  // LICENSE STORAGE
  // ─────────────────────────────────────────────
  storage: {
    // electron-store key for persisting license data
    storeKey: "license",
    // Key used to validate license integrity
    signatureKey: process.env.LICENSE_SECRET || null,
  },

  // ─────────────────────────────────────────────
  // VALIDATION RULES
  // ─────────────────────────────────────────────
  validation: {
    // Check license on every app launch
    checkOnStartup: true,
    // Grace period after expiry (days) before enforcing
    gracePeriodDays: 3,
  },

  // ─────────────────────────────────────────────
  // MESSAGES (displayed to the user)
  // ─────────────────────────────────────────────
  messages: {
    evaluation: "You are running Retail ERP Enterprise in evaluation mode.",
    expiringSoon: "Your evaluation license expires in {days} days.",
    expired: "Your evaluation license has expired. Please contact support.",
    invalid: "Invalid license. Please contact support@retailerp.com.",
  },
};

module.exports = licenseConfig;
