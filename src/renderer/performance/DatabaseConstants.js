/**
 * DatabaseConstants.js
 * Retail ERP Enterprise — Database Performance Limits
 */

"use strict";

export const DatabaseThresholds = {
  WARNING_QUERY_MS: 100, // Alert if query is slow
  WARNING_WAL_SIZE_BYTES: 15 * 1024 * 1024, // WAL warning over 15MB
  WARNING_FRAGMENTATION_PCT: 20, // Alert fragmentation over 20%
  WARNING_CACHE_HIT_PCT: 90 // Alert if hit rate below 90%
};
