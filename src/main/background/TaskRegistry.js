/**
 * TaskRegistry.js
 * Retail ERP Enterprise — In-Memory Registry of All Background Tasks
 */

"use strict";

class TaskRegistry {
  constructor() {
    this.tasks = new Map();
  }

  addTask(task) {
    this.tasks.set(task.id, task);
  }

  getTask(id) {
    return this.tasks.get(id);
  }

  getAllTasks() {
    return Array.from(this.tasks.values());
  }

  getTasksByStatus(status) {
    return this.getAllTasks().filter(t => t.status === status);
  }

  updateTaskStatus(id, status, error = null) {
    const task = this.getTask(id);
    if (task) {
      task.status = status;
      if (error) {
        task.error = error.message || error;
      }
      if (status === "RUNNING") {
        task.startedTime = Date.now();
      } else if (["COMPLETED", "FAILED", "CANCELLED"].includes(status)) {
        task.completedTime = Date.now();
      }
    }
    return task;
  }

  clearRegistry() {
    this.tasks.clear();
  }
}

module.exports = new TaskRegistry();
