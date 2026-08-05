/**
 * LogManager.js
 * Retail ERP Enterprise — Structured Diagnostic Logs Simulator
 */

"use strict";

export default class LogManager {
  constructor() {
    this.logs = [
      { timestamp: new Date(Date.now() - 60000).toLocaleTimeString(), level: "info", type: "app", message: "Application bootstrap sequence loaded successfully" },
      { timestamp: new Date(Date.now() - 40000).toLocaleTimeString(), level: "info", type: "database", message: "SQLite dynamic page storage checks verify vacuum status clean" },
      { timestamp: new Date(Date.now() - 20000).toLocaleTimeString(), level: "info", type: "performance", message: "Core event listeners and timing channels are within budget" }
    ];
  }

  collect() {
    const types = ["app", "database", "performance", "error"];
    const msgs = {
      app: ["IPC context bridge whitelisted channels initialized safely", "Operator session validated successfully", "Navigation state updated to settings viewport"],
      database: ["Reindexed sales history tables successfully", "Database cache hit rate optimal (95.4%)", "Write transactions commit finalized in WAL"],
      performance: ["Heap allocation checked: 48 MB", "Vite assets cache hit rate at 88%", "Startup profile latency target achieved: 1.8s"],
      error: ["Connection pool timeout ping warning", "Retry limits invoked for background sync check", "Vaccum fragmentation exceeds 15% alert threshold"]
    };

    if (Math.random() > 0.85) {
      const type = types[Math.floor(Math.random() * types.length)];
      const list = msgs[type];
      const message = list[Math.floor(Math.random() * list.length)];
      const level = type === "error" ? "error" : "info";
      
      this.logs.unshift({
        timestamp: new Date().toLocaleTimeString(),
        level,
        type,
        message
      });

      if (this.logs.length > 50) this.logs.pop();
    }

    return this.logs;
  }
}
