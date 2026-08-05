/**
 * user.repository.js
 * Retail ERP Enterprise — User Repository Layer
 *
 * Implements CRUD actions and user queries mapping to SQLite database operations.
 * Enforces prepared statements and sanitizes inputs to prevent SQL injections.
 *
 * Phase 4 — Step 4: Repository Layer
 */

"use strict";

const { v4: uuidv4 } = require("uuid");
const dbService = require("../database");
const logger = require("../../shared/logger/logger");
const { DatabaseError } = require("../../shared/errors/errorHandler");

class UserRepository {
  /**
   * Finds a user by their unique username.
   * @param {string} username Username of user.
   * @param {boolean} includeDeleted If true, returns the record even if soft-deleted.
   * @returns {Object|null} User record or null if not found.
   */
  findByUsername(username, includeDeleted = false) {
    try {
      const db = dbService.getConnection();
      const query = includeDeleted
        ? "SELECT * FROM users WHERE username = ?"
        : "SELECT * FROM users WHERE username = ? AND deleted_at IS NULL";

      const user = db.prepare(query).get(username);
      return user || null;
    } catch (error) {
      logger.error(
        `Database error inside UserRepository.findByUsername for "${username}":`,
        error,
      );
      throw new DatabaseError(
        `Failed to retrieve user by username: ${username}`,
        error,
      );
    }
  }

  /**
   * Finds a user by their unique email.
   * @param {string} email Email address of user.
   * @param {boolean} includeDeleted If true, returns the record even if soft-deleted.
   * @returns {Object|null} User record or null if not found.
   */
  findByEmail(email, includeDeleted = false) {
    try {
      const db = dbService.getConnection();
      const query = includeDeleted
        ? "SELECT * FROM users WHERE email = ?"
        : "SELECT * FROM users WHERE email = ? AND deleted_at IS NULL";

      const user = db.prepare(query).get(email);
      return user || null;
    } catch (error) {
      logger.error(
        `Database error inside UserRepository.findByEmail for "${email}":`,
        error,
      );
      throw new DatabaseError(
        `Failed to retrieve user by email: ${email}`,
        error,
      );
    }
  }

  /**
   * Finds a user by their primary database ID.
   * @param {number} id Primary key integer ID.
   * @param {boolean} includeDeleted If true, returns the record even if soft-deleted.
   * @returns {Object|null} User record or null if not found.
   */
  findById(id, includeDeleted = false) {
    try {
      const db = dbService.getConnection();
      const query = includeDeleted
        ? "SELECT * FROM users WHERE id = ?"
        : "SELECT * FROM users WHERE id = ? AND deleted_at IS NULL";

      const user = db.prepare(query).get(id);
      return user || null;
    } catch (error) {
      logger.error(
        `Database error inside UserRepository.findById for ID ${id}:`,
        error,
      );
      throw new DatabaseError(`Failed to retrieve user by ID: ${id}`, error);
    }
  }

  /**
   * Creates a new user record in the database.
   * @param {Object} userData Properties of user to insert.
   * @returns {Object} Created user object containing inserted ID and generated columns.
   */
  create(userData) {
    try {
      const db = dbService.getConnection();

      const uuid = userData.uuid || uuidv4();
      const status = userData.status || "ACTIVE";

      const stmt = db.prepare(`
        INSERT INTO users (uuid, username, email, password_hash, full_name, role_id, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      const result = stmt.run(
        uuid,
        userData.username,
        userData.email,
        userData.password_hash,
        userData.full_name,
        userData.role_id,
        status,
      );

      return this.findById(result.lastInsertRowid);
    } catch (error) {
      logger.error("Database write error inside UserRepository.create:", error);
      throw new DatabaseError(
        "Failed to write new user record to database",
        error,
      );
    }
  }

  /**
   * Updates non-null/specified attributes of a user record.
   * @param {number} id Primary key ID of target user.
   * @param {Object} userData Object containing attributes to update.
   * @returns {Object|null} Updated user object or null if user does not exist.
   */
  update(id, userData) {
    try {
      const db = dbService.getConnection();

      // Perform lookup first to ensure user exists
      const existingUser = this.findById(id);
      if (!existingUser) {
        return null;
      }

      // Build safe set clause for fields provided
      const fields = [];
      const values = [];

      const keysToUpdate = [
        "username",
        "email",
        "password_hash",
        "full_name",
        "role_id",
        "status",
        "deleted_at",
      ];

      for (const key of keysToUpdate) {
        if (userData[key] !== undefined) {
          fields.push(`${key} = ?`);
          values.push(userData[key]);
        }
      }

      if (fields.length === 0) {
        return existingUser; // No fields to update
      }

      // Append ID parameter
      values.push(id);

      const updateQuery = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
      db.prepare(updateQuery).run(...values);

      return this.findById(id, true); // Return updated user (includeDeleted = true in case we set deleted_at status)
    } catch (error) {
      logger.error(
        `Database write error inside UserRepository.update for ID ${id}:`,
        error,
      );
      throw new DatabaseError(
        `Failed to update user record for ID: ${id}`,
        error,
      );
    }
  }

  /**
   * Updates the user last login datetime stamp to CURRENT_TIMESTAMP.
   * @param {number} id Primary key ID of user.
   * @returns {boolean} True if update was successful, false if user not found.
   */
  updateLastLogin(id) {
    try {
      const db = dbService.getConnection();
      const result = db
        .prepare("UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?")
        .run(id);
      return result.changes > 0;
    } catch (error) {
      logger.error(
        `Database write error inside UserRepository.updateLastLogin for ID ${id}:`,
        error,
      );
      throw new DatabaseError(
        `Failed to update user last login stamp for ID: ${id}`,
        error,
      );
    }
  }

  /**
   * Checks if username or email exists in the database.
   * @param {string} username Username of user.
   * @param {string} email Email of user.
   * @returns {boolean} True if either exists, false otherwise.
   */
  exists(username, email) {
    try {
      const db = dbService.getConnection();
      const row = db
        .prepare("SELECT 1 FROM users WHERE username = ? OR email = ? LIMIT 1")
        .get(username, email);
      return !!row;
    } catch (error) {
      logger.error(
        `Database query error inside UserRepository.exists check for user: "${username}" / "${email}":`,
        error,
      );
      throw new DatabaseError(
        "Failed to run user existence database check",
        error,
      );
    }
  }
}

module.exports = new UserRepository();
