/**
 * PrintQueue.js
 * Retail ERP Enterprise — Reusable Desktop Printer Queue Manager
 *
 * Implements:
 * - Mock printer queue handling and job sequences
 * - Decoupled from Electron APIs
 */

"use strict";

export default class PrintQueue {
  /**
   * @param {Object} logger Shared system logger
   */
  constructor(logger = console) {
    this.logger = logger;
    this.queue = [];
    this.logger.info("[PrintQueue] Queue initialized. Ready for scheduling print jobs.");
  }

  /**
   * Safe push printing jobs to queue
   * @param {Object} job Printing job configs map
   */
  enqueue(job) {
    const jobItem = {
      id: `job_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      status: "Pending",
      ...job
    };
    this.queue.push(jobItem);
    this.logger.info(`[PrintQueue] Enqueued job: "${jobItem.id}" | Target printer: "${jobItem.printer}"`);
    this._processNext();
    return jobItem;
  }

  _processNext() {
    if (this.queue.length === 0) return;
    const activeJob = this.queue.find(j => j.status === "Pending");
    if (!activeJob) return;

    activeJob.status = "Processing";
    this.logger.info(`[PrintQueue] Processing print job "${activeJob.id}" on printer "${activeJob.printer}"...`);
    
    // Simulate printing delay
    setTimeout(() => {
      activeJob.status = "Completed";
      this.logger.info(`[PrintQueue] Successfully completed print job: "${activeJob.id}"`);
      this._processNext();
    }, 1000);
  }
}
