/**
 * CleanupScheduler.js
 * Retail ERP Enterprise — Cache Purge & GC Trigger Placeholder Scheduler
 */

"use strict";

export default class CleanupScheduler {
  constructor() {
    this.pendingJobsCount = 0;
    this.completedJobsCount = 0;
    this.lastRunTs = null;
  }

  /**
   * Simulate a cache cleanup run (placeholder only).
   * Future: call Electron's process.gc() or cache.clear() APIs.
   */
  scheduleCleanup(label = "cache") {
    this.pendingJobsCount++;
    console.log(`[CleanupScheduler] Cleanup job scheduled for: ${label}`);

    // Immediately "complete" it as placeholder
    setTimeout(() => {
      this.pendingJobsCount = Math.max(0, this.pendingJobsCount - 1);
      this.completedJobsCount++;
      this.lastRunTs = Date.now();
      console.log(`[CleanupScheduler] Cleanup job completed for: ${label}`);
    }, 500);
  }

  getStatus() {
    return {
      pendingJobsCount: this.pendingJobsCount,
      completedJobsCount: this.completedJobsCount,
      lastRunTs: this.lastRunTs
    };
  }
}
