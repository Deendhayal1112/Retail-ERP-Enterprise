/**
 * InventoryAnalytics.js
 * Retail ERP Enterprise — Inventory Status Donut Chart Card
 */

"use strict";

export default class InventoryAnalytics {
  render() {
    const el = document.createElement("div");
    el.className = "dashboard-card inventory-analytics-card col-span-4";
    el.style.display = "flex";
    el.style.flexDirection = "column";

    el.innerHTML = `
      <h3 class="dashboard-card-title" style="margin-bottom:18px; font-size:16px; font-weight:700; color:#1E293B;">Inventory Status</h3>
      <div class="inventory-status-body" style="display:flex; align-items:center; justify-content:space-between; flex:1; gap:16px;">
        <!-- Donut Chart -->
        <div style="position:relative; width:140px; height:140px; flex-shrink:0;">
          <svg viewBox="0 0 100 100" width="140" height="140" style="transform:rotate(-90deg);">
            <!-- Out of Stock Segment (Red) -->
            <circle cx="50" cy="50" r="38" stroke="#EF4444" stroke-width="12" fill="none" stroke-dasharray="238.76" stroke-dashoffset="0" />
            <!-- Low Stock Segment (Yellow) -->
            <circle cx="50" cy="50" r="38" stroke="#F59E0B" stroke-width="12" fill="none" stroke-dasharray="238.76" stroke-dashoffset="32" />
            <!-- In Stock Segment (Green) -->
            <circle cx="50" cy="50" r="38" stroke="#22C55E" stroke-width="12" fill="none" stroke-dasharray="238.76" stroke-dashoffset="77" />
          </svg>
          <!-- Donut Inner Center Label -->
          <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); text-align:center; font-family:inherit;">
            <div style="font-size:10px; font-weight:600; color:#64748B; text-transform:uppercase; letter-spacing:0.5px;">Total</div>
            <div style="font-size:16px; font-weight:700; color:#1E293B; line-height:1.2;">1,256</div>
            <div style="font-size:10px; font-weight:500; color:#64748B;">Items</div>
          </div>
        </div>

        <!-- Legend Column -->
        <div style="display:flex; flex-direction:column; gap:12px; font-size:13px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="width:10px; height:10px; border-radius:50%; background-color:#22C55E; display:inline-block;"></span>
            <span style="color:#64748B; font-weight:500;">In Stock</span>
            <strong style="color:#1E293B; margin-left:8px;">852 <span style="font-weight:500; font-size:11px; color:#64748B;">(67.8%)</span></strong>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="width:10px; height:10px; border-radius:50%; background-color:#F59E0B; display:inline-block;"></span>
            <span style="color:#64748B; font-weight:500;">Low Stock</span>
            <strong style="color:#1E293B; margin-left:8px;">236 <span style="font-weight:500; font-size:11px; color:#64748B;">(18.8%)</span></strong>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="width:10px; height:10px; border-radius:50%; background-color:#EF4444; display:inline-block;"></span>
            <span style="color:#64748B; font-weight:500;">Out of Stock</span>
            <strong style="color:#1E293B; margin-left:8px;">168 <span style="font-weight:500; font-size:11px; color:#64748B;">(13.4%)</span></strong>
          </div>
        </div>
      </div>
    `;
    return el;
  }
}
