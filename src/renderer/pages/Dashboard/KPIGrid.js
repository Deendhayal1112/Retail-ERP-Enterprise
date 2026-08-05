/**
 * KPIGrid.js
 * Retail ERP Enterprise — Reusable 5-Card KPI Scorecards Grid
 */

"use strict";

export default class KPIGrid {
  render() {
    const el = document.createElement("div");
    el.className = "dashboard-kpi-grid-wrapper col-span-12";
    el.style.display = "grid";
    el.style.gridTemplateColumns = "repeat(5, 1fr)";
    el.style.gap = "24px";
    el.style.width = "100%";

    el.innerHTML = `
      <!-- Card 1: Today's Sales -->
      <div class="kpi-card-item" style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:16px; padding:20px; display:flex; align-items:center; gap:16px; box-shadow:0 1px 3px rgba(0,0,0,0.01); transition:transform 150ms ease;">
        <div class="kpi-card-icon-box" style="width:48px; height:48px; border-radius:12px; display:flex; align-items:center; justify-content:center; background-color:#E8F8F0; color:#10B981; flex-shrink:0;">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
        </div>
        <div class="kpi-card-left" style="display:flex; flex-direction:column; gap:4px;">
          <span class="kpi-card-label" style="font-size:13px; font-weight:600; color:#64748B;">Today's Sales</span>
          <span class="kpi-card-value" style="font-size:20px; font-weight:700; color:#1E293B;">₹ 48,650.00</span>
          <span class="kpi-card-trend trend-positive" style="font-size:12px; font-weight:600; color:#10B981;">↗ 18.6% <span style="color:#64748B; font-weight:500; font-size:11px;">vs Yesterday</span></span>
        </div>
      </div>

      <!-- Card 2: Today's Profit -->
      <div class="kpi-card-item" style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:16px; padding:20px; display:flex; align-items:center; gap:16px; box-shadow:0 1px 3px rgba(0,0,0,0.01); transition:transform 150ms ease;">
        <div class="kpi-card-icon-box" style="width:48px; height:48px; border-radius:12px; display:flex; align-items:center; justify-content:center; background-color:#EEF2FF; color:#4F46E5; flex-shrink:0;">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
        </div>
        <div class="kpi-card-left" style="display:flex; flex-direction:column; gap:4px;">
          <span class="kpi-card-label" style="font-size:13px; font-weight:600; color:#64748B;">Today's Profit</span>
          <span class="kpi-card-value" style="font-size:20px; font-weight:700; color:#1E293B;">₹ 16,240.50</span>
          <span class="kpi-card-trend trend-positive" style="font-size:12px; font-weight:600; color:#10B981;">↗ 22.4% <span style="color:#64748B; font-weight:500; font-size:11px;">vs Yesterday</span></span>
        </div>
      </div>

      <!-- Card 3: Today's Bills -->
      <div class="kpi-card-item" style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:16px; padding:20px; display:flex; align-items:center; gap:16px; box-shadow:0 1px 3px rgba(0,0,0,0.01); transition:transform 150ms ease;">
        <div class="kpi-card-icon-box" style="width:48px; height:48px; border-radius:12px; display:flex; align-items:center; justify-content:center; background-color:#FAF5FF; color:#9333EA; flex-shrink:0;">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
        </div>
        <div class="kpi-card-left" style="display:flex; flex-direction:column; gap:4px;">
          <span class="kpi-card-label" style="font-size:13px; font-weight:600; color:#64748B;">Today's Bills</span>
          <span class="kpi-card-value" style="font-size:20px; font-weight:700; color:#1E293B;">32</span>
          <span class="kpi-card-trend trend-positive" style="font-size:12px; font-weight:600; color:#10B981;">↗ 14.3% <span style="color:#64748B; font-weight:500; font-size:11px;">vs Yesterday</span></span>
        </div>
      </div>

      <!-- Card 4: Today's Customers -->
      <div class="kpi-card-item" style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:16px; padding:20px; display:flex; align-items:center; gap:16px; box-shadow:0 1px 3px rgba(0,0,0,0.01); transition:transform 150ms ease;">
        <div class="kpi-card-icon-box" style="width:48px; height:48px; border-radius:12px; display:flex; align-items:center; justify-content:center; background-color:#FFF7ED; color:#EA580C; flex-shrink:0;">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        </div>
        <div class="kpi-card-left" style="display:flex; flex-direction:column; gap:4px;">
          <span class="kpi-card-label" style="font-size:13px; font-weight:600; color:#64748B;">Today's Customers</span>
          <span class="kpi-card-value" style="font-size:20px; font-weight:700; color:#1E293B;">28</span>
          <span class="kpi-card-trend trend-positive" style="font-size:12px; font-weight:600; color:#10B981;">↗ 12.5% <span style="color:#64748B; font-weight:500; font-size:11px;">vs Yesterday</span></span>
        </div>
      </div>

      <!-- Card 5: Low Stock Items -->
      <div class="kpi-card-item" style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:16px; padding:20px; display:flex; align-items:center; gap:16px; box-shadow:0 1px 3px rgba(0,0,0,0.01); transition:transform 150ms ease;">
        <div class="kpi-card-icon-box" style="width:48px; height:48px; border-radius:12px; display:flex; align-items:center; justify-content:center; background-color:#FEF2F2; color:#EF4444; flex-shrink:0;">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        </div>
        <div class="kpi-card-left" style="display:flex; flex-direction:column; gap:4px;">
          <span class="kpi-card-label" style="font-size:13px; font-weight:600; color:#64748B;">Low Stock Items</span>
          <span class="kpi-card-value" style="font-size:20px; font-weight:700; color:#1E293B;">14</span>
          <span class="kpi-card-trend trend-negative" style="font-size:12px; font-weight:600; color:#EF4444;">↘ 2 <span style="color:#64748B; font-weight:500; font-size:11px;">vs Yesterday</span></span>
        </div>
      </div>
    `;
    return el;
  }
}
