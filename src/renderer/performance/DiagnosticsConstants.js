/**
 * DiagnosticsConstants.js
 * Retail ERP Enterprise — Health Warning Limits & Config
 */

"use strict";

export const DiagnosticsThresholds = {
  WARNING_CPU_PCT: 75,
  WARNING_MEM_PCT: 80,
  WARNING_DISK_PCT: 90,
  WARNING_SLOW_OPS: 5,
  WARNING_CRASHES: 1,
  CRITICAL_HEALTH_SCORE: 60,
  WARNING_HEALTH_SCORE: 80
};

export const DiagnosticsConfig = {
  TELEMETRY_INTERVAL_MS: 2000,
  HISTORY_LIMIT: 20
};
