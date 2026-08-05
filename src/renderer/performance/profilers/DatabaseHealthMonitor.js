/**
 * DatabaseHealthMonitor.js
 * Retail ERP Enterprise — Database Health Telemetry Simulation
 */

"use strict";

export default class DatabaseHealthMonitor {
  collect() {
    const dbBase = 5.4 * 1024 * 1024;
    const walBase = 2 * 1024 * 1024;

    return {
      dbSizeBytes: dbBase + Math.round((Math.random() - 0.5) * 4096),
      walSizeBytes: walBase + Math.round(Math.random() * 64 * 1024),
      pageCount: 1350 + Math.round((Math.random() - 0.5) * 10),
      freePagesCount: 120 + Math.round((Math.random() - 0.5) * 8),
      fragmentationPct: parseFloat((3.8 + Math.random() * 0.8).toFixed(1)),
      vacuumStatus: "Clean"
    };
  }
}
