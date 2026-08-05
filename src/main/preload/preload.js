/**
 * preload.js
 * Retail ERP Enterprise — Secure IPC Preload Context Bridge
 *
 * Implements a strict, secure context bridge.
 * No Node.js or Electron APIs are exposed directly to the renderer.
 * Communication is restricted to explicitly whitelisted IPC channels.
 *
 * Phase 5 — Step 3: Session Management & Login Integration
 */

"use strict";

const { contextBridge, ipcRenderer } = require("electron");

// ─────────────────────────────────────────────────────────────────────
// Whitelisted IPC Channels
// ─────────────────────────────────────────────────────────────────────

// Channels from Renderer to Main (One-way send or two-way invoke)
const ALLOWED_SEND_CHANNELS = [
  "app:get-info",
  "window:minimize",
  "window:maximize",
  "window:close",
  "window:is-maximized",
  "log:write",
  "auth:login",
  "auth:logout",
  "auth:get-session",
];

// Channels from Main to Renderer (Listeners)
const ALLOWED_RECEIVE_CHANNELS = [
  "window:maximized-changed",
  "auth:session-expired",
];

// ─────────────────────────────────────────────────────────────────────
// Context Bridge API Exposure
// ─────────────────────────────────────────────────────────────────────

contextBridge.exposeInMainWorld("api", {
  /**
   * Application Metadata
   */
  app: {
    getInfo: () => ipcRenderer.invoke("app:get-info"),
  },

  /**
   * Window Operations
   */
  window: {
    minimize: () => ipcRenderer.send("window:minimize"),
    maximize: () => ipcRenderer.send("window:maximize"),
    close: () => ipcRenderer.send("window:close"),
    isMaximized: () => ipcRenderer.invoke("window:is-maximized"),
  },

  /**
   * Authentication Operations
   */
  auth: {
    login: (credentials) => ipcRenderer.invoke("auth:login", credentials),
    logout: () => ipcRenderer.invoke("auth:logout"),
    getSession: () => ipcRenderer.invoke("auth:get-session"),
  },

  /**
   * Unified Logging Bridge
   */
  logger: {
    debug: (message, meta) =>
      ipcRenderer.send("log:write", { level: "debug", message, meta }),
    info: (message, meta) =>
      ipcRenderer.send("log:write", { level: "info", message, meta }),
    warn: (message, meta) =>
      ipcRenderer.send("log:write", { level: "warn", message, meta }),
    error: (message, meta) =>
      ipcRenderer.send("log:write", { level: "error", message, meta }),
  },

  /**
   * Secure Raw IPC Communications Gateway
   */
  ipc: {
    send: (channel, data) => {
      if (ALLOWED_SEND_CHANNELS.includes(channel)) {
        ipcRenderer.send(channel, data);
      } else {
        console.warn(
          `[Preload Bridge] Send blocked: unauthorized channel "${channel}"`,
        );
      }
    },
    invoke: (channel, data) => {
      if (ALLOWED_SEND_CHANNELS.includes(channel)) {
        return ipcRenderer.invoke(channel, data);
      }
      return Promise.reject(
        new Error(
          `[Preload Bridge] Invoke blocked: unauthorized channel "${channel}"`,
        ),
      );
    },
    on: (channel, callback) => {
      if (ALLOWED_RECEIVE_CHANNELS.includes(channel)) {
        // Strip event parameter to prevent exposing raw ipcRenderer event object
        const subscription = (event, ...args) => callback(...args);
        ipcRenderer.on(channel, subscription);
        return () => ipcRenderer.removeListener(channel, subscription);
      } else {
        console.warn(
          `[Preload Bridge] Listen blocked: unauthorized channel "${channel}"`,
        );
        return () => {};
      }
    },
  },
});
