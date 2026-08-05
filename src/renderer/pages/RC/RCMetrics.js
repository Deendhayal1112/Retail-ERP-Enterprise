/**
 * RCMetrics.js
 * Retail ERP Enterprise — Reusable Release Candidate Metrics Panel
 */

"use strict";

export default class RCMetrics {
  constructor(options = {}) {
    this.version = options.version || "0.2.0-rc1";
    this.validations = options.validations || 5;
    this.risks = options.risks || 1;
    this.approvals = options.approvals || 3;
  }

  render() {
    const wrap = document.createElement("div");
    wrap.className = "rc-center-metrics-grid col-span-12";
    wrap.innerHTML = `
      <!-- Active version card -->
      <div class="rc-center-metric-card">
        <div>
          <span style="font-size:12px; color:#6B7280; font-weight:500;">Candidate Target</span>
          <strong style="font-size:24px; color:#111827; display:block; margin-top:4px;">v${this.version}</strong>
        </div>
      </div>

      <!-- Validations Card -->
      <div class="rc-center-metric-card" style="border-left:4px solid #5B3DF5;">
        <div>
          <span style="font-size:12px; color:#6B7280; font-weight:500;">Validation Gates Passed</span>
          <strong style="font-size:24px; color:#5B3DF5; display:block; margin-top:4px;">${this.validations} / 6 Verified</strong>
        </div>
      </div>

      <!-- Risks Card -->
      <div class="rc-center-metric-card" style="border-left:4px solid #EF4444;">
        <div>
          <span style="font-size:12px; color:#6B7280; font-weight:500;">Unmitigated Risks</span>
          <strong style="font-size:24px; color:#EF4444; display:block; margin-top:4px;">${this.risks} Active</strong>
        </div>
      </div>

      <!-- Approvals Card -->
      <div class="rc-center-metric-card" style="border-left:4px solid #10B981;">
        <div>
          <span style="font-size:12px; color:#6B7280; font-weight:500;">Sign-Off Progress</span>
          <strong style="font-size:24px; color:#10B981; display:block; margin-top:4px;">${this.approvals} / 5 Signed</strong>
        </div>
      </div>
    `;
    return wrap;
  }
}
