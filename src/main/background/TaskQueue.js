/**
 * TaskQueue.js
 * Retail ERP Enterprise — Central Priority Task Queue System
 */

"use strict";

const { PriorityWeights } = require("../../shared/background/TaskPriorities");

class TaskQueue {
  constructor() {
    this.queue = [];
  }

  enqueue(task) {
    this.queue.push(task);
    this.sortQueue();
  }

  dequeue() {
    return this.queue.shift();
  }

  peek() {
    return this.queue[0];
  }

  remove(taskId) {
    const idx = this.queue.findIndex(t => t.id === taskId);
    if (idx !== -1) {
      return this.queue.splice(idx, 1)[0];
    }
    return null;
  }

  getQueue() {
    return this.queue;
  }

  sortQueue() {
    this.queue.sort((a, b) => {
      const weightA = PriorityWeights[a.priority] || 3;
      const weightB = PriorityWeights[b.priority] || 3;
      if (weightA !== weightB) {
        return weightB - weightA; // Higher weight first
      }
      return a.createdTime - b.createdTime; // First created first
    });
  }

  clear() {
    this.queue = [];
  }
}

module.exports = new TaskQueue();
