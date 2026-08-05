/**
 * DeploymentPanel.js
 * Retail ERP Enterprise — Platform installer packaging and rollback status panel
 */

"use strict";

export default class DeploymentPanel {
  constructor() { this.element = null; }

  render() {
    const card = document.createElement("div");
    card.className = "performance-metric-card deployment-panel";

    card.innerHTML = `
      <div class="metric-card-header">
        <h3 class="metric-card-title">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
          Deployment & Packaging
        </h3>
        <span class="metric-card-badge badge-normal status-badge">Ready</span>
      </div>
      <div class="packaging-list" style="display:flex; flex-direction:column; gap:8px; margin-top:8px;"></div>
    `;

    this.element = card;
    return card;
  }

  update(metrics) {
    if (!this.element) return;
    const p = metrics.packaging;
    const d = metrics.deployment;

    const platforms = [
      { name: "Windows (NSIS Installer)", size: `${p.windowsInstallerSizeMb} MB`, tag: "Build Ready" },
      { name: "macOS (DMG Package)", size: `${p.macOSDmgSizeMb} MB`, tag: "Build Ready" },
      { name: "Linux (AppImage)", size: `${p.linuxAppImageSizeMb} MB`, tag: "Build Ready" },
      { name: "Portable zip Archive", size: `${p.portableArchiveSizeMb} MB`, tag: "Build Ready" }
    ];

    const container = this.element.querySelector(".packaging-list");
    container.innerHTML = `
      <div style="font-size:12px; font-weight:700; color:#64748B; text-transform:uppercase; margin-bottom:4px;">Platforms</div>
      ${platforms.map(plat => `
        <div style="display:flex; align-items:center; justify-content:space-between; padding:4px 0; font-size:13px;">
          <span style="font-weight:500; color:#334155;">${plat.name}</span>
          <div style="display:flex; gap:6px;">
            <span style="font-weight:700; color:#1E293B;">${plat.size}</span>
            <span style="font-size:10px; font-weight:700; background:rgba(16,185,129,0.06); color:#10B981; border-radius:4px; padding:1px 6px;">${plat.tag}</span>
          </div>
        </div>`).join("")}
      <div style="border-top:1px solid rgba(0,0,0,0.06); margin-top:10px; padding-top:10px; display:flex; justify-content:space-between; font-size:13px; font-weight:600;">
        <span style="color:#64748B;">Target Registry:</span>
        <span style="color:#1E293B;">${d.publishingTarget}</span>
      </div>
    `;
  }
}
