/**
 * TaskStates.js
 * Retail ERP Enterprise — Standardized Task Lifecycle States
 */

"use strict";

const TaskStates = {
  QUEUED: "QUEUED",
  STARTING: "STARTING",
  RUNNING: "RUNNING",
  PAUSED: "PAUSED",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED",
  RETRYING: "RETRYING"
};

module.exports = TaskStates;
