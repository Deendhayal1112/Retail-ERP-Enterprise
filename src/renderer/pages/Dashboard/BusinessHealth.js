/**
 * BusinessHealth.js
 * Retail ERP Enterprise — Reusable Business Health Scorecard
 */

"use strict";

export default class BusinessHealth {
  render() {
    const el = document.createElement("div");
    el.className = "dashboard-card business-health-card col-span-6";
    el.innerHTML = `
      <h3 class="dashboard-card-title">Business Health Audit</h3>
      <div class="health-audit-content" style="display:flex; flex-direction:column; gap:16px;">
        <div class="health-percentage-indicator" style="display:flex; align-items:center; gap:20px;">
          <div class="health-gauge" style="width:72px; height:72px; border-radius:50%; background:conic-gradient(#22C55E 92%, #E9EDF5 0); display:flex; align-items:center; justify-content:center;">
            <div style="width:56px; height:56px; border-radius:50%; background-color:#FFFFFF; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:16px;">92%</div>
          </div>
          <div>
            <h4 style="font-size:16px; font-weight:600; color:#111827; margin:0 0 4px 0;">Excellent Health</h4>
            <p style="font-size:13px; color:#6B7280; margin:0;">All operations parameters conform to target benchmarks.</p>
          </div>
        </div>
        <div class="health-metrics-row" style="display:grid; grid-template-columns:1fr 1fr; gap:12px; font-size:12px; margin-top:8px;">
          <div style="background-color:#F8FAFC; border:1px solid #E9EDF5; border-radius:8px; padding:10px;">
            <span style="color:#6B7280; display:block; margin-bottom:4px;">Profit Margin</span>
            <strong style="color:#111827; font-size:14px;">24.5%</strong>
          </div>
          <div style="background-color:#F8FAFC; border:1px solid #E9EDF5; border-radius:8px; padding:10px;">
            <span style="color:#6B7280; display:block; margin-bottom:4px;">Return Rate</span>
            <strong style="color:#111827; font-size:14px;">1.2%</strong>
          </div>
        </div>
      </div>
    `;
    return el;
  }
}
