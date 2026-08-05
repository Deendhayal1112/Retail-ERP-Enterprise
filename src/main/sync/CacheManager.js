/**
 * CacheManager.js
 * Retail ERP Enterprise — Reusable Desktop Cache Manager
 *
 * Implements:
 * - Coordinating data caching for offline lookups
 * - Decoupled from Redis/Node filesystems
 */

"use strict";

import CacheService from "./CacheService.js";

export default class CacheManager {
  /**
   * @param {Object} logger Shared system logger
   */
  constructor(logger = console) {
    this.logger = logger;
    this.cacheService = new CacheService(this.logger);
    this.logger.info("[CacheManager] Service initialized. Ready for coordinating memory caches.");
  }

  /**
   * Safe resolve details from cache, or database query placeholder
   * @param {string}   key      Query identifier
   * @param {Function} fallback Query generator method
   */
  async resolveCachedData(key, fallback) {
    const cached = this.cacheService.get(key);
    if (cached) {
      this.logger.info(`[CacheManager] Cache hit for query: "${key}"`);
      return cached;
    }

    this.logger.info(`[CacheManager] Cache miss for query: "${key}". Fetching from source...`);
    const fresh = await fallback();
    this.cacheService.set(key, fresh);
    return fresh;
  }
}
