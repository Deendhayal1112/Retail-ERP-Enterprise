/**
 * PerformanceEvents.js
 * Retail ERP Enterprise — Event emitter for performance metrics updates
 */

"use strict";

class PerformanceEventEmitter {
  constructor() {
    this.listeners = new Map();
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (!this.listeners.has(event)) return;
    const list = this.listeners.get(event);
    const index = list.indexOf(callback);
    if (index !== -1) {
      list.splice(index, 1);
    }
  }

  emit(event, data) {
    if (!this.listeners.has(event)) return;
    this.listeners.get(event).forEach(cb => cb(data));
  }
}

export const PerformanceEvents = new PerformanceEventEmitter();
