/**
 * BundleManager.js
 * Retail ERP Enterprise — Bundle & Code Splitting Performance Subsystem Orchestrator
 */

"use strict";

import { OptimizationEvents } from "./OptimizationEvents.js";
import { OptimizationThresholds, OptimizationConfig } from "./OptimizationConstants.js";
import BundleMetrics from "./BundleMetrics.js";

import AssetProfiler from "./profilers/AssetProfiler.js";
import ChunkAnalyzer from "./profilers/ChunkAnalyzer.js";
import DependencyAnalyzer from "./profilers/DependencyAnalyzer.js";
import OptimizationAdvisor from "./profilers/OptimizationAdvisor.js";

class BundleManager {
  constructor() {
    this.assetProfiler = new AssetProfiler();
    this.chunkAnalyzer = new ChunkAnalyzer();
    this.dependencyAnalyzer = new DependencyAnalyzer();
    this.optimizationAdvisor = new OptimizationAdvisor();

    this.intervalId = null;
    this.history = [];
    this.alertLog = [];
  }

  start() {
    if (this.intervalId) return;
    this.collect();
    this.intervalId = setInterval(() => this.collect(), OptimizationConfig.TELEMETRY_INTERVAL_MS);
    console.log("[BundleManager] Bundle telemetry loop started.");
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  collect() {
    const sample = new BundleMetrics();

    // Mock bundle sizes based on typical Vite projects
    const mainSize = 1.2 * 1024 * 1024 + Math.round((Math.random() - 0.5) * 8192);
    const vendorSize = 2.8 * 1024 * 1024 + Math.round((Math.random() - 0.5) * 16384);
    const lazySize = 0.9 * 1024 * 1024 + Math.round((Math.random() - 0.5) * 4096);
    const total = mainSize + vendorSize + lazySize;

    sample.bundle = {
      totalBundleSizeBytes: total,
      mainBundleSizeBytes: mainSize,
      vendorBundleSizeBytes: vendorSize,
      lazyChunksTotalBytes: lazySize,
      sourceMapSizeBytes: 3.4 * 1024 * 1024,
      compressionRatioPct: parseFloat((36.5 + Math.random() * 2).toFixed(1))
    };

    // Sub-profiler data gathering
    sample.assets = this.assetProfiler.collect();
    sample.codeSplitting = this.chunkAnalyzer.collect();
    sample.dependencies = this.dependencyAnalyzer.collect();
    sample.suggestions = this.optimizationAdvisor.evaluate(sample);

    this.checkThresholds(sample);

    this.history.push(sample);
    if (this.history.length > OptimizationConfig.HISTORY_LIMIT) this.history.shift();

    OptimizationEvents.emit("bundle-metrics-updated", {
      current: sample,
      history: this.history,
      alerts: this.alertLog
    });
  }

  checkThresholds(sample) {
    const ts = new Date().toLocaleTimeString();
    const b = sample.bundle;
    const a = sample.assets;
    const c = sample.codeSplitting;
    const d = sample.dependencies;

    const toMb = bytes => (bytes / (1024 * 1024)).toFixed(2);

    if (b.mainBundleSizeBytes > OptimizationThresholds.WARNING_MAIN_BUNDLE_BYTES) {
      this.logAlert(ts, "bundle", "Main bundle size exceeds budget", `${toMb(b.mainBundleSizeBytes)} MB`);
    }
    if (b.vendorBundleSizeBytes > OptimizationThresholds.WARNING_VENDOR_BUNDLE_BYTES) {
      this.logAlert(ts, "bundle", "Vendor bundle size exceeds limit", `${toMb(b.vendorBundleSizeBytes)} MB`);
    }
    if (c.totalChunkCount > OptimizationThresholds.WARNING_CHUNK_COUNT) {
      this.logAlert(ts, "split", "Too many small chunks generated", `${c.totalChunkCount}`);
    }
    if (a.assetCacheHitPct < OptimizationThresholds.WARNING_ASSET_CACHE_HIT_PCT) {
      this.logAlert(ts, "asset", "Asset caching efficiency degraded", `${a.assetCacheHitPct}%`);
    }
    if (d.duplicateDepsCount >= OptimizationThresholds.WARNING_DUPLICATE_DEPS) {
      this.logAlert(ts, "dep", "Duplicate transitive dependencies found", `${d.duplicateDepsCount}`);
    }
  }

  logAlert(timestamp, category, message, value) {
    this.alertLog.unshift({ timestamp, category, message, value });
    if (this.alertLog.length > 50) this.alertLog.pop();
  }

  triggerAnalysis() {
    console.log("[BundleManager] Re-running bundle inspection...");
    this.collect();
  }

  getHistory() { return this.history; }
  getAlerts() { return this.alertLog; }
}

export const BundleManagerInstance = new BundleManager();
