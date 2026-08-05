/**
 * FooterStatus.js
 * Retail ERP Enterprise — Reusable Footer Diagnostics Status Bar
 */

"use strict";

export default class FooterStatus {
  render() {
    const el = document.createElement("div");
    el.className = "dashboard-footer-status-bar col-span-12";
    el.innerHTML = `
      <div class="footer-status-left">
        <span class="status-indicator-dot online"></span>
        <span class="status-text">Database Connection: <strong>Connected</strong></span>
      </div>
      <div class="footer-status-right">
        <span class="status-text">Last replication sync: Just now</span>
      </div>
    `;
    return el;
  }
}
