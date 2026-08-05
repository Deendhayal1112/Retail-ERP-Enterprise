/**
 * ReleaseAssetsPanel.js
 * Retail ERP Enterprise — Version Release Changelog & Manifest Assets Panel
 */

"use strict";

export default class ReleaseAssetsPanel {
  constructor(options = {}) {
    this.options = options;
    this.artifacts = options.artifacts || [];
    this.manifest = options.manifest || { changelog: [] };
  }

  render() {
    const card = document.createElement("div");
    card.className = "release-card col-span-12";
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
        <h3 class="release-card-title" style="margin:0;">Release Artifacts & Manifest Notes</h3>
        <button class="compile-manifest-btn" style="height:36px; padding:0 16px; background-color:#5B3DF5; color:#FFFFFF; border:none; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer;">
          Compile Manifest
        </button>
      </div>

      <div style="display:grid; grid-template-columns:1.5fr 1fr; gap:24px;">
        <!-- Left: Artifacts Checksum list -->
        <div>
          <h4 style="font-size:15px; font-weight:600; color:#1E293B; margin-bottom:12px;">Generated Build Binaries</h4>
          <div style="display:flex; flex-direction:column; gap:12px;">
            ${this.artifacts.map(a => `
              <div style="border:1px solid #E9EDF5; border-radius:8px; padding:12px; font-size:13px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                  <strong style="color:#1E293B;">${a.name}</strong>
                  <span style="color:#6B7280; font-weight:500;">${a.size}</span>
                </div>
                <code style="display:block; background-color:#F8FAFC; border:1px solid #E9EDF5; padding:6px; border-radius:4px; font-size:11px; color:#475569; overflow-x:auto;">
                  SHA256: ${a.sha256}
                </code>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- Right: Release Notes manifest list -->
        <div>
          <h4 style="font-size:15px; font-weight:600; color:#1E293B; margin-bottom:12px;">Release Changelog notes</h4>
          <ul style="padding-left:20px; font-size:13px; color:#475569; line-height:1.6; margin:0;">
            ${this.manifest.changelog.map(line => `
              <li style="margin-bottom:8px;">${line}</li>
            `).join("")}
          </ul>
        </div>
      </div>
    `;

    card.querySelector(".compile-manifest-btn").addEventListener("click", () => {
      this.compileManifest();
    });

    return card;
  }

  async compileManifest() {
    try {
      const result = await window.api.ipc.invoke("release:compile-manifest", {
        compliance: this.options.validations
      });
      if (result && result.success) {
        alert(`Version manifest successfully compiled and saved to: ${result.filePath}`);
      }
    } catch (err) {
      console.error("Compile manifest error:", err);
    }
  }
}
