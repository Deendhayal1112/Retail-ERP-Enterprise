/**
 * HealthScoreCalculator.js
 * Retail ERP Enterprise — System Diagnostic Health Score Calculator
 */

"use strict";

export default class HealthScoreCalculator {
  calculate(metrics) {
    let score = 100;

    // Deduct for high resource usage
    if (metrics.system.cpuUsagePct > 70) score -= 10;
    if (metrics.system.memoryUsagePct > 80) score -= 15;

    // Deduct for active issues
    score -= metrics.diagnostics.slowOperationsCount * 2;
    score -= metrics.diagnostics.errorCount * 5;

    return Math.max(20, score);
  }
}
