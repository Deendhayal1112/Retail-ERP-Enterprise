/**
 * StorageProfiler.js
 * Retail ERP Enterprise — Disk Storage & Backup Size Simulation
 */

"use strict";

export default class StorageProfiler {
  collect() {
    return {
      diskUsageBytes: 420 * 1024 * 1024 + Math.round((Math.random() - 0.5) * 64 * 1024),
      backupSizeBytes: 5.2 * 1024 * 1024 + Math.round(Math.random() * 1024),
      growthRateMbPerMonth: parseFloat((0.7 + Math.random() * 0.2).toFixed(2)),
      storageAlertsCount: 0
    };
  }
}
