/**
 * SalesOverview.js
 * Retail ERP Enterprise — Sales Trend Chart Card
 */

"use strict";

export default class SalesOverview {
  render() {
    const el = document.createElement("div");
    el.className = "dashboard-card sales-overview-card col-span-8";
    el.innerHTML = `
      <h3 class="dashboard-card-title">Sales Overview</h3>
      <div class="chart-container-placeholder" style="height: 240px; display:flex; flex-direction:column; justify-content:flex-end;">
        <div class="mock-chart-bars-row" style="display:flex; justify-content:space-between; align-items:flex-end; height:180px; padding:0 20px;">
          <div class="chart-bar-col" style="width:32px; height:45%; background-color:#5B3DF5; border-radius:4px 4px 0 0;"></div>
          <div class="chart-bar-col" style="width:32px; height:60%; background-color:#5B3DF5; border-radius:4px 4px 0 0;"></div>
          <div class="chart-bar-col" style="width:32px; height:80%; background-color:#5B3DF5; border-radius:4px 4px 0 0;"></div>
          <div class="chart-bar-col" style="width:32px; height:55%; background-color:#5B3DF5; border-radius:4px 4px 0 0;"></div>
          <div class="chart-bar-col" style="width:32px; height:90%; background-color:#5B3DF5; border-radius:4px 4px 0 0;"></div>
          <div class="chart-bar-col" style="width:32px; height:75%; background-color:#5B3DF5; border-radius:4px 4px 0 0;"></div>
        </div>
        <div class="mock-chart-labels-row" style="display:flex; justify-content:space-between; padding:8px 10px 0 10px; font-size:12px; color:#6B7280;">
          <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
        </div>
      </div>
    `;
    return el;
  }
}
