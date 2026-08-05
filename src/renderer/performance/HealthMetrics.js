/**
 * HealthMetrics.js
 * Retail ERP Enterprise — Overall System Diagnostics Schema Model
 */

"use strict";

export default class HealthMetrics {
  constructor() {
    this.timestamp = Date.now();
    this.healthScore = 98; // Calculated overall score out of 100

    this.system = {
      cpuUsagePct: 14.5,
      memoryUsagePct: 42.1,
      diskUsagePct: 56.4,
      networkStatus: "Connected",
      gpuUsagePct: 3.2,
      batteryStatus: "AC Power"
    };

    this.application = {
      rendererStatus: "Optimal",
      mainProcessStatus: "Optimal",
      databaseStatus: "Normal",
      ipcStatus: "Healthy",
      backgroundServices: "All Up",
      syncStatus: "Synced"
    };

    this.diagnostics = {
      errorCount: 0,
      warningCount: 0,
      crashReportsCount: 0,
      slowOperationsCount: 0,
      performanceAlertsCount: 0
    };

    this.logs = []; // Contains rolling system log entries
    this.recommendations = []; // Dynamically calculated warnings list
  }
}
