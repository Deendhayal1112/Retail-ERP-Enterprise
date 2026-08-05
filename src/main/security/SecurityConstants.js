/**
 * SecurityConstants.js
 * Retail ERP Enterprise — Security & Compliance Constants
 */

"use strict";

const SecurityConstants = {
  Severity: {
    CRITICAL: "CRITICAL",
    MEDIUM: "MEDIUM",
    LOW: "LOW",
    INFO: "INFO"
  },
  
  ScanType: {
    DEPENDENCY: "Dependency Audit",
    VULNERABILITY: "Vulnerability Scan",
    STATIC_CODE: "Static Code Analysis",
    SECRETS: "Secret Detection",
    CONFIG: "Configuration Review",
    SUPPLY_CHAIN: "Supply Chain Review"
  },

  ComplianceStandard: {
    OWASP: "OWASP Desktop Checklist",
    PRIVACY: "Privacy Review",
    LICENSE: "License Compliance",
    POLICY: "Security Policy Review"
  }
};

module.exports = SecurityConstants;
