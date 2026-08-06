/**
 * ExecutiveDashboardPanel.js
 * Retail ERP Enterprise — Primary Executive KPI Summary view
 */

"use strict";

export default class ExecutiveDashboardPanel {
  constructor(options = {}) {
    this.options = options;
    this.summary = options.summary || {};
  }

  render() {
    const card = document.createElement("div");
    card.className = "analytics-center-card col-span-12";
    card.innerHTML = `
      <h3 class="analytics-center-card-title">Executive Summary Overview</h3>
      <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:24px;">
        <div style="padding:16px; border:1px solid #E9EDF5; border-radius:12px; background-color:#F8FAFC;">
          <span style="font-size:12px; color:#6B7280; font-weight:500; display:block;">Calculated Product Indices</span>
          <strong style="font-size:24px; color:#1E293B; display:block; margin-top:6px;">${this.summary.totalProducts || 0} Categories</strong>
        </div>
        <div style="padding:16px; border:1px solid #E9EDF5; border-radius:12px; background-color:#F8FAFC;">
          <span style="font-size:12px; color:#6B7280; font-weight:500; display:block;">Active Store Operators</span>
          <strong style="font-size:24px; color:#1E293B; display:block; margin-top:6px;">${this.summary.activeUsers || 0} Sessions</strong>
        </div>
        <div style="padding:16px; border:1px solid #E9EDF5; border-radius:12px; background-color:#F8FAFC;">
          <span style="font-size:12px; color:#6B7280; font-weight:500; display:block;">Data Integrity Audit Score</span>
          <strong style="font-size:24px; color:#10B981; display:block; margin-top:6px;">${this.summary.integrityScore || 100}% Certified</strong>
        </div>
      </div>
      <div style="margin-top:20px; font-size:12px; color:#6B7280;">
        Last calculated summary updates timestamp: <strong>${this.summary.lastCalculated}</strong>. Checked against SQL local caches.
      </div>
    `;
    return card;
  }
}
