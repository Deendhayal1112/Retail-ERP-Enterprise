/**
 * AIEvents.js
 * Retail ERP Enterprise — AI Platform IPC Event Hub
 */

"use strict";

const { ipcMain } = require("electron");

class AIEvents {
  static register(handlers) {
    Object.keys(handlers).forEach(channel => {
      // Clean previous registrations to prevent leaks
      ipcMain.removeHandler(channel);
      ipcMain.handle(channel, handlers[channel]);
    });
  }
}

module.exports = AIEvents;
