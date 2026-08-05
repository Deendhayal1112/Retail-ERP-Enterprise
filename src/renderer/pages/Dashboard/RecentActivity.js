/**
 * RecentActivity.js
 * Retail ERP Enterprise — Reusable Recent Activities Feed Component
 */

"use strict";

export default class RecentActivity {
  render() {
    const el = document.createElement("div");
    el.className = "dashboard-card recent-activity-card col-span-4";
    el.innerHTML = `
      <h3 class="dashboard-card-title">Recent Activity</h3>
      <ul class="recent-activities-list" style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:16px;">
        <li style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #E9EDF5; padding-bottom:10px;">
          <div>
            <span style="font-size:13px; font-weight:600; color:#111827; display:block;">Sale Completed: #INV-9402</span>
            <span style="font-size:12px; color:#6B7280;">Processed by Admin Operator</span>
          </div>
          <span style="font-size:12px; color:#9CA3AF;">10m ago</span>
        </li>
        <li style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #E9EDF5; padding-bottom:10px;">
          <div>
            <span style="font-size:13px; font-weight:600; color:#111827; display:block;">Settings Updated</span>
            <span style="font-size:12px; color:#6B7280;">Store details successfully modified</span>
          </div>
          <span style="font-size:12px; color:#9CA3AF;">45m ago</span>
        </li>
      </ul>
    `;
    return el;
  }
}
