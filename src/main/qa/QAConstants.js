/**
 * QAConstants.js
 * Retail ERP Enterprise — Quality Assurance & Testing Constants
 */

"use strict";

const TestTypes = {
  UNIT: "Unit Testing",
  INTEGRATION: "Integration Testing",
  REGRESSION: "Regression Testing",
  PERFORMANCE: "Performance Testing",
  ACCESSIBILITY: "Accessibility Testing",
  SECURITY: "Security Validation"
};

const DefectPriorities = {
  CRITICAL: "Critical",
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low"
};

module.exports = {
  TestTypes,
  DefectPriorities
};
