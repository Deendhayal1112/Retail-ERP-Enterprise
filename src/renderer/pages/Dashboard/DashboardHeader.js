/**
 * DashboardHeader.js
 * Retail ERP Enterprise — Reusable Dashboard Header View
 */

"use strict";

export default class DashboardHeader {
  render() {
    const el = document.createElement("header");
    el.className = "dashboard-view-header";
    el.innerHTML = `
      <div class="header-titles-group">
        <h1 class="dashboard-main-title">Business Dashboard</h1>
        <p class="dashboard-main-subtitle">Real-time store performance, sales metrics, and system diagnostics.</p>
      </div>
    `;
    return el;
  }
}
