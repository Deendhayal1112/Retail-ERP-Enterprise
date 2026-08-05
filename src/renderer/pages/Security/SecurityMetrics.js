/**
 * SecurityMetrics.js
 * Retail ERP Enterprise — Reusable Security Ratings Metrics Card
 */

"use strict";

export default class SecurityMetrics {
  constructor(options = {}) {
    this.score = options.score || 92;
    this.totals = options.totals || { critical: 2, medium: 1, low: 1 };
  }

  render() {
    const wrap = document.createElement("div");
    wrap.className = "security-metrics-grid col-span-12";
    wrap.innerHTML = `
      <!-- Score Circle Rating -->
      <div class="security-score-card">
        <div class="security-score-gauge-wrap">
          <div class="security-score-inner">${this.score}%</div>
        </div>
        <div>
          <h4 style="font-size:16px; font-weight:600; color:#111827; margin:0 0 4px 0;">Security Rating</h4>
          <span style="font-size:13px; color:#6B7280;">Excellent shielding configuration.</span>
        </div>
      </div>

      <!-- Critical findings count -->
      <div class="security-score-card" style="border-left: 4px solid #EF4444;">
        <div>
          <span style="font-size:12px; color:#6B7280; font-weight:500;">Critical Vulnerabilities</span>
          <strong style="font-size:24px; color:#EF4444; display:block; margin-top:4px;">${this.totals.critical}</strong>
        </div>
      </div>

      <!-- Medium findings count -->
      <div class="security-score-card" style="border-left: 4px solid #F59E0B;">
        <div>
          <span style="font-size:12px; color:#6B7280; font-weight:500;">Medium Risks</span>
          <strong style="font-size:24px; color:#F59E0B; display:block; margin-top:4px;">${this.totals.medium}</strong>
        </div>
      </div>

      <!-- Low findings count -->
      <div class="security-score-card" style="border-left: 4px solid #3B82F6;">
        <div>
          <span style="font-size:12px; color:#6B7280; font-weight:500;">Low Severity Findings</span>
          <strong style="font-size:24px; color:#3B82F6; display:block; margin-top:4px;">${this.totals.low}</strong>
        </div>
      </div>
    `;
    return wrap;
  }
}
