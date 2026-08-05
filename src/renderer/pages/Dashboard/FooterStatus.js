/**
 * FooterStatus.js
 * Retail ERP Enterprise — Diagnostics & System Integrity Footer Status Bar
 */

"use strict";

export default class FooterStatus {
  render() {
    const el = document.createElement("div");
    el.className = "dashboard-footer-status-bar col-span-12";
    el.style.display = "flex";
    el.style.justifyContent = "space-between";
    el.style.alignItems = "center";
    el.style.backgroundColor = "#FFFFFF";
    el.style.border = "1px solid #E9EDF5";
    el.style.borderRadius = "12px";
    el.style.padding = "12px 20px";
    el.style.boxShadow = "0 1px 3px rgba(0,0,0,0.02)";
    el.style.fontSize = "13px";
    el.style.color = "#64748B";

    el.innerHTML = `
      <div class="footer-status-left" style="display:flex; align-items:center; gap:20px;">
        <span style="display:flex; align-items:center; gap:8px;">
          <span style="width:8px; height:8px; border-radius:50%; background-color:#22C55E; display:inline-block; box-shadow:0 0 6px #22C55E;"></span>
          Database: <span style="color:#22C55E; font-weight:600;">Connected</span>
        </span>
        <span style="display:flex; align-items:center; gap:8px;">
          <span>💾 Backup: <strong>Today 10:00 PM</strong></span>
        </span>
      </div>
      <div class="footer-status-right" style="display:flex; align-items:center; gap:20px;">
        <span>🎫 License: <strong style="color:#22C55E;">Valid until 31 Dec 2025</strong></span>
        <span style="display:flex; align-items:center; gap:8px;">
          <span style="width:8px; height:8px; border-radius:50%; background-color:#22C55E; display:inline-block; box-shadow:0 0 6px #22C55E;"></span>
          Internet: <span style="color:#22C55E; font-weight:600;">Connected</span>
        </span>
      </div>
    `;
    return el;
  }
}
