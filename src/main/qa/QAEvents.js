/**
 * QAEvents.js
 * Retail ERP Enterprise — QA Center IPC Event Hub
 */

"use strict";

const { ipcMain } = require("electron");

class QAEvents {
  static register(handlers) {
    Object.keys(handlers).forEach(channel => {
      // Clean previous registrations to prevent leaks
      ipcMain.removeHandler(channel);
      ipcMain.handle(channel, handlers[channel]);
    });
  }
}

module.exports = QAEvents;
