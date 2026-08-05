/**
 * SalesOverview.js
 * Retail ERP Enterprise — Sales Overview Chart Widget
 */

"use strict";

export default class SalesOverview {
  render() {
    const el = document.createElement("div");
    el.className = "dashboard-card sales-overview-card col-span-5";
    el.style.position = "relative";

    el.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <h3 class="dashboard-card-title" style="margin:0; font-size:16px; font-weight:700; color:#1E293B;">Sales Overview</h3>
        <select style="border:1px solid #E2E8F0; background-color:#FFFFFF; padding:4px 8px; border-radius:6px; font-size:12px; color:#64748B; cursor:pointer;">
          <option selected>This Week</option>
          <option>This Month</option>
        </select>
      </div>

      <div class="chart-relative-container" style="position:relative; height:240px; width:100%;">
        <!-- SVG Sparkline Chart matching the screenshot line path -->
        <svg viewBox="0 0 500 200" width="100%" height="180" style="overflow:visible;">
          <defs>
            <!-- Gradient Fill below the line -->
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#5B3DF5" stop-opacity="0.15" />
              <stop offset="100%" stop-color="#5B3DF5" stop-opacity="0.0" />
            </linearGradient>
          </defs>

          <!-- Grid Lines (Horizontal) -->
          <line x1="0" y1="30" x2="500" y2="30" stroke="#F1F5F9" stroke-width="1" />
          <line x1="0" y1="70" x2="500" y2="70" stroke="#F1F5F9" stroke-width="1" />
          <line x1="0" y1="110" x2="500" y2="110" stroke="#F1F5F9" stroke-width="1" />
          <line x1="0" y1="150" x2="500" y2="150" stroke="#F1F5F9" stroke-width="1" />
          
          <!-- Gradient Area -->
          <path d="M 10 120 C 50 110, 100 80, 150 70 C 200 65, 250 95, 300 85 C 350 80, 420 50, 480 30 L 480 180 L 10 180 Z" fill="url(#chartGrad)" />
          
          <!-- Chart Line -->
          <path d="M 10 120 C 50 110, 100 80, 150 70 C 200 65, 250 95, 300 85 C 350 80, 420 50, 480 30" fill="none" stroke="#5B3DF5" stroke-width="2.5" />
          
          <!-- Data points (Mon - Sun) -->
          <circle cx="10" cy="120" r="4.5" fill="#FFFFFF" stroke="#5B3DF5" stroke-width="2.5" />
          <circle cx="90" cy="85" r="4.5" fill="#FFFFFF" stroke="#5B3DF5" stroke-width="2.5" />
          <circle cx="170" cy="68" r="4.5" fill="#FFFFFF" stroke="#5B3DF5" stroke-width="2.5" />
          <!-- Interactive Highlighted Point (Wednesday) -->
          <circle cx="250" cy="95" r="6" fill="#5B3DF5" stroke="#FFFFFF" stroke-width="2" />
          <circle cx="330" cy="82" r="4.5" fill="#FFFFFF" stroke="#5B3DF5" stroke-width="2.5" />
          <circle cx="410" cy="50" r="4.5" fill="#FFFFFF" stroke="#5B3DF5" stroke-width="2.5" />
          <circle cx="480" cy="30" r="4.5" fill="#FFFFFF" stroke="#5B3DF5" stroke-width="2.5" />

          <!-- Dotted indicator line for Wednesday -->
          <line x1="250" y1="95" x2="250" y2="180" stroke="#94A3B8" stroke-width="1" stroke-dasharray="3,3" />
        </svg>

        <!-- Horizontal Label Axis -->
        <div style="display:flex; justify-content:space-between; margin-top:8px; font-size:12px; color:#94A3B8; font-weight:500; padding:0 8px;">
          <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
        </div>

        <!-- Y-Axis labels (Floating absolute) -->
        <div style="position:absolute; left:-32px; top:0; height:180px; display:flex; flex-direction:column; justify-content:space-between; font-size:10px; color:#94A3B8; font-weight:600; text-align:right; width:24px; pointer-events:none;">
          <span>60K</span><span>50K</span><span>40K</span><span>30K</span><span>20K</span><span>10K</span><span>0</span>
        </div>

        <!-- Floating Tooltip Card (Positioned exactly matching the screenshot) -->
        <div class="chart-tooltip" style="position:absolute; left:52%; top:22%; transform:translate(-50%, -100%); background-color:#FFFFFF; border:1px solid #E2E8F0; border-radius:8px; padding:10px 12px; box-shadow:0 4px 12px rgba(15,23,42,0.06); font-size:12px; min-width:130px; pointer-events:none;">
          <div style="font-weight:600; color:#64748B; margin-bottom:6px; font-size:11px;">Wed, 7 May 2025</div>
          <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
            <span style="width:6px; height:6px; border-radius:50%; background-color:#5B3DF5; display:inline-block;"></span>
            <span style="color:#1E293B; font-weight:500;">Sales:</span>
            <strong style="color:#1E293B; margin-left:auto;">₹ 42,850.00</strong>
          </div>
          <div style="display:flex; align-items:center; gap:6px;">
            <span style="width:6px; height:6px; border-radius:50%; background-color:#10B981; display:inline-block;"></span>
            <span style="color:#1E293B; font-weight:500;">Profit:</span>
            <strong style="color:#1E293B; margin-left:auto;">₹ 14,250.00</strong>
          </div>
        </div>
      </div>
    `;
    return el;
  }
}
