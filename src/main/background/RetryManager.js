/**
 * RetryManager.js
 * Retail ERP Enterprise — Task Failure Retry Policy Manager
 */

"use strict";

const TaskStates = require("../../shared/background/TaskStates");

class RetryManager {
  constructor() {
    this.maxRetries = 3;
    this.retryDelayMs = 2000;
  }

  shouldRetry(task) {
    return task.retryCount < this.maxRetries && task.status === TaskStates.FAILED;
  }

  prepareRetry(task, reason) {
    task.retryCount++;
    task.status = TaskStates.RETRYING;
    task.error = reason || "Pre-retry failure state";
    console.log(`[RetryManager] Task ${task.id} scheduled for retry ${task.retryCount}/${this.maxRetries}`);
  }
}

module.exports = new RetryManager();
