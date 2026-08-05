/**
 * DocumentationMetrics.js
 * Retail ERP Enterprise — Reusable Help & Onboarding Metrics Panel
 */

"use strict";

export default class DocumentationMetrics {
  constructor(options = {}) {
    this.totalGuides = options.totalGuides || 9;
    this.completedCourses = options.completedCourses || 1;
    this.searchLatency = options.searchLatency || "4 ms";
  }

  render() {
    const wrap = document.createElement("div");
    wrap.className = "docs-center-metrics-grid col-span-12";
    wrap.innerHTML = `
      <!-- Guides Card -->
      <div class="docs-center-metric-card">
        <div>
          <span style="font-size:12px; color:#6B7280; font-weight:500;">Secured Manuals</span>
          <strong style="font-size:24px; color:#111827; display:block; margin-top:4px;">${this.totalGuides} Guides</strong>
        </div>
      </div>

      <!-- Operator Course progress -->
      <div class="docs-center-metric-card" style="border-left:4px solid #5B3DF5;">
        <div>
          <span style="font-size:12px; color:#6B7280; font-weight:500;">Operator Onboarding</span>
          <strong style="font-size:24px; color:#5B3DF5; display:block; margin-top:4px;">${this.completedCourses} Completed</strong>
        </div>
      </div>

      <!-- Latency index -->
      <div class="docs-center-metric-card" style="border-left:4px solid #10B981;">
        <div>
          <span style="font-size:12px; color:#6B7280; font-weight:500;">Search Latency</span>
          <strong style="font-size:24px; color:#10B981; display:block; margin-top:4px;">${this.searchLatency}</strong>
        </div>
      </div>

      <!-- API Documentation size -->
      <div class="docs-center-metric-card" style="border-left:4px solid #3B82F6;">
        <div>
          <span style="font-size:12px; color:#6B7280; font-weight:500;">Index Sync Cache</span>
          <strong style="font-size:24px; color:#3B82F6; display:block; margin-top:4px;">Online (12 KB)</strong>
        </div>
      </div>
    `;
    return wrap;
  }
}
