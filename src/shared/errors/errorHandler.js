"use strict";

/**
 * errorHandler.js
 * Retail ERP Enterprise — Central Error Handling System
 *
 * Defines custom operational errors and provides global error handling hooks
 * for both Node.js processes and Electron main lifecycle.
 *
 * Phase 1 — Step 1: Electron Bootstrap
 */

const logger = require("../logger/logger");

// ─────────────────────────────────────────────────────────────────────
// Custom Operational Error Subclasses
// ─────────────────────────────────────────────────────────────────────

/**
 * Base Application Error class
 */
class AppError extends Error {
  constructor(
    message,
    statusCode = 500,
    errorCode = "INTERNAL_ERROR",
    isOperational = true,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = isOperational; // true if it is an expected operational issue, false for programmatic bugs
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message, details = null) {
    super(message, 400, "VALIDATION_ERROR");
    this.details = details;
  }
}

class AuthenticationError extends AppError {
  constructor(message = "Authentication failed") {
    super(message, 401, "AUTHENTICATION_ERROR");
  }
}

class ForbiddenError extends AppError {
  constructor(message = "Access denied") {
    super(message, 403, "FORBIDDEN_ERROR");
  }
}

class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404, "NOT_FOUND_ERROR");
  }
}

class DatabaseError extends AppError {
  constructor(message, originalError = null) {
    super(message, 500, "DATABASE_ERROR");
    this.originalError = originalError;
  }
}

class InternalServerError extends AppError {
  constructor(message = "An unexpected error occurred") {
    super(message, 500, "INTERNAL_SERVER_ERROR");
  }
}

// ─────────────────────────────────────────────────────────────────────
// Global Error Handlers (Main Process)
// ─────────────────────────────────────────────────────────────────────

/**
 * Registers listeners for uncaught exceptions and unhandled promise rejections
 * on the current Node.js process.
 */
function registerProcessErrorHandlers() {
  process.on("uncaughtException", (err) => {
    logger.error(`UNCAUGHT EXCEPTION: ${err.message}`, {
      stack: err.stack,
      name: err.name,
    });

    // If it's a critical programming error (not operational), exit the application
    if (err instanceof AppError && err.isOperational) {
      return;
    }

    logger.error(
      "CRITICAL: Programmatic error detected. Initiating graceful shutdown.",
    );
    // Let main process perform graceful cleanup and exit
    process.emit("graceful-shutdown", 1);
  });

  process.on("unhandledRejection", (reason) => {
    const errorMsg = reason instanceof Error ? reason.message : String(reason);
    const errorStack = reason instanceof Error ? reason.stack : null;

    logger.error(`UNHANDLED PROMISE REJECTION: ${errorMsg}`, {
      stack: errorStack,
    });
  });
}

module.exports = {
  AppError,
  ValidationError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
  DatabaseError,
  InternalServerError,
  registerProcessErrorHandlers,
};
