/**
 * CacheManager.js
 * Retail ERP Enterprise — Multi-layer Cache Telemetry Simulation
 */

"use strict";

export default class CacheManager {
  constructor() {
    this.hits = 4820;
    this.total = 5120;
    this.cleanupTs = Date.now() - 4 * 60 * 1000;
  }

  collect() {
    this.hits += Math.round(Math.random() * 12);
    this.total += Math.round(Math.random() * 13);

    const hitRate = parseFloat(((this.hits / this.total) * 100).toFixed(1));
    const agoSec = Math.round((Date.now() - this.cleanupTs) / 1000);
    const agoLabel = agoSec < 60 ? `${agoSec}s ago` : `${Math.round(agoSec / 60)} min ago`;

    return {
      uiCacheBytes: 8 * 1024 * 1024 + Math.round((Math.random() - 0.5) * 512 * 1024),
      databaseCacheBytes: 12 * 1024 * 1024,
      imageCacheBytes: 24 * 1024 * 1024 + Math.round(Math.random() * 256 * 1024),
      apiCacheBytes: 4 * 1024 * 1024 + Math.round((Math.random() - 0.5) * 128 * 1024),
      cacheHitRatePct: hitRate,
      lastCleanupAgo: agoLabel
    };
  }
}
