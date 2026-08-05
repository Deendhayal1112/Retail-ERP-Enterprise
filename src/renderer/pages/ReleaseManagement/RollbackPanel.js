/**
 * RollbackPanel.js
 * Retail ERP Enterprise — Rollback & Recovery Dashboard Panel
 */

"use strict";

export default class RollbackPanel {
  constructor(options = {}) {
    this.options = options;
    this.archives = options.archives || [];
  }

  render() {
    const card = document.createElement("div");
    card.className = "release-mgmt-card col-span-12";
    card.innerHTML = `
      <h3 class="release-mgmt-card-title">Archived Releases & Disaster Recovery</h3>
      <div style="display:flex; flex-direction:column; gap:20px;">
        <div class="archives-list-container" style="display:grid; grid-template-columns:1fr; gap:16px;"></div>
      </div>
    `;

    const container = card.querySelector(".archives-list-container");
    this.archives.forEach(arc => {
      const row = document.createElement("div");
      row.style.display = "flex";
      row.style.justifyContent = "space-between";
      row.style.alignItems = "center";
      row.style.borderBottom = "1px solid #F1F5F9";
      row.style.paddingBottom = "12px";

      row.innerHTML = `
        <div>
          <strong style="color:#1E293B; font-size:14px; display:block;">Version v${arc.version}</strong>
          <span style="font-size:12px; color:#6B7280;">Release Date: ${arc.releaseDate} | Backup Package: ${arc.packageFile}</span>
        </div>
        <button class="rollback-btn" data-version="${arc.version}" style="height:32px; padding:0 12px; border:1px solid #EF4444; color:#EF4444; background:none; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer;">
          Rollback System
        </button>
      `;

      row.querySelector(".rollback-btn").addEventListener("click", async () => {
        const confirmResult = confirm(`Are you sure you want to rollback to v${arc.version}?\nThis will overwrite current databases and schemas.`);
        if (confirmResult && this.options.onRollback) {
          await this.options.onRollback(arc.version);
        }
      });

      container.appendChild(row);
    });

    return card;
  }
}
