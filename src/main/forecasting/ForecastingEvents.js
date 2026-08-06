/**
 * ForecastingEvents.js
 * Retail ERP Enterprise — IPC channels registration for predictive planning
 */

"use strict";

const { ipcMain } = require("electron");

class ForecastingEvents {
  static register(handlers) {
    for (const [channel, handler] of Object.entries(handlers)) {
      ipcMain.handle(channel, handler);
    }
  }
}

module.exports = ForecastingEvents;
