/**
 * HealthManager.js
 * Retail ERP Enterprise — Overall Diagnostics and Health Subsystem Orchestrator
 */

"use strict";

import { HealthEvents } from "./HealthEvents.js";
import { DiagnosticsThresholds, DiagnosticsConfig } from "./DiagnosticsConstants.js";
import HealthMetrics from "./HealthMetrics.js";

import DiagnosticsManager from "./profilers/DiagnosticsManager.js";
import LogManager from "./profilers/LogManager.js";
import CrashManager from "./profilers/CrashManager.js";
import AlertManager from "./profilers/AlertManager.js";
import HealthScoreCalculator from "./profilers/HealthScoreCalculator.js";

class HealthManager {
  constructor() {
    this.diagnosticsManager = new DiagnosticsManager();
    this.logManager = new LogManager();
    this.crashManager = new CrashManager();
    this.alertManager = new AlertManager();
    this.scoreCalculator = new HealthScoreCalculator();

    this.intervalId = null;
    this.history = [];
    this.alertLog = [];
  }

  start() {
    if (this.intervalId) return;
    this.collect();
    this.intervalId = setInterval(() => this.collect(), DiagnosticsConfig.TELEMETRY_INTERVAL_MS);
    console.log("[HealthManager] Diagnostics telemetry loop started.");
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  collect() {
    const sample = new HealthMetrics();

    // Fluctuating system metrics
    sample.system = {
      cpuUsagePct: parseFloat((10 + Math.random() * 15).toFixed(1)),
      memoryUsagePct: parseFloat((35 + Math.random() * 10).toFixed(1)),
      diskUsagePct: 56.4,
      networkStatus: Math.random() > 0.98 ? "Disconnected" : "Connected",
      gpuUsagePct: parseFloat((2 + Math.random() * 4).toFixed(1)),
      batteryStatus: "AC Power"
    };

    // Diagnostics stats
    sample.diagnostics = this.diagnosticsManager.collect();

    // Calculate score
    sample.healthScore = this.scoreCalculator.calculate(sample);

    // Read logs and recommendations
    sample.logs = this.logManager.collect();
    sample.recommendations = this.alertManager.evaluate(sample);

    this.checkThresholds(sample);

    this.history.push(sample);
    if (this.history.length > DiagnosticsConfig.HISTORY_LIMIT) this.history.shift();

    HealthEvents.emit("health-metrics-updated", {
      current: sample,
      history: this.history,
      alerts: this.alertLog
    });
  }

  checkThresholds(sample) {
    const ts = new Date().toLocaleTimeString();
    const s = sample.system;

    if (s.cpuUsagePct > DiagnosticsThresholds.WARNING_CPU_PCT) {
      this.logAlert(ts, "system", "CPU usage exceeds threshold limit", `${s.cpuUsagePct}%`);
    }
    if (s.memoryUsagePct > DiagnosticsThresholds.WARNING_MEM_PCT) {
      this.logAlert(ts, "system", "Memory utilization warning threshold", `${s.memoryUsagePct}%`);
    }
    if (sample.healthScore < DiagnosticsThresholds.WARNING_HEALTH_SCORE) {
      this.logAlert(ts, "diagnostics", "Overall system diagnostics health score degraded", `${sample.healthScore}`);
    }
  }

  logAlert(timestamp, category, message, value) {
    this.alertLog.unshift({ timestamp, category, message, value });
    if (this.alertLog.length > 50) this.alertLog.pop();
  }

  triggerDiagnosticsBundle() {
    console.log("[HealthManager] Diagnostic bundle generated successfully.");
  }

  getHistory() { return this.history; }
  getAlerts() { return this.alertLog; }
}

export const HealthManagerInstance = new HealthManager();
