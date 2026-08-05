/**
 * role.repository.js
 * Retail ERP Enterprise — Roles Repository Layer
 *
 * Exposes methods to query lookup roles definitions from the database.
 * No direct SQL calls should be executed outside this repository.
 *
 * Phase 4 — Step 4: Repository Layer
 */

"use strict";

const dbService = require("../database");
const logger = require("../../shared/logger/logger");
const { DatabaseError } = require("../../shared/errors/errorHandler");

class RoleRepository {
  /**
   * Fetches all registered roles.
   * @returns {Array<Object>} List of roles.
   */
  findAll() {
    try {
      const db = dbService.getConnection();
      return db.prepare("SELECT * FROM roles ORDER BY id ASC").all();
    } catch (error) {
      logger.error(
        "Database query failure inside RoleRepository.findAll:",
        error,
      );
      throw new DatabaseError("Failed to fetch roles from database", error);
    }
  }

  /**
   * Fetches a role by its unique ID.
   * @param {number} id Unique role database ID.
   * @returns {Object|null} Role record or null if not found.
   */
  findById(id) {
    try {
      const db = dbService.getConnection();
      const role = db.prepare("SELECT * FROM roles WHERE id = ?").get(id);
      return role || null;
    } catch (error) {
      logger.error(
        `Database query failure inside RoleRepository.findById for ID ${id}:`,
        error,
      );
      throw new DatabaseError(`Failed to fetch role by ID: ${id}`, error);
    }
  }

  /**
   * Fetches a role by its unique system name.
   * @param {string} name Unique name of role.
   * @returns {Object|null} Role record or null if not found.
   */
  findByName(name) {
    try {
      const db = dbService.getConnection();
      const role = db.prepare("SELECT * FROM roles WHERE name = ?").get(name);
      return role || null;
    } catch (error) {
      logger.error(
        `Database query failure inside RoleRepository.findByName for name "${name}":`,
        error,
      );
      throw new DatabaseError(`Failed to fetch role by name: ${name}`, error);
    }
  }
}

module.exports = new RoleRepository();
