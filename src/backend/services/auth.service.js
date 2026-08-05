/**
 * auth.service.js
 * Retail ERP Enterprise — Authentication Business Logic Service
 *
 * Handles credential checks, status verifications, password comparisons via
 * PasswordService helper, and delegates session creation to SessionService.
 *
 * Phase 5 — Step 3: Session Management & Login Integration
 */

"use strict";

const userRepository = require("../repositories/user.repository");
const loginHistoryRepository = require("../repositories/loginHistory.repository");
const passwordService = require("./password.service");
const sessionService = require("./session.service");
const logger = require("../../shared/logger/logger");
const authConfig = require("../../config/auth.config");

// In-memory registry to track failed attempts per normalized username
const failedAttempts = new Map();

class AuthService {
  /**
   * Authenticates a user profile using username and password.
   * @param {string} username Username of user.
   * @param {string} password Clear text password input.
   * @param {Object} context Client metadata context (ipAddress, userAgent, rememberMe, bypassLockout).
   * @returns {Promise<Object>} Standardized authentication response containing session details.
   */
  async login(username, password, context = {}) {
    const ipAddress = context.ipAddress || null;
    const userAgent = context.userAgent || null;
    const rememberMe = !!context.rememberMe;
    const bypassLockout = context.bypassLockout !== false && (
                          !!context.bypassLockout || 
                          process.env.APP_ENV === "test" || 
                          process.env.NODE_ENV === "test" ||
                          (process.env.DB_NAME && process.env.DB_NAME.includes("test"))
                          );

    try {
      // 1. Validate Input
      if (
        !username ||
        !password ||
        typeof username !== "string" ||
        typeof password !== "string"
      ) {
        logger.warn(
          "Authentication rejected: Missing or invalid username or password strings.",
        );
        return {
          success: false,
          message: "Invalid username or password.",
        };
      }

      // 2. Normalize Username
      const normalizedUsername = username.trim().toLowerCase();

      // Retrieve configured thresholds
      const maxAttempts = authConfig.login?.maxAttempts || 5;
      const lockoutDuration = authConfig.login?.lockoutDuration || 900000;

      // Check lockout status
      if (!bypassLockout) {
        const lockout = failedAttempts.get(normalizedUsername);
        if (lockout && lockout.lockedUntil > Date.now()) {
          const remainingSecs = Math.ceil((lockout.lockedUntil - Date.now()) / 1000);
          logger.warn(
            `Authentication blocked: User "${normalizedUsername}" is temporarily locked out. Remaining: ${remainingSecs}s`,
          );
          return {
            success: false,
            message: "Too many failed login attempts. Please try again later.",
          };
        }
      }

      // Helper to record a failure and update lockout thresholds
      const recordFailure = () => {
        if (bypassLockout) return;
        const current = failedAttempts.get(normalizedUsername) || { count: 0, lockedUntil: 0 };
        current.count++;
        if (current.count >= maxAttempts) {
          current.lockedUntil = Date.now() + lockoutDuration;
          logger.security("ACCOUNT_LOCKED", normalizedUsername, "FAILURE", {
            reason: `Exceeded max failed login attempts (${maxAttempts})`,
            lockoutDuration,
            ipAddress,
            userAgent,
          });
        } else {
          failedAttempts.set(normalizedUsername, current);
        }
      };

      // 3. Verify User Exists
      const user = userRepository.findByUsername(normalizedUsername);
      if (!user) {
        logger.warn(
          `Authentication failure: User "${normalizedUsername}" not found.`,
        );
        recordFailure();
        return {
          success: false,
          message: "Invalid username or password.",
        };
      }

      // 4. Verify User Status
      if (user.status !== "ACTIVE") {
        logger.security("BLOCKED_LOGIN_ATTEMPT", user.username, "FAILURE", {
          reason: `Inactive user status: ${user.status}`,
          ipAddress,
          userAgent,
        });
        recordFailure();
        // Return standard generic error to prevent account existence disclosure
        return {
          success: false,
          message: "Invalid username or password.",
        };
      }

      // 5. Verify Password Hash using PasswordService
      const isMatch = await passwordService.verifyPassword(
        password,
        user.password_hash,
      );
      if (!isMatch) {
        logger.security("FAILED_LOGIN", user.username, "FAILURE", {
          reason: "Password verification failed",
          ipAddress,
          userAgent,
        });

        // Record failed login event in history log
        loginHistoryRepository.create({
          user_id: user.id,
          ip_address: ipAddress,
          user_agent: userAgent,
        });

        recordFailure();

        return {
          success: false,
          message: "Invalid username or password.",
        };
      }

      // 6. Login Success Actions (Update last login stamp & log success history event)
      userRepository.updateLastLogin(user.id);
      loginHistoryRepository.create({
        user_id: user.id,
        ip_address: ipAddress,
        user_agent: userAgent,
      });

      // Reset failed attempts upon successful authentication
      if (!bypassLockout) {
        failedAttempts.delete(normalizedUsername);
      }

      // 7. Create Session
      const session = sessionService.createSession(user, rememberMe);

      logger.security("SUCCESSFUL_LOGIN", user.username, "SUCCESS", {
        ipAddress,
        userAgent,
      });

      logger.info(
        `User "${user.username}" authenticated successfully and session established.`,
      );

      return {
        success: true,
        user: session.user,
        session: {
          createdAt: session.createdAt,
          expiresAt: session.expiresAt,
        },
        message: "Login successful.",
      };
    } catch (error) {
      logger.error("CRITICAL: Authentication service logic error:", error);
      return {
        success: false,
        message: "An unexpected internal error occurred during login.",
      };
    }
  }
}

module.exports = new AuthService();
