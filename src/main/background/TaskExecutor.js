/**
 * TaskExecutor.js
 * Retail ERP Enterprise — Task Processor and Worker Lifecycle Wrapper
 */

"use strict";

const TaskStates = require("../../shared/background/TaskStates");
const TaskEvents = require("../../shared/background/TaskEvents");
const TaskRegistry = require("./TaskRegistry");
const ConcurrencyManager = require("./ConcurrencyManager");
const CancellationManager = require("./CancellationManager");
const RetryManager = require("./RetryManager");

class TaskExecutor {
  constructor() {
    this.eventHandlers = new Map();
  }

  on(event, handler) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event).push(handler);
  }

  emit(event, data) {
    if (this.eventHandlers.has(event)) {
      this.eventHandlers.get(event).forEach(cb => cb(data));
    }
  }

  async execute(task) {
    if (!ConcurrencyManager.canExecute()) {
      console.log(`[TaskExecutor] Concurrency full. Task ${task.id} remains in queue.`);
      return;
    }

    ConcurrencyManager.increment();
    TaskRegistry.updateTaskStatus(task.id, TaskStates.RUNNING);
    this.emit(TaskEvents.TASK_STARTED, task);

    console.log(`[TaskExecutor] Commencing task execution: "${task.name}" (${task.id})`);

    // Standardized mock progress tracking simulation loop
    let progress = 0;
    const stages = ["Parsing schema", "Allocating temporary storage", "Writing WAL blocks", "Verifying filesystem locks", "Syncing transactions"];
    const totalItems = 100;

    const runLoop = setInterval(() => {
      // 1. Safe Cancellation Check
      if (CancellationManager.isCancelled(task.id)) {
        clearInterval(runLoop);
        ConcurrencyManager.decrement();
        CancellationManager.clearCancellation(task.id);
        
        TaskRegistry.updateTaskStatus(task.id, TaskStates.CANCELLED);
        task.progress = { pct: progress, stage: "Cancelled by Operator", processed: progress, total: totalItems, message: "Task cancelled safely." };
        
        this.emit(TaskEvents.TASK_CANCELLED, task);
        console.log(`[TaskExecutor] Task ${task.id} successfully cancelled.`);
        this.emit("next");
        return;
      }

      // Increment progress
      progress += Math.round(Math.random() * 15) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(runLoop);
        ConcurrencyManager.decrement();
        
        TaskRegistry.updateTaskStatus(task.id, TaskStates.COMPLETED);
        task.progress = { pct: 100, stage: "Complete", processed: totalItems, total: totalItems, message: "Operation completed successfully." };
        
        this.emit(TaskEvents.TASK_COMPLETED, task);
        console.log(`[TaskExecutor] Task ${task.id} completed successfully.`);
        this.emit("next");
      } else {
        // Update live progress stages
        const stageIndex = Math.min(stages.length - 1, Math.floor((progress / 100) * stages.length));
        task.progress = {
          pct: progress,
          stage: stages[stageIndex],
          processed: progress,
          total: totalItems,
          message: `In progress: ${stages[stageIndex]} (${progress}%)`
        };
        this.emit(TaskEvents.TASK_PROGRESS, task);
      }
    }, 800);
  }
}

module.exports = new TaskExecutor();
