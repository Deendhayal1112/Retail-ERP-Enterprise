"use strict";

/**
 * auth.config.js
 * Retail ERP Enterprise — Authentication Configuration
 *
 * Configuration for authentication, session management, and security.
 * Covers bcrypt password hashing, JWT token signing, and session rules.
 * All secrets MUST come from environment variables — never hardcoded.
 *
 * Phase 1 — Step 4: Application Configuration Integration
 */

require("./secrets");

// ─────────────────────────────────────────────
// GUARD: Fail fast if secrets are not set
// in production environment.
// ─────────────────────────────────────────────
const isProduction = process.env.APP_ENV === "production";

if (isProduction) {
  const required = ["SESSION_SECRET", "JWT_SECRET"];
  required.forEach((key) => {
    if (!process.env[key] || process.env[key].length < 32) {
      throw new Error(
        `[auth.config] FATAL: ${key} is missing or too short. ` +
          `Set a random string of at least 64 characters in .env.`,
      );
    }
  });
}

// ─────────────────────────────────────────────────────────────────────
// AUTH CONFIGURATION
// ─────────────────────────────────────────────────────────────────────
const authConfig = {
  // ─────────────────────────────────────────────
  // BCRYPT — Password Hashing
  // ─────────────────────────────────────────────
  bcrypt: {
    // Cost factor (rounds). Higher = slower = more secure.
    // 12 rounds is the enterprise minimum (tested ~250ms per hash on modern hardware).
    rounds: parseInt(process.env.BCRYPT_ROUNDS, 10) || 12,
  },

  // ─────────────────────────────────────────────
  // JWT — JSON Web Token Session
  // ─────────────────────────────────────────────
  jwt: {
    secret: process.env.JWT_SECRET || "dev-jwt-secret-replace-in-production",
    expiresIn: process.env.JWT_EXPIRES_IN || "8h",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    algorithm: "HS256",
    issuer: "retail-erp-enterprise",
    audience: "retail-erp-client",
  },

  // ─────────────────────────────────────────────
  // SESSION — Express Session Settings
  // ─────────────────────────────────────────────
  session: {
    secret:
      process.env.SESSION_SECRET || "dev-session-secret-replace-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: isProduction, // HTTPS only in production
      httpOnly: true, // Not accessible via JS (XSS protection)
      maxAge: 8 * 60 * 60 * 1000, // 8 hours in milliseconds
      sameSite: "strict",
    },
  },

  // ─────────────────────────────────────────────
  // LOGIN RULES
  // ─────────────────────────────────────────────
  login: {
    maxAttempts: parseInt(process.env.LOGIN_RATE_LIMIT_MAX, 10) || 5,
    lockoutDuration:
      parseInt(process.env.LOGIN_RATE_LIMIT_WINDOW_MS, 10) || 900000, // 15 min
    usernameMinLength: 3,
    usernameMaxLength: 50,
    passwordMinLength: 8,
    passwordMaxLength: 128,
  },

  // ─────────────────────────────────────────────
  // DEFAULT ADMIN (used by database seeder only)
  // IMPORTANT: Change password after first login
  // ─────────────────────────────────────────────
  defaultAdmin: {
    username: "admin",
    email: "admin@retailerp.local",
    displayName: "System Administrator",
    role: "admin",
    // Password is hashed by the seeder — never stored in plain text
    defaultPassword: "Admin@123!",
  },

  // ─────────────────────────────────────────────
  // TOKEN TYPES
  // ─────────────────────────────────────────────
  tokenTypes: {
    ACCESS: "access",
    REFRESH: "refresh",
  },

  // ─────────────────────────────────────────────
  // USER ROLES
  // ─────────────────────────────────────────────
  roles: {
    ADMIN: "admin",
    MANAGER: "manager",
    CASHIER: "cashier",
    VIEWER: "viewer",
  },
};

module.exports = authConfig;
