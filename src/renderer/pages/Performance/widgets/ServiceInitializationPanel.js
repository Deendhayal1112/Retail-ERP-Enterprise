/**
 * ServiceInitializationPanel.js
 * Retail ERP Enterprise — Service Init Status & Duration Panel
 */

"use strict";

export default class ServiceInitializationPanel {
  constructor() { this.element = null; }

  render() {
    const card = document.createElement("div");
    card.className = "performance-metric-card service-init-panel";
    card.innerHTML = `
      <div class="metric-card-header">
        <h3 class="metric-card-title">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20V10M12 20V4M6 20v-6"></path></svg>
          Service Initialization
        </h3>
        <span class="metric-card-badge badge-normal status-badge">All Ready</span>
      </div>
      <div class="service-init-list"></div>
    `;
    this.element = card;
    return card;
  }

  update(metrics) {
    if (!this.element) return;
    const services = metrics.services || [];

    const hasWarning = services.some(s => s.status === "warning" || s.status === "failed");
    const badge = this.element.querySelector(".status-badge");
    if (hasWarning) {
      badge.textContent = "Warning";
      badge.className = "metric-card-badge badge-warning status-badge";
    } else {
      badge.textContent = "All Ready";
      badge.className = "metric-card-badge badge-normal status-badge";
    }

    const list = this.element.querySelector(".service-init-list");
    list.innerHTML = services.map(svc => {
      const isWarn = svc.status === "warning" || svc.status === "failed";
      const dotColor = isWarn ? "#F59E0B" : "#10B981";
      const msColor  = isWarn ? "#B45309" : "#1E293B";
      return `
        <div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid rgba(0,0,0,0.04);">
          <span style="width:8px;height:8px;border-radius:50%;background:${dotColor};flex-shrink:0;"></span>
          <span style="flex:1;font-size:13px;color:#334155;font-weight:500;">${svc.name}</span>
          <span style="font-size:13px;font-weight:700;color:${msColor};">${svc.initMs} ms</span>
          <span style="font-size:11px;font-weight:600;color:${dotColor};text-transform:uppercase;">${svc.status}</span>
        </div>`;
    }).join("");
  }
}
