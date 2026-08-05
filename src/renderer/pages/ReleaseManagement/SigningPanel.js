/**
 * SigningPanel.js
 * Retail ERP Enterprise — Code Signing Control Dashboard
 */

"use strict";

export default class SigningPanel {
  constructor(options = {}) {
    this.options = options;
    this.signatures = options.signatures || [];
    this.element = null;
  }

  render() {
    const card = document.createElement("div");
    card.className = "release-mgmt-card col-span-12";
    card.innerHTML = `
      <h3 class="release-mgmt-card-title">Digital Signature Verification & Code Signing</h3>
      <div style="display:flex; flex-direction:column; gap:20px;">
        <div class="signatures-list-container" style="display:grid; grid-template-columns:1fr; gap:16px;"></div>
        <div class="signing-progress-wrap" style="display:none; padding:16px; border:1px solid #E9EDF5; border-radius:12px; background-color:#F8FAFC;">
          <div style="display:flex; justify-content:space-between; font-size:13px; font-weight:600; color:#1E293B;">
            <span class="signing-label">Signing...</span>
            <span class="signing-percentage">0%</span>
          </div>
          <div style="width:100%; height:10px; background-color:#E9EDF5; border-radius:6px; overflow:hidden; margin-top:10px;">
            <div class="signing-progress-fill" style="height:100%; background-color:#5B3DF5; width:0%; transition:width 200ms ease;"></div>
          </div>
        </div>
      </div>
    `;

    const container = card.querySelector(".signatures-list-container");
    this.signatures.forEach(s => {
      const row = document.createElement("div");
      row.style.display = "flex";
      row.style.justifyContent = "space-between";
      row.style.alignItems = "center";
      row.style.borderBottom = "1px solid #F1F5F9";
      row.style.paddingBottom = "12px";

      const verifiedClass = s.verified ? "signed" : "unsigned";

      row.innerHTML = `
        <div>
          <strong style="color:#1E293B; font-size:14px; display:block;">${s.platform}</strong>
          <span style="font-size:12px; color:#6B7280;">Owner: ${s.certOwner} | Signature Date: ${s.timestamp}</span>
        </div>
        <div style="display:flex; align-items:center; gap:12px;">
          <span class="release-mgmt-badge ${verifiedClass}">
            ${s.verified ? "VERIFIED" : "UNSIGNED"}
          </span>
          <button class="sign-btn" data-platform="${s.platform}" style="height:32px; padding:0 12px; border:1px solid #E9EDF5; background:none; border-radius:6px; font-size:12px; font-weight:600; cursor:pointer; color:#1E293B;">
            Sign Binary
          </button>
        </div>
      `;

      row.querySelector(".sign-btn").addEventListener("click", () => {
        this.startSigning(s.platform);
      });

      container.appendChild(row);
    });

    this.element = card;
    return card;
  }

  async startSigning(platform) {
    const progressWrap = this.element.querySelector(".signing-progress-wrap");
    const progressFill = this.element.querySelector(".signing-progress-fill");
    const progressLabel = this.element.querySelector(".signing-label");
    const progressPerc = this.element.querySelector(".signing-percentage");

    progressLabel.textContent = `Signing ${platform}...`;
    progressPerc.textContent = "0%";
    progressFill.style.width = "0%";
    progressWrap.style.display = "block";

    // Bind listeners for IPC progress updates
    const removeProgressListener = window.api.ipc.on("signing:progress", (data) => {
      if (data.platform === platform) {
        progressPerc.textContent = `${data.progress}%`;
        progressFill.style.width = `${data.progress}%`;
      }
    });

    // Bind listeners for IPC complete updates
    const removeCompleteListener = window.api.ipc.on("signing:completed", (data) => {
      if (data.platform === platform) {
        progressPerc.textContent = "100%";
        progressFill.style.width = "100%";
        
        setTimeout(() => {
          progressWrap.style.display = "none";
          alert(`${platform} signed successfully and notarized timestamps validated!`);
          
          if (this.options.onSignComplete) {
            this.options.onSignComplete(data.signatures);
          }

          // Clean up listeners
          removeProgressListener();
          removeCompleteListener();
        }, 600);
      }
    });

    try {
      await window.api.ipc.invoke("signing:start", platform);
    } catch (err) {
      console.error("Signing error:", err);
      progressWrap.style.display = "none";
      removeProgressListener();
      removeCompleteListener();
    }
  }
}
