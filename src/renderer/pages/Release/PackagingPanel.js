/**
 * PackagingPanel.js
 * Retail ERP Enterprise — Build Packaging Compilation Control Dashboard
 */

"use strict";

export default class PackagingPanel {
  constructor(options = {}) {
    this.options = options;
    this.element = null;
    this.formats = [
      { key: "Windows NSIS", label: "Windows NSIS Installer", desc: "Builds a standard Windows installer (.exe) with NSIS." },
      { key: "Windows Portable", label: "Windows Portable Executable", desc: "Builds a portable Windows app (.exe) without installation." },
      { key: "macOS DMG", label: "macOS DMG Disk Image", desc: "Builds a macOS disk image installer (.dmg)." },
      { key: "Linux AppImage", label: "Linux AppImage", desc: "Builds a standalone Linux executable package (.AppImage)." }
    ];
  }

  render() {
    const card = document.createElement("div");
    card.className = "release-card col-span-12";
    card.innerHTML = `
      <h3 class="release-card-title">Simulated Installer Packaging</h3>
      <div style="display:flex; flex-direction:column; gap:20px;">
        <div class="formats-list-container" style="display:grid; grid-template-columns:1fr; gap:16px;"></div>
        <div class="packaging-progress-wrap" style="display:none; padding:16px; border:1px solid #E9EDF5; border-radius:12px; background-color:#F8FAFC;">
          <div style="display:flex; justify-content:space-between; font-size:13px; font-weight:600; color:#1E293B;">
            <span class="packaging-label">Compiling...</span>
            <span class="packaging-percentage">0%</span>
          </div>
          <div style="width:100%; height:10px; background-color:#E9EDF5; border-radius:6px; overflow:hidden; margin-top:10px;">
            <div class="packaging-progress-fill" style="height:100%; background-color:#5B3DF5; width:0%; transition:width 200ms ease;"></div>
          </div>
        </div>
      </div>
    `;

    const container = card.querySelector(".formats-list-container");
    this.formats.forEach(f => {
      const row = document.createElement("div");
      row.style.display = "flex";
      row.style.justifyContent = "space-between";
      row.style.alignItems = "center";
      row.style.borderBottom = "1px solid #F1F5F9";
      row.style.paddingBottom = "12px";

      row.innerHTML = `
        <div>
          <strong style="color:#1E293B; font-size:14px;">${f.label}</strong>
          <p style="margin:4px 0 0 0; font-size:12px; color:#6B7280;">${f.desc}</p>
        </div>
        <button class="compile-btn" data-format="${f.key}" style="height:36px; padding:0 16px; background-color:#5B3DF5; color:#FFFFFF; border:none; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer;">
          Compile Package
        </button>
      `;

      row.querySelector(".compile-btn").addEventListener("click", () => {
        this.startCompilation(f.key);
      });

      container.appendChild(row);
    });

    this.element = card;
    return card;
  }

  async startCompilation(format) {
    const progressWrap = this.element.querySelector(".packaging-progress-wrap");
    const progressFill = this.element.querySelector(".packaging-progress-fill");
    const progressLabel = this.element.querySelector(".packaging-label");
    const progressPerc = this.element.querySelector(".packaging-percentage");

    progressLabel.textContent = `Compiling ${format}...`;
    progressPerc.textContent = "0%";
    progressFill.style.width = "0%";
    progressWrap.style.display = "block";

    // Bind listeners for IPC progress updates
    const removeProgressListener = window.api.ipc.on("release:package-progress", (event, data) => {
      if (data.format === format) {
        progressPerc.textContent = `${data.progress}%`;
        progressFill.style.width = `${data.progress}%`;
      }
    });

    // Bind listeners for IPC complete updates
    const removeCompleteListener = window.api.ipc.on("release:package-completed", (event, data) => {
      if (data.format === format) {
        progressPerc.textContent = "100%";
        progressFill.style.width = "100%";
        
        setTimeout(() => {
          progressWrap.style.display = "none";
          alert(`Compilation completed successfully!\nArtifact saved to: ${data.filePath}`);
          
          if (this.options.onPackageComplete) {
            this.options.onPackageComplete();
          }

          // Clean up listeners
          removeProgressListener();
          removeCompleteListener();
        }, 600);
      }
    });

    try {
      await window.api.ipc.invoke("release:start-package", format);
    } catch (err) {
      console.error("Compilation error:", err);
      progressWrap.style.display = "none";
      removeProgressListener();
      removeCompleteListener();
    }
  }
}
