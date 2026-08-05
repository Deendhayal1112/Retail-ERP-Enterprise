/**
 * company.repository.js
 * Retail ERP Enterprise — Company Details Repository Layer
 *
 * Implements data access layer to retrieve or update the singleton store profile configuration.
 *
 * Phase 4 — Step 4: Repository Layer
 */

"use strict";

const dbService = require("../database");
const logger = require("../../shared/logger/logger");
const { DatabaseError } = require("../../shared/errors/errorHandler");

class CompanyRepository {
  /**
   * Retrieves the active company profile from the database.
   * @returns {Object|null} Company metadata object or null if not yet configured.
   */
  getCompany() {
    try {
      const db = dbService.getConnection();
      const company = db
        .prepare("SELECT * FROM company ORDER BY id ASC LIMIT 1")
        .get();
      return company || null;
    } catch (error) {
      logger.error(
        "Database query failure inside CompanyRepository.getCompany:",
        error,
      );
      throw new DatabaseError(
        "Failed to fetch company details from database",
        error,
      );
    }
  }

  /**
   * Updates or initializes the company profile.
   * Ensures the database holds exactly one singleton record.
   * @param {Object} companyData Company parameters to save.
   * @returns {Object} Saved company profile.
   */
  updateCompany(companyData) {
    try {
      const db = dbService.getConnection();
      const existing = this.getCompany();

      if (!existing) {
        // Create initial record
        const stmt = db.prepare(`
          INSERT INTO company (
            name, legal_name, tax_id, email, phone,
            address_line1, address_line2, city, state, postal_code, country, logo_path
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(
          companyData.name || "Retail ERP Enterprise",
          companyData.legal_name || null,
          companyData.tax_id || null,
          companyData.email || null,
          companyData.phone || null,
          companyData.address_line1 || null,
          companyData.address_line2 || null,
          companyData.city || null,
          companyData.state || null,
          companyData.postal_code || null,
          companyData.country || null,
          companyData.logo_path || null,
        );
      } else {
        // Dynamically build SET query clauses for provided attributes
        const fields = [];
        const values = [];

        const keysToUpdate = [
          "name",
          "legal_name",
          "tax_id",
          "email",
          "phone",
          "address_line1",
          "address_line2",
          "city",
          "state",
          "postal_code",
          "country",
          "logo_path",
        ];

        for (const key of keysToUpdate) {
          if (companyData[key] !== undefined) {
            fields.push(`${key} = ?`);
            values.push(companyData[key]);
          }
        }

        if (fields.length > 0) {
          values.push(existing.id);
          const updateQuery = `UPDATE company SET ${fields.join(", ")} WHERE id = ?`;
          db.prepare(updateQuery).run(...values);
        }
      }

      return this.getCompany();
    } catch (error) {
      logger.error(
        "Database write error inside CompanyRepository.updateCompany:",
        error,
      );
      throw new DatabaseError("Failed to save company profile settings", error);
    }
  }
}

module.exports = new CompanyRepository();
