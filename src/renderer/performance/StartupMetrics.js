/**
 * StartupMetrics.js
 * Retail ERP Enterprise — Startup Performance Full Snapshot Schema
 */

"use strict";

export default class StartupMetrics {
  constructor() {
    this.timestamp = Date.now();

    this.timeline = {
      stages: [
        { name: "App Launch",          durationMs: 0,    status: "complete" },
        { name: "Main Process Ready",  durationMs: 0,    status: "complete" },
        { name: "Window Creation",     durationMs: 0,    status: "complete" },
        { name: "Renderer Ready",      durationMs: 0,    status: "complete" },
        { name: "First Paint",         durationMs: 0,    status: "complete" },
        { name: "UI Interactive",      durationMs: 0,    status: "complete" }
      ],
      totalBootMs: 0,
      splashDurationMs: 0,
      firstPaintMs: 0
    };

    this.modules = {
      coreModulesCount: 8,
      featureModulesCount: 14,
      lazyModulesCount: 6,
      failedModulesCount: 0,
      totalLoadDurationMs: 0,
      dependencyResolutionMs: 0
    };

    this.services = [
      { name: "Database Service",      initMs: 0, status: "ready" },
      { name: "Authentication",         initMs: 0, status: "ready" },
      { name: "Sync Service",           initMs: 0, status: "ready" },
      { name: "Notification Service",   initMs: 0, status: "ready" },
      { name: "IPC Service",            initMs: 0, status: "ready" },
      { name: "Configuration Service",  initMs: 0, status: "ready" }
    ];

    this.optimization = {
      deferredLoadingCount: 4,
      cacheHitRatePct: 0,
      preloadedModulesCount: 3,
      splashDurationMs: 0,
      criticalPathMs: 0
    };

    this.suggestions = [
      { id: "su-1", category: "lazy",     description: "6 lazy modules detected — verify none block the critical render path" },
      { id: "su-2", category: "cache",    description: "Startup cache warm-up reduces average boot time by ~30%" },
      { id: "su-3", category: "service",  description: "Sync Service can be deferred until after UI Interactive" }
    ];
  }
}
