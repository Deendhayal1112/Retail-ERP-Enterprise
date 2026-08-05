"use strict";

/**
 * secrets.js
 * Retail ERP Enterprise — Production Configuration & Secrets Loader
 *
 * Dynamically resolves execution environments. Loads dotenv in development,
 * and securely generates/caches session/JWT keys under app userData in production.
 *
 * Phase 7 — Step 6: Production Secrets Management
 */

const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

let isPackaged = false;
let userDataPath = "";

// 1. Resolve Electron Process Context
try {
  const { app } = require("electron");
  if (app) {
    isPackaged = app.isPackaged;
    userDataPath = app.getPath("userData");
  }
} catch (e) {
  // Fallback for non-Electron contexts (e.g. testing)
}

// 2. Safe development dotenv loading
if (!isPackaged) {
  try {
    require("dotenv").config();
  } catch (e) {
    // Ignore missing dotenv in dev/test fallbacks
  }
}

// 3. Set APP_ENV
if (isPackaged) {
  process.env.APP_ENV = "production";
} else {
  process.env.APP_ENV = process.env.APP_ENV || "development";
}

// 4. Provision and load secrets in production
if (process.env.APP_ENV === "production" && userDataPath) {
  const configDir = path.join(userDataPath, "config");
  const secretsFilePath = path.join(configDir, "secrets.json");

  // Ensure config folder exists
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  let secrets = {};
  if (fs.existsSync(secretsFilePath)) {
    try {
      secrets = JSON.parse(fs.readFileSync(secretsFilePath, "utf8"));
    } catch (e) {
      // File corrupted, parse failure, fallback to empty
    }
  }

  let modified = false;

  // Verify / Provision SESSION_SECRET
  if (!secrets.SESSION_SECRET || secrets.SESSION_SECRET.length < 64) {
    secrets.SESSION_SECRET = crypto.randomBytes(32).toString("hex");
    modified = true;
  }

  // Verify / Provision JWT_SECRET
  if (!secrets.JWT_SECRET || secrets.JWT_SECRET.length < 64) {
    secrets.JWT_SECRET = crypto.randomBytes(32).toString("hex");
    modified = true;
  }

  // Persist generated keys
  if (modified) {
    fs.writeFileSync(secretsFilePath, JSON.stringify(secrets, null, 2), "utf8");
  }

  // Populate environment variables for application config consumers
  process.env.SESSION_SECRET = secrets.SESSION_SECRET;
  process.env.JWT_SECRET = secrets.JWT_SECRET;
}

// 5. Dynamic Path Mapping for Database and Logs directories
if (isPackaged && userDataPath) {
  if (!process.env.DB_PATH) {
    process.env.DB_PATH = path.join(userDataPath, "database");
  }
  if (!process.env.LOG_PATH) {
    process.env.LOG_PATH = path.join(userDataPath, "logs");
  }
} else {
  // Dev / Test Environment Fallbacks
  if (!process.env.DB_PATH) {
    process.env.DB_PATH = path.resolve("./database");
  }
  if (!process.env.LOG_PATH) {
    process.env.LOG_PATH = path.resolve("./logs");
  }
}

module.exports = {
  isPackaged,
  userDataPath,
};
