/**
 * SecurityScanPanel.js
 * Retail ERP Enterprise — Vulnerability Scanning Controls Panel
 */

"use strict";

export default class SecurityScanPanel {
  constructor(options = {}) {
    this.options = options;
    this.element = null;
    this.scans = [
      { key: "Dependency Audit", label: "Dependency Audit", desc: "Audit third-party package dependencies with npm audit." },
      { key: "Secret Detection", label: "Secret Detection", desc: "Detect hardcoded API credentials and secret tokens." },
      { key: "Configuration Review", label: "Configuration Review", desc: "Review Electron main process configurations security." },
      { key: "Supply Chain Review", label: "Supply Chain Review", desc: "Verify third-party code module signatures." }
    ];
  }

  render() {
    const card = document.createElement("div");
    card.className = "security-card col-span-12";
    card.innerHTML = `
      <h3 class="security-card-title">Vulnerability Scanning Suite</h3>
      <div style="display:flex; flex-direction:column; gap:20px;">
        <div class="scans-list-container" style="display:grid; grid-template-columns:1fr; gap:16px;"></div>
        <div class="active-scan-progress-wrap" style="display:none; padding:16px; border:1px solid #E9EDF5; border-radius:12px; background-color:#F8FAFC;">
          <div style="display:flex; justify-content:space-between; font-size:13px; font-weight:600; color:#1E293B;">
            <span class="active-scan-label">Scanning...</span>
            <span class="active-scan-percentage">0%</span>
          </div>
          <div class="scan-progress-bar-bg">
            <div class="scan-progress-bar-fill"></div>
          </div>
        </div>
      </div>
    `;

    const list = card.querySelector(".scans-list-container");
    this.scans.forEach(scan => {
      const row = document.createElement("div");
      row.style.display = "flex";
      row.style.justifyContent = "space-between";
      row.style.alignItems = "center";
      row.style.borderBottom = "1px solid #F1F5F9";
      row.style.paddingBottom = "12px";

      row.innerHTML = `
        <div>
          <strong style="color:#1E293B; font-size:14px;">${scan.label}</strong>
          <p style="margin:4px 0 0 0; font-size:12px; color:#6B7280;">${scan.desc}</p>
        </div>
        <button class="run-scan-btn" data-scan="${scan.key}" style="height:36px; padding:0 16px; background-color:#5B3DF5; color:#FFFFFF; border:none; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer;">
          Run Scan
        </button>
      `;

      // Bind run scan button trigger
      row.querySelector(".run-scan-btn").addEventListener("click", () => {
        this.startScan(scan.key);
      });

      list.appendChild(row);
    });

    this.element = card;
    return card;
  }

  async startScan(scanType) {
    const progressWrap = this.element.querySelector(".active-scan-progress-wrap");
    const progressFill = this.element.querySelector(".scan-progress-bar-fill");
    const progressLabel = this.element.querySelector(".active-scan-label");
    const progressPerc = this.element.querySelector(".active-scan-percentage");

    progressLabel.textContent = `Running ${scanType}...`;
    progressPerc.textContent = "0%";
    progressFill.style.width = "0%";
    progressWrap.style.display = "block";

    // Bind listeners for IPC progress updates
    const removeProgressListener = window.api.ipc.on("security:scan-progress", (event, data) => {
      if (data.scanType === scanType) {
        progressPerc.textContent = `${data.progress}%`;
        progressFill.style.width = `${data.progress}%`;
      }
    });

    // Bind listeners for IPC complete updates
    const removeCompleteListener = window.api.ipc.on("security:scan-completed", (event, data) => {
      if (data.scanType === scanType) {
        progressPerc.textContent = "100%";
        progressFill.style.width = "100%";
        
        setTimeout(() => {
          progressWrap.style.display = "none";
          alert(`${scanType} completed successfully!`);
          
          // Refresh parent listings
          if (this.options.onScanComplete) {
            this.options.onScanComplete();
          }

          // Clean up listeners
          removeProgressListener();
          removeCompleteListener();
        }, 600);
      }
    });

    try {
      await window.api.ipc.invoke("security:run-scan", scanType);
    } catch (err) {
      console.error("Scan error:", err);
      progressWrap.style.display = "none";
      removeProgressListener();
      removeCompleteListener();
    }
  }
}
