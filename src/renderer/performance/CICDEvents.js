/**
 * CICDEvents.js
 * Retail ERP Enterprise — CI/CD Pipeline Event Emitter
 */

"use strict";

class CICDEventEmitter {
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
    const idx = list.indexOf(callback);
    if (idx !== -1) list.splice(idx, 1);
  }

  emit(event, data) {
    if (!this.listeners.has(event)) return;
    this.listeners.get(event).forEach(cb => cb(data));
  }
}

export const CICDEvents = new CICDEventEmitter();
