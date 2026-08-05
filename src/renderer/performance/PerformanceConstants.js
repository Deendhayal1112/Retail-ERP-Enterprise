/**
 * PerformanceConstants.js
 * Retail ERP Enterprise — Performance Subsystem Constants
 */

"use strict";

export const Thresholds = {
  WARNING_FPS: 55, // Alert if drops below 55 FPS
  WARNING_CPU: 80, // Alert if exceeds 80% CPU
  WARNING_RAM: 85, // Alert if RAM exceeds 85% allotment
  WARNING_QUERY_MS: 100, // Alert if SQLite queries take more than 100ms
  WARNING_IPC_MS: 50, // Alert if IPC message takes more than 50ms
  HEAVY_HEAP_BYTES: 150 * 1024 * 1024 // 150MB heap alert
};

export const Intervals = {
  TELEMETRY_REFRESH_MS: 2000, // Query metrics every 2 seconds
  CHART_HISTORY_LIMIT: 20 // Keep 20 data points
};
