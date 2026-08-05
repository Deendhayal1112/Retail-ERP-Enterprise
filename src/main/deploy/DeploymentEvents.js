/**
 * DeploymentEvents.js
 * Retail ERP Enterprise — Deployment Center IPC Event Hub
 */

"use strict";

const { ipcMain } = require("electron");

class DeploymentEvents {
  static register(handlers) {
    Object.keys(handlers).forEach(channel => {
      // Clean previous registrations to prevent leaks
      ipcMain.removeHandler(channel);
      ipcMain.handle(channel, handlers[channel]);
    });
  }
}

module.exports = DeploymentEvents;
