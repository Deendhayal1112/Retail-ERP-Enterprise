"use strict";

/**
 * logger.js
 * Retail ERP Enterprise — Winston-based Enterprise Logging Module
 *
 * Provides structured, multi-transport logging.
 * Logs are categorized into:
 * 1. Application Logs (combined) -> logs/application/application.log
 * 2. Error Logs (errors only)     -> logs/error/error.log
 * 3. Security Logs (security events) -> logs/security/security.log
 *
 * In development mode, logs are colorized and output to the console.
 *
 * Phase 1 — Step 1: Electron Bootstrap
 */

const winston = require("winston");
const path = require("path");
const fs = require("fs");
const appConfig = require("../../config/app.config");

const logDir = path.resolve(appConfig.logging.path);

// Ensure directories exist
const directories = ["application", "error", "security"];
directories.forEach((dir) => {
  const fullPath = path.join(logDir, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// Formatting layouts - safe layout avoiding metadata destruct errors
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
  winston.format.errors({ stack: true }),
  winston.format.printf((info) => {
    const { level, message, timestamp, ...metadata } = info;

    // Remove formatting helper keys from metadata printout
    delete metadata.splat;

    let metaString = "";
    if (Object.keys(metadata).length > 0) {
      metaString = ` | meta: ${JSON.stringify(metadata)}`;
    }

    const displayLevel = (level || "info").toUpperCase().padEnd(5);
    const displayTime = timestamp || new Date().toISOString();
    return `[${displayTime}] [${displayLevel}] ${message || ""}${metaString}`;
  }),
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "HH:mm:ss.SSS" }),
  winston.format.printf((info) => {
    const { level, message, timestamp } = info;
    const displayLevel = level || "info";
    const displayTime = timestamp || new Date().toISOString();
    return `[${displayTime}] [${displayLevel}] ${message || ""}`;
  }),
);

// 1. Create Main Application Logger
const logger = winston.createLogger({
  level: appConfig.logging.level,
  format: logFormat,
  transports: [
    // Error file transport
    new winston.transports.File({
      filename: path.join(logDir, "error", "error.log"),
      level: "error",
      maxsize: parseInt(appConfig.logging.maxSize, 10) * 1024 * 1024,
      maxFiles: appConfig.logging.maxFiles,
    }),
    // Combined application file transport
    new winston.transports.File({
      filename: path.join(logDir, "application", "application.log"),
      maxsize: parseInt(appConfig.logging.maxSize, 10) * 1024 * 1024,
      maxFiles: appConfig.logging.maxFiles,
    }),
  ],
});

// 2. Create Specialized Security Logger
const securityLogger = winston.createLogger({
  level: "info",
  format: logFormat,
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, "security", "security.log"),
      maxsize: parseInt(appConfig.logging.maxSize, 10) * 1024 * 1024,
      maxFiles: appConfig.logging.maxFiles,
    }),
  ],
});

// Add console logger in development
if (appConfig.electron.isDev || appConfig.app.environment === "development") {
  const devConsole = new winston.transports.Console({
    format: consoleFormat,
  });
  logger.add(devConsole);
  securityLogger.add(devConsole);
}

// ─────────────────────────────────────────────────────────────────────
// Logger Interfaces
// ─────────────────────────────────────────────────────────────────────
module.exports = {
  // Application logger logs
  debug: (msg, meta) => logger.debug(msg, meta),
  info: (msg, meta) => logger.info(msg, meta),
  warn: (msg, meta) => logger.warn(msg, meta),
  error: (msg, meta) => logger.error(msg, meta),

  // Security event logging method
  security: (event, userId, status, details = {}) => {
    const logData = {
      event,
      userId: userId || "SYSTEM",
      status: status || "UNKNOWN",
      timestamp: new Date().toISOString(),
      ...details,
    };
    securityLogger.info(
      `[SECURITY EVENT] ${event} | User: ${logData.userId} | Status: ${logData.status}`,
      logData,
    );
  },

  // Raw Winston instances access if needed
  raw: logger,
  rawSecurity: securityLogger,
};
