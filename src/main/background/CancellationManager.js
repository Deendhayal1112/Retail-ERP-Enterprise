/**
 * CancellationManager.js
 * Retail ERP Enterprise — Safe Cancellation Manager
 */

"use strict";

const TaskStates = require("../../shared/background/TaskStates");

class CancellationManager {
  constructor() {
    this.cancelledTasks = new Set();
  }

  requestCancellation(taskId) {
    this.cancelledTasks.add(taskId);
    console.log(`[CancellationManager] Safe cancellation requested for task: ${taskId}`);
  }

  isCancelled(taskId) {
    return this.cancelledTasks.has(taskId);
  }

  clearCancellation(taskId) {
    this.cancelledTasks.delete(taskId);
  }
}

module.exports = new CancellationManager();
