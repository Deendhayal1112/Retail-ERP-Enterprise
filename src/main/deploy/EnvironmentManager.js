/**
 * EnvironmentManager.js
 * Retail ERP Enterprise — Variables Configuration & Profiles Manager
 */

"use strict";

class EnvironmentManager {
  constructor() {
    this.variables = [
      { key: "DB_CONNECTION_LIMIT", value: "32", profile: "Staging", type: "Integer" },
      { key: "API_GATEWAY_TIMEOUT_MS", value: "5000", profile: "Staging", type: "Integer" },
      { key: "MAINTENANCE_NOTICE_MESSAGE", value: "System maintenance window in progress.", profile: "Production", type: "String" },
      { key: "LOG_LEVEL", value: "debug", profile: "Development", type: "String" }
    ];
  }

  async getVariables() {
    return this.variables;
  }

  async updateVariable(key, newValue) {
    const item = this.variables.find(v => v.key === key);
    if (!item) throw new Error("Variable parameter key not found.");
    item.value = newValue;
    return { success: true, variables: this.variables };
  }
}

module.exports = EnvironmentManager;
