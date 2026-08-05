/**
 * database.js
 * Retail ERP Enterprise — SQLite Core Database Service
 *
 * Implements a reusable, thread-safe database connection manager using better-sqlite3.
 * Configures connection performance options, applies system pragmas (such as WAL mode,
 * synchronous NORMAL, foreign key constraints), logs query events, automatically
 * initializes schema tables, and triggers the seed execution scripts for initial data.
 *
 * Phase 4 — Step 3: Admin User Seeder
 */

"use strict";

const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");
const dbConfig = require("../config/database.config");
const logger = require("../shared/logger/logger");
const { DatabaseError } = require("../shared/errors/errorHandler");

class DatabaseService {
  constructor() {
    this.db = null;
  }

  /**
   * Initializes the database connection, guarantees directories exist, and applies schemas & seeds.
   * @returns {Database.Database} The established better-sqlite3 instance.
   */
  initialize() {
    if (this.db) {
      return this.db;
    }

    try {
      const dbPath = dbConfig.filePath;
      const dbDir = dbConfig.directory;

      // Automatically create database directory if it does not exist
      if (!fs.existsSync(dbDir)) {
        logger.info(`Creating database directory structure at: ${dbDir}`);
        fs.mkdirSync(dbDir, { recursive: true });
      }

      logger.info(`Opening SQLite database instance connection at: ${dbPath}`);

      // Structure connection options
      const connectionOptions = {
        timeout: dbConfig.options.busyTimeout,
      };

      // Inject verbose logger inside development mode
      if (dbConfig.options.verbose) {
        connectionOptions.verbose = (sql) => {
          logger.debug(`[SQL-QUERY]: ${sql}`);
        };
      }

      this.db = new Database(dbPath, connectionOptions);

      // Apply performance tuning and safety pragmas
      this.applyPragmas();

      // Automatically initialize schema files if the database is uninitialized
      this.ensureSchemaInitialized();

      logger.info(
        "SQLite database service successfully initialized. WAL Mode & Foreign Keys activated.",
      );
      return this.db;
    } catch (error) {
      logger.error(
        "CRITICAL: Database initialization failure occurred:",
        error,
      );
      throw new DatabaseError(
        "Failed to initialize SQLite database foundation",
        error,
      );
    }
  }

  /**
   * Executes configured pragmas inside the active SQLite connection session.
   */
  applyPragmas() {
    if (!this.db) return;

    try {
      for (const [pragmaKey, pragmaValue] of Object.entries(dbConfig.pragmas)) {
        this.db.pragma(`${pragmaKey} = ${pragmaValue}`);
      }
    } catch (error) {
      logger.error("Database pragma configuration execution failure:", error);
      throw new DatabaseError("Failed to configure SQLite pragmas", error);
    }
  }

  /**
   * Verifies if schemas are loaded by checking the 'roles' table. If missing, loads all SQL files and seeds.
   */
  ensureSchemaInitialized() {
    if (!this.db) return;

    try {
      // Check if 'roles' table exists in sqlite_master
      const rolesTableExists = this.db
        .prepare(
          "SELECT name FROM sqlite_master WHERE type='table' AND name='roles'",
        )
        .get();

      if (!rolesTableExists) {
        logger.info("Fresh database detected. Initializing schema tables...");

        const schemaFiles = [
          "roles.sql",
          "permissions.sql",
          "users.sql",
          "company.sql",
          "settings.sql",
        ];
        const schemaDir = dbConfig.schema.directory;

        // Execute all schema scripts inside a single transaction for safety (must invoke wrapper immediately)
        this.transaction(() => {
          for (const file of schemaFiles) {
            const filePath = path.join(schemaDir, file);
            if (fs.existsSync(filePath)) {
              logger.info(`Executing schema definition: ${file}`);
              const sqlContent = fs.readFileSync(filePath, "utf8");
              this.db.exec(sqlContent);
            } else {
              throw new Error(`Schema file not found: ${file}`);
            }
          }
        })();

        logger.info("Database schema tables successfully generated.");

        // Trigger master seeder if configuration setting allows
        if (dbConfig.seed.enabled) {
          logger.info("Executing application database seeder...");
          const adminSeeder = require("../../database/seed/admin.seed");
          this.transaction(() => {
            adminSeeder.run(this.db);
          })();
        }
      }
    } catch (error) {
      logger.error("Database schema setup failure:", error);
      throw new DatabaseError("Failed to initialize database schemas", error);
    }
  }

  /**
   * Returns the active connection, initializing it if none exists.
   * @returns {Database.Database} Active better-sqlite3 instance.
   */
  getConnection() {
    if (!this.db) {
      return this.initialize();
    }
    return this.db;
  }

  /**
   * Closes the active database connection gracefully.
   */
  close() {
    if (this.db) {
      try {
        logger.info("Initiating graceful shutdown for database connection...");
        this.db.close();
        this.db = null;
        logger.info("Database connection successfully closed.");
      } catch (error) {
        logger.error(
          "Error occurred while closing database connection:",
          error,
        );
        throw new DatabaseError(
          "Failed to close database connection gracefully",
          error,
        );
      }
    }
  }

  /**
   * Helper transaction wrapper utility.
   * @param {Function} executionFn Function containing query sequences to execute inside a transaction.
   * @returns {Function} Wrapper function.
   */
  transaction(executionFn) {
    const activeConnection = this.getConnection();
    return activeConnection.transaction(executionFn);
  }
}

// Export singleton database service instance
module.exports = new DatabaseService();
