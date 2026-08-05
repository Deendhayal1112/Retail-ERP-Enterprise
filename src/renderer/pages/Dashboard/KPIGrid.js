/**
 * KPIGrid.js
 * Retail ERP Enterprise — Reusable KPI Scorecards Grid
 */

"use strict";

export default class KPIGrid {
  render() {
    const el = document.createElement("div");
    el.className = "dashboard-kpi-grid-wrapper col-span-12";
    el.innerHTML = `
      <div class="kpi-card-item">
        <div class="kpi-card-left">
          <span class="kpi-card-label">Total Revenue</span>
          <span class="kpi-card-value">$48,250.00</span>
          <span class="kpi-card-trend trend-positive">+12.4% vs last week</span>
        </div>
        <div class="kpi-card-icon-box revenue-icon">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
        </div>
      </div>
      <div class="kpi-card-item">
        <div class="kpi-card-left">
          <span class="kpi-card-label">Sales Transactions</span>
          <span class="kpi-card-value">348 sales</span>
          <span class="kpi-card-trend trend-positive">+8.2% vs last week</span>
        </div>
        <div class="kpi-card-icon-box sales-icon">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
        </div>
      </div>
      <div class="kpi-card-item">
        <div class="kpi-card-left">
          <span class="kpi-card-label">Active Customers</span>
          <span class="kpi-card-value">1,240</span>
          <span class="kpi-card-trend trend-negative">-2.1% vs last week</span>
        </div>
        <div class="kpi-card-icon-box customers-icon">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        </div>
      </div>
      <div class="kpi-card-item">
        <div class="kpi-card-left">
          <span class="kpi-card-label">Average Sale Value</span>
          <span class="kpi-card-value">$138.60</span>
          <span class="kpi-card-trend trend-positive">+4.3% vs last week</span>
        </div>
        <div class="kpi-card-icon-box value-icon">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
        </div>
      </div>
    `;
    return el;
  }
}
