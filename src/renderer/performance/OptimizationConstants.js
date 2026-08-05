/**
 * OptimizationConstants.js
 * Retail ERP Enterprise — Bundle & Asset Optimization Thresholds
 */

"use strict";

export const OptimizationThresholds = {
  // Bundle size limits (bytes)
  WARNING_MAIN_BUNDLE_BYTES:   1.5 * 1024 * 1024,   // 1.5 MB main bundle
  WARNING_VENDOR_BUNDLE_BYTES: 2.5 * 1024 * 1024,   // 2.5 MB vendor bundle
  WARNING_TOTAL_BUNDLE_BYTES:  5 * 1024 * 1024,     // 5 MB total
  WARNING_LAZY_CHUNK_BYTES:    512 * 1024,           // 512 KB per lazy chunk
  WARNING_CHUNK_COUNT:         30,                   // Too many chunks

  // Asset limits
  WARNING_IMAGE_UNCOMPRESSED_BYTES: 200 * 1024,     // 200 KB per image
  WARNING_ASSET_CACHE_HIT_PCT:      75,             // Cache hit rate floor

  // Compression
  WARNING_COMPRESSION_RATIO:  0.40,                 // Below 40% compression efficiency

  // Dependencies
  WARNING_DUPLICATE_DEPS:     3,                    // Duplicate package count
  WARNING_UNUSED_DEPS:        5                     // Unused package count
};

export const OptimizationConfig = {
  TELEMETRY_INTERVAL_MS: 3000,    // 3s cycle — appropriate for build-time analysis
  HISTORY_LIMIT: 20
};
