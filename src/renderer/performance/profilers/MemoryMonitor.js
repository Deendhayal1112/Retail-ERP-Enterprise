/**
 * MemoryMonitor.js  (Extended v2)
 * Retail ERP Enterprise — Heap, RAM, Peak, Available & Growth Simulation
 */

"use strict";

export default class MemoryMonitor {
  constructor() {
    this.peakBytes = 210 * 1024 * 1024;
    this.growthSamples = [];
    this.lastHeap = 48 * 1024 * 1024;
  }

  collect() {
    const fluctuation = (Math.random() - 0.5) * 4 * 1024 * 1024;
    const heap = Math.max(40 * 1024 * 1024, this.lastHeap + fluctuation);
    const ram = heap * 3.8 + Math.random() * 4 * 1024 * 1024;

    // Track peak
    if (heap > this.peakBytes) this.peakBytes = heap;

    // Growth rate — MB/min based on rolling diff
    this.growthSamples.push(heap);
    if (this.growthSamples.length > 30) this.growthSamples.shift();
    const growthRaw = this.growthSamples.length > 1
      ? (this.growthSamples[this.growthSamples.length - 1] - this.growthSamples[0]) / (1024 * 1024)
      : 0;
    const growthRate = parseFloat(Math.max(0, growthRaw).toFixed(2));

    this.lastHeap = heap;

    let trend = "Stable";
    if (growthRate > 3) trend = "Rising";
    else if (growthRate > 1) trend = "Increasing";

    return {
      heapUsageBytes: heap,
      ramUsageBytes: ram,
      peakMemoryBytes: this.peakBytes,
      availableMemoryBytes: 1.8 * 1024 * 1024 * 1024 - ram,
      memoryTrend: trend,
      growthRateMbPerMin: growthRate
    };
  }
}
