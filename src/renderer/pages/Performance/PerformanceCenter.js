/**
 * PerformanceCenter.js
 * Retail ERP Enterprise — Reusable Performance Center Dashboard Page
 */

"use strict";

import { PerformanceCenterManager } from "../../performance/PerformanceManager.js";
import { PerformanceEvents } from "../../performance/PerformanceEvents.js";

import RendererMetrics from "./widgets/RendererMetrics.js";
import MemoryMetrics from "./widgets/MemoryMetrics.js";
import DatabaseMetrics from "./widgets/DatabaseMetrics.js";
import StartupMetrics from "./widgets/StartupMetrics.js";
import ServiceMetrics from "./widgets/ServiceMetrics.js";
import IPCMetrics from "./widgets/IPCMetrics.js";

export default class PerformanceCenter {
  constructor() {
    this.element = null;
    
    // Widgets
    this.rendererMetrics = new RendererMetrics();
    this.memoryMetrics = new MemoryMetrics();
    this.databaseMetrics = new DatabaseMetrics();
    this.startupMetrics = new StartupMetrics();
    this.serviceMetrics = new ServiceMetrics();
    this.ipcMetrics = new IPCMetrics();

    // Store callbacks for unbind cleanup
    this.onMetricsUpdated = this.handleMetricsUpdated.bind(this);
  }

  render() {
    const mainWrap = document.createElement("div");
    mainWrap.className = "performance-center-wrapper";

    // 1. Header Bar Row
    const header = document.createElement("header");
    header.className = "performance-header-row";
    header.innerHTML = `
      <div class="performance-header-info">
        <h1 class="performance-title">Performance Center</h1>
        <p class="performance-subtitle">Real-time system telemetry and resource diagnostics</p>
      </div>
      <div class="performance-header-actions">
        <button class="perf-btn-primary btn-diagnostic-export" aria-label="Export Diagnostics File">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          Export Diagnostics
        </button>
      </div>
    `;
    mainWrap.appendChild(header);

    // 2. Scrollable Body
    const layoutBody = document.createElement("div");
    layoutBody.className = "performance-center-layout";

    // A. Visual Grid mapping 6 widgets
    const dashboardGrid = document.createElement("div");
    dashboardGrid.className = "performance-dashboard-grid";
    
    dashboardGrid.appendChild(this.rendererMetrics.render());
    dashboardGrid.appendChild(this.memoryMetrics.render());
    dashboardGrid.appendChild(this.databaseMetrics.render());
    dashboardGrid.appendChild(this.startupMetrics.render());
    dashboardGrid.appendChild(this.serviceMetrics.render());
    dashboardGrid.appendChild(this.ipcMetrics.render());

    layoutBody.appendChild(dashboardGrid);

    // B. Bottom Logs Panel
    const logsPanel = document.createElement("div");
    logsPanel.className = "performance-logs-panel";
    logsPanel.innerHTML = `
      <h3 style="margin:0; font-size:16px; font-weight:700; color:#1E293B; display:flex; align-items:center; gap:8px;">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        System Performance Alerts log
      </h3>
      <div class="logs-list-wrapper">
        <div style="color:var(--neutral-500); font-size:13px; text-align:center; padding:16px;">No alert violations logged in this session.</div>
      </div>
    `;
    layoutBody.appendChild(logsPanel);

    mainWrap.appendChild(layoutBody);
    this.element = mainWrap;

    // Bind event handlers
    const exportBtn = header.querySelector(".btn-diagnostic-export");
    if (exportBtn) {
      exportBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleExport();
      });
    }

    // Initialize telemetry manager and listeners
    PerformanceEvents.on("metrics-updated", this.onMetricsUpdated);
    PerformanceCenterManager.start();

    return mainWrap;
  }

  handleMetricsUpdated(data) {
    if (!this.element) return;

    // Update individual widgets
    this.rendererMetrics.update(data.current);
    this.memoryMetrics.update(data.current);
    this.databaseMetrics.update(data.current);
    this.startupMetrics.update(data.current);
    this.serviceMetrics.update(data.current);
    this.ipcMetrics.update(data.current);

    // Update alerts list log
    const wrapper = this.element.querySelector(".logs-list-wrapper");
    if (!wrapper) return;

    if (data.logs.length === 0) {
      wrapper.innerHTML = `<div style="color:var(--neutral-500); font-size:13px; text-align:center; padding:16px;">No alert violations logged in this session.</div>`;
    } else {
      wrapper.innerHTML = data.logs.map(log => `
        <div class="log-item-row">
          <span class="log-time">[${log.timestamp}]</span>
          <span class="log-category-tag">[${log.category}]</span>
          <span class="log-message">${log.message}</span>
          <span class="log-value-badge">${log.value}</span>
        </div>
      `).join("");
    }
  }

  handleExport() {
    if (window.Toast) {
      window.Toast.show("Diagnostic metrics log exported to clipboard!", "success", 3000);
    }
    const data = {
      timestamp: new Date().toISOString(),
      sessionHistory: PerformanceCenterManager.getHistory(),
      activeWarnings: PerformanceCenterManager.getLogs()
    };
    navigator.clipboard.writeText(JSON.stringify(data, null, 2)).catch(err => {
      console.error("Clipboard copy failed:", err);
    });
  }

  destroy() {
    // Cleanup event listeners to prevent leaks
    PerformanceEvents.off("metrics-updated", this.onMetricsUpdated);
    PerformanceCenterManager.stop();
  }
}
