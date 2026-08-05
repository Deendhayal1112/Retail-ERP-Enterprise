"use strict";

/**
 * database.config.js
 * Retail ERP Enterprise — Database Configuration
 *
 * Configuration for the SQLite database layer.
 * Uses better-sqlite3 for synchronous, high-performance local storage.
 * Database file lives in the root-level database/ directory.
 * The .db file itself is gitignored — only schema/seed scripts are committed.
 *
 * Phase 1 — Step 4: Application Configuration Integration
 */

require("./secrets");

const path = require("path");

const databaseConfig = {
  // ─────────────────────────────────────────────
  // DATABASE FILE
  // ─────────────────────────────────────────────
  filename: process.env.DB_NAME || "retail_erp.db",

  // Resolved absolute path to the database file
  // In production (packaged), this will use app.getPath('userData')
  // In development, it uses the root-level database/ directory
  directory: path.resolve(process.env.DB_PATH || "./database"),

  // Computed full path — used by the connection module
  get filePath() {
    return path.join(this.directory, this.filename);
  },

  // ─────────────────────────────────────────────
  // BETTER-SQLITE3 OPTIONS
  // ─────────────────────────────────────────────
  options: {
    // WAL mode: enables concurrent reads, better crash recovery
    walMode: process.env.DB_WAL_MODE === "true",

    // Busy timeout: wait time when DB is locked (ms)
    busyTimeout: parseInt(process.env.DB_BUSY_TIMEOUT, 10) || 5000,

    // Enable verbose logging in development only
    verbose:
      process.env.APP_ENV === "development"
        ? (_message) => {
            /* verbose SQL logging handled by database.js DatabaseService */
          }
        : null,
  },

  // ─────────────────────────────────────────────
  // MIGRATION SETTINGS
  // ─────────────────────────────────────────────
  migrations: {
    directory: path.resolve("./database/migrations"),
    tableName: "_migrations",
  },

  // ─────────────────────────────────────────────
  // SCHEMA SETTINGS
  // ─────────────────────────────────────────────
  schema: {
    directory: path.resolve("./database/schema"),
  },

  // ─────────────────────────────────────────────
  // SEED SETTINGS
  // ─────────────────────────────────────────────
  seed: {
    directory: path.resolve("./database/seed"),
    // Run seeds only in development unless explicitly enabled
    enabled:
      process.env.APP_ENV === "development" || process.env.DB_SEED === "true",
  },

  // ─────────────────────────────────────────────
  // PRAGMA SETTINGS (applied after connection opens)
  // ─────────────────────────────────────────────
  pragmas: {
    journal_mode: "WAL", // Write-Ahead Logging
    synchronous: "NORMAL", // Balanced safety vs. performance
    foreign_keys: "ON", // Enforce referential integrity
    cache_size: -32000, // 32MB cache (negative = kilobytes)
    temp_store: "MEMORY", // Temp tables in memory
    mmap_size: 268435456, // 256MB memory-mapped I/O
  },
};

module.exports = databaseConfig;
