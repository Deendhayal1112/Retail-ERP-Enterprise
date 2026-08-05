/**
 * QAManager.js
 * Retail ERP Enterprise — Central QA Subsystem Orchestrator
 */

"use strict";

import { QAEvents } from "./QAEvents.js";
import { QAConfig } from "./QAConstants.js";
import QAMetrics from "./QAMetrics.js";

import TestRunnerProfiler from "./profilers/TestRunnerProfiler.js";

class QAManager {
  constructor() {
    this.runnerProfiler = new TestRunnerProfiler();
    this.intervalId = null;
    this.history = [];
  }

  start() {
    if (this.intervalId) return;
    this.collect();
    this.intervalId = setInterval(() => this.collect(), QAConfig.TELEMETRY_INTERVAL_MS);
    console.log("[QAManager] QA Telemetry loop started.");
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  collect() {
    const sample = new QAMetrics();

    // Populate data from simulated test runners
    const runnerData = this.runnerProfiler.collect();
    sample.passRatePct = runnerData.passRatePct;
    sample.totalTestsCount = runnerData.totalTestsCount;
    sample.failedTestsCount = runnerData.failedTestsCount;
    sample.unitCoverage = runnerData.unitCoverage;

    this.history.push(sample);
    if (this.history.length > QAConfig.HISTORY_LIMIT) this.history.shift();

    QAEvents.emit("qa-metrics-updated", {
      current: sample,
      history: this.history
    });
  }

  triggerTestRun() {
    console.log("[QAManager] Manual QA test sweep triggered.");
    this.collect();
  }

  getHistory() { return this.history; }
}

export const QAManagerInstance = new QAManager();
