/**
 * BackgroundTaskManager.js
 * Retail ERP Enterprise — Centralized Background Task Manager
 */

"use strict";

const TaskRegistry = require("./TaskRegistry");
const TaskQueue = require("./TaskQueue");
const TaskExecutor = require("./TaskExecutor");
const TaskScheduler = require("./TaskScheduler");
const TaskMonitor = require("./TaskMonitor");
const CancellationManager = require("./CancellationManager");
const ConcurrencyManager = require("./ConcurrencyManager");

const TaskStates = require("../../shared/background/TaskStates");
const TaskEvents = require("../../shared/background/TaskEvents");

class BackgroundTaskManager {
  constructor() {
    this.ipcRegistered = false;
    this.intervalId = null;

    // Listen to executor to run the next task in queue automatically
    TaskExecutor.on("next", () => this.processNext());
  }

  createTask(type, name, priority, metadata = {}) {
    const task = {
      id: `task_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      type,
      name,
      status: TaskStates.QUEUED,
      priority,
      createdTime: Date.now(),
      startedTime: null,
      completedTime: null,
      progress: { pct: 0, stage: "Queued", processed: 0, total: 100, message: "Waiting in queue." },
      retryCount: 0,
      error: null,
      metadata
    };

    TaskRegistry.addTask(task);
    TaskQueue.enqueue(task);
    console.log(`[BackgroundTaskManager] Created background task: "${name}" (${task.id})`);
    
    // Trigger loop execution attempt
    this.processNext();
    return task;
  }

  processNext() {
    if (!ConcurrencyManager.canExecute()) return;
    const task = TaskQueue.dequeue();
    if (task) {
      TaskExecutor.execute(task);
    }
  }

  cancelTask(taskId) {
    const task = TaskRegistry.getTask(taskId);
    if (task) {
      if (task.status === TaskStates.QUEUED) {
        TaskQueue.remove(taskId);
        TaskRegistry.updateTaskStatus(taskId, TaskStates.CANCELLED);
        task.progress.stage = "Cancelled from Queue";
        task.progress.message = "Task cancelled safely while queued.";
        console.log(`[BackgroundTaskManager] Task ${taskId} cancelled directly from queue.`);
      } else if (task.status === TaskStates.RUNNING) {
        CancellationManager.requestCancellation(taskId);
      }
    }
  }

  startTelemetry(window) {
    if (this.intervalId) return;
    this.intervalId = setInterval(() => {
      if (window && !window.isDestroyed()) {
        const metrics = TaskMonitor.getMetrics();
        window.webContents.send("bg-tasks:metrics-updated", {
          metrics,
          tasks: TaskRegistry.getAllTasks()
        });
      }
    }, 2000);
  }

  stopTelemetry() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // Bind IPC channels safely
  registerIpc(ipcMain, validateSender, getWindowFn) {
    if (this.ipcRegistered) return;

    ipcMain.handle("bg-tasks:get-metrics", (event) => {
      validateSender(event);
      return TaskMonitor.getMetrics();
    });

    ipcMain.handle("bg-tasks:get-tasks", (event) => {
      validateSender(event);
      return TaskRegistry.getAllTasks();
    });

    ipcMain.handle("bg-tasks:trigger-task", (event, payload) => {
      validateSender(event);
      const { type, name, priority, metadata } = payload || {};
      return this.createTask(type || "sync", name || "Manual Job", priority || "Normal", metadata);
    });

    ipcMain.handle("bg-tasks:cancel-task", (event, taskId) => {
      validateSender(event);
      this.cancelTask(taskId);
      return { success: true };
    });

    this.ipcRegistered = true;
    console.log("[BackgroundTaskManager] IPC interfaces registered successfully.");
  }
}

module.exports = new BackgroundTaskManager();
