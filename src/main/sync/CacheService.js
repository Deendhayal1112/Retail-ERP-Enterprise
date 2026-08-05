/**
 * CacheService.js
 * Retail ERP Enterprise — Reusable Key-Value Cache Wrapper
 *
 * Implements:
 * - Mock cache storage reads, writes and expires routines
 * - Decoupled from Redis/Node filesystems
 */

"use strict";

export default class CacheService {
  /**
   * @param {Object} logger Shared system logger
   */
  constructor(logger = console) {
    this.logger = logger;
    this.cache = new Map();
    this.logger.info("[CacheService] Service initialized. Ready for caching dataset values.");
  }

  /**
   * Safe set key-value in cache
   * @param {string} key   Dictionary key
   * @param {Object} value Data value
   * @param {number} ttl   Time to live in seconds
   */
  set(key, value, ttl = 300) {
    this.logger.info(`[CacheService] Caching key "${key}" for duration: ${ttl}s`);
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + (ttl * 1000)
    });
  }

  /**
   * Safe resolve cached values
   * @param {string} key Dictionary key
   */
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiresAt) {
      this.logger.info(`[CacheService] Cache expired for key: "${key}"`);
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }
}
