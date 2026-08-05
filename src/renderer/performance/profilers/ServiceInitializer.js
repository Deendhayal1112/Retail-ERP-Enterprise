/**
 * ServiceInitializer.js
 * Retail ERP Enterprise — Service Initialization Duration Simulation
 */

"use strict";

export default class ServiceInitializer {
  constructor() {
    // Baseline init durations per service (ms)
    this.baselines = {
      "Database Service":      { ms: 185, jitter: 30 },
      "Authentication":        { ms: 95,  jitter: 20 },
      "Sync Service":          { ms: 210, jitter: 40 },
      "Notification Service":  { ms: 65,  jitter: 15 },
      "IPC Service":           { ms: 45,  jitter: 10 },
      "Configuration Service": { ms: 40,  jitter: 8  }
    };
  }

  collect() {
    return Object.entries(this.baselines).map(([name, cfg]) => {
      const jitter = Math.round((Math.random() - 0.5) * cfg.jitter);
      const initMs = Math.max(20, cfg.ms + jitter);
      const status = initMs > 400 ? "warning" : "ready";
      return { name, initMs, status };
    });
  }
}
