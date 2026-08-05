/**
 * RecentActivity.js
 * Retail ERP Enterprise — Recent Bills Feed Panel
 */

"use strict";

export default class RecentActivity {
  render() {
    const el = document.createElement("div");
    el.className = "dashboard-card recent-activity-card col-span-4";
    el.style.display = "flex";
    el.style.flexDirection = "column";

    el.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px;">
        <h3 class="dashboard-card-title" style="margin:0; font-size:16px; font-weight:700; color:#1E293B;">Recent Bills</h3>
        <a href="#" style="font-size:13px; font-weight:600; color:#5B3DF5; text-decoration:none;">View All</a>
      </div>

      <div class="recent-bills-list" style="display:flex; flex-direction:column; gap:12px; flex:1;">
        <!-- Bill 1 -->
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #F1F5F9; padding-bottom:8px; font-size:13px;">
          <div>
            <strong style="color:#1E293B; font-weight:600; display:block;">INV-10045</strong>
            <span style="color:#64748B; font-size:11px;">Walk-in Customer</span>
          </div>
          <strong style="color:#1E293B; font-weight:600; margin-right:24px;">₹ 2,450</strong>
          <span style="color:#94A3B8; font-size:12px;">10:28 AM</span>
        </div>

        <!-- Bill 2 -->
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #F1F5F9; padding-bottom:8px; font-size:13px;">
          <div>
            <strong style="color:#1E293B; font-weight:600; display:block;">INV-10044</strong>
            <span style="color:#64748B; font-size:11px;">Priya Sharma</span>
          </div>
          <strong style="color:#1E293B; font-weight:600; margin-right:24px;">₹ 1,850</strong>
          <span style="color:#94A3B8; font-size:12px;">10:12 AM</span>
        </div>

        <!-- Bill 3 -->
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #F1F5F9; padding-bottom:8px; font-size:13px;">
          <div>
            <strong style="color:#1E293B; font-weight:600; display:block;">INV-10043</strong>
            <span style="color:#64748B; font-size:11px;">Ramesh Kumar</span>
          </div>
          <strong style="color:#1E293B; font-weight:600; margin-right:24px;">₹ 3,250</strong>
          <span style="color:#94A3B8; font-size:12px;">09:58 AM</span>
        </div>

        <!-- Bill 4 -->
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #F1F5F9; padding-bottom:8px; font-size:13px;">
          <div>
            <strong style="color:#1E293B; font-weight:600; display:block;">INV-10042</strong>
            <span style="color:#64748B; font-size:11px;">Neha Fashion</span>
          </div>
          <strong style="color:#1E293B; font-weight:600; margin-right:24px;">₹ 1,350</strong>
          <span style="color:#94A3B8; font-size:12px;">09:42 AM</span>
        </div>

        <!-- Bill 5 -->
        <div style="display:flex; justify-content:space-between; align-items:center; padding-bottom:4px; font-size:13px;">
          <div>
            <strong style="color:#1E293B; font-weight:600; display:block;">INV-10041</strong>
            <span style="color:#64748B; font-size:11px;">Walk-in Customer</span>
          </div>
          <strong style="color:#1E293B; font-weight:600; margin-right:24px;">₹ 2,750</strong>
          <span style="color:#94A3B8; font-size:12px;">09:30 AM</span>
        </div>
      </div>
    `;
    return el;
  }
}
