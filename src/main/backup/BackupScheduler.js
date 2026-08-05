/**
 * BackupScheduler.js
 * Retail ERP Enterprise — Reusable Desktop Database Automated Scheduler
 *
 * Implements:
 * - Mock chron scheduler triggers for nightly backups
 * - Decoupled from cron/SQLite systems
 */

"use strict";

export default class BackupScheduler {
  /**
   * @param {Object} logger Shared system logger
   */
  constructor(logger = console) {
    this.logger = logger;
    this.activeJobs = new Map();
    this.logger.info("[BackupScheduler] Service initialized. Ready for scheduling automated snapshots.");
  }

  /**
   * Safe schedule a backup task cron job
   * @param {string}   name     Scheduled task identifier
   * @param {string}   cronExpr Timing pattern expression
   * @param {Function} task     Operation task callback
   */
  scheduleJob(name, cronExpr, task) {
    this.logger.info(`[BackupScheduler] Scheduling backup job "${name}" with timing: "${cronExpr}"`);
    const job = {
      name,
      cronExpr,
      nextRun: "2026-08-06T02:00:00.000Z",
      cancel: () => {
        this.logger.info(`[BackupScheduler] Job "${name}" cancelled.`);
        this.activeJobs.delete(name);
      }
    };
    this.activeJobs.set(name, job);
    return job;
  }

  /**
   * Cancel an active schedule
   * @param {string} name Task name
   */
  cancelJob(name) {
    const job = this.activeJobs.get(name);
    if (job) {
      job.cancel();
    }
  }
}
