/**
 * DatabasePerformanceManager.js
 * Retail ERP Enterprise — Database Performance Subsystem Orchestrator
 */

"use strict";

import { DatabaseEvents } from "./DatabaseEvents.js";
import { DatabaseThresholds } from "./DatabaseConstants.js";
import DatabaseMetrics from "./DatabaseMetrics.js";

import QueryProfiler from "./profilers/QueryProfiler.js";
import DatabaseHealthMonitor from "./profilers/DatabaseHealthMonitor.js";
import IndexProfiler from "./profilers/IndexProfiler.js";
import CacheProfiler from "./profilers/CacheProfiler.js";
import StorageProfiler from "./profilers/StorageProfiler.js";

class DatabasePerformanceManager {
  constructor() {
    this.queryProfiler = new QueryProfiler();
    this.healthMonitor = new DatabaseHealthMonitor();
    this.indexProfiler = new IndexProfiler();
    this.cacheProfiler = new CacheProfiler();
    this.storageProfiler = new StorageProfiler();

    this.intervalId = null;
    this.history = [];
    this.alertLog = [];
  }

  start() {
    if (this.intervalId) return;
    this.collect();
    this.intervalId = setInterval(() => this.collect(), 2000);
    console.log("[DatabasePerformanceManager] Telemetry loop started.");
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  collect() {
    const sample = new DatabaseMetrics();

    sample.query = this.queryProfiler.collect();
    sample.health = this.healthMonitor.collect();
    sample.indexes = this.indexProfiler.collect();
    sample.cache = this.cacheProfiler.collect();
    sample.storage = this.storageProfiler.collect();

    // Threshold checks
    this.checkThresholds(sample);

    // Rolling history
    this.history.push(sample);
    if (this.history.length > 20) this.history.shift();

    DatabaseEvents.emit("db-metrics-updated", {
      current: sample,
      history: this.history,
      alerts: this.alertLog
    });
  }

  checkThresholds(sample) {
    const ts = new Date().toLocaleTimeString();

    if (sample.query.avgQueryTimeMs > DatabaseThresholds.WARNING_QUERY_MS) {
      this.logAlert(ts, "query", "Slow query detected", `${sample.query.avgQueryTimeMs} ms`);
    }
    if (sample.health.walSizeBytes > DatabaseThresholds.WARNING_WAL_SIZE_BYTES) {
      const walMb = (sample.health.walSizeBytes / (1024 * 1024)).toFixed(1);
      this.logAlert(ts, "wal", "WAL file size exceeded limit", `${walMb} MB`);
    }
    if (sample.health.fragmentationPct > DatabaseThresholds.WARNING_FRAGMENTATION_PCT) {
      this.logAlert(ts, "vacuum", "High fragmentation — VACUUM recommended", `${sample.health.fragmentationPct}%`);
    }
    if (sample.cache.cacheHitRatePct < DatabaseThresholds.WARNING_CACHE_HIT_PCT) {
      this.logAlert(ts, "cache", "Cache hit rate degraded", `${sample.cache.cacheHitRatePct}%`);
    }
  }

  logAlert(timestamp, category, message, value) {
    this.alertLog.unshift({ timestamp, category, message, value });
    if (this.alertLog.length > 50) this.alertLog.pop();
  }

  getHistory() {
    return this.history;
  }

  getAlerts() {
    return this.alertLog;
  }
}

export const DatabasePerfManagerInstance = new DatabasePerformanceManager();
