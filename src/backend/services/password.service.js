/**
 * password.service.js
 * Retail ERP Enterprise — Password Encryption & Verification Service
 *
 * Implements password hashing via bcrypt, secure constant-time verification,
 * and robust password policy validation rules.
 *
 * Phase 5 — Step 2: Password Encryption & Verification
 */

"use strict";

const bcrypt = require("bcryptjs");
const authConfig = require("../../config/auth.config");
const logger = require("../../shared/logger/logger");

class PasswordService {
  /**
   * Hashes a plain text password using bcrypt.
   * @param {string} password Plain text password string.
   * @returns {Promise<string>} The generated secure password hash.
   */
  async hashPassword(password) {
    try {
      const rounds = authConfig.bcrypt.rounds || 12;
      return await bcrypt.hash(password, rounds);
    } catch (error) {
      logger.error("CRITICAL: Password hashing failed:", error);
      throw error;
    }
  }

  /**
   * Securely compares a plain text password to a stored hash.
   * Protects against timing attacks.
   * @param {string} password Plain text password string.
   * @param {string} hash Stored bcrypt hash string.
   * @returns {Promise<boolean>} True if matching, false otherwise.
   */
  async verifyPassword(password, hash) {
    try {
      if (!password || !hash) return false;
      return await bcrypt.compare(password, hash);
    } catch (error) {
      logger.error("CRITICAL: Password comparison failed:", error);
      return false;
    }
  }

  /**
   * Validates a password against system password complexity guidelines.
   * @param {string} password Plain text password to validate.
   * @returns {Object} Validation outcome { isValid: boolean, errors: string[] }.
   */
  validatePasswordStrength(password) {
    const errors = [];
    const minLength = authConfig.login.passwordMinLength || 8;

    if (!password || typeof password !== "string") {
      return {
        isValid: false,
        errors: ["Password must be a valid text string."],
      };
    }

    if (password.length < minLength) {
      errors.push(
        `Password must be at least ${minLength} characters in length.`,
      );
    }

    // Complexity rules validation
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must include at least one uppercase letter (A-Z).");
    }

    if (!/[a-z]/.test(password)) {
      errors.push("Password must include at least one lowercase letter (a-z).");
    }

    if (!/[0-9]/.test(password)) {
      errors.push("Password must include at least one numerical digit (0-9).");
    }

    // Special characters check: includes common ASCII symbols
    if (!/[!@#$%^&*(),.?":{}|<>\-_]/.test(password)) {
      errors.push(
        "Password must include at least one special character (e.g. !, @, #, $, %, ^, *).",
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

module.exports = new PasswordService();
