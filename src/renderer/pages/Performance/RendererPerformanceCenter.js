/**
 * RendererPerformanceCenter.js
 * Retail ERP Enterprise — Renderer Performance Optimization Center Dashboard Page
 */

"use strict";

import { RendererPerfManagerInstance } from "../../performance/RendererPerformanceManager.js";
import { RenderEvents } from "../../performance/RenderEvents.js";

import RenderMetricsPanel from "./widgets/RenderMetricsPanel.js";
import ComponentMetricsPanel from "./widgets/ComponentMetricsPanel.js";
import VirtualizationPanel from "./widgets/VirtualizationPanel.js";
import BundleMetricsPanel from "./widgets/BundleMetricsPanel.js";
import OptimizationSuggestions from "./widgets/OptimizationSuggestions.js";

export default class RendererPerformanceCenter {
  constructor() {
    this.element = null;

    // Panels
    this.renderMetricsPanel = new RenderMetricsPanel();
    this.componentMetricsPanel = new ComponentMetricsPanel();
    this.virtualizationPanel = new VirtualizationPanel();
    this.bundleMetricsPanel = new BundleMetricsPanel();
    this.optimizationSuggestions = new OptimizationSuggestions();

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
        <h1 class="performance-title">Renderer Optimization</h1>
        <p class="performance-subtitle">FPS rendering cycles, virtualization viewports, and bundle size splits</p>
      </div>
      <div class="performance-header-actions">
        <button class="perf-btn-primary btn-diagnostic-export" aria-label="Export Renderer Diagnostics">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          Export Telemetry
        </button>
      </div>
    `;
    mainWrap.appendChild(header);

    // 2. Scrollable Body
    const layoutBody = document.createElement("div");
    layoutBody.className = "performance-center-layout";

    // Grid of 4 primary panels
    const dashboardGrid = document.createElement("div");
    dashboardGrid.className = "performance-dashboard-grid";
    dashboardGrid.style.gridTemplateColumns = "repeat(2, 1fr)"; // 2 columns for wider display panels
    
    dashboardGrid.appendChild(this.renderMetricsPanel.render());
    dashboardGrid.appendChild(this.componentMetricsPanel.render());
    dashboardGrid.appendChild(this.virtualizationPanel.render());
    dashboardGrid.appendChild(this.bundleMetricsPanel.render());

    layoutBody.appendChild(dashboardGrid);

    // Bottom Suggestions Panel
    layoutBody.appendChild(this.optimizationSuggestions.render());

    mainWrap.appendChild(layoutBody);
    this.element = mainWrap;

    // Export Button Binder
    const exportBtn = header.querySelector(".btn-diagnostic-export");
    if (exportBtn) {
      exportBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleExport();
      });
    }

    // Subscribe and start loops
    RenderEvents.on("render-metrics-updated", this.onMetricsUpdated);
    RendererPerfManagerInstance.start();

    return mainWrap;
  }

  handleMetricsUpdated(data) {
    if (!this.element) return;

    this.renderMetricsPanel.update(data.current);
    this.componentMetricsPanel.update(data.current);
    this.virtualizationPanel.update(data.current);
    this.bundleMetricsPanel.update(data.current);
    this.optimizationSuggestions.update(data.current);
  }

  handleExport() {
    if (window.Toast) {
      window.Toast.show("Renderer diagnostics exported to clipboard!", "success", 3000);
    }
    const data = {
      timestamp: new Date().toISOString(),
      history: RendererPerfManagerInstance.getHistory()
    };
    navigator.clipboard.writeText(JSON.stringify(data, null, 2)).catch(err => {
      console.error("Clipboard copy failed:", err);
    });
  }

  destroy() {
    RenderEvents.off("render-metrics-updated", this.onMetricsUpdated);
    RendererPerfManagerInstance.stop();
  }
}
