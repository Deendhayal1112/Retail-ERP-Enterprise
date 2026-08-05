/**
 * PerformanceManager.js
 * Retail ERP Enterprise — Performance Orchestrator
 */

"use strict";

import { Intervals, Thresholds } from "./PerformanceConstants.js";
import { PerformanceEvents } from "./PerformanceEvents.js";
import PerformanceLogger from "./PerformanceLogger.js";
import Metrics from "./Metrics.js";

import StartupProfiler from "./profilers/StartupProfiler.js";
import MemoryMonitor from "./profilers/MemoryMonitor.js";
import RendererProfiler from "./profilers/RendererProfiler.js";
import DatabaseProfiler from "./profilers/DatabaseProfiler.js";
import ServiceProfiler from "./profilers/ServiceProfiler.js";
import IPCProfiler from "./profilers/IPCProfiler.js";

class PerformanceManager {
  constructor() {
    this.logger = new PerformanceLogger();
    this.startupProfiler = new StartupProfiler();
    this.memoryMonitor = new MemoryMonitor();
    this.rendererProfiler = new RendererProfiler();
    this.databaseProfiler = new DatabaseProfiler();
    this.serviceProfiler = new ServiceProfiler();
    this.ipcProfiler = new IPCProfiler();
    
    this.intervalId = null;
    this.history = [];
  }

  start() {
    if (this.intervalId) return;

    // Run first collection immediately
    this.collect();

    this.intervalId = setInterval(() => {
      this.collect();
    }, Intervals.TELEMETRY_REFRESH_MS);
    
    console.log("[PerformanceManager] Active telemetry loop initialized.");
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  collect() {
    const sample = new Metrics();

    // Collect telemetry from mock sensors
    sample.startup = this.startupProfiler.collect();
    sample.memory = this.memoryMonitor.collect();
    sample.renderer = this.rendererProfiler.collect();
    sample.database = this.databaseProfiler.collect();
    sample.background = this.serviceProfiler.collect();
    sample.ipc = this.ipcProfiler.collect();

    // Check thresholds and log warnings
    this.checkThresholds(sample);

    // Save history
    this.history.push(sample);
    if (this.history.length > Intervals.CHART_HISTORY_LIMIT) {
      this.history.shift();
    }

    // Emit live events to active views
    PerformanceEvents.emit("metrics-updated", {
      current: sample,
      history: this.history,
      logs: this.logger.getLogs()
    });
  }

  checkThresholds(sample) {
    if (sample.renderer.fps < Thresholds.WARNING_FPS) {
      this.logger.logWarning("renderer", "Frame rate drop detected", `${sample.renderer.fps} FPS`);
    }
    if (sample.memory.heapUsageBytes > Thresholds.HEAVY_HEAP_BYTES) {
      const heapMb = (sample.memory.heapUsageBytes / (1024 * 1024)).toFixed(1);
      this.logger.logWarning("memory", "High heap usage warning limit", `${heapMb} MB`);
    }
    if (sample.database.avgQueryTimeMs > Thresholds.WARNING_QUERY_MS) {
      this.logger.logWarning("database", "Slow query warning response", `${sample.database.avgQueryTimeMs} ms`);
    }
    if (sample.ipc.avgResponseTimeMs > Thresholds.WARNING_IPC_MS) {
      this.logger.logWarning("ipc", "Slow IPC message response", `${sample.ipc.avgResponseTimeMs} ms`);
    }
  }

  getHistory() {
    return this.history;
  }

  getLogs() {
    return this.logger.getLogs();
  }
}

// Singleton instances
export const PerformanceCenterManager = new PerformanceManager();
