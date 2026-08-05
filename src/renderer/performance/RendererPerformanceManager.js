/**
 * RendererPerformanceManager.js
 * Retail ERP Enterprise — Renderer Performance Subsystem Orchestrator
 */

"use strict";

import { RenderEvents } from "./RenderEvents.js";
import RenderMetrics from "./RenderMetrics.js";

import RenderProfiler from "./RenderProfiler.js";
import ComponentProfiler from "./ComponentProfiler.js";
import VirtualizationManager from "./VirtualizationManager.js";
import BundleProfiler from "./BundleProfiler.js";

class RendererPerformanceManager {
  constructor() {
    this.renderProfiler = new RenderProfiler();
    this.componentProfiler = new ComponentProfiler();
    this.virtualizationManager = new VirtualizationManager();
    this.bundleProfiler = new BundleProfiler();

    this.intervalId = null;
    this.history = [];
  }

  start() {
    if (this.intervalId) return;

    this.collect();
    this.intervalId = setInterval(() => {
      this.collect();
    }, 2000); // Poll every 2 seconds
    
    console.log("[RendererPerformanceManager] Telemetry loop started.");
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  collect() {
    const sample = new RenderMetrics();

    sample.rendering = this.renderProfiler.collect();
    sample.components = this.componentProfiler.collect();
    sample.virtualization = this.virtualizationManager.collect();
    sample.bundle = this.bundleProfiler.collect();

    this.history.push(sample);
    if (this.history.length > 20) {
      this.history.shift();
    }

    RenderEvents.emit("render-metrics-updated", {
      current: sample,
      history: this.history
    });
  }

  getHistory() {
    return this.history;
  }
}

// Singleton instances
export const RendererPerfManagerInstance = new RendererPerformanceManager();
