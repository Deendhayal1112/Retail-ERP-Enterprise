/**
 * TaskScheduler.js
 * Retail ERP Enterprise — Automated Job Scheduler and Triggers
 */

"use strict";

class TaskScheduler {
  constructor() {
    this.jobs = new Map();
  }

  scheduleIntervalJob(name, intervalMs, callback) {
    if (this.jobs.has(name)) {
      clearInterval(this.jobs.get(name));
    }
    const id = setInterval(callback, intervalMs);
    this.jobs.set(name, id);
    console.log(`[TaskScheduler] Configured recurring job trigger: "${name}" (${intervalMs}ms interval)`);
  }

  stopJob(name) {
    if (this.jobs.has(name)) {
      clearInterval(this.jobs.get(name));
      this.jobs.delete(name);
      console.log(`[TaskScheduler] Cancelled job trigger: "${name}"`);
    }
  }

  clear() {
    for (const [name, id] of this.jobs) {
      clearInterval(id);
    }
    this.jobs.clear();
  }
}

module.exports = new TaskScheduler();
