/**
 * loginHistory.repository.js
 * Retail ERP Enterprise — User Login History Repository Layer
 *
 * Exposes methods to log user connection events and fetch login histories.
 *
 * Phase 4 — Step 4: Repository Layer
 */

"use strict";

const dbService = require("../database");
const logger = require("../../shared/logger/logger");
const { DatabaseError } = require("../../shared/errors/errorHandler");

class LoginHistoryRepository {
  /**
   * Logs a new user login connection event in the history logs.
   * @param {Object} loginData Connection context data (user_id, ip_address, user_agent).
   * @returns {Object} Inserted history record.
   */
  create(loginData) {
    try {
      const db = dbService.getConnection();

      const stmt = db.prepare(`
        INSERT INTO login_history (user_id, ip_address, user_agent)
        VALUES (?, ?, ?)
      `);

      const result = stmt.run(
        loginData.user_id,
        loginData.ip_address || null,
        loginData.user_agent || null,
      );

      return db
        .prepare("SELECT * FROM login_history WHERE id = ?")
        .get(result.lastInsertRowid);
    } catch (error) {
      logger.error(
        "Database write error inside LoginHistoryRepository.create:",
        error,
      );
      throw new DatabaseError(
        "Failed to record user login connection history",
        error,
      );
    }
  }

  /**
   * Fetches recent connection logs for a specific user ID.
   * @param {number} userId Primary key ID of user.
   * @param {number} limit Number of connection entries to return.
   * @returns {Array<Object>} History logs list sorted by login datetime descending.
   */
  findLatest(userId, limit = 10) {
    try {
      const db = dbService.getConnection();
      return db
        .prepare(
          `
        SELECT * FROM login_history
        WHERE user_id = ?
        ORDER BY login_at DESC, id DESC
        LIMIT ?
      `,
        )
        .all(userId, limit);
    } catch (error) {
      logger.error(
        `Database query failure inside LoginHistoryRepository.findLatest for user ID ${userId}:`,
        error,
      );
      throw new DatabaseError(
        `Failed to fetch connection history logs for user ID: ${userId}`,
        error,
      );
    }
  }
}

module.exports = new LoginHistoryRepository();
