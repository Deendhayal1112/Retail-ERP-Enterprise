/**
 * DatabasePerformanceCenter.js
 * Retail ERP Enterprise — Database Performance & Optimization Center Dashboard
 */

"use strict";

import { DatabasePerfManagerInstance } from "../../performance/DatabasePerformanceManager.js";
import { DatabaseEvents } from "../../performance/DatabaseEvents.js";

import QueryMetricsPanel from "./widgets/QueryMetricsPanel.js";
import DatabaseHealthPanel from "./widgets/DatabaseHealthPanel.js";
import IndexMetricsPanel from "./widgets/IndexMetricsPanel.js";
import CacheMetricsPanel from "./widgets/CacheMetricsPanel.js";
import StorageMetricsPanel from "./widgets/StorageMetricsPanel.js";
import DatabaseOptimizationSuggestions from "./widgets/DatabaseOptimizationSuggestions.js";

export default class DatabasePerformanceCenter {
  constructor() {
    this.element = null;

    // Metric panels
    this.queryPanel = new QueryMetricsPanel();
    this.healthPanel = new DatabaseHealthPanel();
    this.indexPanel = new IndexMetricsPanel();
    this.cachePanel = new CacheMetricsPanel();
    this.storagePanel = new StorageMetricsPanel();
    this.suggestionsPanel = new DatabaseOptimizationSuggestions();

    this.onMetricsUpdated = this.handleMetricsUpdated.bind(this);
  }

  render() {
    const mainWrap = document.createElement("div");
    mainWrap.className = "performance-center-wrapper";

    // 1. Header Row
    const header = document.createElement("header");
    header.className = "performance-header-row";
    header.innerHTML = `
      <div class="performance-header-info">
        <h1 class="performance-title">Database Tuning</h1>
        <p class="performance-subtitle">SQLite query profiling, index health, WAL monitoring, and cache efficiency</p>
      </div>
      <div class="performance-header-actions">
        <button class="perf-btn-primary btn-db-export" aria-label="Export Database Diagnostics">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          Export Diagnostics
        </button>
      </div>
    `;
    mainWrap.appendChild(header);

    // 2. Scrollable Body
    const layoutBody = document.createElement("div");
    layoutBody.className = "performance-center-layout";

    // 3x2 grid of metric panels
    const grid = document.createElement("div");
    grid.className = "performance-dashboard-grid";

    grid.appendChild(this.queryPanel.render());
    grid.appendChild(this.healthPanel.render());
    grid.appendChild(this.indexPanel.render());
    grid.appendChild(this.cachePanel.render());
    grid.appendChild(this.storagePanel.render());

    layoutBody.appendChild(grid);

    // Bottom suggestions panel
    layoutBody.appendChild(this.suggestionsPanel.render());

    mainWrap.appendChild(layoutBody);
    this.element = mainWrap;

    // Export button binding
    const exportBtn = header.querySelector(".btn-db-export");
    if (exportBtn) {
      exportBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleExport();
      });
    }

    // Start telemetry loop and subscribe to updates
    DatabaseEvents.on("db-metrics-updated", this.onMetricsUpdated);
    DatabasePerfManagerInstance.start();

    return mainWrap;
  }

  handleMetricsUpdated(data) {
    if (!this.element) return;

    this.queryPanel.update(data.current);
    this.healthPanel.update(data.current);
    this.indexPanel.update(data.current);
    this.cachePanel.update(data.current);
    this.storagePanel.update(data.current);
    this.suggestionsPanel.update(data.current);
  }

  handleExport() {
    if (window.Toast) {
      window.Toast.show("Database diagnostics exported to clipboard!", "success", 3000);
    }
    const payload = {
      timestamp: new Date().toISOString(),
      history: DatabasePerfManagerInstance.getHistory(),
      alerts: DatabasePerfManagerInstance.getAlerts()
    };
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2)).catch(err => {
      console.error("Clipboard copy failed:", err);
    });
  }

  destroy() {
    DatabaseEvents.off("db-metrics-updated", this.onMetricsUpdated);
    DatabasePerfManagerInstance.stop();
  }
}
