/**
 * PerformanceLogger.js
 * Retail ERP Enterprise — Performance Log Collector
 */

"use strict";

export default class PerformanceLogger {
  constructor() {
    this.logs = [];
    this.maxLogs = 50;
  }

  logWarning(category, message, value) {
    const timestamp = new Date().toLocaleTimeString();
    const logItem = { timestamp, category, message, value, type: "warning" };
    this.logs.unshift(logItem);
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }
    console.warn(`[PERF WARNING] [${category.toUpperCase()}] ${message} (Value: ${value})`);
    return logItem;
  }

  getLogs() {
    return this.logs;
  }
}
