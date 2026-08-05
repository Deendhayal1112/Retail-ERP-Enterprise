/**
 * StartupProfiler.js
 * Retail ERP Enterprise — Startup Metrics Simulation
 */

"use strict";

export default class StartupProfiler {
  collect() {
    return {
      startupTimeMs: 1240,
      splashDurationMs: 1500,
      moduleLoadTimeMs: 420,
      dependencyLoadTimeMs: 310,
      serviceInitTimeMs: 510
    };
  }
}
