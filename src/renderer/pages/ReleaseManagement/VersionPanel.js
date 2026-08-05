/**
 * VersionPanel.js
 * Retail ERP Enterprise — Semantic Versioning Control Panel
 */

"use strict";

export default class VersionPanel {
  constructor(options = {}) {
    this.options = options;
    this.current = options.current || {};
    this.history = options.history || [];
  }

  render() {
    const card = document.createElement("div");
    card.className = "release-mgmt-card col-span-12";
    card.innerHTML = `
      <h3 class="release-mgmt-card-title">Semantic Versioning Control</h3>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:24px;">
        <!-- Left: Active build details -->
        <div>
          <h4 style="font-size:15px; font-weight:600; color:#1E293B; margin-bottom:12px;">Active Target Parameters</h4>
          <div style="display:flex; flex-direction:column; gap:12px;">
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid #F1F5F9; padding-bottom:8px; font-size:13px;">
              <span style="color:#6B7280;">Semantic Target</span>
              <strong style="color:#1E293B;">v${this.current.semVer}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid #F1F5F9; padding-bottom:8px; font-size:13px;">
              <span style="color:#6B7280;">Build Number</span>
              <strong style="color:#1E293B;">#${this.current.buildNumber}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid #F1F5F9; padding-bottom:8px; font-size:13px;">
              <span style="color:#6B7280;">Compile Date</span>
              <strong style="color:#1E293B;">${this.current.releaseDate}</strong>
            </div>
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid #F1F5F9; padding-bottom:8px; font-size:13px;">
              <span style="color:#6B7280;">Build Hash Metadata</span>
              <code style="color:#475569; font-family:monospace; background-color:#F8FAFC; border:1px solid #E9EDF5; padding:2px 6px; border-radius:4px;">${this.current.buildMetadata}</code>
            </div>
          </div>
        </div>

        <!-- Right: Version History list -->
        <div>
          <h4 style="font-size:15px; font-weight:600; color:#1E293B; margin-bottom:12px;">Historical Versions Trace</h4>
          <div style="display:flex; flex-direction:column; gap:10px;">
            ${this.history.map(h => `
              <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #F1F5F9; padding-bottom:8px; font-size:13px;">
                <div>
                  <strong style="color:#1E293B;">v${h.semVer}</strong>
                  <span style="font-size:11px; color:#6B7280; margin-left:8px;">Build #${h.buildNumber} (${h.releaseDate})</span>
                </div>
                <span class="release-mgmt-badge ${h.status.toLowerCase()}">${h.status}</span>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `;

    return card;
  }
}
