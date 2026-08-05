/**
 * CICDManager.js
 * Retail ERP Enterprise — CI/CD Pipeline Orchestrator Manager
 */

"use strict";

import { CICDEvents } from "./CICDEvents.js";
import { CICDConfig } from "./CICDConstants.js";
import CICDMetrics from "./CICDMetrics.js";

import PipelineProfiler from "./profilers/PipelineProfiler.js";

class CICDManager {
  constructor() {
    this.profiler = new PipelineProfiler();
    this.intervalId = null;
    this.history = [];
  }

  start() {
    if (this.intervalId) return;
    this.collect();
    this.intervalId = setInterval(() => this.collect(), CICDConfig.TELEMETRY_INTERVAL_MS);
    console.log("[CICDManager] CI/CD telemetry loop started.");
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  collect() {
    const sample = new CICDMetrics();

    // Map profiler changes
    const stepData = this.profiler.collect();
    sample.activeBuildEnv = stepData.activeBuildEnv;
    sample.overallStatus = stepData.overallStatus;
    sample.pipeline = stepData.pipeline;
    sample.gates = stepData.gates;

    this.history.push(sample);
    if (this.history.length > CICDConfig.HISTORY_LIMIT) this.history.shift();

    CICDEvents.emit("cicd-metrics-updated", {
      current: sample,
      history: this.history
    });
  }

  triggerPipelineSweep() {
    console.log("[CICDManager] Re-running automated pipeline validation...");
    this.collect();
  }

  getHistory() { return this.history; }
}

export const CICDManagerInstance = new CICDManager();
