/**
 * BusinessSummary.js
 * Retail ERP Enterprise — Business Summary Metrics Panel
 */

"use strict";

export default class BusinessSummary {
  render() {
    const el = document.createElement("div");
    el.className = "dashboard-card business-summary-card col-span-3";
    el.innerHTML = `
      <h3 class="dashboard-card-title">Business Summary</h3>
      <div class="business-summary-list" style="display:flex; flex-direction:column; gap:14px; font-size:14px;">
        <div class="summary-item-row" style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #F1F5F9; padding-bottom:8px;">
          <span style="color:#64748B;">Total Sales (May)</span>
          <strong style="color:#1E293B; font-weight:600;">₹ 4,85,650</strong>
        </div>
        <div class="summary-item-row" style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #F1F5F9; padding-bottom:8px;">
          <span style="color:#64748B;">Total Profit (May)</span>
          <strong style="color:#1E293B; font-weight:600;">₹ 1,62,405</strong>
        </div>
        <div class="summary-item-row" style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #F1F5F9; padding-bottom:8px;">
          <span style="color:#64748B;">Total Bills (May)</span>
          <strong style="color:#1E293B; font-weight:600;">385</strong>
        </div>
        <div class="summary-item-row" style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #F1F5F9; padding-bottom:8px;">
          <span style="color:#64748B;">Total Customers</span>
          <strong style="color:#1E293B; font-weight:600;">1,248</strong>
        </div>
        <div class="summary-item-row" style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #F1F5F9; padding-bottom:8px;">
          <span style="color:#64748B;">Total Products</span>
          <strong style="color:#1E293B; font-weight:600;">1,256</strong>
        </div>
        <div class="summary-item-row" style="display:flex; justify-content:space-between; align-items:center; padding-bottom:4px;">
          <span style="color:#64748B;">Total Stock Value</span>
          <strong style="color:#1E293B; font-weight:600;">₹ 18,75,650</strong>
        </div>
      </div>
    `;
    return el;
  }
}
