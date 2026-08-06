/**
 * AnalyticsEvents.js
 * Retail ERP Enterprise — Smart Analytics Center IPC Event Hub
 */

"use strict";

const { ipcMain } = require("electron");

class AnalyticsEvents {
  static register(handlers) {
    Object.keys(handlers).forEach(channel => {
      // Clean previous registrations to prevent leaks
      ipcMain.removeHandler(channel);
      ipcMain.handle(channel, handlers[channel]);
    });
  }
}

module.exports = AnalyticsEvents;
