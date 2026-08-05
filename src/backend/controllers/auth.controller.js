/**
 * auth.controller.js
 * Retail ERP Enterprise — Authentication Endpoint Controller
 *
 * Exposes login handler for Express router endpoints and direct invocation (e.g. via Electron IPC).
 * Handles inputs retrieval, executes authentication services, and outputs JSON payloads.
 *
 * Phase 5 — Step 3: Session Management & Login Integration
 */

"use strict";

const authService = require("../services/auth.service");
const sessionService = require("../services/session.service");
const logger = require("../../shared/logger/logger");

class AuthController {
  /**
   * Login handler endpoint for Express HTTP requests.
   * @param {Request} req Express Request object.
   * @param {Response} res Express Response object.
   */
  async login(req, res) {
    try {
      const { username, password, rememberMe } = req.body || {};

      const result = await authService.login(username, password, {
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        rememberMe: !!rememberMe,
      });

      if (result.success) {
        return res.status(200).json(result);
      } else {
        // Return 401 Unauthorized for credentials failure or inactive accounts
        return res.status(401).json(result);
      }
    } catch (error) {
      logger.error("CRITICAL: Login controller exception caught:", error);
      return res.status(500).json({
        success: false,
        message: "An unexpected internal error occurred during login.",
      });
    }
  }

  /**
   * Directly authenticates credentials via internal calls (e.g. Electron IPC handlers).
   * @param {Object} credentials User inputs (username, password, rememberMe).
   * @param {Object} context Metadata environment (ipAddress, userAgent).
   * @returns {Promise<Object>} Standardized outcome block.
   */
  async loginDirect(credentials, context = {}) {
    try {
      const { username, password, rememberMe } = credentials || {};
      return await authService.login(username, password, {
        ipAddress: context.ipAddress || "127.0.0.1",
        userAgent: context.userAgent || "ElectronMainProcess",
        rememberMe: !!rememberMe,
      });
    } catch (error) {
      logger.error(
        "CRITICAL: Direct login controller execution failure:",
        error,
      );
      return {
        success: false,
        message: "An unexpected internal error occurred during login.",
      };
    }
  }

  /**
   * Directly logs out the active session.
   * @returns {Object} Logout response status.
   */
  logoutDirect() {
    try {
      sessionService.logout();
      return { success: true, message: "Logged out successfully." };
    } catch (error) {
      logger.error("CRITICAL: Logout execution failure:", error);
      return { success: false, message: "Failed to log out cleanly." };
    }
  }

  /**
   * Retrieves the active session if existing.
   * @returns {Object|null} Active session context or null.
   */
  getSessionDirect() {
    try {
      const session = sessionService.getSession();
      if (session) {
        return {
          success: true,
          user: session.user,
          expiresAt: session.expiresAt,
        };
      }
      return null;
    } catch (error) {
      logger.error("CRITICAL: Failed to retrieve active session:", error);
      return null;
    }
  }
}

module.exports = new AuthController();
