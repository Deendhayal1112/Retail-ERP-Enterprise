/**
 * MemoryEvents.js
 * Retail ERP Enterprise — Event emitter for memory management telemetry
 */

"use strict";

class MemoryEventEmitter {
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
    if (index !== -1) list.splice(index, 1);
  }

  emit(event, data) {
    if (!this.listeners.has(event)) return;
    this.listeners.get(event).forEach(cb => cb(data));
  }
}

export const MemoryEvents = new MemoryEventEmitter();
