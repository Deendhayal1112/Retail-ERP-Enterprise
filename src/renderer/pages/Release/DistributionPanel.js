/**
 * DistributionPanel.js
 * Retail ERP Enterprise — Multi-channel Deployments Panel
 */

"use strict";

export default class DistributionPanel {
  constructor(options = {}) {
    this.options = options;
    this.channels = options.channels || [];
  }

  render() {
    const card = document.createElement("div");
    card.className = "release-card col-span-12";
    card.innerHTML = `
      <h3 class="release-card-title">Active Release Channels & Deployment</h3>
      <div class="channels-grid" style="display:grid; grid-template-columns:1fr; gap:16px;"></div>
    `;

    const container = card.querySelector(".channels-grid");
    this.channels.forEach(ch => {
      const row = document.createElement("div");
      row.style.display = "flex";
      row.style.justifyContent = "space-between";
      row.style.alignItems = "center";
      row.style.borderBottom = "1px solid #F1F5F9";
      row.style.paddingBottom = "12px";

      row.innerHTML = `
        <div>
          <strong style="color:#1E293B; font-size:14px; display:block;">${ch.channel}</strong>
          <span style="font-size:12px; color:#6B7280;">Deploys: ${ch.deployedCount} | Last Deployment: ${ch.lastDeploy}</span>
        </div>
        <div style="display:flex; align-items:center; gap:12px;">
          <span style="font-size:12px; font-weight:700; color:${ch.active ? "#10B981" : "#94A3B8"};">
            ${ch.active ? "DEPLOYED" : "INACTIVE"}
          </span>
          <button class="channel-toggle-btn" data-channel="${ch.channel}" style="height:32px; padding:0 12px; border:1px solid #E9EDF5; background:none; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer; color:#1E293B;">
            ${ch.active ? "Pause" : "Deploy"}
          </button>
        </div>
      `;

      row.querySelector(".channel-toggle-btn").addEventListener("click", async () => {
        if (this.options.onToggleChannel) {
          await this.options.onToggleChannel(ch.channel);
        }
      });

      container.appendChild(row);
    });

    return card;
  }
}
