/**
 * Notifications.js
 * Retail ERP Enterprise — Reusable Notifications Feed Component
 */

"use strict";

export default class Notifications {
  render() {
    const el = document.createElement("div");
    el.className = "dashboard-card notifications-card col-span-4";
    el.innerHTML = `
      <h3 class="dashboard-card-title">System Notifications</h3>
      <ul class="notifications-feed-list" style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:16px;">
        <li style="display:flex; gap:12px; border-bottom:1px solid #E9EDF5; padding-bottom:10px;">
          <span style="font-size:18px;">⚠️</span>
          <div>
            <span style="font-size:13px; font-weight:600; color:#111827; display:block;">Low Stock Alert</span>
            <span style="font-size:12px; color:#6B7280;">Leather Oxford Shoes is below min limit.</span>
          </div>
        </li>
        <li style="display:flex; gap:12px; border-bottom:1px solid #E9EDF5; padding-bottom:10px;">
          <span style="font-size:18px;">🛡️</span>
          <div>
            <span style="font-size:13px; font-weight:600; color:#111827; display:block;">Backup Created Successfully</span>
            <span style="font-size:12px; color:#6B7280;">Database snapshot successfully verified.</span>
          </div>
        </li>
      </ul>
    `;
    return el;
  }
}
