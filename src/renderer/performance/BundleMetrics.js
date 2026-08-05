/**
 * BundleMetrics.js
 * Retail ERP Enterprise — Bundle & Asset Optimization Full Snapshot Schema
 */

"use strict";

export default class BundleMetrics {
  constructor() {
    this.timestamp = Date.now();

    this.bundle = {
      totalBundleSizeBytes: 0,
      mainBundleSizeBytes: 0,
      vendorBundleSizeBytes: 0,
      lazyChunksTotalBytes: 0,
      sourceMapSizeBytes: 0,
      compressionRatioPct: 0
    };

    this.assets = {
      imagesCount: 0,
      imagesSizeBytes: 0,
      fontsCount: 0,
      fontsSizeBytes: 0,
      iconsCount: 0,
      staticAssetsCount: 0,
      assetCacheHitPct: 0,
      cdnReadiness: "Not Configured"   // "Ready" | "Partial" | "Not Configured"
    };

    this.codeSplitting = {
      routeChunksCount: 0,
      componentChunksCount: 0,
      dynamicImportsCount: 0,
      lazyLoadedCount: 0,
      totalChunkCount: 0,
      avgChunkSizeKb: 0
    };

    this.dependencies = {
      totalPackagesCount: 0,
      duplicateDepsCount: 0,
      unusedDepsCount: 0,
      heavyPackages: [],
      treeShakingEnabled: true
    };

    this.suggestions = [
      { id: "bun-sug-1", category: "bundle", description: "Vendor bundle exceeds 2 MB — consider splitting react-* packages into separate chunk" },
      { id: "bun-sug-2", category: "asset",  description: "3 PNG images above 200 KB — convert to WebP for ~30% size reduction" },
      { id: "bun-sug-3", category: "split",  description: "Inventory module is 480 KB — add route-level lazy import boundary" },
      { id: "bun-sug-4", category: "dep",    description: "moment.js detected — replace with date-fns to save ~200 KB" },
      { id: "bun-sug-5", category: "tree",   description: "Tree shaking enabled — verify no side-effect imports bypassing elimination" }
    ];
  }
}
