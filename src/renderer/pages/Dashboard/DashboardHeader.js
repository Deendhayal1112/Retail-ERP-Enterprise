/**
 * DashboardHeader.js
 * Retail ERP Enterprise — Reusable Dashboard Header View
 */

"use strict";

export default class DashboardHeader {
  render() {
    const el = document.createElement("header");
    el.className = "dashboard-view-header";
    el.style.display = "flex";
    el.style.justifyContent = "space-between";
    el.style.alignItems = "center";
    el.style.marginBottom = "8px";

    el.innerHTML = `
      <div class="header-titles-group">
        <h1 class="dashboard-main-title" style="margin:0; font-size:28px; font-weight:700; color:#1E293B;">Dashboard</h1>
        <p class="dashboard-main-subtitle" style="margin:4px 0 0 0; font-size:14px; color:#64748B;">Welcome back, Owner! 👋</p>
      </div>
      <div class="header-actions-group" style="display:flex; flex-direction:column; align-items:flex-end; gap:8px;">
        <div class="header-datetime" style="font-size:13px; color:#64748B; font-weight:500;">
          <span style="color:#1E293B; font-weight:600; margin-right:8px;">Monday, 12 May 2025</span>
          <span>10:30 <span style="font-size:11px; opacity:0.8;">AM</span></span>
        </div>
        <button class="header-new-sale-btn" style="height:36px; padding:0 16px; background-color:#5B3DF5; color:#FFFFFF; border:none; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; display:flex; align-items:center; gap:8px; transition:background-color 150ms ease;">
          <span style="font-size:16px;">+</span> New Sale (F2)
        </button>
      </div>
    `;
    return el;
  }
}
