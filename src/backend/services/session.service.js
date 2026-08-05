/**
 * session.service.js
 * Retail ERP Enterprise — Session Management Service
 *
 * Implements session lifecycles including in-memory state tracking,
 * expiration timeouts, remember-me options, and logouts.
 *
 * Phase 5 — Step 3: Session Management & Login Integration
 */

"use strict";

const Store = require("electron-store");
const authConfig = require("../../config/auth.config");
const logger = require("../../shared/logger/logger");

// Initialize electron-store registry for session cache
const store = new Store({ name: "user-session" });

class SessionService {
  constructor() {
    this.currentSession = null;
    this.timeoutCheckInterval = null;
  }

  /**
   * Generates a new active session for a successfully authenticated user.
   * @param {Object} user User profile details.
   * @param {boolean} rememberMe Cache session across app launches.
   * @returns {Object} Active session metadata block.
   */
  createSession(user, rememberMe = false) {
    try {
      this.destroySession(); // Ensure any existing session is cleared first

      const now = Date.now();
      const maxAge = authConfig.session.cookie.maxAge || 8 * 60 * 60 * 1000; // Default to 8 Hours
      const expiresAt = now + maxAge;

      const sessionData = {
        user: {
          id: user.id,
          uuid: user.uuid,
          username: user.username,
          email: user.email,
          full_name: user.full_name,
          role_id: user.role_id,
          status: user.status,
        },
        createdAt: now,
        expiresAt,
        rememberMe,
      };

      this.currentSession = sessionData;

      if (rememberMe) {
        store.set("active_session", sessionData);
      }

      logger.info(
        `Session created successfully for user: "${user.username}". Expires at: ${new Date(expiresAt).toISOString()}`,
      );

      // Start polling/monitoring session timeouts
      this.startSessionTimeoutMonitor();

      return sessionData;
    } catch (error) {
      logger.error("CRITICAL: Failed to create user session:", error);
      throw error;
    }
  }

  /**
   * Retrieves the current user session block if active and valid.
   * @returns {Object|null} Active session details or null.
   */
  getSession() {
    // If not in-memory, try to restore from persistent store
    if (!this.currentSession) {
      this.restoreSession();
    }

    if (!this.currentSession) {
      return null;
    }

    // Check expiration bounds
    if (Date.now() >= this.currentSession.expiresAt) {
      logger.info("User session expired. Auto-destroying active session.");
      this.destroySession();
      return null;
    }

    return this.currentSession;
  }

  /**
   * Checks validity of the current active session.
   * @returns {boolean} True if active session is valid and unexpired.
   */
  validateSession() {
    return this.getSession() !== null;
  }

  /**
   * Clears the current active session.
   */
  destroySession() {
    try {
      this.stopSessionTimeoutMonitor();
      this.currentSession = null;
      store.delete("active_session");
      logger.info("Active session successfully destroyed.");
    } catch (error) {
      logger.error("Error occurred while destroying session:", error);
    }
  }

  /**
   * Restores session context from cache/store.
   * @returns {Object|null} Restored session or null.
   */
  restoreSession() {
    try {
      const cachedSession = store.get("active_session");
      if (cachedSession) {
        if (Date.now() < cachedSession.expiresAt) {
          this.currentSession = cachedSession;
          this.startSessionTimeoutMonitor();
          logger.info(
            `Session restored successfully from cache for user: "${cachedSession.user.username}"`,
          );
          return cachedSession;
        } else {
          // Cached session is expired, clean it up
          store.delete("active_session");
        }
      }
    } catch (error) {
      logger.warn("Failed to restore session from cache:", error);
    }
    return null;
  }

  /**
   * Standard user logout handler.
   */
  logout() {
    logger.info("Processing user logout action.");
    this.destroySession();
  }

  /**
   * Monitors session timeouts in the background.
   */
  startSessionTimeoutMonitor() {
    this.stopSessionTimeoutMonitor(); // Reset any existing check interval

    // Check every 30 seconds
    this.timeoutCheckInterval = setInterval(() => {
      if (this.currentSession && Date.now() >= this.currentSession.expiresAt) {
        logger.info(
          "Background monitor detected session timeout. Destroying...",
        );
        this.destroySession();

        // Notify the renderer to reload/redirect to login page
        const windowManager = require("../../main/managers/windowManager");
        const mainWindow = windowManager.getMainWindow();
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send("auth:session-expired");
        }
      }
    }, 30000);

    // Prevent blocking Node process from exiting
    if (this.timeoutCheckInterval.unref) {
      this.timeoutCheckInterval.unref();
    }
  }

  /**
   * Clears session timeout background polling check.
   */
  stopSessionTimeoutMonitor() {
    if (this.timeoutCheckInterval) {
      clearInterval(this.timeoutCheckInterval);
      this.timeoutCheckInterval = null;
    }
  }
}

module.exports = new SessionService();
