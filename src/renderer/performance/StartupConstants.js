/**
 * StartupConstants.js
 * Retail ERP Enterprise — Startup Performance Thresholds & Configuration
 */

"use strict";

export const StartupThresholds = {
  WARNING_SPLASH_DURATION_MS: 3000,      // Splash screen budget
  WARNING_FIRST_PAINT_MS: 1500,          // First paint budget
  WARNING_TOTAL_BOOT_MS: 5000,           // Total boot time budget
  WARNING_MODULE_LOAD_MS: 800,           // Individual module load cap
  WARNING_SERVICE_INIT_MS: 600,          // Individual service init cap
  WARNING_CRITICAL_PATH_MS: 4000,        // Critical path estimate limit
  WARNING_FAILED_MODULES: 1,            // Any failed module triggers alert
  WARNING_CACHE_HIT_PCT: 70             // Startup cache hit rate floor
};

export const StartupConfig = {
  TELEMETRY_INTERVAL_MS: 2000,
  HISTORY_LIMIT: 20,
  BOOT_STAGES: [
    "App Launch",
    "Main Process Ready",
    "Window Creation",
    "Renderer Ready",
    "First Paint",
    "UI Interactive"
  ],
  SERVICES: [
    "Database Service",
    "Authentication",
    "Sync Service",
    "Notification Service",
    "IPC Service",
    "Configuration Service"
  ]
};
