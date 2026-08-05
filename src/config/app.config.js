"use strict";

/**
 * app.config.js
 * Retail ERP Enterprise — Application Configuration
 *
 * Central configuration object for the entire application.
 * All values are driven by environment variables.
 * Never hardcode values — always use process.env with safe defaults.
 *
 * Phase 1 — Step 4: Application Configuration Integration
 */

require("./secrets");

const appConfig = {
  // ─────────────────────────────────────────────
  // APPLICATION METADATA
  // ─────────────────────────────────────────────
  app: {
    name: process.env.APP_NAME || "Retail ERP Enterprise",
    version: process.env.APP_VERSION || "0.2.0",
    environment: process.env.APP_ENV || "development",
    debug: process.env.APP_DEBUG === "true",
  },

  // ─────────────────────────────────────────────
  // ELECTRON CONFIGURATION
  // ─────────────────────────────────────────────
  electron: {
    isDev: process.env.ELECTRON_DEV === "true",
    logLevel: process.env.ELECTRON_LOG_LEVEL || "info",
    enableLogging: process.env.ELECTRON_ENABLE_LOGGING === "true",
  },

  // ─────────────────────────────────────────────
  // MAIN WINDOW CONFIGURATION
  // ─────────────────────────────────────────────
  window: {
    width: parseInt(process.env.WIN_WIDTH, 10) || 1280,
    height: parseInt(process.env.WIN_HEIGHT, 10) || 800,
    minWidth: parseInt(process.env.WIN_MIN_WIDTH, 10) || 1024,
    minHeight: parseInt(process.env.WIN_MIN_HEIGHT, 10) || 700,
    title: process.env.APP_NAME || "Retail ERP Enterprise",
    center: true,
    show: false, // Show only after 'ready-to-show' event fires
    frame: true,
    resizable: true,
  },

  // ─────────────────────────────────────────────
  // EXPRESS LOCAL SERVER CONFIGURATION
  // ─────────────────────────────────────────────
  server: {
    port: parseInt(process.env.SERVER_PORT, 10) || 3721,
    host: process.env.SERVER_HOST || "127.0.0.1",
    timeout: parseInt(process.env.SERVER_TIMEOUT, 10) || 30000,
    baseUrl: `http://${process.env.SERVER_HOST || "127.0.0.1"}:${process.env.SERVER_PORT || 3721}`,
  },

  // ─────────────────────────────────────────────
  // LOGGING CONFIGURATION
  // ─────────────────────────────────────────────
  logging: {
    level: process.env.LOG_LEVEL || "info",
    path: process.env.LOG_PATH || "./logs",
    maxSize: process.env.LOG_MAX_SIZE || "20m",
    maxFiles: process.env.LOG_MAX_FILES || "14d",
    colorize: process.env.LOG_COLORIZE === "true",
  },

  // ─────────────────────────────────────────────
  // RATE LIMITING CONFIGURATION
  // ─────────────────────────────────────────────
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000,
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
    login: {
      windowMs: parseInt(process.env.LOGIN_RATE_LIMIT_WINDOW_MS, 10) || 900000,
      max: parseInt(process.env.LOGIN_RATE_LIMIT_MAX, 10) || 5,
    },
  },

  // ─────────────────────────────────────────────
  // PATHS
  // ─────────────────────────────────────────────
  paths: {
    database: process.env.DB_PATH || "./database",
    logs: process.env.LOG_PATH || "./logs",
    assets: "./assets",
    renderer: "./src/renderer",
  },

  // ─────────────────────────────────────────────
  // CONFIGURATION VALIDATION ENGINE
  // ─────────────────────────────────────────────
  validate() {
    // 1. Validate Environment
    if (!["development", "production", "test"].includes(this.app.environment)) {
      throw new Error(
        `[Config Validation] Invalid APP_ENV: "${this.app.environment}". Must be development, production, or test.`,
      );
    }

    // 2. Validate Local Server Port bounds
    if (
      isNaN(this.server.port) ||
      this.server.port < 1024 ||
      this.server.port > 65535
    ) {
      throw new Error(
        `[Config Validation] Invalid SERVER_PORT: "${this.server.port}". Must be between 1024 and 65535.`,
      );
    }

    // 3. Validate main window dimensions bounds
    if (isNaN(this.window.width) || this.window.width <= 0) {
      throw new Error(
        `[Config Validation] Invalid WIN_WIDTH: "${this.window.width}"`,
      );
    }
    if (isNaN(this.window.height) || this.window.height <= 0) {
      throw new Error(
        `[Config Validation] Invalid WIN_HEIGHT: "${this.window.height}"`,
      );
    }

    // 4. Production specific secrets size bounds
    if (this.app.environment === "production") {
      if (
        !process.env.SESSION_SECRET ||
        process.env.SESSION_SECRET.length < 32
      ) {
        throw new Error(
          "[Config Validation] SESSION_SECRET must be at least 32 characters in production.",
        );
      }
      if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
        throw new Error(
          "[Config Validation] JWT_SECRET must be at least 32 characters in production.",
        );
      }
    }
  },
};

// ─────────────────────────────────────────────
// DERIVED HELPERS
// ─────────────────────────────────────────────
appConfig.isDevelopment = appConfig.app.environment === "development";
appConfig.isProduction = appConfig.app.environment === "production";

module.exports = appConfig;
