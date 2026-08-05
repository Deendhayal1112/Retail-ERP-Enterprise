/**
 * ReleaseEvents.js
 * Retail ERP Enterprise — Release Management IPC Router
 */

"use strict";

const { ipcMain } = require("electron");

class ReleaseEvents {
  static register(ipcHandlers) {
    // General IPC call wrapper router
    Object.keys(ipcHandlers).forEach(channel => {
      ipcMain.handle(channel, async (event, data) => {
        try {
          return await ipcHandlers[channel](event, data);
        } catch (err) {
          console.error(`[Release Event Router Error] on ${channel}:`, err);
          throw err;
        }
      });
    });
  }
}

module.exports = ReleaseEvents;
