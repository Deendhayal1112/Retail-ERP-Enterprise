/**
 * DeploymentMetrics.js
 * Retail ERP Enterprise — Reusable Deploy & Environments Metrics Panel
 */

"use strict";

export default class DeploymentMetrics {
  constructor(options = {}) {
    this.env = options.env || "Staging";
    this.availability = options.availability || 99.98;
    this.dbStatus = options.dbStatus || "Healthy";
    this.validations = options.validations || 3;
  }

  render() {
    const wrap = document.createElement("div");
    wrap.className = "deploy-center-metrics-grid col-span-12";
    wrap.innerHTML = `
      <!-- Environment Card -->
      <div class="deploy-center-metric-card">
        <div>
          <span style="font-size:12px; color:#6B7280; font-weight:500;">Active environment</span>
          <strong style="font-size:24px; color:#111827; display:block; margin-top:4px;">${this.env}</strong>
        </div>
      </div>

      <!-- Availability Card -->
      <div class="deploy-center-metric-card" style="border-left:4px solid #5B3DF5;">
        <div>
          <span style="font-size:12px; color:#6B7280; font-weight:500;">System Availability</span>
          <strong style="font-size:24px; color:#5B3DF5; display:block; margin-top:4px;">${this.availability}%</strong>
        </div>
      </div>

      <!-- DB Status Card -->
      <div class="deploy-center-metric-card" style="border-left:4px solid #10B981;">
        <div>
          <span style="font-size:12px; color:#6B7280; font-weight:500;">Database health</span>
          <strong style="font-size:24px; color:#10B981; display:block; margin-top:4px;">${this.dbStatus}</strong>
        </div>
      </div>

      <!-- Validations checklist card -->
      <div class="deploy-center-metric-card" style="border-left:4px solid #3B82F6;">
        <div>
          <span style="font-size:12px; color:#6B7280; font-weight:500;">Go-Live Checklist</span>
          <strong style="font-size:24px; color:#3B82F6; display:block; margin-top:4px;">${this.validations} / 4 Verified</strong>
        </div>
      </div>
    `;
    return wrap;
  }
}
