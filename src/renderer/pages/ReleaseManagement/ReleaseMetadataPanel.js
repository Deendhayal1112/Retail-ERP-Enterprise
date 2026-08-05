/**
 * ReleaseMetadataPanel.js
 * Retail ERP Enterprise — Changelog Manifest Details Panel
 */

"use strict";

export default class ReleaseMetadataPanel {
  constructor(options = {}) {
    this.options = options;
    this.changelogs = options.changelogs || [];
  }

  render() {
    const card = document.createElement("div");
    card.className = "release-mgmt-card col-span-12";
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
        <h3 class="release-mgmt-card-title" style="margin:0;">Release Manifest Metadata Logs</h3>
        <button class="compile-metadata-btn" style="height:36px; padding:0 16px; background-color:#5B3DF5; color:#FFFFFF; border:none; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer;">
          Compile Manifest
        </button>
      </div>

      <div class="changelogs-container" style="display:flex; flex-direction:column; gap:16px;"></div>
    `;

    const container = card.querySelector(".changelogs-container");
    this.changelogs.forEach(log => {
      const row = document.createElement("div");
      row.style.border = "1px solid #E9EDF5";
      row.style.borderRadius = "12px";
      row.style.padding = "16px";
      row.style.display = "flex";
      row.style.flexDirection = "column";
      row.style.gap = "8px";

      row.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #F1F5F9; padding-bottom:8px;">
          <strong style="font-size:14px; color:#1E293B;">Release v${log.version}</strong>
          <span style="font-size:12px; color:#6B7280;">Release Date: ${log.date}</span>
        </div>
        <ul style="margin:0; padding-left:20px; font-size:13px; color:#475569; line-height:1.6;">
          ${log.changes.map(change => `<li>${change}</li>`).join("")}
        </ul>
      `;

      container.appendChild(row);
    });

    card.querySelector(".compile-metadata-btn").addEventListener("click", () => {
      this.compileMetadata();
    });

    return card;
  }

  async compileMetadata() {
    try {
      const result = await window.api.ipc.invoke("release:compile-metadata", {
        version: "0.2.0-beta",
        stability: "Beta",
        releaseDate: new Date().toISOString().slice(0, 10)
      });
      if (result && result.success) {
        alert(`Release manifest metadata successfully compiled and saved to: ${result.filePath}`);
      }
    } catch (err) {
      console.error("Compile metadata error:", err);
    }
  }
}
