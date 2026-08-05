/**
 * BundleOptimizationCenter.js
 * Retail ERP Enterprise — Bundle, Asset & Code Optimization Dashboard Page
 */

"use strict";

import { BundleManagerInstance } from "../../performance/BundleManager.js";
import { OptimizationEvents } from "../../performance/OptimizationEvents.js";

import BundleAnalysisPanel from "./widgets/BundleAnalysisPanel.js";
import AssetAnalysisPanel from "./widgets/AssetAnalysisPanel.js";
import CodeSplittingPanel from "./widgets/CodeSplittingPanel.js";
import OptimizationSuggestionsPanel from "./widgets/OptimizationSuggestionsPanel.js";

export default class BundleOptimizationCenter {
  constructor() {
    this.element = null;

    this.bundlePanel = new BundleAnalysisPanel();
    this.assetPanel = new AssetAnalysisPanel();
    this.splittingPanel = new CodeSplittingPanel();
    this.suggestionsPanel = new OptimizationSuggestionsPanel();

    this.onMetricsUpdated = this.handleMetricsUpdated.bind(this);
  }

  render() {
    const mainWrap = document.createElement("div");
    mainWrap.className = "performance-center-wrapper";

    // Header Row
    const header = document.createElement("header");
    header.className = "performance-header-row";
    header.innerHTML = `
      <div class="performance-header-info">
        <h1 class="performance-title">Bundle Optimization</h1>
        <p class="performance-subtitle">Vite bundle analysis, static asset sizes, code splitting coverage, and dependency auditing</p>
      </div>
      <div class="performance-header-actions">
        <button class="perf-btn-primary btn-bundle-analyze" aria-label="Trigger Bundle Analysis">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path></svg>
          Re-Analyze
        </button>
        <button class="perf-btn-primary btn-bundle-export" aria-label="Export Bundle Diagnostics" style="background-color:var(--neutral-700);">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          Export
        </button>
      </div>
    `;
    mainWrap.appendChild(header);

    // Layout body
    const layoutBody = document.createElement("div");
    layoutBody.className = "performance-center-layout";

    // Full-width Bundle Analysis panel at top
    const topGrid = document.createElement("div");
    topGrid.className = "performance-dashboard-grid";
    topGrid.style.gridTemplateColumns = "1fr";
    topGrid.appendChild(this.bundlePanel.render());
    layoutBody.appendChild(topGrid);

    // 2-column grid below (Asset and Splitting)
    const splitGrid = document.createElement("div");
    splitGrid.className = "performance-dashboard-grid";
    splitGrid.appendChild(this.assetPanel.render());
    splitGrid.appendChild(this.splittingPanel.render());
    layoutBody.appendChild(splitGrid);

    // Suggestions panel at bottom
    layoutBody.appendChild(this.suggestionsPanel.render());

    mainWrap.appendChild(layoutBody);
    this.element = mainWrap;

    // Action button bindings
    const analyzeBtn = header.querySelector(".btn-bundle-analyze");
    if (analyzeBtn) {
      analyzeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        BundleManagerInstance.triggerAnalysis();
        if (window.Toast) window.Toast.show("Bundle audit initiated.", "success", 3000);
      });
    }

    const exportBtn = header.querySelector(".btn-bundle-export");
    if (exportBtn) {
      exportBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleExport();
      });
    }

    // Subscribe to events and start telemetry loop
    OptimizationEvents.on("bundle-metrics-updated", this.onMetricsUpdated);
    BundleManagerInstance.start();

    return mainWrap;
  }

  handleMetricsUpdated(data) {
    if (!this.element) return;
    this.bundlePanel.update(data.current);
    this.assetPanel.update(data.current);
    this.splittingPanel.update(data.current);
    this.suggestionsPanel.update(data.current, data.alerts);
  }

  handleExport() {
    if (window.Toast) window.Toast.show("Bundle diagnostics exported to clipboard!", "success", 3000);
    const payload = {
      timestamp: new Date().toISOString(),
      history: BundleManagerInstance.getHistory(),
      alerts: BundleManagerInstance.getAlerts()
    };
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2)).catch(err => {
      console.error("Clipboard export failed:", err);
    });
  }

  destroy() {
    OptimizationEvents.off("bundle-metrics-updated", this.onMetricsUpdated);
    BundleManagerInstance.stop();
  }
}
