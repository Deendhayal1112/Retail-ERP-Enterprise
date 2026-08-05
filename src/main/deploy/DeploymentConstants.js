/**
 * DeploymentConstants.js
 * Retail ERP Enterprise — Deployment & Environments Constants
 */

"use strict";

const EnvTypes = {
  DEVELOPMENT: "Development",
  TESTING: "Testing",
  STAGING: "Staging",
  PRODUCTION: "Production"
};

const OperationsStatuses = {
  HEALTHY: "Healthy",
  WARNING: "Warning",
  CRITICAL: "Critical",
  MAINTENANCE: "Maintenance Mode"
};

module.exports = {
  EnvTypes,
  OperationsStatuses
};
