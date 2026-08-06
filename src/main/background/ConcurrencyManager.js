/**
 * ConcurrencyManager.js
 * Retail ERP Enterprise — Concurrency Control for Resource Protection
 */

"use strict";

class ConcurrencyManager {
  constructor() {
    this.maxConcurrency = 3; // Standard batch limit to prevent database/CPU contention
    this.activeCount = 0;
  }

  setMaxConcurrency(limit) {
    this.maxConcurrency = limit;
  }

  canExecute() {
    return this.activeCount < this.maxConcurrency;
  }

  increment() {
    this.activeCount++;
  }

  decrement() {
    this.activeCount = Math.max(0, this.activeCount - 1);
  }

  getActiveCount() {
    return this.activeCount;
  }
}

module.exports = new ConcurrencyManager();
