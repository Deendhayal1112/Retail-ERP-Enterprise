/**
 * MemoryManager.js
 * Retail ERP Enterprise — Memory Management Subsystem Orchestrator
 */

"use strict";

import { MemoryEvents } from "./MemoryEvents.js";
import { MemoryThresholds, MemoryConfig } from "./MemoryConstants.js";
import MemoryMetrics from "./MemoryMetrics.js";

import MemoryMonitor from "./profilers/MemoryMonitor.js";
import CacheManager from "./profilers/CacheManager.js";
import ResourceManager from "./profilers/ResourceManager.js";
import LeakDetector from "./profilers/LeakDetector.js";
import CleanupScheduler from "./profilers/CleanupScheduler.js";

class MemoryManager {
  constructor() {
    this.memoryMonitor = new MemoryMonitor();
    this.cacheManager = new CacheManager();
    this.resourceManager = new ResourceManager();
    this.leakDetector = new LeakDetector();
    this.cleanupScheduler = new CleanupScheduler();

    this.intervalId = null;
    this.history = [];
    this.alertLog = [];
  }

  start() {
    if (this.intervalId) return;
    this.collect();
    this.intervalId = setInterval(() => this.collect(), MemoryConfig.TELEMETRY_INTERVAL_MS);
    console.log("[MemoryManager] Memory telemetry loop started.");
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  collect() {
    const sample = new MemoryMetrics();

    sample.memory = this.memoryMonitor.collect();
    sample.cache = this.cacheManager.collect();
    sample.resources = this.resourceManager.collect();
    sample.objects = this.leakDetector.collect();

    this.checkThresholds(sample);

    this.history.push(sample);
    if (this.history.length > MemoryConfig.HISTORY_LIMIT) this.history.shift();

    MemoryEvents.emit("memory-metrics-updated", {
      current: sample,
      history: this.history,
      alerts: this.alertLog,
      cleanup: this.cleanupScheduler.getStatus()
    });
  }

  checkThresholds(sample) {
    const ts = new Date().toLocaleTimeString();
    const m = sample.memory;
    const r = sample.resources;
    const o = sample.objects;

    if (m.heapUsageBytes > MemoryThresholds.WARNING_HEAP_BYTES) {
      const mb = (m.heapUsageBytes / (1024 * 1024)).toFixed(1);
      this.logAlert(ts, "heap", "Heap usage exceeded warning limit", `${mb} MB`);
    }
    if (m.ramUsageBytes > MemoryThresholds.WARNING_RAM_BYTES) {
      const mb = (m.ramUsageBytes / (1024 * 1024)).toFixed(1);
      this.logAlert(ts, "ram", "High RAM consumption detected", `${mb} MB`);
    }
    if (m.growthRateMbPerMin > MemoryThresholds.WARNING_GROWTH_RATE) {
      this.logAlert(ts, "leak", "Memory growth rate exceeds limit", `${m.growthRateMbPerMin} MB/min`);
    }
    if (o.retainedObjectsCount > MemoryThresholds.WARNING_LEAK_RETAINED) {
      this.logAlert(ts, "gc", "High retained object count", `${o.retainedObjectsCount}`);
    }
    if (r.eventListenersCount > MemoryThresholds.WARNING_LISTENERS) {
      this.logAlert(ts, "resource", "Event listener count above threshold", `${r.eventListenersCount}`);
    }
  }

  logAlert(timestamp, category, message, value) {
    this.alertLog.unshift({ timestamp, category, message, value });
    if (this.alertLog.length > 50) this.alertLog.pop();
  }

  triggerCleanup(label) {
    this.cleanupScheduler.scheduleCleanup(label);
  }

  getHistory() { return this.history; }
  getAlerts() { return this.alertLog; }
}

export const MemoryManagerInstance = new MemoryManager();
