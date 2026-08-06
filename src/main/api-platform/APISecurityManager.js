/**
 * APISecurityManager.js
 * Retail ERP Enterprise — Enterprise API Security & Keys Manager
 *
 * Manages API key generation, scopes, token validation, and audit log entries.
 * Architecture only — no real cryptography or network authentication is performed.
 */

"use strict";

const logger = require("../../shared/logger/logger");
const crypto = require("crypto");

// All available OAuth-style permission scopes
const ALL_SCOPES = [
  "products:read", "products:write", "products:delete",
  "inventory:read", "inventory:write",
  "sales:read", "sales:write",
  "purchases:read", "purchases:write",
  "customers:read", "customers:write",
  "reports:read",
  "webhooks:manage",
  "admin:full"
];

class APISecurityManager {
  constructor() {
    /**
     * Registered API key records.
     */
    this.apiKeys = [
      {
        id: "key-001",
        label: "ERP Internal Default Key",
        key: "erpk_live_4xR8mKqP2zT9vLfWnJdY7cUhSbAoEgXi",
        scopes: ["products:read", "inventory:read", "sales:read", "customers:read", "reports:read"],
        createdAt: "2026-08-01T10:00:00Z",
        lastUsed: "2026-08-06T04:30:00Z",
        status: "active",
        createdBy: "Karthik Subramanian"
      },
      {
        id: "key-002",
        label: "Warehouse Integration Key",
        key: "erpk_live_7mNqXvZ3tKjRpLwFeDcYuAhGsBiOoQn9",
        scopes: ["inventory:read", "inventory:write", "products:read"],
        createdAt: "2026-08-03T09:00:00Z",
        lastUsed: "2026-08-05T22:00:00Z",
        status: "active",
        createdBy: "Manjunath Gowda"
      },
      {
        id: "key-003",
        label: "Reporting Dashboard Key",
        key: "erpk_live_2cBvPkLrXiZmNdQfGtWoYeJhUsTaOu8p",
        scopes: ["reports:read", "sales:read", "purchases:read"],
        createdAt: "2026-07-25T08:00:00Z",
        lastUsed: "2026-08-04T18:00:00Z",
        status: "revoked",
        createdBy: "Ramanathan Iyer"
      }
    ];

    /**
     * Audit log trail entries.
     */
    this.auditLogs = [
      { id: "audit-001", action: "API_KEY_CREATED",  keyId: "key-001", actor: "Karthik Subramanian", timestamp: "2026-08-01T10:00:00Z", ip: "192.168.1.10" },
      { id: "audit-002", action: "API_KEY_CREATED",  keyId: "key-002", actor: "Manjunath Gowda",      timestamp: "2026-08-03T09:00:00Z", ip: "192.168.1.22" },
      { id: "audit-003", action: "API_KEY_REVOKED",  keyId: "key-003", actor: "Karthik Subramanian", timestamp: "2026-08-05T10:00:00Z", ip: "192.168.1.10" },
      { id: "audit-004", action: "API_REQUEST",      keyId: "key-001", actor: "System",               timestamp: "2026-08-06T04:30:00Z", ip: "127.0.0.1",   detail: "GET /api/v1/products" },
      { id: "audit-005", action: "API_REQUEST",      keyId: "key-002", actor: "System",               timestamp: "2026-08-05T22:00:00Z", ip: "127.0.0.1",   detail: "GET /api/v1/inventory" }
    ];
  }

  /**
   * Returns all registered API keys.
   */
  getAPIKeys() {
    logger.debug("[APISecurityManager] Fetching all API keys registry.");
    return this.apiKeys.map(k => ({
      ...k,
      key: this._maskKey(k.key) // Always return masked key in listings
    }));
  }

  /**
   * Generates a new API key entry (mock generation only).
   * @param {Object} data - { label, scopes, createdBy }
   */
  generateKey(data) {
    logger.info(`[APISecurityManager] Generating mock API key: ${data.label}`);
    if (!data.label || !data.scopes || !Array.isArray(data.scopes)) {
      throw new Error("Invalid key generation parameters: label and scopes are required.");
    }

    const rawKey = `erpk_live_${crypto.randomBytes(18).toString("base64url")}`;
    const newKey = {
      id: `key-${Date.now()}`,
      label: data.label,
      key: rawKey,
      scopes: data.scopes.filter(s => ALL_SCOPES.includes(s)),
      createdAt: new Date().toISOString(),
      lastUsed: null,
      status: "active",
      createdBy: data.createdBy || "Operator"
    };

    this.apiKeys.push(newKey);
    this._addAuditLog("API_KEY_CREATED", newKey.id, data.createdBy || "Operator");

    // Return full key ONCE upon creation — renderer must store it
    return { success: true, key: newKey };
  }

  /**
   * Revokes an existing API key by ID.
   * @param {string} id - Key identifier
   */
  revokeKey(id) {
    logger.info(`[APISecurityManager] Revoking API key: ${id}`);
    const key = this.apiKeys.find(k => k.id === id);
    if (!key) throw new Error(`API key not found: ${id}`);
    if (key.status === "revoked") throw new Error(`API key already revoked: ${id}`);

    key.status = "revoked";
    this._addAuditLog("API_KEY_REVOKED", id, "Operator");
    return { success: true, id };
  }

  /**
   * Returns audit log trail entries.
   */
  getAuditLogs() {
    logger.debug("[APISecurityManager] Fetching audit trail logs.");
    return [...this.auditLogs].reverse(); // Return most recent first
  }

  /**
   * Returns all available permission scopes.
   */
  getAvailableScopes() {
    return ALL_SCOPES;
  }

  /**
   * Validates a raw API key (mock validation).
   * @param {string} rawKey
   */
  validateKey(rawKey) {
    const match = this.apiKeys.find(k => k.key === rawKey && k.status === "active");
    if (!match) return { valid: false };
    return { valid: true, keyId: match.id, scopes: match.scopes };
  }

  // ─── Private Helpers ─────────────────────────────────────────────────────────

  _maskKey(key) {
    if (!key || key.length < 12) return "****";
    return `${key.slice(0, 12)}${"*".repeat(20)}${key.slice(-4)}`;
  }

  _addAuditLog(action, keyId, actor) {
    this.auditLogs.push({
      id: `audit-${Date.now()}`,
      action,
      keyId,
      actor,
      timestamp: new Date().toISOString(),
      ip: "127.0.0.1"
    });
  }
}

module.exports = new APISecurityManager();
