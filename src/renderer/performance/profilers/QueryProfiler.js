/**
 * QueryProfiler.js
 * Retail ERP Enterprise — Query Performance Telemetry Simulation
 */

"use strict";

export default class QueryProfiler {
  constructor() {
    this.failedCount = 0;
    this.slowCount = 0;
  }

  collect() {
    const avgMs = parseFloat((6.5 + Math.random() * 4).toFixed(2));
    const maxMs = parseFloat((avgMs + 10 + Math.random() * 20).toFixed(2));
    const isSlow = Math.random() > 0.96;
    if (isSlow) this.slowCount++;

    return {
      avgQueryTimeMs: avgMs,
      maxQueryTimeMs: maxMs,
      slowQueriesCount: this.slowCount,
      failedQueriesCount: this.failedCount,
      transactionDurationMs: parseFloat((12 + Math.random() * 6).toFixed(2)),
      queryQueueLength: Math.random() > 0.9 ? 1 : 0
    };
  }
}
