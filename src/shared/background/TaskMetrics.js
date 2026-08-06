/**
 * TaskMetrics.js
 * Retail ERP Enterprise — Task Performance Metrics Model
 */

"use strict";

class TaskMetrics {
  constructor() {
    this.activeTasksCount = 0;
    this.queuedTasksCount = 0;
    this.completedTasksCount = 0;
    this.failedTasksCount = 0;
    this.averageDurationMs = 0;
    this.longestTaskDurationMs = 0;
    this.averageQueueWaitTimeMs = 0;
    this.workerUtilizationPct = 0;
    this.cpuUtilizationPct = 0; // CPU utilization placeholder
    this.memoryUtilizationPct = 0; // Memory utilization placeholder
  }
}

module.exports = TaskMetrics;
