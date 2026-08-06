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
  "bg-tasks:get-metrics",
  "bg-tasks:get-tasks",
  "bg-tasks:trigger-task",
  "bg-tasks:cancel-task",
  "bg-tasks:start-telemetry",
  "bg-tasks:stop-telemetry",
  "security:run-scan",
  "security:get-findings",
  "security:get-electron-status",
  "compliance:get-checklists",
  "compliance:toggle-rule",
  "security:get-audit-logs",
  "security:write-audit-log",
  "security:download-report",
  "release:start-package",
  "release:get-artifacts",
  "release:get-channels",
  "release:get-validations",
  "release:get-manifest",
  "release:toggle-validation",
  "release:toggle-channel",
  "release:compile-manifest",
  "version:get-info",
  "version:get-history",
  "version:promote",
  "signing:get-signatures",
  "signing:start",
  "rollback:get-archives",
  "rollback:trigger-rollback",
  "release:get-changelogs",
  "release:compile-metadata",
  "release:get-lifecycle-state",
  "release:promote-lifecycle-state",
  "docs:get-user-guides",
  "docs:get-admin-guides",
  "docs:get-dev-guides",
  "docs:run-download",
  "help:ask-ai",
  "training:get-courses",
  "training:start-tour",
  "training:enroll",
  "training:update-progress",
  "deploy:get-history",
  "deploy:run-deployment",
  "deploy:get-variables",
  "deploy:update-variable",
  "deploy:get-health",
  "deploy:toggle-maintenance",
  "deploy:get-recovery-plan",
  "deploy:run-recovery-step",
  "deploy:get-golive-checklist",
  "deploy:toggle-golive-step",
  "qa:get-validations",
  "qa:run-regression-test",
  "qa:get-uat-checklist",
  "qa:toggle-uat-feature",
  "qa:get-business-validations",
  "qa:toggle-business-validation",
  "qa:get-bugs",
  "qa:resolve-bug",
  "qa:get-readiness",
  "qa:toggle-readiness",
  "rc:get-info",
  "rc:update-notes",
  "rc:get-validations",
  "rc:toggle-validation",
  "rc:get-checklist",
  "rc:toggle-checklist",
  "rc:get-approvals",
  "rc:toggle-approval",
  "rc:get-risks",
  "rc:toggle-risk-mitigation",
  "ai:get-chat-history",
  "ai:query-chat",
  "ai:get-prompt-library",
  "ai:get-commands",
  "ai:run-command",
  "ai:get-context",
  "ai:get-providers",
  "ai:toggle-provider",
  "analytics:get-summary",
  "analytics:get-kpis",
  "analytics:get-trends",
  "analytics:get-recommendations",
  "analytics:get-forecasts",
  "plugins:get-installed",
  "plugins:get-available",
  "plugins:install",
  "plugins:toggle",
  "plugins:update-permissions",
  "plugins:get-diagnostics"
];

// Channels from Main to Renderer (Listeners)
const ALLOWED_RECEIVE_CHANNELS = [
  "window:maximized-changed",
  "auth:session-expired",
  "bg-tasks:metrics-updated",
  "security:scan-progress",
  "security:scan-completed",
  "release:package-progress",
  "release:package-completed",
  "signing:progress",
  "signing:completed",
  "docs:download-progress",
  "docs:download-completed",
  "deploy:progress",
  "deploy:completed",
  "qa:test-progress",
  "qa:test-completed"
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
