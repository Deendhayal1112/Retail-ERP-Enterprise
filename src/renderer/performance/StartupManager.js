/**
 * StartupManager.js
 * Retail ERP Enterprise — Startup Performance Subsystem Orchestrator
 */

"use strict";

import { StartupEvents } from "./StartupEvents.js";
import { StartupThresholds, StartupConfig } from "./StartupConstants.js";
import StartupMetrics from "./StartupMetrics.js";

import BootProfiler from "./profilers/BootProfiler.js";
import ModuleLoader from "./profilers/ModuleLoader.js";
import ServiceInitializer from "./profilers/ServiceInitializer.js";
import StartupScheduler from "./profilers/StartupScheduler.js";
import StartupCache from "./profilers/StartupCache.js";

class StartupManager {
  constructor() {
    this.bootProfiler = new BootProfiler();
    this.moduleLoader = new ModuleLoader();
    this.serviceInitializer = new ServiceInitializer();
    this.startupScheduler = new StartupScheduler();
    this.startupCache = new StartupCache();

    this.intervalId = null;
    this.history = [];
    this.alertLog = [];
  }

  start() {
    if (this.intervalId) return;
    this.collect();
    this.intervalId = setInterval(() => this.collect(), StartupConfig.TELEMETRY_INTERVAL_MS);
    console.log("[StartupManager] Startup telemetry loop started.");
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  collect() {
    const sample = new StartupMetrics();

    // Populate telemetry from profilers
    const timelineData = this.bootProfiler.collect();
    sample.timeline = {
      ...timelineData,
      splashDurationMs: timelineData.splashDurationMs
    };

    const moduleData = this.moduleLoader.collect();
    sample.modules = moduleData;

    sample.services = this.serviceInitializer.collect();

    const cacheData = this.startupCache.collect();
    const schedulerData = this.startupScheduler.getStatus();

    sample.optimization = {
      deferredLoadingCount: schedulerData.deferredJobsCount,
      cacheHitRatePct: cacheData.cacheHitRatePct,
      preloadedModulesCount: schedulerData.preloadedModulesCount,
      splashDurationMs: timelineData.splashDurationMs,
      criticalPathMs: parseFloat((timelineData.totalBootMs * 0.72).toFixed(0))
    };

    this.checkThresholds(sample);

    this.history.push(sample);
    if (this.history.length > StartupConfig.HISTORY_LIMIT) this.history.shift();

    StartupEvents.emit("startup-metrics-updated", {
      current: sample,
      history: this.history,
      alerts: this.alertLog
    });
  }

  checkThresholds(sample) {
    const ts = new Date().toLocaleTimeString();
    const t = sample.timeline;
    const m = sample.modules;
    const o = sample.optimization;

    if (t.totalBootMs > StartupThresholds.WARNING_TOTAL_BOOT_MS) {
      this.logAlert(ts, "critical", "Total boot time exceeded budget", `${t.totalBootMs} ms`);
    }
    if (t.firstPaintMs > StartupThresholds.WARNING_FIRST_PAINT_MS) {
      this.logAlert(ts, "critical", "First paint exceeds 1500ms target", `${t.firstPaintMs} ms`);
    }
    if (m.failedModulesCount >= StartupThresholds.WARNING_FAILED_MODULES) {
      this.logAlert(ts, "module", "Module load failures detected", `${m.failedModulesCount} failed`);
    }
    if (o.cacheHitRatePct < StartupThresholds.WARNING_CACHE_HIT_PCT) {
      this.logAlert(ts, "cache", "Startup cache hit rate below threshold", `${o.cacheHitRatePct}%`);
    }
    if (o.criticalPathMs > StartupThresholds.WARNING_CRITICAL_PATH_MS) {
      this.logAlert(ts, "critical", "Critical path estimate exceeds limit", `${o.criticalPathMs} ms`);
    }

    // Check individual service init times
    sample.services.forEach(svc => {
      if (svc.initMs > StartupThresholds.WARNING_SERVICE_INIT_MS) {
        this.logAlert(ts, "service", `${svc.name} init time exceeded budget`, `${svc.initMs} ms`);
      }
    });
  }

  logAlert(timestamp, category, message, value) {
    this.alertLog.unshift({ timestamp, category, message, value });
    if (this.alertLog.length > 50) this.alertLog.pop();
  }

  triggerReProfile() {
    // Placeholder: future — trigger real Electron startup tracing
    console.log("[StartupManager] Re-profile requested.");
    this.collect();
  }

  getHistory() { return this.history; }
  getAlerts() { return this.alertLog; }
}

export const StartupManagerInstance = new StartupManager();
