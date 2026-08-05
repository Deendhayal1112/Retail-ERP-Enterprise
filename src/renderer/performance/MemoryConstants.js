/**
 * MemoryConstants.js
 * Retail ERP Enterprise — Memory Management Thresholds & Configuration
 */

"use strict";

export const MemoryThresholds = {
  WARNING_HEAP_BYTES: 150 * 1024 * 1024,    // 150 MB heap alert
  WARNING_RAM_BYTES: 350 * 1024 * 1024,     // 350 MB RAM alert
  WARNING_PEAK_BYTES: 400 * 1024 * 1024,    // 400 MB peak alert
  WARNING_GROWTH_RATE: 5,                   // MB/min growth alert
  WARNING_LEAK_RETAINED: 500,               // Retained object count alert
  WARNING_LISTENERS: 200,                   // Event listener count alert
  WARNING_TIMERS: 50                        // Active timer count alert
};

export const MemoryConfig = {
  TELEMETRY_INTERVAL_MS: 2000,             // Poll every 2 seconds
  HISTORY_LIMIT: 20,                       // Keep 20 historical samples
  CLEANUP_INTERVAL_MS: 30000,              // Cleanup scheduler every 30s
  CACHE_LAYER_NAMES: ["ui", "database", "image", "api"]
};
