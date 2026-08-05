/**
 * Notifications.js
 * Retail ERP Enterprise — System Notifications Feed Card
 */

"use strict";

export default class Notifications {
  render() {
    const el = document.createElement("div");
    el.className = "dashboard-card notifications-card col-span-4";
    el.style.display = "flex";
    el.style.flexDirection = "column";

    el.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px;">
        <h3 class="dashboard-card-title" style="margin:0; font-size:16px; font-weight:700; color:#1E293B;">Notifications</h3>
        <a href="#" style="font-size:13px; font-weight:600; color:#5B3DF5; text-decoration:none;">View All</a>
      </div>

      <div class="notifications-feed-list" style="display:flex; flex-direction:column; gap:12px; flex:1;">
        <!-- Notification 1 -->
        <div style="display:flex; gap:12px; align-items:center; border-bottom:1px solid #F1F5F9; padding-bottom:8px; font-size:13px;">
          <div style="width:32px; height:32px; border-radius:50%; background-color:#E8F8F0; color:#10B981; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:14px;">
            ✓
          </div>
          <div style="flex:1;">
            <strong style="color:#1E293B; font-weight:600; display:block;">Backup Completed</strong>
            <span style="color:#64748B; font-size:11px;">Daily backup completed successfully</span>
          </div>
          <span style="color:#94A3B8; font-size:11px; flex-shrink:0;">10:00 PM</span>
        </div>

        <!-- Notification 2 -->
        <div style="display:flex; gap:12px; align-items:center; border-bottom:1px solid #F1F5F9; padding-bottom:8px; font-size:13px;">
          <div style="width:32px; height:32px; border-radius:50%; background-color:#FEF3C7; color:#F59E0B; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:14px;">
            ⚠️
          </div>
          <div style="flex:1;">
            <strong style="color:#1E293B; font-weight:600; display:block;">Low Stock Alert</strong>
            <span style="color:#64748B; font-size:11px;">14 items are running low on stock</span>
          </div>
          <span style="color:#94A3B8; font-size:11px; flex-shrink:0;">09:15 PM</span>
        </div>

        <!-- Notification 3 -->
        <div style="display:flex; gap:12px; align-items:center; border-bottom:1px solid #F1F5F9; padding-bottom:8px; font-size:13px;">
          <div style="width:32px; height:32px; border-radius:50%; background-color:#E0F2FE; color:#3B82F6; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:14px;">
            ✉
          </div>
          <div style="flex:1;">
            <strong style="color:#1E293B; font-weight:600; display:block;">Daily Report Sent</strong>
            <span style="color:#64748B; font-size:11px;">Daily sales report sent to owner email</span>
          </div>
          <span style="color:#94A3B8; font-size:11px; flex-shrink:0;">10:00 PM</span>
        </div>

        <!-- Notification 4 -->
        <div style="display:flex; gap:12px; align-items:center; padding-bottom:4px; font-size:13px;">
          <div style="width:32px; height:32px; border-radius:50%; background-color:#E8F8F0; color:#10B981; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:14px;">
            ✓
          </div>
          <div style="flex:1;">
            <strong style="color:#1E293B; font-weight:600; display:block;">License Valid</strong>
            <span style="color:#64748B; font-size:11px;">Your license is valid until 31 Dec 2025</span>
          </div>
          <span style="color:#94A3B8; font-size:11px; flex-shrink:0;">08:30 PM</span>
        </div>
      </div>
    `;
    return el;
  }
}
