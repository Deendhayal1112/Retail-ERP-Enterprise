/**
 * DeveloperGuidePanel.js
 * Retail ERP Enterprise — Developer Documentation, Folder Schema & APIs
 */

"use strict";

export default class DeveloperGuidePanel {
  constructor(options = {}) {
    this.options = options;
    this.guides = options.guides || [];
  }

  render() {
    const card = document.createElement("div");
    card.className = "docs-center-card col-span-12";
    card.innerHTML = `
      <h3 class="docs-center-card-title">Developer & Codebase Architecture Guides</h3>
      <div style="display:flex; flex-direction:column; gap:20px;">
        <div class="guides-list-container" style="display:grid; grid-template-columns:1fr; gap:16px;"></div>
      </div>
    `;

    const container = card.querySelector(".guides-list-container");
    this.guides.forEach(g => {
      const row = document.createElement("div");
      row.className = "docs-guide-row";
      row.innerHTML = `
        <div>
          <strong style="color:#1E293B; font-size:14px; display:block;">${g.title}</strong>
          <span style="font-size:12px; color:#6B7280;">Format: ${g.format} | File Size: ${g.size}</span>
        </div>
        <button class="view-guide-btn" style="height:32px; padding:0 12px; border:1px solid #E9EDF5; background-color:#FFFFFF; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer; color:#1E293B;">
          Open Code Guide
        </button>
      `;

      row.querySelector(".view-guide-btn").addEventListener("click", () => {
        alert(`Opening codebase guide "${g.title}" inside dev documentation sandbox...`);
      });

      container.appendChild(row);
    });

    return card;
  }
}
