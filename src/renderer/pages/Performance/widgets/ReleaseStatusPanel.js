/**
 * ReleaseStatusPanel.js
 * Retail ERP Enterprise — Active Release Candidate metadata and history panel
 */

"use strict";

export default class ReleaseStatusPanel {
  constructor() { this.element = null; }

  render() {
    const card = document.createElement("div");
    card.className = "performance-logs-panel release-status-panel";
    card.style.gridColumn = "1 / -1"; // Spans full width

    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
        <h3 style="margin:0; font-size:16px; font-weight:700; color:#1E293B; display:flex; align-items:center; gap:8px;">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          Release Candidates & Build History
        </h3>
        <span class="val-version" style="font-size:12px; font-weight:800; background:rgba(37,99,235,0.06); color:var(--primary-600); border-radius:4px; padding:2px 8px;">v0.2.0-rc2</span>
      </div>
      <div style="margin:12px 0; font-size:13px; color:#475569; padding:8px; background:rgba(0,0,0,0.02); border-left:3px solid var(--primary-600); border-radius:4px;">
        <span style="font-weight:700; display:block; margin-bottom:2px;">Changelog Summary:</span>
        <span class="val-notes">Loading notes...</span>
      </div>
      <div class="history-runs-list" style="display:flex; flex-direction:column; gap:4px;"></div>
    `;

    this.element = card;
    return card;
  }

  update(metrics) {
    if (!this.element) return;
    const d = metrics.deployment;

    this.element.querySelector(".val-version").textContent = d.versionTag;
    this.element.querySelector(".val-notes").textContent = d.releaseNotes;

    const list = this.element.querySelector(".history-runs-list");
    list.innerHTML = (metrics.runsHistory || []).map(run => {
      let badgeColor = "#10B981"; // Success green
      if (run.status === "failed") badgeColor = "#EF4444"; // Red

      return `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:6px; font-size:12px; border-bottom:1px solid rgba(0,0,0,0.02);">
          <div style="display:flex; gap:8px;">
            <span style="color:#64748B; font-weight:700;">[${run.date}]</span>
            <span style="color:#1E293B; font-weight:700;">Build ID: ${run.id} • ${run.tag}</span>
          </div>
          <div style="display:flex; gap:8px;">
            <span style="color:#475569; font-weight:600;">Time: ${run.duration}</span>
            <span style="font-weight:700; color:${badgeColor}; text-transform:uppercase;">${run.status}</span>
          </div>
        </div>`;
    }).join("");
  }
}
