/**
 * SecurityEvents.js
 * Retail ERP Enterprise — Security Events Definitions
 */

"use strict";

const EventEmitter = require("events");

class SecurityEventEmitter extends EventEmitter {}
const securityEvents = new SecurityEventEmitter();

const SecurityEvents = {
  events: securityEvents,
  Types: {
    SCAN_STARTED: "security:scan-started",
    SCAN_PROGRESS: "security:scan-progress",
    SCAN_COMPLETED: "security:scan-completed",
    FINDING_DETECTED: "security:finding-detected",
    COMPLIANCE_UPDATED: "security:compliance-updated",
    AUDIT_LOG_ADDED: "security:audit-log-added"
  }
};

module.exports = SecurityEvents;
