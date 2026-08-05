/**
 * ReleaseMetrics.js
 * Retail ERP Enterprise — Reusable Release Metrics Panel
 */

"use strict";

export default class ReleaseMetrics {
  constructor(options = {}) {
    this.version = options.version || "0.2.0-beta";
    this.successRate = options.successRate || "100%";
    this.channelsCount = options.channelsCount || 4;
  }

  render() {
    const wrap = document.createElement("div");
    wrap.className = "release-metrics-grid col-span-12";
    wrap.innerHTML = `
      <!-- Active version card -->
      <div class="release-metric-card">
        <div>
          <span style="font-size:12px; color:#6B7280; font-weight:500;">Active Release Target</span>
          <strong style="font-size:24px; color:#111827; display:block; margin-top:4px;">v${this.version}</strong>
        </div>
      </div>

      <!-- Compilation Build success status -->
      <div class="release-metric-card" style="border-left:4px solid #10B981;">
        <div>
          <span style="font-size:12px; color:#6B7280; font-weight:500;">Build Success Rate</span>
          <strong style="font-size:24px; color:#10B981; display:block; margin-top:4px;">${this.successRate}</strong>
        </div>
      </div>

      <!-- Channels count -->
      <div class="release-metric-card" style="border-left:4px solid #5B3DF5;">
        <div>
          <span style="font-size:12px; color:#6B7280; font-weight:500;">Active Channels</span>
          <strong style="font-size:24px; color:#5B3DF5; display:block; margin-top:4px;">${this.channelsCount}</strong>
        </div>
      </div>

      <!-- Storage check -->
      <div class="release-metric-card" style="border-left:4px solid #3B82F6;">
        <div>
          <span style="font-size:12px; color:#6B7280; font-weight:500;">Storage Capacity</span>
          <strong style="font-size:24px; color:#3B82F6; display:block; margin-top:4px;">92.4% Free</strong>
        </div>
      </div>
    `;
    return wrap;
  }
}
