/**
 * settings.repository.js
 * Retail ERP Enterprise — Settings Repository Layer
 *
 * Exposes methods to query and update application system configurations.
 * Enforces sanitization and SQLite transaction mechanics.
 *
 * Phase 4 — Step 4: Repository Layer
 */

"use strict";

const dbService = require("../database");
const logger = require("../../shared/logger/logger");
const { DatabaseError } = require("../../shared/errors/errorHandler");

class SettingsRepository {
  /**
   * Fetches all settings records from the system.
   * @returns {Array<Object>} List of application settings.
   */
  findAll() {
    try {
      const db = dbService.getConnection();
      return db.prepare("SELECT * FROM settings ORDER BY key ASC").all();
    } catch (error) {
      logger.error(
        "Database query failure inside SettingsRepository.findAll:",
        error,
      );
      throw new DatabaseError(
        "Failed to fetch settings catalog from database",
        error,
      );
    }
  }

  /**
   * Finds a specific setting config item by its key.
   * @param {string} key Configuration key (e.g. 'app.currency').
   * @returns {Object|null} Configuration record or null if not found.
   */
  find(key) {
    try {
      const db = dbService.getConnection();
      const setting = db
        .prepare("SELECT * FROM settings WHERE key = ?")
        .get(key);
      return setting || null;
    } catch (error) {
      logger.error(
        `Database query failure inside SettingsRepository.find for key "${key}":`,
        error,
      );
      throw new DatabaseError(`Failed to fetch setting by key: ${key}`, error);
    }
  }

  /**
   * Updates the value of a specific setting key.
   * Supports upsert if the setting doesn't already exist.
   * @param {string} key Configuration key.
   * @param {string} value New configuration value.
   * @returns {Object} Updated/Inserted configuration setting record.
   */
  update(key, value) {
    try {
      const db = dbService.getConnection();

      const stmt = db.prepare(`
        INSERT INTO settings (key, value)
        VALUES (?, ?)
        ON CONFLICT(key) DO UPDATE SET
          value = excluded.value
      `);

      stmt.run(key, String(value));
      return this.find(key);
    } catch (error) {
      logger.error(
        `Database write error inside SettingsRepository.update for key "${key}":`,
        error,
      );
      throw new DatabaseError(`Failed to update setting key: ${key}`, error);
    }
  }
}

module.exports = new SettingsRepository();
