/**
 * MemoryManagementCenter.js
 * Retail ERP Enterprise — Memory Management & Resource Optimization Dashboard Page
 */

"use strict";

import { MemoryManagerInstance } from "../../performance/MemoryManager.js";
import { MemoryEvents } from "../../performance/MemoryEvents.js";

import MemoryUsagePanel from "./widgets/MemoryUsagePanel.js";
import CacheManagementPanel from "./widgets/CacheManagementPanel.js";
import ResourceManagementPanel from "./widgets/ResourceManagementPanel.js";
import ObjectLifecyclePanel from "./widgets/ObjectLifecyclePanel.js";
import MemoryOptimizationSuggestions from "./widgets/MemoryOptimizationSuggestions.js";

export default class MemoryManagementCenter {
  constructor() {
    this.element = null;

    this.memoryUsagePanel = new MemoryUsagePanel();
    this.cachePanel = new CacheManagementPanel();
    this.resourcePanel = new ResourceManagementPanel();
    this.objectPanel = new ObjectLifecyclePanel();
    this.suggestionsPanel = new MemoryOptimizationSuggestions();

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
        <h1 class="performance-title">Memory Management</h1>
        <p class="performance-subtitle">Heap monitoring, multi-layer cache management, resource handles, and object lifecycle tracking</p>
      </div>
      <div class="performance-header-actions">
        <button class="perf-btn-primary btn-mem-cleanup" aria-label="Trigger Cache Cleanup">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
          Trigger Cleanup
        </button>
        <button class="perf-btn-primary btn-mem-export" aria-label="Export Memory Diagnostics" style="background-color:var(--neutral-700);">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          Export
        </button>
      </div>
    `;
    mainWrap.appendChild(header);

    // Scrollable body
    const layoutBody = document.createElement("div");
    layoutBody.className = "performance-center-layout";

    // 2×2 grid of panels
    const grid = document.createElement("div");
    grid.className = "performance-dashboard-grid";

    grid.appendChild(this.memoryUsagePanel.render());
    grid.appendChild(this.cachePanel.render());
    grid.appendChild(this.resourcePanel.render());
    grid.appendChild(this.objectPanel.render());

    layoutBody.appendChild(grid);

    // Bottom suggestions panel
    layoutBody.appendChild(this.suggestionsPanel.render());

    mainWrap.appendChild(layoutBody);
    this.element = mainWrap;

    // Cleanup button
    const cleanupBtn = header.querySelector(".btn-mem-cleanup");
    if (cleanupBtn) {
      cleanupBtn.addEventListener("click", (e) => {
        e.preventDefault();
        MemoryManagerInstance.triggerCleanup("all-layers");
        if (window.Toast) window.Toast.show("Cache cleanup scheduled across all layers.", "success", 3000);
      });
    }

    // Export button
    const exportBtn = header.querySelector(".btn-mem-export");
    if (exportBtn) {
      exportBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleExport();
      });
    }

    // Subscribe and start loop
    MemoryEvents.on("memory-metrics-updated", this.onMetricsUpdated);
    MemoryManagerInstance.start();

    return mainWrap;
  }

  handleMetricsUpdated(data) {
    if (!this.element) return;
    this.memoryUsagePanel.update(data.current);
    this.cachePanel.update(data.current);
    this.resourcePanel.update(data.current);
    this.objectPanel.update(data.current);
    this.suggestionsPanel.update(data.current, data.alerts);
  }

  handleExport() {
    if (window.Toast) window.Toast.show("Memory diagnostics exported to clipboard!", "success", 3000);
    const payload = {
      timestamp: new Date().toISOString(),
      history: MemoryManagerInstance.getHistory(),
      alerts: MemoryManagerInstance.getAlerts()
    };
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2)).catch(err => {
      console.error("Clipboard export failed:", err);
    });
  }

  destroy() {
    MemoryEvents.off("memory-metrics-updated", this.onMetricsUpdated);
    MemoryManagerInstance.stop();
  }
}
