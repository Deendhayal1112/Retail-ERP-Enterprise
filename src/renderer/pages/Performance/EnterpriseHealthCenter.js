/**
 * EnterpriseHealthCenter.js
 * Retail ERP Enterprise — Overall System Diagnostics Monitoring Dashboard Page
 */

"use strict";

import { HealthManagerInstance } from "../../performance/HealthManager.js";
import { HealthEvents } from "../../performance/HealthEvents.js";

import SystemHealthPanel from "./widgets/SystemHealthPanel.js";
import ApplicationHealthPanel from "./widgets/ApplicationHealthPanel.js";
import DiagnosticsPanel from "./widgets/DiagnosticsPanel.js";
import LogViewer from "./widgets/LogViewer.js";
import RecommendationPanel from "./widgets/RecommendationPanel.js";

export default class EnterpriseHealthCenter {
  constructor() {
    this.element = null;

    this.systemPanel = new SystemHealthPanel();
    this.appPanel = new ApplicationHealthPanel();
    this.diagnosticsPanel = new DiagnosticsPanel();
    this.logViewer = new LogViewer();
    this.recPanel = new RecommendationPanel();

    this.onMetricsUpdated = this.handleMetricsUpdated.bind(this);
  }

  render() {
    const mainWrap = document.createElement("div");
    mainWrap.className = "performance-center-wrapper";

    // Header
    const header = document.createElement("header");
    header.className = "performance-header-row";
    header.innerHTML = `
      <div class="performance-header-info">
        <h1 class="performance-title">System Diagnostics</h1>
        <p class="performance-subtitle">Overall application health monitoring, CPU/RAM levels, database indices, and error logs</p>
      </div>
      <div class="performance-header-actions">
        <button class="perf-btn-primary btn-run-diagnostics" aria-label="Trigger Diagnostics Check">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          Run Diagnostics
        </button>
        <button class="perf-btn-primary btn-diagnostics-export" aria-label="Export Diagnostic Bundle" style="background-color:var(--neutral-700);">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          Export Bundle
        </button>
      </div>
    `;
    mainWrap.appendChild(header);

    // Scrollable layout body
    const layoutBody = document.createElement("div");
    layoutBody.className = "performance-center-layout";

    // 3-column top grid (System, App, Diagnostics)
    const grid = document.createElement("div");
    grid.className = "performance-dashboard-grid";
    grid.style.gridTemplateColumns = "repeat(auto-fit, minmax(280px, 1fr))";

    grid.appendChild(this.systemPanel.render());
    grid.appendChild(this.appPanel.render());
    grid.appendChild(this.diagnosticsPanel.render());

    layoutBody.appendChild(grid);

    // Log viewer below
    layoutBody.appendChild(this.logViewer.render());

    // Recommendations at bottom
    layoutBody.appendChild(this.recPanel.render());

    mainWrap.appendChild(layoutBody);
    this.element = mainWrap;

    // Action button bindings
    const checkBtn = header.querySelector(".btn-run-diagnostics");
    if (checkBtn) {
      checkBtn.addEventListener("click", (e) => {
        e.preventDefault();
        HealthManagerInstance.collect();
        if (window.Toast) window.Toast.show("System diagnostic evaluation complete.", "success", 2000);
      });
    }

    const exportBtn = header.querySelector(".btn-diagnostics-export");
    if (exportBtn) {
      exportBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleExport();
      });
    }

    // Subscribe to events and start telemetry loop
    HealthEvents.on("health-metrics-updated", this.onMetricsUpdated);
    HealthManagerInstance.start();

    return mainWrap;
  }

  handleMetricsUpdated(data) {
    if (!this.element) return;
    this.systemPanel.update(data.current);
    this.appPanel.update(data.current);
    this.diagnosticsPanel.update(data.current);
    this.logViewer.update(data.current.logs);
    this.recPanel.update(data.current);
  }

  handleExport() {
    HealthManagerInstance.triggerDiagnosticsBundle();
    if (window.Toast) window.Toast.show("Diagnostic bundle generated & copied to clipboard!", "success", 3000);
    const payload = {
      timestamp: new Date().toISOString(),
      history: HealthManagerInstance.getHistory(),
      alerts: HealthManagerInstance.getAlerts()
    };
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2)).catch(err => {
      console.error("Clipboard copy failed:", err);
    });
  }

  destroy() {
    HealthEvents.off("health-metrics-updated", this.onMetricsUpdated);
    HealthManagerInstance.stop();
  }
}
