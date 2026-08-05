/**
 * StartupPerformanceCenter.js
 * Retail ERP Enterprise — Startup Performance & Boot Optimization Dashboard Page
 */

"use strict";

import { StartupManagerInstance } from "../../performance/StartupManager.js";
import { StartupEvents } from "../../performance/StartupEvents.js";

import StartupTimelinePanel from "./widgets/StartupTimelinePanel.js";
import ModuleLoadingPanel from "./widgets/ModuleLoadingPanel.js";
import ServiceInitializationPanel from "./widgets/ServiceInitializationPanel.js";
import StartupOptimizationPanel from "./widgets/StartupOptimizationPanel.js";
import StartupSuggestions from "./widgets/StartupSuggestions.js";

export default class StartupPerformanceCenter {
  constructor() {
    this.element = null;

    this.timelinePanel = new StartupTimelinePanel();
    this.modulePanel = new ModuleLoadingPanel();
    this.servicePanel = new ServiceInitializationPanel();
    this.optimizationPanel = new StartupOptimizationPanel();
    this.suggestionsPanel = new StartupSuggestions();

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
        <h1 class="performance-title">Startup Profiler</h1>
        <p class="performance-subtitle">Boot timeline analysis, module loading, service initialization, and startup optimization</p>
      </div>
      <div class="performance-header-actions">
        <button class="perf-btn-primary btn-startup-reprofile" aria-label="Re-Profile Boot Sequence">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
          Re-Profile
        </button>
        <button class="perf-btn-primary btn-startup-export" aria-label="Export Boot Diagnostics" style="background-color:var(--neutral-700);">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          Export
        </button>
      </div>
    `;
    mainWrap.appendChild(header);

    // Layout body
    const layoutBody = document.createElement("div");
    layoutBody.className = "performance-center-layout";

    // Full-width timeline panel at top
    const timelineGrid = document.createElement("div");
    timelineGrid.className = "performance-dashboard-grid";
    timelineGrid.style.gridTemplateColumns = "1fr";
    timelineGrid.appendChild(this.timelinePanel.render());
    layoutBody.appendChild(timelineGrid);

    // 3-column metric grid below
    const metricGrid = document.createElement("div");
    metricGrid.className = "performance-dashboard-grid";
    metricGrid.appendChild(this.modulePanel.render());
    metricGrid.appendChild(this.servicePanel.render());
    metricGrid.appendChild(this.optimizationPanel.render());
    layoutBody.appendChild(metricGrid);

    // Suggestions panel at bottom
    layoutBody.appendChild(this.suggestionsPanel.render());

    mainWrap.appendChild(layoutBody);
    this.element = mainWrap;

    // Button bindings
    const reprofileBtn = header.querySelector(".btn-startup-reprofile");
    if (reprofileBtn) {
      reprofileBtn.addEventListener("click", (e) => {
        e.preventDefault();
        StartupManagerInstance.triggerReProfile();
        if (window.Toast) window.Toast.show("Boot sequence re-profiled.", "success", 3000);
      });
    }

    const exportBtn = header.querySelector(".btn-startup-export");
    if (exportBtn) {
      exportBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleExport();
      });
    }

    // Subscribe and start telemetry loop
    StartupEvents.on("startup-metrics-updated", this.onMetricsUpdated);
    StartupManagerInstance.start();

    return mainWrap;
  }

  handleMetricsUpdated(data) {
    if (!this.element) return;
    this.timelinePanel.update(data.current);
    this.modulePanel.update(data.current);
    this.servicePanel.update(data.current);
    this.optimizationPanel.update(data.current);
    this.suggestionsPanel.update(data.current, data.alerts);
  }

  handleExport() {
    if (window.Toast) window.Toast.show("Boot diagnostics exported to clipboard!", "success", 3000);
    const payload = {
      timestamp: new Date().toISOString(),
      history: StartupManagerInstance.getHistory(),
      alerts: StartupManagerInstance.getAlerts()
    };
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2)).catch(err => {
      console.error("Clipboard export failed:", err);
    });
  }

  destroy() {
    StartupEvents.off("startup-metrics-updated", this.onMetricsUpdated);
    StartupManagerInstance.stop();
  }
}
