/**
 * SyncQueue.js
 * Retail ERP Enterprise — Reusable Desktop Local Sync Queue Manager
 *
 * Implements:
 * - Queueing pending database transaction changes while offline
 * - Decoupled from physical database engines
 */

"use strict";

export default class SyncQueue {
  /**
   * @param {Object} logger Shared system logger
   */
  constructor(logger = console) {
    this.logger = logger;
    this.queue = [];
    this.logger.info("[SyncQueue] Offline Queue initialized. Ready to cache offline transactions.");
  }

  /**
   * Safe push pending transactions to queue
   * @param {Object} txn Database action configurations
   */
  enqueue(txn) {
    const txnItem = {
      id: `txn_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      status: "Pending",
      ...txn
    };
    this.queue.push(txnItem);
    this.logger.info(`[SyncQueue] Enqueued transaction "${txnItem.id}" (Operation: "${txnItem.action}" on table "${txnItem.table}")`);
    return txnItem;
  }

  /**
   * Resolve pending updates list
   */
  getPendingTransactions() {
    return this.queue.filter(t => t.status === "Pending");
  }

  /**
   * Flush queue records
   */
  clearCompleted() {
    this.queue = this.queue.filter(t => t.status !== "Completed");
  }
}
